import React, { useState } from "react";
import Select from "react-select";
import { useQuery } from "@tanstack/react-query";

import { Search } from "lucide-react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const roleOptions = [
  { value: "", label: "All Roles" },
  { value: "admin", label: "Admin" },
  { value: "guide", label: "Tour Guide" },
  { value: "user", label: "Tourist" },
];

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState(roleOptions[0]);

  const { data: users = [], refetch } = useQuery({
    queryKey: ["users", search, selectedRole.value],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/users?search=${search}&role=${selectedRole.value}`
      );
      return res.data;
    },
  });

  const handleSearch = (e) => {
    e.preventDefault();
    refetch();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-emerald-800">Manage Users</h2>

      {/* Filters */}
      <form
        onSubmit={handleSearch}
        className="flex flex-col md:flex-row gap-4 items-center"
      >
        <div className="form-control w-full md:w-1/3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email"
            className="input input-bordered w-full"
          />
        </div>
        <div className="w-full md:w-1/4">
          <Select
            options={roleOptions}
            value={selectedRole}
            onChange={(option) => setSelectedRole(option)}
            className="react-select-container"
            classNamePrefix="react-select"
          />
        </div>
        <button type="submit" className="btn btn-success">
          <Search className="w-4 h-4" />
          Search
        </button>
      </form>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="table table-zebra w-full">
          <thead className="bg-emerald-50 text-emerald-900">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Booking Count</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={u._id}>
                <td>{i + 1}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td className="capitalize">
                  <span className="badge badge-outline">
                    {u.role || "user"}
                  </span>
                </td>
                <td>{u.bookingCount || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <div className="p-4 text-center text-gray-500">No users found.</div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
