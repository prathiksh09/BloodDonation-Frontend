import { useState } from "react";
import {
  FaUser,
  FaTint,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import axios from "axios";

const DonorDetails = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    donorName: "",
    bloodGroup: "",
    age: "",
    contact: "",
    address: "",
  });

  // Store selected image
  const [file, setFile] = useState(null);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

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
  // HANDLE IMAGE
  // ==========================================================

  const handleFile = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  // ==========================================================
  // SUBMIT DONOR DETAILS
  // ==========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      // ========================================================
      // GET DONOR TOKEN
      // ========================================================

      const token = localStorage.getItem("donorToken");

      if (!token) {
        setMessage("Donor token not found. Please register or login again.");

        setLoading(false);
        return;
      }

      // ========================================================
      // CREATE FORMDATA
      // ========================================================

      const formData1 = new FormData();

      formData1.append("donorName", formData.donorName);
      formData1.append("bloodGroup", formData.bloodGroup);
      formData1.append("age", formData.age);
      formData1.append("contact", formData.contact);
      formData1.append("address", formData.address);

      // Only add image if user selected one
      if (file) {
        formData1.append("image", file);
      }

      console.log("Submitting donor details...");

      // ========================================================
      // SEND REQUEST TO RENDER BACKEND
      // ========================================================

      const response = await axios.post(
        "https://blooddonation-backend-1.onrender.com/api/create-donor",
        formData1,
        {
          headers: {
            token: token,
          },
        },
      );

      console.log("Donor Details Response:", response.data);

      // ========================================================
      // SUCCESS
      // ========================================================

      if (response.data.success) {
        setMessage("Donor details saved successfully");

        // Clear form
        setFormData({
          donorName: "",
          bloodGroup: "",
          age: "",
          contact: "",
          address: "",
        });

        // Clear selected image
        setFile(null);

        // Redirect to donor login
        setTimeout(() => {
          navigate("/donor-login");
        }, 1000);
      } else {
        setMessage(response.data.message || "Unable to save donor details");
      }
    } catch (error) {
      console.error("Donor Details Error:", error);

      // ========================================================
      // BACKEND ERROR
      // ========================================================

      if (error.response) {
        console.error("Backend Status:", error.response.status);

        console.error("Backend Response:", error.response.data);

        setMessage(
          error.response.data?.message || "Unable to save donor details",
        );
      }

      // ========================================================
      // REQUEST SENT BUT NO RESPONSE
      // ========================================================
      else if (error.request) {
        setMessage(
          "Unable to connect to the backend server. Please try again.",
        );
      }

      // ========================================================
      // OTHER ERROR
      // ========================================================
      else {
        setMessage(error.message || "Unable to save donor details");
      }
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div style={styles.container}>
      <form style={styles.card} onSubmit={handleSubmit}>
        <h1 style={styles.title}>Donor Details</h1>

        <p style={styles.subtitle}>
          Complete your donor profile and help people find you during
          emergencies.
        </p>

        <div style={styles.grid}>
          {/* ==================================================
              FULL NAME
          ================================================== */}

          <div style={styles.inputBox}>
            <FaUser style={styles.icon} />

            <input
              type="text"
              name="donorName"
              value={formData.donorName}
              onChange={handleChange}
              placeholder="Enter Full Name"
              style={styles.input}
              required
            />
          </div>

          {/* ==================================================
              BLOOD GROUP
          ================================================== */}

          <div style={styles.inputBox}>
            <FaTint style={styles.icon} />

            <select
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              style={styles.select}
              required
            >
              <option value="">Select Blood Group</option>

              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>

          {/* ==================================================
              AGE
          ================================================== */}

          <div style={styles.inputBox}>
            <FaCalendarAlt style={styles.icon} />

            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="Enter Age"
              min="18"
              max="65"
              style={styles.input}
              required
            />
          </div>

          {/* ==================================================
              CONTACT
          ================================================== */}

          <div style={styles.inputBox}>
            <FaPhone style={styles.icon} />

            <input
              type="tel"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              placeholder="Enter Contact Number"
              pattern="[0-9]{10}"
              maxLength="10"
              style={styles.input}
              required
            />
          </div>

          {/* ==================================================
              IMAGE
          ================================================== */}

          <div style={styles.fileBox}>
            <input type="file" accept="image/*" onChange={handleFile} />

            {file && <p style={styles.fileName}>Selected: {file.name}</p>}
          </div>
        </div>

        {/* ==================================================
            ADDRESS
        ================================================== */}

        <div style={styles.addressBox}>
          <FaMapMarkerAlt style={styles.addressIcon} />

          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter Address"
            rows="4"
            style={styles.textarea}
            required
          />
        </div>

        {/* ==================================================
            SUBMIT BUTTON
        ================================================== */}

        <button
          type="submit"
          style={{
            ...styles.button,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Donor Details"}
        </button>

        {/* ==================================================
            MESSAGE
        ================================================== */}

        {message && (
          <p
            style={{
              ...styles.message,
              color: message.includes("successfully") ? "#16a34a" : "#e0002b",
            }}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

// ==========================================================
// STYLES
// ==========================================================

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "35px 20px",
    background:
      "linear-gradient(135deg, #fff7f7 0%, #ffffff 55%, #ffe4e6 100%)",
  },

  card: {
    width: "100%",
    maxWidth: "850px",
    padding: "40px",
    boxSizing: "border-box",
    borderRadius: "22px",
    backgroundColor: "#ffffff",
    boxShadow: "0 16px 40px rgba(0,0,0,0.1)",
  },

  title: {
    margin: "0 0 10px",
    textAlign: "center",
    color: "#e0002b",
    fontSize: "40px",
  },

  subtitle: {
    margin: "0 0 30px",
    textAlign: "center",
    color: "#737373",
    fontSize: "16px",
    lineHeight: "1.6",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
  },

  inputBox: {
    display: "flex",
    alignItems: "center",
    padding: "14px 16px",
    border: "1px solid #d4d4d4",
    borderRadius: "10px",
    backgroundColor: "#ffffff",
  },

  icon: {
    marginRight: "12px",
    color: "#e0002b",
    fontSize: "18px",
    flexShrink: 0,
  },

  input: {
    width: "100%",
    minWidth: 0,
    border: "none",
    outline: "none",
    fontSize: "16px",
    backgroundColor: "transparent",
  },

  select: {
    width: "100%",
    border: "none",
    outline: "none",
    fontSize: "16px",
    backgroundColor: "transparent",
    color: "#555555",
    cursor: "pointer",
  },

  fileBox: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "10px 0",
  },

  fileName: {
    margin: "6px 0 0",
    fontSize: "13px",
    color: "#737373",
    wordBreak: "break-word",
  },

  addressBox: {
    display: "flex",
    alignItems: "flex-start",
    marginTop: "20px",
    padding: "14px 16px",
    border: "1px solid #d4d4d4",
    borderRadius: "10px",
    backgroundColor: "#ffffff",
  },

  addressIcon: {
    marginTop: "5px",
    marginRight: "12px",
    color: "#e0002b",
    fontSize: "18px",
    flexShrink: 0,
  },

  textarea: {
    width: "100%",
    minWidth: 0,
    border: "none",
    outline: "none",
    resize: "none",
    fontSize: "16px",
    fontFamily: "inherit",
    backgroundColor: "transparent",
  },

  button: {
    width: "100%",
    marginTop: "24px",
    padding: "15px",
    border: "none",
    borderRadius: "10px",
    backgroundColor: "#e0002b",
    color: "#ffffff",
    fontSize: "18px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 10px 22px rgba(224, 0, 43, 0.2)",
  },

  message: {
    marginTop: "18px",
    textAlign: "center",
    fontWeight: "600",
  },
};

export default DonorDetails;
