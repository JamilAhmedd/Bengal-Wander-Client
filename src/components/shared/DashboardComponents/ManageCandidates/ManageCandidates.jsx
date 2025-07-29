import React from "react";
import Swal from "sweetalert2";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ManageCandidates = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const {
    data: applications = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["tour-guide-applications"],
    queryFn: async () => {
      const res = await axiosSecure.get("/tour-guide-applications");
      return res.data;
    },
  });

  const acceptMutation = useMutation({
    mutationFn: async (app) => {
      await axiosSecure.patch(`/users/role/${app.applicantEmail}`, {
        role: "tour-guide",
      });

      return await axiosSecure.delete(`/tour-guide-applications/${app._id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tour-guide-applications"] });
      refetch();
      Swal.fire("Accepted!", "User promoted to tour guide.", "success");
    },
    onError: () => {
      Swal.fire("Error", "Failed to accept application", "error");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (app) => {
      return await axiosSecure.delete(`/tour-guide-applications/${app._id}`);
    },
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ["tour-guide-applications"] });
      Swal.fire("Rejected!", "Application has been removed.", "info");
    },
    onError: () => {
      Swal.fire("Error", "Failed to reject application", "error");
    },
  });

  const handleAccept = async (app) => {
    const result = await Swal.fire({
      title: "Accept Application?",
      text: `Promote ${app.applicantName} to tour guide?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Accept",
      confirmButtonColor: "#10B981",
    });
    if (result.isConfirmed) {
      acceptMutation.mutate(app);
    }
  };

  // Reject Handler
  const handleReject = async (app) => {
    const result = await Swal.fire({
      title: "Reject Application?",
      text: `Remove application of ${app.applicantName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Reject",
      confirmButtonColor: "#EF4444",
    });
    if (result.isConfirmed) {
      rejectMutation.mutate(app);
    }
  };

  if (isLoading) return <p className="text-center">Loading candidates...</p>;

  return (
    <div className="p-4 bg-white shadow rounded-lg overflow-x-auto">
      <h2 className="text-2xl font-semibold mb-4 text-emerald-700">
        Manage Tour Guide Applications
      </h2>

      {applications.length === 0 ? (
        <p className="text-gray-600">No pending applications.</p>
      ) : (
        <table className="table table-zebra w-full text-sm">
          <thead className="bg-emerald-100 text-emerald-800">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>CV</th>
              <th>Applied At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app, idx) => (
              <tr key={app._id}>
                <td>{idx + 1}</td>
                <td>{app.applicantName}</td>
                <td>{app.applicantEmail}</td>
                <td>
                  <a
                    href={app.cvLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-500 underline"
                  >
                    View CV
                  </a>
                </td>
                <td>{new Date(app.appliedAt).toLocaleString()}</td>
                <td className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => handleAccept(app)}
                    className="btn btn-success btn-sm"
                    disabled={acceptMutation.isPending}
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleReject(app)}
                    className="btn btn-error btn-sm"
                    disabled={rejectMutation.isPending}
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

export default ManageCandidates;
