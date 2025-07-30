import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";

import useAxiosPublic from "../../../hooks/useAxiosPublic";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../../AuthProvider/useAuth";

import Swal from "sweetalert2";

const CheckoutForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const { bookingId } = useParams();
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();
  const [error, setError] = useState("");

  const { data: packageInfo = {}, isPending } = useQuery({
    queryKey: ["bookings", bookingId],
    queryFn: async () => {
      const res = await axiosPublic.get(`/trips/${bookingId}`);
      return res.data;
    },
  });

  if (isPending) {
    return <span className="loading loading-spinner loading-xl"> </span>;
  }
  const cost = packageInfo.price;
  const costInCents = cost * 100;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      return;
    }
    const card = elements.getElement(CardElement);
    if (!card) return;

    const { error } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });
    if (error) {
      console.log(error);
      setError(error.message);
    } else {
      setError("");
    }

    const res = await axiosSecure.post("/create-payment-intent", {
      costInCents,
    });

    const clientSecret = res.data.clientSecret;
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: user.displayName,
          email: user.email,
        },
      },
    });
    if (result.error) {
      console.log(result.error.message);
    }

    if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
      const paymentInfo = {
        cost: cost,
        packageId: packageInfo._id,
        packageName: packageInfo.packageName,
        bookingId: bookingId,
        userEmail: user?.email,
        paymentDate: new Date().toISOString(),
        transactionId: result.paymentIntent.id,
      };

      const res = await axiosSecure.post("/payments", paymentInfo);
      if (res) {
        setLoading(false);
        navigate("/dashboard");
        Swal.fire(
          "Payment Successful",
          "Your payment has been recorded!",
          "success"
        );
      }
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-green-50 p-6 rounded-xl shadow-md w-full max-w-md mx-auto"
      >
        <CardElement className="p-2 border border-gray-400/30 rounded"></CardElement>
        <button
          type="submit"
          className="btn btn-success w-full disabled:bg-gray-600"
          disabled={!stripe || loading}
        >
          pay ${cost}
        </button>
        {error && <p className="text-red-500 font-bold">{error}</p>}
      </form>
    </div>
  );
};

export default CheckoutForm;
