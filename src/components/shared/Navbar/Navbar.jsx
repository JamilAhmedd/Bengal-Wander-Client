import { Link, NavLink } from "react-router";

import logo from "../../../assets/brand-logo.png";
import useAuth from "../../../AuthProvider/useAuth";
import Profile from "../Profile/Profile";

const Navbar = () => {
  const { user } = useAuth();

  const navItems = (
    <>
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          isActive
            ? "text-primary font-semibold border-b-2 border-primary pb-1"
            : "text-neutral hover:text-primary transition"
        }
      >
        Home
      </NavLink>

      <NavLink
        to="/community"
        className={({ isActive }) =>
          isActive
            ? "text-primary font-semibold border-b-2 border-primary pb-1"
            : "text-neutral hover:text-primary transition"
        }
      >
        Community
      </NavLink>

      {user && (
        <NavLink
          to="/trips"
          className={({ isActive }) =>
            isActive
              ? "text-primary font-semibold border-b-2 border-primary pb-1"
              : "text-neutral hover:text-primary transition"
          }
        >
          Trips
        </NavLink>
      )}

      <NavLink
        to="/about-us"
        className={({ isActive }) =>
          isActive
            ? "text-primary font-semibold border-b-2 border-primary pb-1"
            : "text-neutral hover:text-primary transition"
        }
      >
        About Us
      </NavLink>
    </>
  );

  return (
    <nav className="bg-[#3a5a40] shadow-md px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center ">
          <img className="size-18" src={logo} alt="" />
          <div className="text-2xl font-bold text-green-800">Bengal Wander</div>
        </div>

        <div className="flex items-center space-x-6">
          {navItems}

          {/* Profile Dropdown */}
          {user ? (
            <Profile></Profile>
          ) : (
            <Link to="auth/login">
              <button className="px-4 w-max py-2 cursor-pointer rounded-md  bg-[#588157] text-white border-none hover:bg-emerald-500 flex items-center justify-center">
                Sign In
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
