import { useOutletContext } from "react-router";

import AdminDashboard from "../AdminDashboard/AdminDashboard";
import UserDashboard from "../ManageProfile/UserDashboard";
import AdminRoute from "../../../../Routes/AdminRoute";
import GuideDashboard from "../GuideDashboard/GuideDashboard";

const DashboardIndex = () => {
  const { role } = useOutletContext();

  if (role === "admin")
    return (
      <AdminRoute>
        <AdminDashboard />
      </AdminRoute>
    );
  if (role === "guide") return <GuideDashboard />;
  return <UserDashboard />;
};

export default DashboardIndex;
