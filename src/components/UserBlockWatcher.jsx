import { useEffect } from "react";
import axios from "axios";

const UserBlockWatcher = () => {
  useEffect(() => {
    const checkUserStatus = async () => {
      const currentPath = window.location.pathname;

      // Never interfere with admin pages.

      if (currentPath.startsWith("/admin")) {
        return;
      }

      // ======================================================
      // CHECK SESSION ROLE
      // ======================================================

      const sessionRole = localStorage.getItem("sessionRole");

      // This watcher works ONLY for USER
      if (sessionRole !== "user") {
        // If this is a blocked-user session,
        // prevent access to normal website pages.
        const userBlocked = localStorage.getItem("userBlocked");

        if (userBlocked === "true" && currentPath !== "/user-login") {
          window.location.replace("/user-login");
        }

        return;
      }

      // USER TOKEN

      const userToken = localStorage.getItem("userToken");

      // No logged-in user
      if (!userToken) {
        return;
      }

      // CHECK USER WITH BACKEND

      try {
        await axios.get(
          "https://blooddonation-backend-1.onrender.com/api/check-user-status",
          {
            headers: {
              token: userToken,
            },
          },
        );

        // User is active
        console.log("User account is active");
      } catch (error) {
        console.log(
          "User status check:",
          error.response?.data || error.message,
        );

        // USER IS BLOCKED

        if (
          error.response?.status === 403 &&
          error.response?.data?.blocked === true
        ) {
          console.log("User blocked by admin");

          // Remember blocked state
          localStorage.setItem("userBlocked", "true");

          // Change session role
          localStorage.setItem("sessionRole", "blockedUser");

          // =================================================
          // REMOVE ONLY USER SESSION
          // =================================================

          localStorage.removeItem("token");

          localStorage.removeItem("userToken");

          localStorage.removeItem("user");

          // =================================================
          // REDIRECT USER TO LOGIN
          // =================================================

          window.location.replace("/user-login");
        }
      }
    };

    // ======================================================
    // CHECK IMMEDIATELY
    // ======================================================

    checkUserStatus();

    // ======================================================
    // CHECK EVERY 1 SECOND
    // ======================================================

    const interval = setInterval(checkUserStatus, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return null;
};

export default UserBlockWatcher;
