import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { QueryClient, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useParams } from "react-router";

import useAxiosPublic from "../../../hooks/useAxiosPublic";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../../AuthProvider/useAuth";

const CheckoutForm = () => {
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
  console.log(packageInfo);

  if (isPending) {
    return <span className="loading loading-spinner loading-xl"> </span>;
  }
  const cost = packageInfo.price;
  const costInCents = cost * 100;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }
    const card = elements.getElement(CardElement);
    if (!card) return;

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });
    if (error) {
      console.log(error);
      setError(error.message);
    } else {
      console.log("payment method", paymentMethod);
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
    } else {
      if (result.paymentIntent.status === "succeeded") {
        // Payment is successful
        console.log("Payment succeeded!");
      }
    }
    console.log(result);
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
          className="btn btn-success w-full"
          disabled={!stripe}
        >
          pay ${cost}
        </button>
        {error && <p className="text-red-500 font-bold">{error}</p>}
      </form>
    </div>
  );
};

export default CheckoutForm;
