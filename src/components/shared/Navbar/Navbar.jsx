import { NavLink } from "react-router";

const Navbar = () => {
  const navItems = (
    <>
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          isActive
            ? "text-blue-600 font-semibold border-b-2 border-blue-600 pb-1"
            : "text-gray-600 hover:text-blue-600 transition"
        }
      >
        Home
      </NavLink>

      <NavLink
        to="/community"
        className={({ isActive }) =>
          isActive
            ? "text-blue-600 font-semibold border-b-2 border-blue-600 pb-1"
            : "text-gray-600 hover:text-blue-600 transition"
        }
      >
        Community
      </NavLink>

      <NavLink
        to="/about-us"
        className={({ isActive }) =>
          isActive
            ? "text-blue-600 font-semibold border-b-2 border-blue-600 pb-1"
            : "text-gray-600 hover:text-blue-600 transition"
        }
      >
        About Us
      </NavLink>

      <NavLink
        to="/trips"
        className={({ isActive }) =>
          isActive
            ? "text-blue-600 font-semibold border-b-2 border-blue-600 pb-1"
            : "text-gray-600 hover:text-blue-600 transition"
        }
      >
        Trips
      </NavLink>
    </>
  );

  return (
    <nav className="bg-white shadow-md px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="text-2xl font-bold text-blue-600">Bengal Wander</div>
        <div className="flex space-x-6">{navItems}</div>
      </div>
    </nav>
  );
};

export default Navbar;
