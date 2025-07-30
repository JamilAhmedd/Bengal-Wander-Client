import React from "react";
import Swal from "sweetalert2";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import useAuth from "../../../../AuthProvider/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const MyAssignedTours = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: assignedTours = [], isLoading } = useQuery({
    queryKey: ["assigned-tours", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/assigned-tours?name=${user.displayName}`
      );
      return res.data;
    },
    enabled: !!user?.email,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, newStatus }) => {
      return await axiosSecure.patch(`/assigned-tours/${id}`, {
        status: newStatus,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["assigned-tours", user?.email]);
    },
  });

  const handleAccept = (tourId) => {
    updateStatusMutation.mutate({ id: tourId, newStatus: "accepted" });
  };

  const handleReject = (tourId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to reject this tour?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#10b981",
      confirmButtonText: "Yes, reject it!",
    }).then((result) => {
      if (result.isConfirmed) {
        updateStatusMutation.mutate({ id: tourId, newStatus: "rejected" });
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <span className="loading loading-spinner loading-lg text-emerald-500"></span>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-6 text-gray-700">
        My Assigned Tours
      </h2>
      {assignedTours.length === 0 ? (
        <p className="text-center text-gray-500">No assigned tours yet.</p>
      ) : (
        <table className="table w-full">
          <thead>
            <tr className="bg-emerald-100 text-gray-700">
              <th>#</th>
              <th>Package Name</th>
              <th>Tourist</th>
              <th>Date</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assignedTours.map((tour, index) => (
              <tr key={tour._id} className="hover:bg-gray-50">
                <td>{index + 1}</td>
                <td>{tour.packageName}</td>
                <td>{tour.touristName}</td>
                <td>{new Date(tour.tourDate).toLocaleDateString()}</td>
                <td>${tour.price}</td>
                <td>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      tour.status === "pending"
                        ? "bg-gray-200 text-gray-700"
                        : tour.status === "in-review"
                        ? "bg-yellow-200 text-yellow-800"
                        : tour.status === "accepted"
                        ? "bg-green-200 text-green-800"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {tour.status}
                  </span>
                </td>
                <td className="space-x-2">
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => handleAccept(tour._id)}
                    disabled={tour.status !== "in-review"}
                  >
                    Accept
                  </button>
                  <button
                    className="btn btn-error btn-sm"
                    onClick={() => handleReject(tour._id)}
                    disabled={tour.status !== "in-review"}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyAssignedTours;
