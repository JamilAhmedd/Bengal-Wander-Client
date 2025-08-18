import React, { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import useAuth from "../../../AuthProvider/useAuth";

const Profile = () => {
  const { logOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const { user } = useAuth();
  const handleLogout = () => {
    logOut()
      .then(() => {
        localStorage.removeItem("access-token");
        navigate("/auth/login");
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen((prev) => !prev)}
        className="btn  btn-ghost  btn-circle avatar"
      >
        <div className="w-16  rounded-full ring ring-offset-base-100 ring-offset-2">
          <img
            className="object-cover w-full h-full"
            src={user.photoURL}
            alt="User"
            referrerPolicy="no-referrer"
          />
        </div>
      </button>

      {dropdownOpen && (
        <ul className="absolute right-0 mt-8 z-[100] p-2 w-60 border border-gray-400/30 bg-white/60 backdrop-blur-sm rounded-box ">
          <li className="px-3 py-2 border-b">
            <p className="text-sm font-semibold text-gray-500">
              {user.displayName}
            </p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </li>
          <li className="mt-4">
            <NavLink
              to="/dashboard/profile"
              className="block px-4 py-2 text-black hover:bg-gray-100/60  hover:backdrop-blur-md rounded-md"
            >
              Dashboard
            </NavLink>
          </li>

          <li>
            <button
              onClick={handleLogout}
              className="text-left text-red-500 hover:bg-gray-100/60 hover:backdrop-blur-md cursor-pointer w-full px-4 py-2 mt-1 rounded-md"
            >
              Logout
            </button>
          </li>
        </ul>
      )}
    </div>
  );
};

export default Profile;
