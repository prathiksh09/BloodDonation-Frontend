import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import { router } from "./routes";
import UserBlockWatcher from "./components/UserBlockWatcher";

import "./index.css";
import "./responsive.css";

createRoot(
  document.getElementById("root")
).render(
  <StrictMode>
    <UserBlockWatcher />

    <RouterProvider router={router} />
  </StrictMode>
);