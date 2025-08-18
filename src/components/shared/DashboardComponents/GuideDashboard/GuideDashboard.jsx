import React, { useState } from "react";
import { useOutletContext } from "react-router";
import { Pencil } from "lucide-react";
import useAuth from "../../../../AuthProvider/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

import Swal from "sweetalert2";
import Input from "../../Input/Input";
const Modal = ({ open, onClickBackdrop, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClickBackdrop}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

const GuideDashboard = () => {
  const { user, userUpdate } = useAuth();
  const { role, roleLoading } = useOutletContext();
  const axiosSecure = useAxiosSecure();
  const [formData, setFormData] = useState({
    name: user?.displayName || "",
    photoURL: user?.photoURL || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleEditChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleEditSubmit = async () => {
    setIsSubmitting(true);

    try {
      const updateData = {
        name: formData.name.trim(),
        photoURL: formData.photoURL.trim(),
      };
      const updatedProfile = {
        displayName: formData.name,
        photoURL: formData.photoURL,
      };

      await userUpdate(user, updatedProfile);

      const response = await axiosSecure.patch("/users", updateData);

      if (response.status === 200) {
        Swal.fire({
          title: "Success!",
          text: "Profile updated successfully!",
          icon: "success",
          confirmButtonText: "Great!",
          confirmButtonColor: "#10B981",
        });
        setIsEditOpen(false);
      } else {
        throw new Error(response.data.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Swal.fire({
        title: "Error!",
        text:
          error.response?.data?.message ||
          "Failed to update profile. Please try again.",
        icon: "error",
        confirmButtonColor: "#EF4444",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (roleLoading)
    return <div className="loading loading-spinner loading-lg"></div>;
  if (role !== "guide") return;

  return (
    <div className="space-y-10">
      <h2 className="text-2xl font-bold text-emerald-800">
        Welcome, {user?.displayName} 👋
      </h2>

      {/********************** Profile Card ****************************/}
      <div className="bg-base-100 rounded-lg shadow p-6 flex items-center gap-6">
        <div className="avatar">
          <div className="w-24 h-24 rounded-full ">
            <img src={user?.photoURL} alt={user?.displayName} />
          </div>
        </div>
        <div className="flex-1 space-y-1 text-neutral">
          <h3 className="text-xl font-semibold">{user?.displayName}</h3>
          <p className="">Email: {user?.email}</p>
          <p className=" capitalize">Role: {role}</p>
        </div>
        <button
          onClick={() => setIsEditOpen(true)}
          className="btn btn-outline btn-sm"
        >
          <Pencil className="w-4 h-4" /> Edit
        </button>
      </div>

      <Modal open={isEditOpen} onClickBackdrop={() => setIsEditOpen(false)}>
        <div className="p-6">
          {/* Modal Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-neutral">Edit Profile</h3>
            <button
              type="button"
              onClick={() => setIsEditOpen(false)}
              className="btn btn-sm btn-circle btn-ghost text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {/* Modal Form */}
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-lg">
              <img
                src={
                  formData.photoURL ||
                  "https://placehold.co/60x60/E0F2F1/047857?text=Preview"
                }
                alt="Profile Preview"
                className="w-16 h-16 rounded-full object-cover border-2 border-emerald-200"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://placehold.co/60x60/E0F2F1/047857?text=Preview";
                }}
              />
              <div>
                <p className="font-medium text-emerald-800">
                  {formData.name || "Your Name"}
                </p>
                <p className="text-sm text-emerald-600">{user?.email}</p>
              </div>
            </div>

            <div>
              <label className="label">
                <span className="label-text font-semibold text-emerald-800">
                  Full Name <span className="text-red-500">*</span>
                </span>
              </label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleEditChange}
                placeholder="Enter your full name"
                className="input input-bordered w-full focus:border-emerald-500"
                required
                minLength={2}
                maxLength={50}
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text font-semibold text-emerald-800">
                  Profile Image URL
                </span>
              </label>
              <Input
                type="url"
                name="photoURL"
                value={formData.photoURL}
                onChange={handleEditChange}
                placeholder="https://example.com/your-photo.jpg"
                className="input input-bordered w-full focus:border-emerald-500"
              />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-black/30">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setIsEditOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={handleEditSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default GuideDashboard;
