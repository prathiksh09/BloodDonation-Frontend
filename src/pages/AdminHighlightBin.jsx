import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import AdminSidebar from "../components/AdminSidebar";

const AdminHighlightBin = () => {
  const navigate = useNavigate();

  const [highlights, setHighlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  // ==========================================================
  // GET DELETED HIGHLIGHTS
  // ==========================================================

  useEffect(() => {
    fetchDeletedHighlights();
  }, []);

  const fetchDeletedHighlights = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("adminToken");

      if (!token) {
        navigate("/admin-login");
        return;
      }

      const response = await axios.get(
        "http://localhost:5001/api/highlights/bin",
        {
          headers: {
            token: token,
          },
        },
      );

      console.log("Bin highlights:", response.data);

      if (response.data.success) {
        setHighlights(response.data.highlights || []);
      }
    } catch (error) {
      console.error(
        "Get bin highlights error:",
        error.response?.data || error.message,
      );

      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");

        navigate("/admin-login");
      }
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // RESTORE
  // ==========================================================

  const handleRestore = async (id) => {
    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        navigate("/admin-login");
        return;
      }

      setActionLoading(id);

      const response = await axios.patch(
        `http://localhost:5001/api/highlights/${id}/restore`,
        {},
        {
          headers: {
            token: token,
          },
        },
      );

      console.log("Restore response:", response.data);

      if (response.data.success) {
        setHighlights((previousHighlights) =>
          previousHighlights.filter((highlight) => highlight._id !== id),
        );

        alert("Highlight restored successfully");
      }
    } catch (error) {
      console.error("Restore error:", error.response?.data || error.message);

      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");

        navigate("/admin-login");
        return;
      }

      alert(error.response?.data?.message || "Failed to restore highlight");
    } finally {
      setActionLoading(null);
    }
  };

  // ==========================================================
  // PERMANENT DELETE
  // ==========================================================

  const handlePermanentDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete this highlight? This cannot be undone.",
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

      setActionLoading(id);

      const response = await axios.delete(
        `http://localhost:5001/api/highlights/${id}/permanent`,
        {
          headers: {
            token: token,
          },
        },
      );

      console.log("Permanent delete response:", response.data);

      if (response.data.success) {
        setHighlights((previousHighlights) =>
          previousHighlights.filter((highlight) => highlight._id !== id),
        );

        alert("Highlight permanently deleted");
      }
    } catch (error) {
      console.error(
        "Permanent delete error:",
        error.response?.data || error.message,
      );

      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");

        navigate("/admin-login");
        return;
      }

      alert(
        error.response?.data?.message ||
          "Failed to permanently delete highlight",
      );
    } finally {
      setActionLoading(null);
    }
  };

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <div style={styles.page}>
      <AdminSidebar />

      <main style={styles.main}>
        {/* HEADER */}

        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Highlight Bin</h1>

            <p style={styles.subtitle}>Deleted highlights are stored here</p>
          </div>
        </div>

        {/* LOADING */}

        {loading && <div style={styles.messageBox}>Loading Bin...</div>}

        {/* EMPTY */}

        {!loading && highlights.length === 0 && (
          <div style={styles.messageBox}>
            <h3 style={styles.emptyTitle}>Bin is empty</h3>

            <p style={styles.emptyText}>No deleted highlights found.</p>
          </div>
        )}

        {/* HIGHLIGHTS */}

        {!loading && highlights.length > 0 && (
          <div style={styles.highlightGrid}>
            {highlights.map((highlight) => (
              <div key={highlight._id} style={styles.highlightCard}>
                {/* TOP */}

                <div style={styles.cardTop}>
                  {/* Added img clodanary  */}

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

                  <div style={styles.cardTopInfo}>
                    <h2 style={styles.bloodGroupTitle}>
                      {highlight.bloodGroup} Blood Group
                    </h2>

                    <span style={styles.deletedStatus}>Deleted</span>
                  </div>
                </div>

                {/* DESCRIPTION */}

                <div style={styles.infoSection}>
                  <p style={styles.label}>Description</p>

                  <p style={styles.description}>
                    {highlight.description || "No description available"}
                  </p>
                </div>

                {/* DONATE TO */}

                <div style={styles.infoSection}>
                  <p style={styles.label}>Can Donate To</p>

                  <p style={styles.value}>
                    {highlight.donateTo || "Not specified"}
                  </p>
                </div>

                {/* RECEIVE FROM */}

                <div style={styles.infoSection}>
                  <p style={styles.label}>Receive From</p>

                  <p style={styles.value}>
                    {highlight.receiveFrom || "Not specified"}
                  </p>
                </div>

                {/* DELETED DATE */}

                <div style={styles.infoSection}>
                  <p style={styles.label}>Deleted At</p>

                  <p style={styles.value}>
                    {highlight.deletedAt
                      ? new Date(highlight.deletedAt).toLocaleString()
                      : "Unknown"}
                  </p>
                </div>

                {/* ACTIONS */}

                <div style={styles.actions}>
                  <button
                    type="button"
                    style={styles.restoreButton}
                    disabled={actionLoading === highlight._id}
                    onClick={() => handleRestore(highlight._id)}
                  >
                    {actionLoading === highlight._id
                      ? "Processing..."
                      : "Restore"}
                  </button>

                  <button
                    type="button"
                    style={styles.permanentButton}
                    disabled={actionLoading === highlight._id}
                    onClick={() => handlePermanentDelete(highlight._id)}
                  >
                    Delete Permanently
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

  highlightCard: {
    backgroundColor: "#ffffff",
    borderRadius: "18px",
    padding: "25px",
    boxShadow: "0 5px 25px rgba(0,0,0,0.05)",
    border: "1px solid #eeeeee",
  },

  cardTop: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
    paddingBottom: "20px",
    borderBottom: "1px solid #eeeeee",
  },

  bloodGroupCircle: {
    width: "65px",
    height: "65px",
    borderRadius: "50%",
    backgroundColor: "#e0002b",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    fontWeight: "800",
    flexShrink: 0,
  },

  cardTopInfo: {
    flex: 1,
  },

  bloodGroupTitle: {
    margin: "0 0 8px",
    color: "#222222",
    fontSize: "20px",
  },

  deletedStatus: {
    display: "inline-block",
    padding: "5px 12px",
    borderRadius: "20px",
    backgroundColor: "#ffe5e9",
    color: "#e0002b",
    fontSize: "12px",
    fontWeight: "700",
  },

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

  actions: {
    display: "flex",
    gap: "12px",
    marginTop: "25px",
    paddingTop: "18px",
    borderTop: "1px solid #eeeeee",
  },

  restoreButton: {
    flex: 1,
    border: "none",
    borderRadius: "9px",
    padding: "11px",
    backgroundColor: "#e7f8ed",
    color: "#198754",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
  },

  permanentButton: {
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

  messageBox: {
    backgroundColor: "#ffffff",
    borderRadius: "15px",
    padding: "40px",
    textAlign: "center",
    color: "#777777",
    boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
  },

  emptyTitle: {
    margin: "0 0 8px",
    color: "#333333",
  },

  emptyText: {
    margin: 0,
    color: "#777777",
  },

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
  bloodGroupImageImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
};

export default AdminHighlightBin;
