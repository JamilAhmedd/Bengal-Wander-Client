import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router";
import useAuth from "../../../../AuthProvider/useAuth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

import Swal from "sweetalert2";

const MyBookings = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["bookings", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/bookings`);
      return res.data;
    },
  });

  useEffect(() => {
    if (data) {
      setBookings(data);
      setLoading(false);
    }
  }, [data]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Failed to load bookings</div>;

  const handlePayment = async (booking) => {
    navigate(`/dashboard/payment/${booking}`);
  };

  const handleRemove = async (booking) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: `Cancel your booking for ${booking.packageName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it!",
      cancelButtonText: "No, keep it",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosSecure.delete(`/bookings/${booking._id}`);
        if (res.data?.deletedCount > 0) {
          Swal.fire("Cancelled!", "Your booking has been removed.", "success");
          queryClient.invalidateQueries(["my-bookings"]);
        }
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "Failed to cancel booking. Try again.", "error");
      }
    }
  };
  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: "badge badge-warning text-white",
      "in-review": "badge badge-info text-white",
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
            onClick={() => navigate("/trips")}
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
                <tr key={booking._id} className="hover:bg-emerald-50">
                  <td className="font-medium">{booking.packageName}</td>
                  <td>{booking.guide}</td>
                  <td>{formatDate(booking.tourDate)}</td>
                  <td className="font-semibold text-emerald-600">
                    ${booking.price}
                  </td>
                  <td>{getStatusBadge(booking.status)}</td>
                  <td>
                    <div className="flex gap-2">
                      {booking.status === "pending" && (
                        <>
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handlePayment(booking._id)}
                          >
                            Pay
                          </button>
                          <button
                            onClick={() => handleRemove(booking)}
                            className="btn btn-outline btn-error btn-sm"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {booking.status === "in_review" && (
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
