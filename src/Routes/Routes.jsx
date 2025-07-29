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
import ForgotPassword from "../components/ForgotPassword/ForgotPassword";
import ManageProfile from "../components/shared/DashboardComponents/ManageProfile/ManageProfile";
import AddStory from "../components/shared/DashboardComponents/AddStory/AddStory";
import ManageStories from "../components/shared/DashboardComponents/ManageStories/ManageStories";
import MyBookings from "../components/shared/DashboardComponents/MyBookings/MyBookings";
import TourGuideApplication from "../components/shared/DashboardComponents/TourGuideApplication/TourGuideApplication";
import UpdateStory from "../components/shared/DashboardComponents/UpdateStory/UpdateStory";
import StripePayment from "../components/shared/DashboardComponents/Payment/StipePayment";

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
    children: [
      {
        path: "manage-profile",
        element: <ManageProfile />,
      },
      {
        path: "my-bookings",
        element: <MyBookings />,
      },
      {
        path: "stories/add",
        element: <AddStory />,
      },
      {
        path: "stories/manage",
        element: <ManageStories />,
      },
      {
        path: "stories/update/:id",
        element: <UpdateStory />,
      },
      {
        path: "join-as-tour-guide",
        element: <TourGuideApplication />,
      },
      {
        path: "payment/:bookingId",
        element: <StripePayment />,
      },
    ],
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
      {
        path: "forgot-password",
        Component: ForgotPassword,
      },
    ],
  },
]);

export default router;
