import { createBrowserRouter } from "react-router-dom";

import App from "./App";

// User
import UserLogin from "./pages/UserLogin";
import UserRegister from "./pages/UserRegister";

// Donor
import DonorLogin from "./pages/DonorLogin";
import DonorRegister from "./pages/DonorRegister";
import DonorDetails from "./pages/DonorDetails";
import DonorDashboard from "./pages/DonorDashboard";

// Common
import Donors from "./pages/Donors";
import RequestBlood from "./pages/RequestBlood";

import About from "./pages/About";
import Contact from "./pages/Contact";

// Admin
import AdminLogin from "./pages/Admin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminHighlights from "./pages/AdminHighlights";
import Status from "./pages/status";
import AdminViewHighlights from "./pages/AdminViewHighlights";
import AdminHighlightBin from "./pages/AdminHighlightBin";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },

  // USER

  {
    path: "/user-login",
    element: <UserLogin />,
  },

  {
    path: "/user-register",
    element: <UserRegister />,
  },

  {
    path: "/status",
    element: <Status />,
  },

  // DONOR

  {
    path: "/donor-login",
    element: <DonorLogin />,
  },

  {
    path: "/donor-register",
    element: <DonorRegister />,
  },

  {
    path: "/donor-details",
    element: <DonorDetails />,
  },

  {
    path: "/donor-dashboard",
    element: <DonorDashboard />,
  },

  {
    path: "/donor-my-details",
    element: <DonorDetails />,
  },

  // DONORS / BLOOD REQUEST

  {
    path: "/donors",
    element: <Donors />,
  },

  {
    path: "/request-blood/:donorId",
    element: <RequestBlood />,
  },

  // OTHER PAGES

  {
    path: "/about",
    element: <About />,
  },

  {
    path: "/contact",
    element: <Contact />,
  },

  // ADMIN

  {
    path: "/admin-login",
    element: <AdminLogin />,
  },

  {
    path: "/admin-dashboard",
    element: <AdminDashboard />,
  },

  {
    path: "/admin-highlights",
    element: <AdminHighlights />,
  },
  {
    path: "/admin-profile",
    element: <AdminDashboard />,
  },
  {
    path: "/admin-view-highlights",
    element: <AdminViewHighlights />,
  },
  {
    path: "/admin-highlight-bin",
    element: <AdminHighlightBin />,
  },
]);
