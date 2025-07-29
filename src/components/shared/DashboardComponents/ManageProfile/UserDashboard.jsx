import React, { useState } from "react";
import { useNavigate, useOutletContext } from "react-router";
import Swal from "sweetalert2"; // Import SweetAlert2

import useAuth from "../../../../AuthProvider/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

// Modal Component
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

// Input Component
const Input = ({ className, ...props }) => {
  return <input className={className} {...props} />;
};

const UserDashboard = () => {
  const { role, roleLoading } = useOutletContext();
  const { user, userUpdate } = useAuth();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const [formData, setFormData] = useState({
    name: user?.displayName || "",
    photoURL: user?.photoURL || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  if (roleLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-xl text-emerald-500"></span>
      </div>
    );
  }

  if (role !== "user") return null;

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
  const handleApplyTourGuide = () => {
    navigate("/dashboard/join-as-tour-guide");
    Swal.fire({
      title: "Redirecting...",
      text: "Navigating to the tour guide application page.",
      icon: "info",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-emerald-800 mb-6">
        Welcome, {user?.displayName}!
      </h2>

      <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col sm:flex-row items-center gap-6">
        <img
          src={
            user?.photoURL ||
            "https://placehold.co/100x100/E0F2F1/047857?text=User"
          }
          alt="User Profile"
          className="w-24 h-24 rounded-full object-cover border-2 border-emerald-300 shadow-md"
          // Fallback for image loading errors
          onError={(e) => {
            e.target.onerror = null; // Prevent infinite loop
            e.target.src =
              "https://placehold.co/100x100/E0F2F1/047857?text=User";
          }}
        />
        <div className="space-y-2 text-center sm:text-left">
          <p className="text-gray-700 text-lg">
            <strong className="text-emerald-800">Name:</strong>{" "}
            {formData.name || user?.displayName || "N/A"}
          </p>
          <p className="text-gray-700 text-lg">
            <strong className="text-emerald-800">Email:</strong>{" "}
            {user?.email || "N/A"}
          </p>
          <p className="text-gray-700 text-lg">
            <strong className="text-emerald-800">Role:</strong> {role || "N/A"}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mt-6">
        <button
          className="btn btn-outline btn-success flex-grow sm:flex-grow-0"
          onClick={() => setIsEditOpen(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
          Edit Profile
        </button>
        <button
          className="btn btn-success flex-grow sm:flex-grow-0"
          onClick={handleApplyTourGuide}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
              clipRule="evenodd"
            />
          </svg>
          Apply as Tour Guide
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <div className="stats shadow bg-white rounded-lg border-l-4 border-blue-400 p-4">
          <div className="stat">
            <div className="stat-figure text-blue-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-8 h-8 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <div className="stat-title text-gray-600">Stories Written</div>
            <div className="stat-value text-blue-600 text-3xl">3</div>
            <div className="stat-desc text-blue-600">
              Keep sharing your adventures!
            </div>
          </div>
        </div>
        <div className="stats shadow bg-white rounded-lg border-l-4 border-yellow-400 p-4">
          <div className="stat">
            <div className="stat-figure text-yellow-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-8 h-8 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                ></path>
              </svg>
            </div>
            <div className="stat-title text-gray-600">Bookings Made</div>
            <div className="stat-value text-yellow-600 text-3xl">2</div>
            <div className="stat-desc text-yellow-600">Active traveler!</div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal open={isEditOpen} onClickBackdrop={() => setIsEditOpen(false)}>
        <div className="p-6">
          {/* Modal Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-emerald-800">Edit Profile</h3>
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
            {/* Current Profile Preview */}
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

            {/* Name Input */}
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

            {/* Photo URL Input */}
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

      {/* Tips Section */}
      <div className="bg-emerald-50 rounded-lg p-6 mt-8">
        <h3 className="font-semibold text-emerald-800 mb-3">💡 Profile Tips</h3>
        <ul className="space-y-2 text-sm text-emerald-700">
          <li>• Complete your profile to build trust with other users</li>
          <li>• Use a clear, professional profile photo</li>
          <li>• Keep your information up to date</li>
          <li>• Consider applying as a tour guide to earn extra income</li>
        </ul>
      </div>
    </div>
  );
};

export default UserDashboard;
