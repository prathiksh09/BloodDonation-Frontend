import { useEffect, useState } from "react";
import {
  FaTint,
  FaSignOutAlt,
  FaSignInAlt,
  FaChevronDown,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // ==========================================================
  // CHECK WHETHER JWT TOKEN IS VALID
  // ==========================================================
  const checkLoginStatus = () => {
    const token =
      localStorage.getItem("token") || localStorage.getItem("userToken");

    // No token
    if (!token) {
      setIsLoggedIn(false);
      setUser(null);
      return;
    }

    try {
      // Decode JWT payload
      const payload = JSON.parse(atob(token.split(".")[1]));

      // JWT exp is in seconds
      const currentTime = Math.floor(Date.now() / 1000);

      // Token expired
      if (payload.exp && payload.exp <= currentTime) {
        console.log("Token expired");

        localStorage.removeItem("token");
        localStorage.removeItem("userToken");
        localStorage.removeItem("user");

        setIsLoggedIn(false);
        setUser(null);
        setShowDropdown(false);

        return;
      }

      // Token is valid
      const storedUser = JSON.parse(localStorage.getItem("user") || "null");

      setIsLoggedIn(true);
      setUser(storedUser);
    } catch (error) {
      console.log("Invalid token");

      // Invalid token
      localStorage.removeItem("token");
      localStorage.removeItem("userToken");
      localStorage.removeItem("user");

      setIsLoggedIn(false);
      setUser(null);
      setShowDropdown(false);
    }
  };

  // ==========================================================
  // CHECK LOGIN WHEN NAVBAR LOADS
  // ==========================================================
  useEffect(() => {
    checkLoginStatus();

    // Check every 1 second
    const interval = setInterval(() => {
      checkLoginStatus();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // ==========================================================
  // CHECK WHEN LOCAL STORAGE CHANGES
  // ==========================================================
  useEffect(() => {
    const handleStorageChange = () => {
      checkLoginStatus();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // ==========================================================
  // USER IMAGE
  // ==========================================================
  const userImage = user?.image
    ? `https://res.cloudinary.com/a7dja13r/image/upload/${user.image}`
    : null;

  // ==========================================================
  // LOGOUT
  // ==========================================================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userToken");
    localStorage.removeItem("user");

    setIsLoggedIn(false);
    setUser(null);
    setShowDropdown(false);

    navigate("/");
  };

  return (
    <nav className="lifeline-navbar" style={styles.navbar}>
      {/* ======================================================
          LOGO
      ====================================================== */}
      <Link to="/" className="lifeline-logo" style={styles.logo}>
        <FaTint style={styles.logoIcon} />
        <span>LifeLine</span>
      </Link>

      {/* ======================================================
          MENU
      ====================================================== */}
      <ul className="lifeline-menu" style={styles.menu}>
        {/* HOME */}
        <li>
          <Link to="/" className="lifeline-link" style={styles.link}>
            Home
          </Link>
        </li>

        {/* ABOUT */}
        <li>
          <Link to="/about" className="lifeline-link" style={styles.link}>
            About
          </Link>
        </li>

        {/* DONORS */}
        <li>
          <Link to="/donors" className="lifeline-link" style={styles.link}>
            Donors
          </Link>
        </li>

        {/* ==================================================
            STATUS - ONLY LOGGED IN USERS
        ================================================== */}
        {isLoggedIn && (
          <li>
            <Link to="/status" className="lifeline-link" style={styles.link}>
              Status
            </Link>
          </li>
        )}

        {/* CONTACT */}
        <li>
          <Link to="/contact" className="lifeline-link" style={styles.link}>
            Contact
          </Link>
        </li>
      </ul>

      {/* ======================================================
          LOGIN / PROFILE
      ====================================================== */}
      <div className="lifeline-buttons" style={styles.buttons}>
        {isLoggedIn ? (
          /* ==================================================
             LOGGED IN → PROFILE
          ================================================== */
          <div style={styles.profileContainer}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              style={styles.profileBox}
            >
              {/* PROFILE IMAGE */}
              {userImage ? (
                <img
                  src={userImage}
                  alt="User Profile"
                  style={styles.profileImage}
                />
              ) : (
                <div style={styles.profileFallback}>
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}

              {/* USER NAME */}
              <span style={styles.userName}>{user?.name || "User"}</span>

              {/* ARROW */}
              <FaChevronDown
                style={{
                  ...styles.arrow,
                  transform: showDropdown ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            </button>

            {/* DROPDOWN */}
            {showDropdown && (
              <div style={styles.dropdown}>
                <button onClick={handleLogout} style={styles.logoutBtn}>
                  <FaSignOutAlt style={{ marginRight: "8px" }} />
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          /* ==================================================
             LOGGED OUT → LOGIN
          ================================================== */
          <Link to="/user-login" style={styles.loginBtn}>
            <FaSignInAlt style={{ marginRight: "8px" }} />
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    width: "100%",
    height: "80px",
    backgroundColor: "#ffffff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 70px",
    boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    boxSizing: "border-box",
  },

  logo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#d90429",
    fontSize: "28px",
    fontWeight: "bold",
    textDecoration: "none",
    whiteSpace: "nowrap",
  },

  logoIcon: {
    fontSize: "32px",
    flexShrink: 0,
  },

  menu: {
    display: "flex",
    alignItems: "center",
    listStyle: "none",
    gap: "32px",
    margin: 0,
    padding: 0,
  },

  link: {
    textDecoration: "none",
    color: "#333333",
    fontSize: "17px",
    fontWeight: "500",
    whiteSpace: "nowrap",
  },

  buttons: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },

  profileContainer: {
    position: "relative",
  },

  profileBox: {
    width: "175px",
    height: "52px",
    padding: "5px 12px",
    backgroundColor: "#ffffff",
    border: "1px solid #dddddd",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
  },

  profileImage: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #514d4da6",
    flexShrink: 0,
  },

  profileFallback: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#d90429",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "17px",
    flexShrink: 0,
  },

  userName: {
    color: "#333333",
    fontSize: "16px",
    fontWeight: "600",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: "90px",
  },

  arrow: {
    fontSize: "12px",
    color: "#555555",
    marginLeft: "auto",
    transition: "transform 0.2s ease",
  },

  dropdown: {
    position: "absolute",
    top: "60px",
    right: "0",
    width: "175px",
    backgroundColor: "#ffffff",
    border: "1px solid #dddddd",
    borderRadius: "8px",
    padding: "8px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.15)",
    zIndex: 2000,
  },

  logoutBtn: {
    width: "100%",
    padding: "10px 15px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#464344d8",
    color: "#ffffff",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "15px",
  },

  loginBtn: {
    padding: "10px 20px",
    border: "2px solid #d90429",
    borderRadius: "8px",
    backgroundColor: "#ffffff",
    color: "#d90429",
    fontWeight: "600",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    whiteSpace: "nowrap",
  },
};

export default Navbar;
