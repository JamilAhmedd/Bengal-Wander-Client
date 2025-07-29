import React from "react";
import useAuth from "../../AuthProvider/useAuth";
import useAxiosSecure from "./useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const useUserRole = () => {
  const { user, loading: authLoading } = useAuth();

  const axiosSecure = useAxiosSecure();
  const {
    data: role = "user",
    isLoading: roleLoading,
    refetch,
  } = useQuery({
    queryKey: ["userRole", user?.email],
    enabled: !authLoading && !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get("users/role");
      return res.data.role;
    },
  });

  return { role, roleLoading: authLoading || roleLoading, refetch };
};

export default useUserRole;
