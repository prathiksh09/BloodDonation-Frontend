import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import AdminSidebar from "../components/AdminSidebar";

const AdminViewHighlights = () => {
  const navigate = useNavigate();

  const [highlights, setHighlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);

  // GET ALL HIGHLIGHTS

  useEffect(() => {
    fetchHighlights();
  }, []);

  const fetchHighlights = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        navigate("/admin-login");
        return;
      }

      const response = await axios.get(
        "https://blooddonation-backend-1.onrender.com/api/highlights/all",
        {
          headers: {
            token: token,
          },
        },
      );

      console.log("Highlights:", response.data);

      if (response.data.success) {
        setHighlights(response.data.highlights || []);
      }
    } catch (error) {
      console.error(
        "Get highlights error:",
        error.response?.data || error.message,
      );

      // ADMIN AUTH ERROR

      if (error.response?.status === 401) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");

        navigate("/admin-login");
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  // DELETE HIGHLIGHT

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this highlight?",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        navigate("/admin-login");
        return;
      }

      setDeleteLoading(id);

      const response = await axios.delete(
        `https://blooddonation-backend-1.onrender.com/api/highlights/${id}`,
        {
          headers: {
            token: token,
          },
        },
      );

      console.log("Delete response:", response.data);

      if (response.data.success) {
        // Remove deleted highlight immediately
        setHighlights((previousHighlights) =>
          previousHighlights.filter((highlight) => highlight._id !== id),
        );

        alert("Highlight deleted successfully");
      }
    } catch (error) {
      console.error(
        "Delete highlight error:",
        error.response?.data || error.message,
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");

        navigate("/admin-login");
        return;
      }

      alert(error.response?.data?.message || "Failed to delete highlight");
    } finally {
      setDeleteLoading(null);
    }
  };

  // For editing highlight
  const handleEdit = (id) => {
    navigate(`/admin-highlights?edit=${id}`);
  };

  // PAGE

  return (
    <div style={styles.page}>
      <AdminSidebar />

      <main style={styles.main}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>View Highlights</h1>

            <p style={styles.subtitle}>
              View and manage all blood group highlights
            </p>
          </div>
        </div>

        {/* ==================================================
            CONTENT
        ================================================== */}

        {loading && <div style={styles.messageBox}>Loading highlights...</div>}

        {!loading && highlights.length === 0 && (
          <div style={styles.messageBox}>No highlights found.</div>
        )}

        {!loading && highlights.length > 0 && (
          <div style={styles.highlightGrid}>
            {highlights.map((highlight) => (
              <div key={highlight._id} style={styles.highlightCard}>
                <div style={styles.cardTop}>
                  {/* ========================================
                      BLOOD GROUP IMAGE
                  ======================================== */}

                  <div style={styles.bloodGroupImage}>
                    {highlight.image ? (
                      <img
                        src={`https://res.cloudinary.com/a7dja13r/image/upload/${highlight.image}`}
                        alt={`${highlight.bloodGroup} blood group`}
                        style={styles.bloodGroupImageImg}
                      />
                    ) : (
                      <div style={styles.bloodGroupCircle}>
                        {highlight.bloodGroup}
                      </div>
                    )}
                  </div>

                  {/* ========================================
                      BLOOD GROUP INFORMATION
                  ======================================== */}

                  <div style={styles.cardTopInfo}>
                    <h2 style={styles.bloodGroupTitle}>
                      {highlight.bloodGroup} Blood Group
                    </h2>

                    <span
                      style={
                        highlight.isActive
                          ? styles.activeStatus
                          : styles.inactiveStatus
                      }
                    >
                      {highlight.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                {/* ==========================================
                    DESCRIPTION
                ========================================== */}

                <div style={styles.infoSection}>
                  <p style={styles.label}>Description</p>

                  <p style={styles.description}>
                    {highlight.description || "No description available"}
                  </p>
                </div>

                {/* ==========================================
                    DONATE TO
                ========================================== */}

                <div style={styles.infoSection}>
                  <p style={styles.label}>Can Donate To</p>

                  <p style={styles.value}>
                    {highlight.donateTo || "Not specified"}
                  </p>
                </div>

                {/* ==========================================
                    RECEIVE FROM
                ========================================== */}

                <div style={styles.infoSection}>
                  <p style={styles.label}>Receive From</p>

                  <p style={styles.value}>
                    {highlight.receiveFrom || "Not specified"}
                  </p>
                </div>

                {/* ==========================================
                    ACTION BUTTONS
                ========================================== */}

                <div style={styles.actions}>
                  {/* EDIT */}

                  <button
                    type="button"
                    style={styles.editButton}
                    onClick={() => handleEdit(highlight._id)}
                  >
                    Edit
                  </button>

                  {/* DELETE */}

                  <button
                    type="button"
                    style={styles.deleteButton}
                    disabled={deleteLoading === highlight._id}
                    onClick={() => handleDelete(highlight._id)}
                  >
                    {deleteLoading === highlight._id
                      ? "Deleting..."
                      : " Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

// ==========================================================
// STYLES
// ==========================================================

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f7f8fa",
    fontFamily: "Arial, Helvetica, sans-serif",
  },

  main: {
    marginLeft: "250px",
    minHeight: "100vh",
    padding: "35px 40px",
    boxSizing: "border-box",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "35px",
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

  highlightGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "22px",
  },

  // ========================================================
  // CARD
  // ========================================================

  highlightCard: {
    backgroundColor: "#ffffff",
    borderRadius: "18px",
    padding: "25px",
    boxShadow: "0 5px 25px rgba(0,0,0,0.05)",
    border: "1px solid #eeeeee",
  },

  // ========================================================
  // CARD TOP
  // ========================================================

  cardTop: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
    paddingBottom: "20px",
    borderBottom: "1px solid #eeeeee",
  },

  // ========================================================
  // IMAGE CONTAINER
  // ========================================================

  bloodGroupImage: {
    width: "84px",
    height: "84px",
    borderRadius: "50%",
    overflow: "hidden",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f5f5f5",
  },

  // ========================================================
  // CLOUDINARY IMAGE
  // ========================================================

  bloodGroupImageImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },

  // ========================================================
  // FALLBACK BLOOD GROUP CIRCLE
  // ========================================================

  bloodGroupCircle: {
    width: "84px",
    height: "84px",
    borderRadius: "50%",
    backgroundColor: "#e0002b",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    fontWeight: "700",
  },

  // ========================================================
  // CARD TOP INFORMATION
  // ========================================================

  cardTopInfo: {
    flex: 1,
  },

  bloodGroupTitle: {
    margin: "0 0 8px",
    color: "#222222",
    fontSize: "20px",
  },

  // ========================================================
  // ACTIVE
  // ========================================================

  activeStatus: {
    display: "inline-block",
    padding: "5px 12px",
    borderRadius: "20px",
    backgroundColor: "#e7f8ed",
    color: "#198754",
    fontSize: "12px",
    fontWeight: "700",
  },

  // ========================================================
  // INACTIVE
  // ========================================================

  inactiveStatus: {
    display: "inline-block",
    padding: "5px 12px",
    borderRadius: "20px",
    backgroundColor: "#ffe5e9",
    color: "#e0002b",
    fontSize: "12px",
    fontWeight: "700",
  },

  // ========================================================
  // INFORMATION SECTION
  // ========================================================

  infoSection: {
    marginTop: "18px",
  },

  label: {
    margin: "0 0 6px",
    color: "#888888",
    fontSize: "13px",
    fontWeight: "700",
  },

  description: {
    margin: 0,
    color: "#555555",
    fontSize: "14px",
    lineHeight: "1.6",
  },

  value: {
    margin: 0,
    color: "#222222",
    fontSize: "14px",
    fontWeight: "600",
  },

  // ========================================================
  // ACTIONS
  // ========================================================

  actions: {
    display: "flex",
    gap: "12px",
    marginTop: "25px",
    paddingTop: "18px",
    borderTop: "1px solid #eeeeee",
  },

  // ========================================================
  // EDIT BUTTON
  // ========================================================

  editButton: {
    flex: 1,
    border: "none",
    borderRadius: "9px",
    padding: "11px",
    backgroundColor: "#fff0f3",
    color: "#e0002b",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
  },

  // ========================================================
  // DELETE BUTTON
  // ========================================================

  deleteButton: {
    flex: 1,
    border: "none",
    borderRadius: "9px",
    padding: "11px",
    backgroundColor: "#e0002b",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
  },

  // ========================================================
  // MESSAGE BOX
  // ========================================================

  messageBox: {
    backgroundColor: "#ffffff",
    borderRadius: "15px",
    padding: "40px",
    textAlign: "center",
    color: "#777777",
    boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
  },
};

export default AdminViewHighlights;
