import React, { useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import Swal from "sweetalert2";
import useAuth from "../../../../AuthProvider/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useOutletContext } from "react-router";

const AdminDashboard = () => {
  const { role, roleLoading } = useOutletContext();

  const { user, userUpdate } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editInfo, setEditInfo] = useState({
    name: user?.displayName,
    photoURL: user?.photoURL,
  });
  const { data: stats = {}, isFetching } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/stats");
      return res.data;
    },
  });
  if (roleLoading)
    return <span className="loading loading-spinner loading-xl"></span>;
  if (role !== "admin") return;

  const handleEditClick = () => {
    setEditInfo({ name: user.displayName, photo: user.photoURL });
    setIsModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const updateData = {
      name: editInfo.name,
      photoURL: editInfo.photoURL,
    };
    const updatedProfile = {
      displayName: editInfo.name,
      photoURL: editInfo.photoURL,
    };
    const response = await userUpdate(user, updatedProfile);

    Swal.fire({
      title: "Success!",
      text: "Profile updated successfully!",
      icon: "success",
      confirmButtonText: "Great!",
      confirmButtonColor: "#10B981",
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-emerald-800">
        Welcome back, {user?.displayName} 👋
      </h2>

  {/************************** {stats caardssss} *************************************/}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
        <div className="stat bg-white border-l-4 border-emerald-400">
          <div className="stat-title text-gray-500">Total Payment</div>
          <div className="stat-value text-emerald-600">
            ${stats.totalPayment || 0}
          </div>
        </div>

        <div className="stat bg-white border-l-4 border-blue-400">
          <div className="stat-title text-gray-500">Tour Guides</div>
          <div className="stat-value text-blue-600">
            {stats.totalGuides || 0}
          </div>
        </div>

        <div className="stat bg-white border-l-4 border-purple-400">
          <div className="stat-title text-gray-500">Packages</div>
          <div className="stat-value text-purple-600">
            {stats.totalPackages || 0}
          </div>
        </div>

        <div className="stat bg-white border-l-4 border-rose-400">
          <div className="stat-title text-gray-500">Clients</div>
          <div className="stat-value text-rose-600">
            {stats.totalClients || 0}
          </div>
        </div>

        <div className="stat bg-white border-l-4 border-yellow-400">
          <div className="stat-title text-gray-500">Stories</div>
          <div className="stat-value text-yellow-600">
            {stats.totalStories || 0}
          </div>
        </div>
      </div>

      {/* Admin Info */}
      <div className="bg-white rounded-lg shadow p-6 flex items-center gap-6">
        <div className="avatar">
          <div className="w-24 h-24 rounded-full ring ring-emerald-300">
            <img src={user?.photoURL} alt={user?.displayName} />
          </div>
        </div>
        <div className="flex-1 space-y-1">
          <h3 className="text-xl font-semibold">{user?.displayName}</h3>
          <p className="text-gray-600">Email: {user?.email}</p>
          <p className="text-gray-600 capitalize flex items-center ">
            Role: <span className="badge badge-success ml-1">{role}</span>
          </p>
        </div>
        <button onClick={handleEditClick} className="btn btn-outline btn-sm">
          <Pencil className="w-4 h-4" />
          Edit
        </button>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <form
            onSubmit={handleUpdate}
            className="bg-white rounded-xl p-6 space-y-4 shadow-xl w-full max-w-md"
          >
            <h3 className="text-lg font-bold">Edit Profile</h3>

            <div>
              <label className="label font-semibold">Name</label>
              <input
                type="text"
                value={editInfo.name}
                onChange={(e) =>
                  setEditInfo({ ...editInfo, name: e.target.value })
                }
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <label className="label font-semibold">Photo URL</label>
              <input
                type="url"
                value={editInfo.photo}
                onChange={(e) =>
                  setEditInfo({ ...editInfo, photo: e.target.value })
                }
                className="input input-bordered w-full"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                type="button"
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-success">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

// Stat card component

export default AdminDashboard;
