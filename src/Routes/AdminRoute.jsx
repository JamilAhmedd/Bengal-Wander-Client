import React from "react";
import useAuth from "../AuthProvider/useAuth";
import useUserRole from "../components/hooks/useUserRole";
import { Navigate, useLocation } from "react-router";

const AdminRoute = () => {
  const { user, loading } = useAuth();
  const { role, roleLoading } = useUserRole();
  const location = useLocation();
  if (loading)
    return <span className="loading loading-spinner loading-xl"></span>;

  if (!user || role !== "admin") {
    <Navigate
      state={{ from: location.pathname }}
      to={"/auth/login"}
    ></Navigate>;
  }
  return <div></div>;
};

export default AdminRoute;
