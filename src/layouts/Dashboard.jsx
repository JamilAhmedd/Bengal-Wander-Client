// Dashboard.jsx
import React from "react";
import { Outlet, NavLink, useLocation } from "react-router";
import {
  UserCircle,
  BookOpen,
  FileText,
  PlusCircle,
  Briefcase,
} from "lucide-react";
import logo from "../assets/brand-logo.png";

const Dashboard = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);

  return (
    <div className="drawer lg:drawer-open ">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
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
          <div className="rounded-xl border  border-green-400/30 p-4 md:p-6 bg-white shadow-sm">
            <Outlet />
          </div>
        </main>
      </div>

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
                  to={"manage-profile"}
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-2 rounded-lg transition duration-200 ${
                      isActive
                        ? "bg-emerald-200 text-emerald-900 font-semibold"
                        : "hover:bg-emerald-100"
                    }`
                  }
                >
                  <UserCircle className="w-5 h-5" /> Manage Profile
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="my-bookings"
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-2 rounded-lg transition duration-200 ${
                      isActive
                        ? "bg-emerald-200 text-emerald-900 font-semibold"
                        : "hover:bg-emerald-100"
                    }`
                  }
                >
                  <BookOpen className="w-5 h-5" /> My Bookings
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="stories/manage"
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-2 rounded-lg transition duration-200 ${
                      isActive
                        ? "bg-emerald-200 text-emerald-900 font-semibold"
                        : "hover:bg-emerald-100"
                    }`
                  }
                >
                  <FileText className="w-5 h-5" /> Manage Stories
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="stories/add"
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-2 rounded-lg transition duration-200 ${
                      isActive
                        ? "bg-emerald-200 text-emerald-900 font-semibold"
                        : "hover:bg-emerald-100"
                    }`
                  }
                >
                  <PlusCircle className="w-5 h-5" /> Add Stories
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="join-as-tour-guide"
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-2 rounded-lg transition duration-200 ${
                      isActive
                        ? "bg-emerald-200 text-emerald-900 font-semibold"
                        : "hover:bg-emerald-100"
                    }`
                  }
                >
                  <Briefcase className="w-5 h-5" /> Join as Tour Guide
                </NavLink>
              </li>
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
