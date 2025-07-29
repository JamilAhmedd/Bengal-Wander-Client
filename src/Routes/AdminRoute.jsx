import React from "react";
import useAuth from "../AuthProvider/useAuth";
import useUserRole from "../components/hooks/useUserRole";
import { Navigate } from "react-router";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { role, roleLoading } = useUserRole();

  if (loading || roleLoading)
    return <span className="loading loading-spinner loading-xl"></span>;

  if (!user || role !== "admin") {
    <Navigate to={"forbidden"}></Navigate>;
  }
  return children;
};

export default AdminRoute;
