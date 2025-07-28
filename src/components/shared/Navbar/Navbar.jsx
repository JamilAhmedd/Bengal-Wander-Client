import { NavLink, useNavigate } from "react-router";
import { useEffect, useRef, useState } from "react";
import logo from "../../../assets/brand-logo.png";
const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const user = {
    name: "Jamil Ahmed",
    email: "jamil@example.com",
    photoURL: "https://i.pravatar.cc/150?img=3",
  };

  const handleLogout = () => {
    console.log("Logged out");
    // navigate("/login");
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

  const navItems = (
    <>
      {[
        { path: "/", label: "Home" },
        { path: "/community", label: "Community" },
        { path: "/about-us", label: "About Us" },
        { path: "/trips", label: "Trips" },
      ].map(({ path, label }) => (
        <NavLink
          key={path}
          to={path}
          end={path === "/"}
          className={({ isActive }) =>
            isActive
              ? "text-green-800 font-semibold border-b-2 border-blue-600 pb-1"
              : "text-gray-600 hover:text-green-800 transition"
          }
        >
          {label}
        </NavLink>
      ))}
    </>
  );

  return (
    <nav className="bg-white shadow-md px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center ">
          <img className="size-18" src={logo} alt="" />
          <div className="text-2xl font-bold text-green-800">Bengal Wander</div>
        </div>

        <div className="flex items-center space-x-6">
          {navItems}

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full ring ring-green-700 ring-offset-base-100 ring-offset-2">
                <img src={user.photoURL} alt="User" />
              </div>
            </button>

            {dropdownOpen && (
              <ul className="absolute right-0 mt-3 z-[100] p-2 w-60 shadow bg-white rounded-box border border-gray-200">
                <li className="px-3 py-2 border-b">
                  <p className="text-sm font-semibold text-gray-500">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </li>
                <li>
                  <NavLink
                    to="/dashboard"
                    className="block px-4 py-2 text-black hover:bg-gray-100 rounded-md"
                  >
                    Dashboard
                  </NavLink>
                </li>

                <li>
                  <button
                    onClick={handleLogout}
                    className="text-left text-red-500 hover:bg-gray-100 cursor-pointer w-full px-4 py-2 mt-1 rounded-md"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
