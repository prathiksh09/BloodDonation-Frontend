import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

import AdminSidebar from "../components/AdminSidebar";

const AdminHighlights = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // ==========================================================
  // FOR EDITING HIGHLIGHT
  // ==========================================================

  const editId = searchParams.get("edit");
  const isEditMode = Boolean(editId);

  // ==========================================================
  // FORM DATA
  // ==========================================================

  const [formData, setFormData] = useState({
    bloodGroup: "",
    description: "",
    healthInfo: "",
    donateTo: "",
    receiveFrom: "",
    order: 0,
  });

  // IMAGE

  const [selectedImage, setSelectedImage] = useState(null);
  const [existingImage, setExistingImage] = useState("");

  // ==========================================================
  // OTHER STATES
  // ==========================================================

  const [loading, setLoading] = useState(false);
  const [loadingHighlight, setLoadingHighlight] = useState(false);

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // ==========================================================
  // BLOOD GROUPS
  // ==========================================================

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  // ==========================================================
  // GET EXISTING HIGHLIGHT FOR EDIT
  // ==========================================================

  useEffect(() => {
    if (!editId) {
      return;
    }

    const loadHighlight = async () => {
      try {
        setLoadingHighlight(true);
        setErrorMessage("");

        const token = localStorage.getItem("adminToken");

        if (!token) {
          navigate("/admin-login");
          return;
        }

        const response = await axios.get(
          `https://blooddonation-backend-1.onrender.com/api/highlights/${editId}`,
          {
            headers: {
              token: token,
            },
          },
        );

        console.log("Highlight for edit:", response.data);

        if (response.data.success) {
          const highlight = response.data.highlight;

          // ==================================================
          // CONVERT ARRAY OR STRING TO TEXT
          // ==================================================

          const donateToText = Array.isArray(highlight.donateTo)
            ? highlight.donateTo.join(", ")
            : highlight.donateTo || "";

          const receiveFromText = Array.isArray(highlight.receiveFrom)
            ? highlight.receiveFrom.join(", ")
            : highlight.receiveFrom || "";

          // ==================================================
          // SET FORM DATA
          // ==================================================

          setFormData({
            bloodGroup: highlight.bloodGroup || "",
            description: highlight.description || "",
            healthInfo: highlight.healthInfo || "",
            donateTo: donateToText,
            receiveFrom: receiveFromText,
            order: highlight.order || 0,
          });

          // ==================================================
          // SET EXISTING IMAGE
          // ==================================================

          setExistingImage(highlight.image || "");
          setSelectedImage(null);
        } else {
          setErrorMessage(response.data.message || "Unable to get highlight");
        }
      } catch (error) {
        console.error(
          "Get highlight error:",
          error.response?.data || error.message,
        );

        if (error.response?.status === 401) {
          localStorage.removeItem("adminToken");
          localStorage.removeItem("admin");

          navigate("/admin-login");
          return;
        }

        setErrorMessage(
          error.response?.data?.message || "Unable to load highlight",
        );
      } finally {
        setLoadingHighlight(false);
      }
    };

    loadHighlight();
  }, [editId, navigate]);

  // ==========================================================
  // HANDLE INPUT CHANGE
  // ==========================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // ==========================================================
  // HANDLE IMAGE CHANGE
  // ==========================================================

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    setSelectedImage(file);
  };

  // ==========================================================
  // SUBMIT
  // CREATE OR UPDATE
  // ==========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setErrorMessage("");

    // ========================================================
    // VALIDATION
    // ========================================================

    if (
      !formData.bloodGroup ||
      !formData.description ||
      !formData.donateTo ||
      !formData.receiveFrom
    ) {
      setErrorMessage("Please fill all required fields");
      return;
    }

    // Image is required only while creating
    if (!isEditMode && !selectedImage) {
      setErrorMessage("Please select an image");
      return;
    }

    try {
      setLoading(true);

      // ======================================================
      // GET ADMIN TOKEN
      // ======================================================

      const token = localStorage.getItem("adminToken");

      if (!token) {
        navigate("/admin-login");
        return;
      }

      // ======================================================
      // CONVERT TEXT INTO ARRAYS
      // ======================================================

      const donateToArray = formData.donateTo
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item !== "");

      const receiveFromArray = formData.receiveFrom
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item !== "");

      // ======================================================
      // CREATE FORMDATA
      // ======================================================

      const highlightData = new FormData();

      highlightData.append("bloodGroup", formData.bloodGroup);

      highlightData.append("description", formData.description);

      highlightData.append("healthInfo", formData.healthInfo);

      highlightData.append("donateTo", donateToArray.join(", "));

      highlightData.append("receiveFrom", receiveFromArray.join(", "));

      highlightData.append("isActive", "true");

      highlightData.append("order", Number(formData.order) || 0);

      // ======================================================
      // ADD IMAGE
      // ======================================================

      if (selectedImage) {
        highlightData.append("image", selectedImage);
      }

      let response;

      // ======================================================
      // EDIT EXISTING HIGHLIGHT
      // ======================================================

      if (isEditMode) {
        response = await axios.put(
          `https://blooddonation-backend-1.onrender.com/api/highlights/${editId}`,
          highlightData,
          {
            headers: {
              token: token,
            },
          },
        );

        console.log("Update highlight response:", response.data);

        if (response.data.success) {
          setMessage("Highlight updated successfully");

          // Go back to View Highlights
          setTimeout(() => {
            navigate("/admin-view-highlights");
          }, 700);
        } else {
          setErrorMessage(
            response.data.message || "Unable to update highlight",
          );
        }
      }

      // ======================================================
      // CREATE NEW HIGHLIGHT
      // ======================================================
      else {
        response = await axios.post(
          "https://blooddonation-backend-1.onrender.com/api/highlights/create",
          highlightData,
          {
            headers: {
              token: token,
            },
          },
        );

        console.log("Create highlight response:", response.data);

        if (response.data.success) {
          setMessage("Highlight added successfully");

          // ==================================================
          // CLEAR FORM
          // ==================================================

          setFormData({
            bloodGroup: "",
            description: "",
            healthInfo: "",
            donateTo: "",
            receiveFrom: "",
            order: 0,
          });

          setSelectedImage(null);
          setExistingImage("");
        } else {
          setErrorMessage(response.data.message || "Unable to add highlight");
        }
      }
    } catch (error) {
      console.error(
        "Highlight submit error:",
        error.response?.data || error.message,
      );

      // ======================================================
      // ADMIN AUTH ERROR
      // ======================================================

      if (error.response?.status === 401) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");

        navigate("/admin-login");
        return;
      }

      setErrorMessage(
        error.response?.data?.message ||
          (isEditMode
            ? "Unable to update highlight"
            : "Unable to create highlight"),
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // RETURN UI
  // ==========================================================

  return (
    <div style={styles.page}>
      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <AdminSidebar />

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <main style={styles.main}>
        {/* ===================================================
            HEADER
        ==================================================== */}

        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>
              {isEditMode ? "Edit Highlight" : "Highlights"}
            </h1>

            <p style={styles.subtitle}>
              {isEditMode
                ? "Update blood group highlight"
                : "Add blood group highlights"}
            </p>
          </div>
        </div>

        {/* ===================================================
            SUCCESS MESSAGE
        ==================================================== */}

        {message && <div style={styles.successMessage}>{message}</div>}

        {/* ===================================================
            ERROR MESSAGE
        ==================================================== */}

        {errorMessage && <div style={styles.errorMessage}>{errorMessage}</div>}

        {/* ===================================================
            LOADING EXISTING HIGHLIGHT
        ==================================================== */}

        {loadingHighlight ? (
          <section style={styles.formCard}>
            <div style={styles.loadingText}>Loading highlight...</div>
          </section>
        ) : (
          <section style={styles.formCard}>
            <h2 style={styles.sectionTitle}>
              {isEditMode ? "Edit Highlight" : "Add Highlight"}
            </h2>

            <form onSubmit={handleSubmit}>
              {/* =================================================
                  BLOOD GROUP
              ================================================== */}

              <div style={styles.formGroup}>
                <label style={styles.label}>Blood Group</label>

                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  style={styles.input}
                  required
                >
                  <option value="">Select Blood Group</option>

                  {bloodGroups.map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
              </div>

              {/* =================================================
                  DESCRIPTION
              ================================================== */}

              <div style={styles.formGroup}>
                <label style={styles.label}>Description</label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter blood group description"
                  style={styles.textarea}
                  required
                />
              </div>

              {/* =================================================
                  HEALTH / DISEASE INFORMATION
              ================================================== */}

              <div style={styles.formGroup}>
                <label style={styles.label}>Health / Disease Information</label>

                <textarea
                  name="healthInfo"
                  value={formData.healthInfo}
                  onChange={handleChange}
                  placeholder="Enter health or disease related information"
                  style={styles.textarea}
                />
              </div>

              {/* =================================================
                  IMAGE UPLOAD
              ================================================== */}

              <div style={styles.formGroup}>
                <label style={styles.label}>Blood Group Image</label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={styles.fileInput}
                />

                {/* =================================================
                    NEW SELECTED IMAGE PREVIEW
                ================================================== */}

                {selectedImage && (
                  <div style={styles.imagePreviewContainer}>
                    <p style={styles.previewLabel}>Selected Image:</p>

                    <img
                      src={URL.createObjectURL(selectedImage)}
                      alt="Selected blood group"
                      style={styles.previewImage}
                    />
                  </div>
                )}

                {/* =================================================
                    EXISTING IMAGE PREVIEW
                ================================================== */}

                {!selectedImage && existingImage && (
                  <div style={styles.imagePreviewContainer}>
                    <p style={styles.previewLabel}>Current Image:</p>

                    <img
                      src={`https://blooddonation-backend-1.onrender.com/uploads/${existingImage}`}
                      alt="Current blood group"
                      style={styles.previewImage}
                    />
                  </div>
                )}
              </div>

              {/* =================================================
                  CAN DONATE TO
              ================================================== */}

              <div style={styles.formGroup}>
                <label style={styles.label}>Can Donate To</label>

                <input
                  type="text"
                  name="donateTo"
                  value={formData.donateTo}
                  onChange={handleChange}
                  placeholder="Example: A+, AB+"
                  style={styles.input}
                  required
                />
              </div>

              {/* =================================================
                  RECEIVE FROM
              ================================================== */}

              <div style={styles.formGroup}>
                <label style={styles.label}>Receive From</label>

                <input
                  type="text"
                  name="receiveFrom"
                  value={formData.receiveFrom}
                  onChange={handleChange}
                  placeholder="Example: A+, A-, O+, O-"
                  style={styles.input}
                  required
                />
              </div>

              {/* =================================================
                  SUBMIT BUTTON
              ================================================== */}

              <button
                type="submit"
                disabled={loading}
                style={{
                  ...styles.addButton,
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading
                  ? isEditMode
                    ? "Updating..."
                    : "Adding..."
                  : isEditMode
                    ? "Update Highlight"
                    : "Add Highlight"}
              </button>
            </form>
          </section>
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
    marginBottom: "30px",
  },

  title: {
    margin: 0,
    fontSize: "32px",
    color: "#222",
  },

  subtitle: {
    margin: "8px 0 0",
    color: "#777",
    fontSize: "15px",
  },

  successMessage: {
    backgroundColor: "#e7f8ed",
    color: "#16833d",
    padding: "13px 16px",
    borderRadius: "8px",
    marginBottom: "20px",
  },

  errorMessage: {
    backgroundColor: "#ffe5e9",
    color: "#d80027",
    padding: "13px 16px",
    borderRadius: "8px",
    marginBottom: "20px",
  },

  formCard: {
    backgroundColor: "#ffffff",
    borderRadius: "15px",
    padding: "30px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
    marginBottom: "35px",
  },

  sectionTitle: {
    margin: "0 0 22px",
    fontSize: "21px",
    color: "#333",
  },

  formGroup: {
    marginBottom: "20px",
  },

  label: {
    display: "block",
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#333",
  },

  input: {
    width: "100%",
    height: "48px",
    padding: "0 14px",
    boxSizing: "border-box",
    border: "1px solid #d5d5d5",
    borderRadius: "9px",
    outline: "none",
    fontSize: "15px",
    backgroundColor: "#fff",
  },

  textarea: {
    width: "100%",
    minHeight: "100px",
    padding: "13px 14px",
    boxSizing: "border-box",
    border: "1px solid #d5d5d5",
    borderRadius: "9px",
    outline: "none",
    fontSize: "15px",
    resize: "vertical",
    fontFamily: "Arial, Helvetica, sans-serif",
  },

  // ==========================================================
  // FILE INPUT
  // ==========================================================

  fileInput: {
    width: "100%",
    padding: "12px",
    boxSizing: "border-box",
    border: "1px solid #d5d5d5",
    borderRadius: "9px",
    fontSize: "14px",
    backgroundColor: "#fff",
    cursor: "pointer",
  },

  // ==========================================================
  // IMAGE PREVIEW
  // ==========================================================

  imagePreviewContainer: {
    marginTop: "15px",
  },

  previewLabel: {
    margin: "0 0 8px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#555",
  },

  previewImage: {
    width: "180px",
    height: "180px",
    objectFit: "cover",
    borderRadius: "12px",
    border: "1px solid #ddd",
  },

  // ==========================================================
  // BUTTON
  // ==========================================================

  addButton: {
    width: "100%",
    height: "50px",
    border: "none",
    borderRadius: "9px",
    backgroundColor: "#e0002b",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
  },

  loadingText: {
    textAlign: "center",
    padding: "40px",
    color: "#777",
    fontSize: "15px",
  },
};

export default AdminHighlights;
