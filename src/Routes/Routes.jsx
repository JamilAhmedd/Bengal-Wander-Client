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
import ManageProfile from "../components/shared/DashboardComponents/ManageProfile/UserDashboard";
import AddStory from "../components/shared/DashboardComponents/AddStory/AddStory";
import ManageStories from "../components/shared/DashboardComponents/ManageStories/ManageStories";
import MyBookings from "../components/shared/DashboardComponents/MyBookings/MyBookings";
import TourGuideApplication from "../components/shared/DashboardComponents/TourGuideApplication/TourGuideApplication";
import UpdateStory from "../components/shared/DashboardComponents/UpdateStory/UpdateStory";
import StripePayment from "../components/shared/DashboardComponents/Payment/Payment";
import EditStory from "../components/shared/DashboardComponents/ManageStories/EditStory";
import PackageDetails from "../pages/PackageDetails/PackageDetails";
import AddPackage from "../components/shared/DashboardComponents/AddPackage/AddPackage";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import UserDashboard from "../components/shared/DashboardComponents/ManageProfile/UserDashboard";
import AdminDashboard from "../components/shared/DashboardComponents/AdminDashboard/AdminDashboard";
import ManageCandidates from "../components/shared/DashboardComponents/ManageCandidates/ManageCanditase";
import Payment from "../components/shared/DashboardComponents/Payment/Payment";

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
      {
        path: "/trips/:id",
        element: <PackageDetails></PackageDetails>,
      },
    ],
  },

  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <Dashboard></Dashboard>
      </PrivateRoute>
    ),
    children: [
      {
        path: "",
        element: <UserDashboard />,
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
      {
        path: "edit-story/:id",
        element: <EditStory></EditStory>,
      },
      {
        path: "add-packages",
        element: (
          <AdminRoute>
            <AddPackage></AddPackage>
          </AdminRoute>
        ),
      },
      {
        path: "",
        element: (
          <AdminRoute>
            <AdminDashboard></AdminDashboard>
          </AdminRoute>
        ),
      },
      {
        path: "manage-candidates",
        element: (
          <AdminRoute>
            <ManageCandidates></ManageCandidates>
          </AdminRoute>
        ),
      },
      {
        path: "payment/:",
        Component: Payment,
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
