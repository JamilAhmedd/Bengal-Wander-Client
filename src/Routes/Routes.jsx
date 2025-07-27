import { createBrowserRouter } from "react-router";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home/Home";
import Community from "../pages/Community/Community";
import AboutUs from "../pages/AboutUs/AboutUs";
import Trips from "../pages/Trips/Trips";
import Dashboard from "../layouts/Dashboard";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/login/Login";
import Register from "../pages/register/Register";

const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "community",
        Component: Community,
      },
      {
        path: "about-us",
        Component: AboutUs,
      },
      {
        path: "trips",
        Component: Trips,
      },
    ],
  },
  {
    path: "/dashboard",
    Component: Dashboard,
    children: [{}],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },
]);

export default router;
