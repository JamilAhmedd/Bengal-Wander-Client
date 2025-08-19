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
            ? "text-white font-semibold border-b-2 border-secondary pb-1"
            : " text-white  transition"
        }
      >
        Home
      </NavLink>

      <NavLink
        to="/community"
        className={({ isActive }) =>
          isActive
            ? "text-white font-semibold border-b-2 border-secondary pb-1"
            : " text-white  transition"
        }
      >
        Community
      </NavLink>

      {user && (
        <NavLink
          to="/trips"
          className={({ isActive }) =>
            isActive
              ? "text-white font-semibold border-b-2 border-secondary pb-1"
              : " text-white  transition"
          }
        >
          Trips
        </NavLink>
      )}

      <NavLink
        to="/about-us"
        className={({ isActive }) =>
          isActive
            ? "text-white font-semibold border-b-2 border-secondary pb-1"
            : " text-white  transition"
        }
      >
        About Us
      </NavLink>
    </>
  );

  return (
    <nav className="bg-primary dark:bg-base-100/80  backdrop-blur-2xl  shadow-md px-6 py-4  sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center ">
          <img className="size-18" src={logo} alt="" />
          <div className="text-2xl font-bold text-white">Bengal Wander</div>
        </div>

        <div className="flex items-center space-x-6">
          {navItems}

          {/* Profile Dropdown */}
          {user ? (
            <Profile></Profile>
          ) : (
            <Link to="auth/login">
              <button className="px-4 w-max py-2 cursor-pointer rounded-md  bg-primary text-white border-none hover:bg-emerald-500 flex items-center justify-center">
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
