// AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import Modal from "../../components/Modal";
import AdminProfileSection from "./AdminProfileSection";
import AddPackageForm from "./AddPackageForm";
import UsersTable from "./UsersTable";
import CandidatesTable from "./CandidatesTable";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../../AuthProvider/useAuth";

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalPayment: 0,
    totalTourGuides: 0,
    totalPackages: 0,
    totalClients: 0,
    totalStories: 0,
  });

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [adminInfo, setAdminInfo] = useState({ name: "", photoURL: "" });
  const [users, setUsers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const statsRes = await useAxiosSecure.get("/admin/stats");
        const usersRes = await useAxiosSecure.get("/users");
        const appsRes = await useAxiosSecure.get("/applications");

        setStats(statsRes.data);
        setUsers(usersRes.data);
        setApplications(appsRes.data);

        setAdminInfo({ name: user.displayName, photoURL: user.photoURL });
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      }
    }
    fetchData();
  }, [user]);

  const handleEditSubmit = async () => {
    try {
      await useAxiosSecure.patch(`/users/${user.uid}`, adminInfo);
      setIsEditOpen(false);
    } catch (error) {
      console.error("Failed to update profile", error);
    }
  };

  return (
    <motion.div
      className="space-y-10 px-4 md:px-10 py-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Profile Section */}
      <AdminProfileSection
        user={user}
        stats={stats}
        onEditClick={() => setIsEditOpen(true)}
      />

      {/* Edit Profile Modal */}
      <Modal open={isEditOpen} onClickBackdrop={() => setIsEditOpen(false)}>
        <div className="p-6 space-y-4">
          <h3 className="text-xl font-bold text-emerald-800">Edit Profile</h3>
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="Full Name"
            value={adminInfo.name}
            onChange={(e) =>
              setAdminInfo({ ...adminInfo, name: e.target.value })
            }
          />
          <input
            type="url"
            className="input input-bordered w-full"
            placeholder="Photo URL"
            value={adminInfo.photoURL}
            onChange={(e) =>
              setAdminInfo({ ...adminInfo, photoURL: e.target.value })
            }
          />
          <div className="flex justify-end gap-4">
            <button className="btn" onClick={() => setIsEditOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-success" onClick={handleEditSubmit}>
              Save
            </button>
          </div>
        </div>
      </Modal>

      {/* Add Package Section */}
      <section>
        <h2 className="text-xl font-semibold text-emerald-800 mb-4">
          Add New Package
        </h2>
        <AddPackageForm />
      </section>

      {/* Manage Users Section */}
      <section>
        <h2 className="text-xl font-semibold text-emerald-800 mb-4">
          Manage Users
        </h2>
        <UsersTable
          users={users}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
        />
      </section>

      {/* Manage Candidates Section */}
      <section>
        <h2 className="text-xl font-semibold text-emerald-800 mb-4">
          Manage Candidates
        </h2>
        <CandidatesTable applications={applications} />
      </section>
    </motion.div>
  );
};

export default AdminDashboard;
