import { NavLink, useNavigate } from "react-router-dom";
import { FaTint } from "react-icons/fa";

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");

    navigate("/admin-login");
  };

  // ==========================================================
  // MENU ITEM STYLE
  // ==========================================================

  const menuItemStyle = ({ isActive }) => ({
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "13px 18px",
    marginBottom: "8px",
    borderRadius: "9px",
    textDecoration: "none",

    backgroundColor: isActive ? "#e0002b" : "transparent",

    color: isActive ? "#ffffff" : "#555555",

    fontSize: "14px",
    fontWeight: isActive ? "700" : "600",

    transition: "0.2s",
  });

  return (
    <aside style={styles.sidebar}>
      {/* ==================================================
          LIFELINE LOGO
      ================================================== */}

      <div style={styles.logoSection}>
        {/* LIFE LINE ICON */}

        <FaTint style={styles.logoIcon} />

        {/* LOGO TEXT */}

        <div style={styles.logoTextContainer}>
          <h2 style={styles.logoTitle}>LifeLine</h2>

          <p style={styles.logoSubtitle}>Admin Panel</p>
        </div>
      </div>

      {/* ==================================================
          MENU
      ================================================== */}

      <nav style={styles.menu}>
        {/* DASHBOARD */}

        <NavLink to="/admin-dashboard" style={menuItemStyle}>
          <span style={styles.icon}></span>
          <span>Dashboard</span>
        </NavLink>

        {/* HIGHLIGHT */}

        <NavLink to="/admin-highlights" style={menuItemStyle}>
          <span style={styles.icon}></span>
          <span>Highlight</span>
        </NavLink>

        {/* VIEW HIGHLIGHTS */}

        <NavLink to="/admin-view-highlights" style={menuItemStyle}>
          <span style={styles.icon}></span>
          <span>View</span>
        </NavLink>

        {/* BIN */}

        <NavLink to="/admin-highlight-bin" style={menuItemStyle}>
          <span style={styles.icon}></span>
          <span>Bin</span>
        </NavLink>

        {/* ADMIN PROFILE */}

        <NavLink to="/admin-profile" style={menuItemStyle}>
          <span style={styles.icon}></span>
          <span>Admin Profile</span>
        </NavLink>
      </nav>

      {/* ==================================================
          LOGOUT
      ================================================== */}

      <div style={styles.bottomSection}>
        <button
          type="button"
          onClick={handleLogout}
          style={styles.logoutButton}
        >
          <span style={styles.icon}></span>

          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

// ==========================================================
// STYLES
// ==========================================================

const styles = {
  // ========================================================
  // SIDEBAR
  // ========================================================

  sidebar: {
    position: "fixed",

    left: 0,
    top: 0,

    width: "250px",
    height: "100vh",

    backgroundColor: "#ffffff",

    borderRight: "1px solid #eeeeee",

    padding: "25px 18px",

    boxSizing: "border-box",

    display: "flex",
    flexDirection: "column",

    zIndex: 1000,
  },

  // ========================================================
  // LOGO SECTION
  // ========================================================

  logoSection: {
    display: "flex",
    alignItems: "center",

    gap: "12px",

    padding: "5px 8px 25px",

    borderBottom: "1px solid #eeeeee",

    marginBottom: "25px",
  },

  // ========================================================
  // LIFE LINE ICON
  // ========================================================

  logoIcon: {
    fontSize: "33px",

    color: "#d90429",

    flexShrink: 0,
  },

  // ========================================================
  // LOGO TEXT
  // ========================================================

  logoTextContainer: {
    display: "flex",

    flexDirection: "column",

    justifyContent: "center",
  },

  logoTitle: {
    margin: 0,

    color: "#d90429",

    fontSize: "24px",

    lineHeight: "20px",

    fontWeight: "600",

    letterSpacing: "-0.5px",
  },

  logoSubtitle: {
    margin: "3px 0 0",

    color: "#888888",

    fontSize: "13px",

    lineHeight: "16px",
  },

  // ========================================================
  // MENU
  // ========================================================

  menu: {
    flex: 1,
  },

  icon: {
    width: "25px",

    textAlign: "center",

    fontSize: "18px",
  },

  // ========================================================
  // BOTTOM
  // ========================================================

  bottomSection: {
    borderTop: "1px solid #eeeeee",

    paddingTop: "18px",
  },

  // ========================================================
  // LOGOUT
  // ========================================================

  logoutButton: {
    width: "100%",

    display: "flex",

    alignItems: "center",

    gap: "12px",

    padding: "13px 18px",

    border: "none",

    borderRadius: "9px",

    backgroundColor: "#fff0f3",

    color: "#e0002b",

    fontSize: "14px",

    fontWeight: "700",

    cursor: "pointer",

    textAlign: "left",
  },
};

export default AdminSidebar;
