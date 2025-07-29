import React, { useState } from "react";
import {
  FaDollarSign,
  FaUsers,
  FaBoxOpen,
  FaUserTie,
  FaBook,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaEdit,
} from "react-icons/fa";
import { useOutletContext } from "react-router";

const mockData = {
  admin: {
    name: "John Doe",
    email: "john.doe@admin.com",
    role: "Super Admin",
    phone: "123-456-7890",
    address: "123 Admin St, City",
    picture: "https://i.pravatar.cc/150?u=a042581f4e29026704d", // A more dynamic placeholder
  },
  stats: {
    totalPayment: 15000,
    totalTourGuides: 25,
    totalPackages: 10,
    totalClients: 200,
    totalStories: 50,
  },
};

// Re-designed StatCard with icon support
const StatCard = ({ icon, title, value, colorClass }) => (
  <div className="card bg-base-100 dark:bg-base-200 shadow-lg border border-base-300 transition-all hover:-translate-y-1 hover:shadow-xl">
    <div className="card-body flex-row items-center p-4">
      <div
        className={`flex items-center justify-center w-12 h-12 rounded-full ${colorClass.bg} ${colorClass.text}`}
      >
        {icon}
      </div>
      <div className="ml-4">
        <h3 className="text-sm text-gray-500 dark:text-gray-400">{title}</h3>
        <p className="text-2xl font-bold text-gray-800 dark:text-white">
          {value}
        </p>
      </div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const { role } = useOutletContext();
  if (role !== "admin") return;
  const [isModalOpen, setIsModalOpen] = useState(false);
  // This state will hold the profile data and reflect updates
  const [profileData, setProfileData] = useState(mockData.admin);
  // This temporary state holds form data while editing in the modal
  const [formData, setFormData] = useState(mockData.admin);

  const stats = [
    {
      icon: <FaDollarSign size={20} />,
      title: "Total Payment",
      value: `$${mockData.stats.totalPayment.toLocaleString()}`,
      colorClass: { bg: "bg-teal-100", text: "text-teal-600" },
    },
    {
      icon: <FaUserTie size={20} />,
      title: "Tour Guides",
      value: mockData.stats.totalTourGuides,
      colorClass: { bg: "bg-blue-100", text: "text-blue-600" },
    },
    {
      icon: <FaBoxOpen size={20} />,
      title: "Packages",
      value: mockData.stats.totalPackages,
      colorClass: { bg: "bg-purple-100", text: "text-purple-600" },
    },
    {
      icon: <FaUsers size={20} />,
      title: "Clients",
      value: mockData.stats.totalClients,
      colorClass: { bg: "bg-orange-100", text: "text-orange-600" },
    },
    {
      icon: <FaBook size={20} />,
      title: "Stories",
      value: mockData.stats.totalStories,
      colorClass: { bg: "bg-pink-100", text: "text-pink-600" },
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setProfileData(formData); // Update the main profile data
    setIsModalOpen(false);
    console.log("Updated admin data:", formData);
  };

  const openModal = () => {
    setFormData(profileData); // Ensure modal opens with the latest data
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-base-200/50 dark:bg-base-300 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white">
            Welcome Back,{" "}
            <span className="text-primary">{profileData.name}</span>!
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Here's a snapshot of your platform's performance.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-10">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Admin Info Card */}
        <div className="card max-w-4xl mx-auto bg-base-100 dark:bg-base-200 shadow-xl p-6 md:p-8 rounded-2xl">
          <div className="flex justify-between items-start">
            <h2 className="card-title text-2xl font-bold text-gray-800 dark:text-white mb-6">
              Admin Profile
            </h2>
            <button className="btn btn-ghost btn-circle" onClick={openModal}>
              <FaEdit className="text-accent" size={20} />
            </button>
          </div>
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="avatar">
              <div className="w-32 h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img src={profileData.picture} alt="Admin" />
              </div>
            </div>
            <div className="flex-1 space-y-3">
              <h3 className="text-2xl font-bold text-primary">
                {profileData.name}
              </h3>
              <p className="text-sm uppercase font-semibold text-gray-400 dark:text-gray-500">
                {profileData.role}
              </p>
              <div className="divider my-1"></div>
              <div className="space-y-2 text-gray-600 dark:text-gray-300">
                <p className="flex items-center gap-3">
                  <FaEnvelope className="text-primary" /> {profileData.email}
                </p>
                <p className="flex items-center gap-3">
                  <FaPhone className="text-primary" /> {profileData.phone}
                </p>
                <p className="flex items-center gap-3">
                  <FaMapMarkerAlt className="text-primary" />{" "}
                  {profileData.address}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        {isModalOpen && (
          <div className="modal modal-open">
            <div className="modal-box w-full max-w-lg">
              <h3 className="font-bold text-xl mb-4">Edit Profile</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Form fields remain the same */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Name</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input input-bordered"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Phone</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="input input-bordered"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Address</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="input input-bordered"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Picture URL</span>
                  </label>
                  <input
                    type="url"
                    name="picture"
                    value={formData.picture}
                    onChange={handleInputChange}
                    className="input input-bordered"
                  />
                </div>
                <div className="modal-action mt-6">
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
