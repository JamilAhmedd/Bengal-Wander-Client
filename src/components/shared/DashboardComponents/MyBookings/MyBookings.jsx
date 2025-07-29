import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom"; // Commented out for demo

import { useNavigate } from "react-router";
import useAuth from "../../../../AuthProvider/useAuth";

// Mock data for demonstration - replace with actual API calls
const mockBookings = [
  {
    id: 1,
    packageName: "Golden Triangle Adventure",
    tourGuideName: "John Smith",
    tourDate: "2025-08-15",
    tourPrice: 299,
    status: "pending",
  },
  {
    id: 2,
    packageName: "Mountain Explorer Trek",
    tourGuideName: "Sarah Johnson",
    tourDate: "2025-09-10",
    tourPrice: 450,
    status: "in review",
  },
  {
    id: 3,
    packageName: "Coastal Discovery Tour",
    tourGuideName: "Mike Wilson",
    tourDate: "2025-07-20",
    tourPrice: 199,
    status: "accepted",
  },
  {
    id: 4,
    packageName: "Desert Safari Experience",
    tourGuideName: "Emma Davis",
    tourDate: "2025-08-05",
    tourPrice: 350,
    status: "rejected",
  },
];

const MyBookings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setTimeout(() => {
          setBookings(mockBookings);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setLoading(false);
      }
    };

    if (user) {
      fetchBookings();
    }
  }, [user]);

  const handlePayment = async (booking) => {
    setPaymentLoading(booking.id);

    try {
      // Step 1: Create payment intent on your backend
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: booking.tourPrice * 100, // Convert to cents
          bookingId: booking.id,
          userId: user.uid,
          packageName: booking.packageName,
        }),
      });

      const { clientSecret } = await response.json();

      // Step 2: Redirect to Stripe Checkout or handle payment
      // For this example, we'll simulate a successful payment
      // In a real implementation, you'd use Stripe Elements or Checkout

      // Simulate payment processing
      setTimeout(async () => {
        try {
          // Step 3: Save payment transaction and update booking status
          const paymentData = {
            bookingId: booking.id,
            userId: user.uid,
            amount: booking.tourPrice,
            paymentMethod: "stripe",
            transactionId: `txn_${Date.now()}`,
            status: "completed",
            createdAt: new Date().toISOString(),
          };

          // Save payment transaction
          await fetch("/api/payments", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(paymentData),
          });

          // Update booking status to "in review"
          await fetch(`/api/bookings/${booking.id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: "in review" }),
          });

          // Update local state
          setBookings((prevBookings) =>
            prevBookings.map((b) =>
              b.id === booking.id ? { ...b, status: "in review" } : b
            )
          );

          alert("Payment successful! Your booking is now under review.");
        } catch (error) {
          console.error("Error processing payment:", error);
          alert("Payment failed. Please try again.");
        } finally {
          setPaymentLoading(null);
        }
      }, 2000);
    } catch (error) {
      console.error("Error initiating payment:", error);
      alert("Payment failed. Please try again.");
      setPaymentLoading(null);
    }
  };

  const handleCancel = async (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        // API call to cancel booking
        await fetch(`/api/bookings/${bookingId}`, {
          method: "DELETE",
        });

        // Remove from local state
        setBookings((prevBookings) =>
          prevBookings.filter((booking) => booking.id !== bookingId)
        );

        alert("Booking cancelled successfully.");
      } catch (error) {
        console.error("Error cancelling booking:", error);
        alert("Failed to cancel booking. Please try again.");
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: "badge badge-warning text-white",
      "in review": "badge badge-info text-white",
      accepted: "badge badge-success text-white",
      rejected: "badge badge-error text-white",
    };

    return (
      <span className={statusClasses[status] || "badge badge-neutral"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="loading loading-spinner loading-lg text-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-emerald-800">My Bookings</h2>

      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl text-gray-300 mb-4">📅</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No Bookings Yet
          </h3>
          <p className="text-gray-500 mb-6">
            Start exploring our amazing tour packages!
          </p>
          <button
            className="btn btn-success"
            onClick={() => navigate("/packages")}
          >
            Browse Packages
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="table table-zebra w-full">
            <thead>
              <tr className="bg-emerald-50">
                <th className="text-emerald-800 font-semibold">Package Name</th>
                <th className="text-emerald-800 font-semibold">Tour Guide</th>
                <th className="text-emerald-800 font-semibold">Tour Date</th>
                <th className="text-emerald-800 font-semibold">Price</th>
                <th className="text-emerald-800 font-semibold">Status</th>
                <th className="text-emerald-800 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-emerald-50">
                  <td className="font-medium">{booking.packageName}</td>
                  <td>{booking.tourGuideName}</td>
                  <td>{formatDate(booking.tourDate)}</td>
                  <td className="font-semibold text-emerald-600">
                    ${booking.tourPrice}
                  </td>
                  <td>{getStatusBadge(booking.status)}</td>
                  <td>
                    <div className="flex gap-2">
                      {booking.status === "pending" && (
                        <>
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handlePayment(booking)}
                            disabled={paymentLoading === booking.id}
                          >
                            {paymentLoading === booking.id ? (
                              <span className="loading loading-spinner loading-xs"></span>
                            ) : (
                              "Pay"
                            )}
                          </button>
                          <button
                            className="btn btn-outline btn-error btn-sm"
                            onClick={() => handleCancel(booking.id)}
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {booking.status === "in review" && (
                        <span className="text-sm text-gray-500 italic">
                          Under Review
                        </span>
                      )}
                      {booking.status === "accepted" && (
                        <span className="text-sm text-emerald-600 font-medium">
                          ✓ Confirmed
                        </span>
                      )}
                      {booking.status === "rejected" && (
                        <span className="text-sm text-red-600 font-medium">
                          ✗ Rejected
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary Card */}
      {bookings.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <div className="stat bg-white rounded-lg shadow border-l-4 border-l-yellow-400">
            <div className="stat-title text-gray-600">Pending</div>
            <div className="stat-value text-yellow-600">
              {bookings.filter((b) => b.status === "pending").length}
            </div>
          </div>
          <div className="stat bg-white rounded-lg shadow border-l-4 border-l-blue-400">
            <div className="stat-title text-gray-600">In Review</div>
            <div className="stat-value text-blue-600">
              {bookings.filter((b) => b.status === "in review").length}
            </div>
          </div>
          <div className="stat bg-white rounded-lg shadow border-l-4 border-l-emerald-400">
            <div className="stat-title text-gray-600">Accepted</div>
            <div className="stat-value text-emerald-600">
              {bookings.filter((b) => b.status === "accepted").length}
            </div>
          </div>
          <div className="stat bg-white rounded-lg shadow border-l-4 border-l-red-400">
            <div className="stat-title text-gray-600">Rejected</div>
            <div className="stat-value text-red-600">
              {bookings.filter((b) => b.status === "rejected").length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
