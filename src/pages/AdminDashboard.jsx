import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

import AdminSidebar from "../components/AdminSidebar";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ==================================================
  // STATES
  // ==================================================

  const [users, setUsers] = useState([]);
  const [donors, setDonors] = useState([]);

  const [stats, setStats] = useState({
    users: 0,
    donors: 0,
  });

  const [loading, setLoading] = useState(true);

  const [userActionLoading, setUserActionLoading] = useState(null);
  const [donorActionLoading, setDonorActionLoading] = useState(null);

  // ==================================================
  // GET USERS + DONORS
  // ==================================================

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // ==========================================
        // ADMIN TOKEN
        // ==========================================

        const token = localStorage.getItem("adminToken");

        if (!token) {
          navigate("/admin-login");
          return;
        }

        // ==========================================
        // GET ALL USERS
        // ==========================================

        const usersResponse = await axios.get(
          "http://localhost:5001/api/get-all-users",
          {
            headers: {
              token: token,
            },
          },
        );

        console.log("Users:", usersResponse.data);

        // ==========================================
        // GET ALL DONORS
        // ==========================================

        const donorsResponse = await axios.get(
          "http://localhost:5001/api/get-all-donors",
          {
            headers: {
              token: token,
            },
          },
        );

        console.log("Donors:", donorsResponse.data);

        // ==========================================
        // USERS DATA
        // ==========================================

        const usersData =
          usersResponse.data.users || usersResponse.data.data || [];

        // ==========================================
        // DONORS DATA
        // ==========================================

        const donorsData =
          donorsResponse.data.donors || donorsResponse.data.data || [];

        // ==========================================
        // SET USERS
        // ==========================================

        if (Array.isArray(usersData)) {
          setUsers(usersData);
        }

        // ==========================================
        // SET DONORS
        // ==========================================

        if (Array.isArray(donorsData)) {
          setDonors(donorsData);
        }

        // ==========================================
        // SET STATS
        // ==========================================

        setStats({
          users: Array.isArray(usersData)
            ? usersData.length
            : usersResponse.data.count || 0,

          donors: Array.isArray(donorsData)
            ? donorsData.length
            : donorsResponse.data.count || 0,
        });
      } catch (error) {
        console.error(
          "Admin Dashboard Error:",
          error.response?.data || error.message,
        );

        // ==========================================
        // ADMIN AUTH ERROR
        // ==========================================

        if (error.response?.status === 401) {
          localStorage.removeItem("adminToken");
          localStorage.removeItem("admin");

          navigate("/admin-login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  // ==================================================
  // BLOCK / UNBLOCK USER
  // ==================================================

  const handleUserBlockStatus = async (userId, isBlocked) => {
    try {
      const token = localStorage.getItem("adminToken");

      // ==========================================
      // CHECK TOKEN
      // ==========================================

      if (!token) {
        navigate("/admin-login");
        return;
      }

      setUserActionLoading(userId);

      // ==========================================
      // UPDATE BLOCK STATUS
      // ==========================================

      const response = await axios.patch(
        `http://localhost:5001/api/user/${userId}/block-status`,
        {
          isBlocked: isBlocked,
        },
        {
          headers: {
            token: token,
          },
        },
      );

      console.log("User block status response:", response.data);

      // ==========================================
      // UPDATE USER IN FRONTEND
      // ==========================================

      if (response.data.success) {
        setUsers((previousUsers) =>
          previousUsers.map((user) =>
            user._id === userId
              ? {
                  ...user,
                  isBlocked: response.data.data.isBlocked,
                }
              : user,
          ),
        );
      }
    } catch (error) {
      console.error(
        "User block status error:",
        error.response?.data || error.message,
      );

      // ==========================================
      // ADMIN AUTH ERROR
      // ==========================================

      if (error.response?.status === 401) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");

        navigate("/admin-login");

        return;
      }

      alert(error.response?.data?.message || "Failed to update user status");
    } finally {
      setUserActionLoading(null);
    }
  };

  // ==================================================
  // BLOCK / UNBLOCK DONOR
  // ==================================================

  const handleDonorBlockStatus = async (donorId, isBlocked) => {
    try {
      const token = localStorage.getItem("adminToken");

      // ==========================================
      // CHECK TOKEN
      // ==========================================

      if (!token) {
        navigate("/admin-login");
        return;
      }

      setDonorActionLoading(donorId);

      // ==========================================
      // UPDATE DONOR BLOCK STATUS
      // ==========================================

      const response = await axios.patch(
        `http://localhost:5001/api/donor/${donorId}/block-status`,
        {
          isBlocked: isBlocked,
        },
        {
          headers: {
            token: token,
          },
        },
      );

      console.log("Donor block status response:", response.data);

      // ==========================================
      // UPDATE DONOR IN FRONTEND
      // ==========================================

      if (response.data.success) {
        setDonors((previousDonors) =>
          previousDonors.map((donor) =>
            donor._id === donorId
              ? {
                  ...donor,
                  isBlocked: response.data.data.isBlocked,
                }
              : donor,
          ),
        );
      }
    } catch (error) {
      console.error(
        "Donor block status error:",
        error.response?.data || error.message,
      );

      // ==========================================
      // ADMIN AUTH ERROR
      // ==========================================

      if (error.response?.status === 401) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");

        navigate("/admin-login");

        return;
      }

      alert(error.response?.data?.message || "Failed to update donor status");
    } finally {
      setDonorActionLoading(null);
    }
  };

  // ==================================================
  // ADMIN PROFILE PAGE
  // ==================================================

  if (location.pathname === "/admin-profile") {
    return (
      <div style={styles.page}>
        {/* SIDEBAR */}

        <AdminSidebar />

        {/* MAIN CONTENT */}

        <main style={styles.main}>
          {/* HEADER */}

          <div style={styles.header}>
            <div>
              <h1 style={styles.title}>Admin Profile</h1>

              <p style={styles.subtitle}>
                Manage administrator profile and account information
              </p>
            </div>
          </div>

          {/* PROFILE CONTENT */}

          <div style={styles.profileContainer}>
            {/* PROFILE TOP CARD */}

            <section style={styles.profileTopCard}>
              <div>
                <img style ={styles.profileAvatar}
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9zfzfKGaBIjTUd2PVwAw0IeKmCyj9g4OrOmx5FMpHkw&s=10"
                alt="Admin"
                
              />
              </div>
              

              <div style={styles.profileMainInfo}>
                <div style={styles.profileNameRow}>
                  <h2 style={styles.profileName}>Pavan</h2>

                  <span style={styles.adminBadge}>Administrator</span>
                </div>

                <p style={styles.profileEmail}>pavan123@gmail.com</p>

                <p style={styles.profileDescription}>
                  LifeLine platform administrator
                </p>
              </div>
            </section>

            {/* ACCOUNT INFORMATION */}

            <section style={styles.infoCard}>
              <div style={styles.infoHeader}>
                <div>
                  <h2 style={styles.infoTitle}>Account Information</h2>

                  <p style={styles.infoSubtitle}>
                    Personal and contact details
                  </p>
                </div>
              </div>

              {/* INFORMATION GRID */}

              <div style={styles.infoGrid}>
                {/* FULL NAME */}

                <div style={styles.infoItem}>
                  <div>
                    <p style={styles.infoLabel}>Full Name</p>

                    <p style={styles.infoValue}>Pavan</p>
                  </div>
                </div>

                {/* EMAIL */}

                <div style={styles.infoItem}>
                  <div>
                    <p style={styles.infoLabel}>Email Address</p>

                    <p style={styles.infoValue}>pavan123@gmail.com</p>
                  </div>
                </div>

                {/* PHONE */}

                <div style={styles.infoItem}>
                  <div>
                    <p style={styles.infoLabel}>Phone Number</p>

                    <p style={styles.infoValue}>9745623143</p>
                  </div>
                </div>

                {/* LOCATION */}

                <div style={styles.infoItem}>
                  <div>
                    <p style={styles.infoLabel}>Location</p>

                    <p style={styles.infoValue}>Mangaluru, Karnataka</p>
                  </div>
                </div>
              </div>
            </section>

            {/* ADMIN ACCESS */}

            <section style={styles.accessCard}>
              <div style={styles.accessIcon}>🛡️</div>

              <div style={styles.accessContent}>
                <h3 style={styles.accessTitle}>Administrator Access</h3>

                <p style={styles.accessText}>
                  This account has administrator access to manage users, donors
                  and the LifeLine platform.
                </p>
              </div>
            </section>
          </div>
        </main>
      </div>
    );
  }

  // ==================================================
  // DASHBOARD
  // ==================================================

  return (
    <div style={styles.page}>
      <AdminSidebar />

      <main style={styles.main}>
        {/* HEADER */}

        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Admin Dashboard</h1>

            <p style={styles.subtitle}>
              Manage LifeLine blood donation platform
            </p>
          </div>
        </div>

        {/* ==================================================
            OVERVIEW
        ================================================== */}

        <section>
          <h2 style={styles.sectionTitle}>Overview</h2>

          <div style={styles.statsGrid}>
            {/* USERS */}

            <div style={styles.statCard}>
              <div>
                <p style={styles.statLabel}>Total Users</p>

                <h2 style={styles.statNumber}>
                  {loading ? "..." : stats.users}
                </h2>
              </div>
            </div>

            {/* DONORS */}

            <div style={styles.statCard}>
              <div>
                <p style={styles.statLabel}>Total Donors</p>

                <h2 style={styles.statNumber}>
                  {loading ? "..." : stats.donors}
                </h2>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            USERS LIST
        ================================================== */}

        <section style={styles.usersSection}>
          <div style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}>Registered Users</h2>

              <p style={styles.sectionDescription}>
                Manage registered users and their account access.
              </p>
            </div>
          </div>

          {/* LOADING */}

          {loading && <div style={styles.messageBox}>Loading users...</div>}

          {/* NO USERS */}

          {!loading && users.length === 0 && (
            <div style={styles.messageBox}>No users found.</div>
          )}

          {/* USERS */}

          {!loading && users.length > 0 && (
            <div style={styles.usersList}>
              {users.map((user) => (
                <div key={user._id} style={styles.userCard}>
                  {/* USER AVATAR */}

                  <div style={styles.userAvatar}>
                    {user.image ? (
                      <img
                        src={`https://res.cloudinary.com/a7dja13r/image/upload/${user.image}`}
                        alt={user.name || "User Profile"}
                        style={styles.userProfileImage}
                      />
                    ) : user.name ? (
                      user.name.charAt(0).toUpperCase()
                    ) : (
                      "U"
                    )}
                  </div>

                  {/* USER DETAILS */}

                  <div style={styles.userDetails}>
                    <h3 style={styles.userName}>
                      {user.name || "Unknown User"}
                    </h3>

                    <p style={styles.userEmail}>{user.email}</p>
                  </div>

                  {/* STATUS */}

                  <div style={styles.userStatus}>
                    {user.isBlocked ? (
                      <span style={styles.blockedStatus}>Blocked</span>
                    ) : (
                      <span style={styles.activeStatus}>Active</span>
                    )}
                  </div>

                  {/* ACTION */}

                  <div style={styles.userAction}>
                    {user.isBlocked ? (
                      <button
                        type="button"
                        disabled={userActionLoading === user._id}
                        style={styles.unblockButton}
                        onClick={() => handleUserBlockStatus(user._id, false)}
                      >
                        {userActionLoading === user._id
                          ? "Updating..."
                          : "Unblock"}
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={userActionLoading === user._id}
                        style={styles.blockButton}
                        onClick={() => handleUserBlockStatus(user._id, true)}
                      >
                        {userActionLoading === user._id
                          ? "Updating..."
                          : "Block"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ==================================================
            DONORS LIST
        ================================================== */}

        <section style={styles.usersSection}>
          <div style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}>Registered Donors</h2>

              <p style={styles.sectionDescription}>
                Manage registered donors and their account access.
              </p>
            </div>
          </div>

          {/* LOADING */}

          {loading && <div style={styles.messageBox}>Loading donors...</div>}

          {/* NO DONORS */}

          {!loading && donors.length === 0 && (
            <div style={styles.messageBox}>No donors found.</div>
          )}

          {/* DONORS */}

          {!loading && donors.length > 0 && (
            <div style={styles.usersList}>
              {donors.map((donor) => (
                <div key={donor._id} style={styles.userCard}>
                  {/* DONOR IMAGE / AVATAR */}

                  <div style={styles.userAvatar}>
                    {donor.image ? (
                      <img
                        src={`https://res.cloudinary.com/a7dja13r/image/upload/${donor.image}`}
                        alt={donor.donorName}
                        style={styles.donorImage}
                      />
                    ) : donor.donorName ? (
                      donor.donorName.charAt(0).toUpperCase()
                    ) : (
                      "D"
                    )}
                  </div>

                  {/* DONOR DETAILS */}

                  <div style={styles.userDetails}>
                    <h3 style={styles.userName}>
                      {donor.donorName || "Unknown Donor"}
                    </h3>

                    <p style={styles.userEmail}>
                      Blood Group: {donor.bloodGroup || "N/A"}
                    </p>
                  </div>

                  {/* STATUS */}

                  <div style={styles.userStatus}>
                    {donor.isBlocked ? (
                      <span style={styles.blockedStatus}>Blocked</span>
                    ) : (
                      <span style={styles.activeStatus}>Active</span>
                    )}
                  </div>

                  {/* ACTION */}

                  <div style={styles.userAction}>
                    {donor.isBlocked ? (
                      <button
                        type="button"
                        disabled={donorActionLoading === donor._id}
                        style={styles.unblockButton}
                        onClick={() => handleDonorBlockStatus(donor._id, false)}
                      >
                        {donorActionLoading === donor._id
                          ? "Updating..."
                          : "Unblock"}
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={donorActionLoading === donor._id}
                        style={styles.blockButton}
                        onClick={() => handleDonorBlockStatus(donor._id, true)}
                      >
                        {donorActionLoading === donor._id
                          ? "Updating..."
                          : "Block"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

// ==========================================================
// STYLES
// ==========================================================

const styles = {
  // ==================================================
  // PAGE
  // ==================================================

  page: {
    minHeight: "100vh",
    backgroundColor: "#f7f8fa",
    fontFamily: "Arial, Helvetica, sans-serif",
  },

  // ==================================================
  // MAIN
  // ==================================================

  main: {
    marginLeft: "250px",
    minHeight: "100vh",
    padding: "35px 40px",
    boxSizing: "border-box",
  },

  // ==================================================
  // HEADER
  // ==================================================

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "40px",
  },

  title: {
    margin: 0,
    fontSize: "32px",
    color: "#222222",
  },

  subtitle: {
    margin: "8px 0 0",
    color: "#777777",
    fontSize: "15px",
  },

  // ==================================================
  // SECTION
  // ==================================================

  sectionTitle: {
    margin: "0 0 18px",
    color: "#222222",
    fontSize: "21px",
  },

  sectionDescription: {
    margin: 0,
    color: "#777777",
    fontSize: "14px",
  },

  // ==================================================
  // STATS
  // ==================================================

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "20px",
  },

  statCard: {
    backgroundColor: "#ffffff",
    borderRadius: "15px",
    padding: "25px",
    display: "flex",
    alignItems: "center",
    gap: "18px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
  },

  statLabel: {
    margin: "0 0 5px",
    color: "#777777",
    fontSize: "14px",
  },

  statNumber: {
    margin: 0,
    color: "#222222",
    fontSize: "30px",
  },

  // ==================================================
  // USERS / DONORS
  // ==================================================

  usersSection: {
    marginTop: "40px",
  },

  sectionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "18px",
  },

  usersList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  userCard: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "18px 20px",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
  },

  userAvatar: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    backgroundColor: "#eaf2ff",
    color: "#4a3b8f",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    fontWeight: "700",
    flexShrink: 0,
    overflow: "hidden",
  },

  userProfileImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },

  donorImage: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    objectFit: "cover",
  },

  userDetails: {
    flex: 1,
  },

  userName: {
    margin: 0,
    color: "#222222",
    fontSize: "16px",
  },

  userEmail: {
    margin: "5px 0 0",
    color: "#777777",
    fontSize: "14px",
  },

  userStatus: {
    minWidth: "80px",
  },

  activeStatus: {
    display: "inline-block",
    padding: "6px 12px",
    borderRadius: "20px",
    backgroundColor: "#e7f8ed",
    color: "#198754",
    fontSize: "12px",
    fontWeight: "700",
  },

  blockedStatus: {
    display: "inline-block",
    padding: "6px 12px",
    borderRadius: "20px",
    backgroundColor: "#ffe5e9",
    color: "#e0002b",
    fontSize: "12px",
    fontWeight: "700",
  },

  userAction: {
    minWidth: "100px",
    textAlign: "right",
  },

  blockButton: {
    border: "none",
    borderRadius: "8px",
    padding: "9px 18px",
    backgroundColor: "#e0002b",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
  },

  unblockButton: {
    border: "none",
    borderRadius: "8px",
    padding: "9px 18px",
    backgroundColor: "#198754",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
  },

  messageBox: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "30px",
    textAlign: "center",
    color: "#777777",
    boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
  },

  // ==================================================
  // ADMIN PROFILE
  // ==================================================

  profileContainer: {
    maxWidth: "1000px",
    display: "flex",
    flexDirection: "column",
    gap: "22px",
  },

  profileTopCard: {
    backgroundColor: "#ffffff",
    borderRadius: "18px",
    padding: "32px",
    display: "flex",
    alignItems: "center",
    gap: "24px",
    boxShadow: "0 5px 25px rgba(0,0,0,0.05)",
    border: "1px solid #f0f0f0",
  },

  profileAvatar: {
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "34px",
    fontWeight: "700",
    flexShrink: 0,

  },

  profileMainInfo: {
    flex: 1,
  },

  profileNameRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  },

  profileName: {
    margin: 0,
    color: "#222222",
    fontSize: "26px",
    fontWeight: "700",
  },

  adminBadge: {
    display: "inline-block",
    padding: "6px 12px",
    borderRadius: "20px",
    backgroundColor: "#ffe5e9",
    color: "#e0002b",
    fontSize: "12px",
    fontWeight: "700",
  },

  profileEmail: {
    margin: "8px 0 0",
    color: "#555555",
    fontSize: "15px",
  },

  profileDescription: {
    margin: "6px 0 0",
    color: "#888888",
    fontSize: "14px",
  },

  // ==================================================
  // INFORMATION CARD
  // ==================================================

  infoCard: {
    backgroundColor: "#ffffff",
    borderRadius: "18px",
    padding: "30px",
    boxShadow: "0 5px 25px rgba(0,0,0,0.05)",
    border: "1px solid #f0f0f0",
  },

  infoHeader: {
    paddingBottom: "20px",
    borderBottom: "1px solid #eeeeee",
  },

  infoTitle: {
    margin: 0,
    color: "#222222",
    fontSize: "20px",
    fontWeight: "700",
  },

  infoSubtitle: {
    margin: "6px 0 0",
    color: "#888888",
    fontSize: "14px",
  },

  // ==================================================
  // INFORMATION GRID
  // ==================================================

  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "0",
  },

  infoItem: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    padding: "24px 10px",
    borderBottom: "1px solid #eeeeee",
  },

  infoLabel: {
    margin: 0,
    color: "#888888",
    fontSize: "13px",
    fontWeight: "500",
  },

  infoValue: {
    margin: "5px 0 0",
    color: "#222222",
    fontSize: "15px",
    fontWeight: "600",
  },

  // ==================================================
  // ADMIN ACCESS CARD
  // ==================================================

  accessCard: {
    backgroundColor: "#ffffff",
    borderRadius: "18px",
    padding: "24px 28px",
    display: "flex",
    alignItems: "center",
    gap: "18px",
    boxShadow: "0 5px 25px rgba(0,0,0,0.05)",
    border: "1px solid #f0f0f0",
  },

  accessIcon: {
    width: "52px",
    height: "52px",
    borderRadius: "12px",
    backgroundColor: "#fff4e5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "23px",
    flexShrink: 0,
  },

  accessContent: {
    flex: 1,
  },

  accessTitle: {
    margin: 0,
    color: "#222222",
    fontSize: "16px",
    fontWeight: "700",
  },

  accessText: {
    margin: "5px 0 0",
    color: "#777777",
    fontSize: "13px",
    lineHeight: "1.5",
  },
};

export default AdminDashboard;
