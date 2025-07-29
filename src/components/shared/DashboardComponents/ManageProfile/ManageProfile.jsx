import React, { useState } from "react";
import { useNavigate } from "react-router";

// Mock useAuth hook for demo
const useAuth = () => ({
  user: {
    uid: "demo-user-123",
    displayName: "John Doe",
    email: "john.doe@example.com",
    photoURL:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
  },
});

// import useAuth from "../../../../AuthProvider/useAuth"; // Use this in your actual app
// import { useNavigate } from "react-router"; // Use this in your actual app

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

const ManageProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.displayName || "",
    photoURL: user?.photoURL || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEditChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Simulate API call to update profile
      const updateData = {
        name: formData.name.trim(),
        photoURL: formData.photoURL.trim(),
        updatedAt: new Date().toISOString(),
      };

      // Replace with actual API call
      const response = await fetch(`/api/users/${user.uid}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      // Simulate delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Profile updated:", updateData);
      alert("Profile updated successfully!");

      setIsEditOpen(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApplyTourGuide = () => {
    navigate("/dashboard/tour-guide");
    alert("Navigate to tour guide application page");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-emerald-800">
        Welcome, {user?.displayName}
      </h2>

      <div className="flex items-center gap-6">
        <img
          src={user?.photoURL || "https://via.placeholder.com/100"}
          alt="User"
          className="w-24 h-24 rounded-full object-cover border-2 border-emerald-200"
        />
        <div className="space-y-2">
          <p className="text-gray-700">
            <strong className="text-emerald-800">Name:</strong>{" "}
            {user?.displayName}
          </p>
          <p className="text-gray-700">
            <strong className="text-emerald-800">Email:</strong> {user?.email}
          </p>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          className="btn btn-outline btn-success"
          onClick={() => setIsEditOpen(true)}
        >
          ✏️ Edit Profile
        </button>
        <button className="btn btn-success" onClick={handleApplyTourGuide}>
          🎯 Apply as Tour Guide
        </button>
      </div>

      {/* Profile Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat bg-white rounded-lg shadow border-l-4 border-l-emerald-400">
          <div className="stat-title text-gray-600">Profile Completion</div>
          <div className="stat-value text-emerald-600 text-2xl">85%</div>
          <div className="stat-desc text-emerald-600">Looking good!</div>
        </div>
        <div className="stat bg-white rounded-lg shadow border-l-4 border-l-blue-400">
          <div className="stat-title text-gray-600">Stories Written</div>
          <div className="stat-value text-blue-600 text-2xl">3</div>
          <div className="stat-desc text-blue-600">Keep sharing!</div>
        </div>
        <div className="stat bg-white rounded-lg shadow border-l-4 border-l-yellow-400">
          <div className="stat-title text-gray-600">Bookings Made</div>
          <div className="stat-value text-yellow-600 text-2xl">2</div>
          <div className="stat-desc text-yellow-600">Active traveler</div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditOpen && (
        <Modal open={isEditOpen} onClickBackdrop={() => setIsEditOpen(false)}>
          <div className="p-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-emerald-800">
                Edit Profile
              </h3>
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
                  src={formData.photoURL || "https://via.placeholder.com/60"}
                  alt="Preview"
                  className="w-16 h-16 rounded-full object-cover border-2 border-emerald-200"
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
      )}

      {/* Tips Section */}
      <div className="bg-emerald-50 rounded-lg p-6">
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

export default ManageProfile;
