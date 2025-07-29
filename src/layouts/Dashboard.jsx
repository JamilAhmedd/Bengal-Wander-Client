import React, { useEffect, useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router";
import {
  UserCircle,
  BookOpen,
  FileText,
  PlusCircle,
  Briefcase,
  Home,
} from "lucide-react";
import logo from "../assets/brand-logo.png";
import useAuth from "../AuthProvider/useAuth";
import useAxiosSecure from "../components/hooks/useAxiosSecure";
import useUserRole from "../components/hooks/useUserRole";

const Dashboard = () => {
  const { user, loading } = useAuth();

  const axiosSecure = useAxiosSecure();

  const location = useLocation();

  const { role, roleLoading } = useUserRole();
  if (!role) return;
  const pathSegments = location.pathname.split("/").filter(Boolean);

  if (loading || roleLoading) return <p>Loading...</p>;

  const menuItemsByRole = {
    admin: [
      { to: "", icon: UserCircle, label: "Manage Profile" },
      { to: "manage-users", icon: Briefcase, label: "Manage Users" },
      { to: "add-packages", icon: PlusCircle, label: "Add Packages" },
      { to: "manage-candidates", icon: FileText, label: "Manage Candidates" },
    ],
    guide: [
      { to: "", icon: UserCircle, label: "Manage Profile" },
      { to: "assigned-tours", icon: BookOpen, label: "My Assigned Tours" },
      { to: "stories/manage", icon: FileText, label: "Manage Stories" },
      { to: "stories/add", icon: PlusCircle, label: "Add Stories" },
    ],
    user: [
      { to: "", icon: UserCircle, label: "Manage Profile" },
      { to: "my-bookings", icon: BookOpen, label: "My Bookings" },
      { to: "stories/manage", icon: FileText, label: "Manage Stories" },
      { to: "stories/add", icon: PlusCircle, label: "Add Stories" },
      {
        to: "join-as-tour-guide",
        icon: Briefcase,
        label: "Join as Tour Guide",
      },
    ],
  };

  const menuItems = menuItemsByRole[role];

  return (
    <div className="drawer lg:drawer-open ">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* Header */}
        <div className="w-full flex items-center justify-between p-4 border-b lg:hidden">
          <img src={logo} alt="Logo" className="w-10 h-10" />
          <label htmlFor="dashboard-drawer" className="btn btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-emerald-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </label>
        </div>

        {/* Main Content */}
        <main className="container max-w-[1440px] mx-auto px-4 py-6">
          <div className="text-sm breadcrumbs mb-4">
            <ul>
              {pathSegments.map((segment, idx) => {
                const path = "/" + pathSegments.slice(0, idx + 1).join("/");
                const label = segment
                  .replace(/-/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase());
                return (
                  <li key={idx}>
                    <NavLink to={path}>{label}</NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="rounded-xl border border-green-400/30 p-4 md:p-6 bg-white shadow-sm">
            <Outlet context={{ role, roleLoading }} />
          </div>
        </main>
      </div>

      {/* Sidebar */}
      <div className="drawer-side">
        <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
        <aside className="w-72 bg-emerald-50 border-r border-emerald-200 shadow-lg min-h-screen flex flex-col justify-between">
          <div>
            <div className="p-4 mb-4 text-center border-b">
              <img src={logo} alt="Logo" className="w-32 mx-auto" />
            </div>
            <ul className="menu space-y-2 px-4">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-2 rounded-lg transition duration-200 ${
                      isActive
                        ? "bg-emerald-200 text-emerald-900 font-semibold"
                        : "hover:bg-emerald-100"
                    }`
                  }
                >
                  <Home className="w-5 h-5" />
                  Home
                </NavLink>
              </li>
              {menuItems.map(({ to, icon: Icon, label }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 p-2 rounded-lg transition duration-200 ${
                        isActive &&
                        ((to === "" && location.pathname === "/dashboard") ||
                          to !== "")
                          ? "bg-emerald-200 text-emerald-900 font-semibold"
                          : "hover:bg-emerald-100"
                      }`
                    }
                  >
                    <Icon className="w-5 h-5" />
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
          <footer className="text-center text-xs text-gray-500 p-4 border-t border-emerald-200">
            © {new Date().getFullYear()} Bengal Wander
          </footer>
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;
