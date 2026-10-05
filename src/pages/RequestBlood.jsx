import { useState } from "react";
import {
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaCommentAlt,
  FaTint,
} from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const RequestBlood = () => {
  const { donorId } = useParams();

  const [formData, setFormData] = useState({
    userName: "",
    age: "",
    location: "",
    contact: "",
    message: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    const token = localStorage.getItem("token");

    if (!token) {
      setErrorMessage("Please login before sending a blood request.");
      return;
    }

    if (!donorId) {
      setErrorMessage("Donor information is missing.");
      return;
    }

    if (!formData.userName.trim()) {
      setErrorMessage("Please enter your name.");
      return;
    }

    if (!formData.age) {
      setErrorMessage("Please enter your age.");
      return;
    }

    if (!formData.location.trim()) {
      setErrorMessage("Please enter your location.");
      return;
    }

    if (!/^[0-9]{10}$/.test(formData.contact)) {
      setErrorMessage("Please enter a valid 10-digit contact number.");
      return;
    }

    if (!formData.message.trim()) {
      setErrorMessage("Please enter your blood requirement.");
      return;
    }

    try {
      setLoading(true);

      const requestData = {
        donorId: donorId,
        userName: formData.userName.trim(),
        age: Number(formData.age),
        location: formData.location.trim(),
        contact: formData.contact.trim(),
        description: formData.message.trim(),
      };

      console.log("=================================");
      console.log("SENDING BLOOD REQUEST");
      console.log("=================================");
      console.log("Donor ID:", donorId);
      console.log("Request Data:", requestData);
      console.log("Token exists:", !!token);

      const response = await axios.post(
        "http://localhost:5001/api/create-service",
        requestData,
        {
          headers: {
            token: token,
            "Content-Type": "application/json",
          },
        },
      );

      console.log("=================================");
      console.log("SERVER RESPONSE");
      console.log("=================================");
      console.log(response.data);

      if (response.data && response.data.success === true) {
        setSuccessMessage(
          response.data.message || "Blood request sent successfully!",
        );

        setErrorMessage("");

        setFormData({
          userName: "",
          age: "",
          location: "",
          contact: "",
          message: "",
        });
      } else {
        setSuccessMessage("");

        setErrorMessage(
          response.data?.message || "Unable to submit blood request.",
        );
      }
    } catch (error) {
      console.error("=================================");
      console.error("BLOOD REQUEST ERROR");
      console.error("=================================");
      console.error(error);

      setSuccessMessage("");

      if (error.response) {
        console.error("Status:", error.response.status);

        console.error("Server Response:", error.response.data);

        setErrorMessage(
          error.response.data?.message || "Server rejected the blood request.",
        );
      } else if (error.request) {
        setErrorMessage("Unable to connect to the backend server.");
      } else {
        setErrorMessage(error.message || "Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form style={styles.card} onSubmit={handleSubmit}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.iconCircle}>
            <FaTint />
          </div>

          <div>
            <h1 style={styles.title}>Contact Donor</h1>

            <p style={styles.subtitle}>
              Enter the blood requirement details and send your request.
            </p>
          </div>
        </div>

        {/* Form Grid */}
        <div style={styles.grid}>
          {/* Name */}
          <div style={styles.inputBox}>
            <FaUser style={styles.icon} />

            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              placeholder="Enter Your Name"
              style={styles.input}
              required
            />
          </div>

          {/* Age */}
          <div style={styles.inputBox}>
            <FaUser style={styles.icon} />

            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="Enter Age"
              min="1"
              max="120"
              style={styles.input}
              required
            />
          </div>

          {/* Location */}
          <div style={styles.inputBox}>
            <FaMapMarkerAlt style={styles.icon} />

            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter Location"
              style={styles.input}
              required
            />
          </div>

          {/* Contact */}
          <div style={styles.inputBox}>
            <FaPhone style={styles.icon} />

            <input
              type="tel"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              placeholder="Enter 10-digit Contact Number"
              pattern="[0-9]{10}"
              maxLength="10"
              style={styles.input}
              required
            />
          </div>
        </div>

        {/* Message */}
        <div style={styles.messageBox}>
          <FaCommentAlt style={styles.messageIcon} />

          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Example: I need A+ blood urgently."
            rows="4"
            style={styles.textarea}
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            ...styles.button,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Sending..." : "Send Blood Request"}
        </button>

        {/* Success Message */}
        {successMessage && (
          <div style={styles.successBox}>
            <p style={styles.successMessage}>✓ {successMessage}</p>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div style={styles.errorBox}>
            <p style={styles.errorMessage}>{errorMessage}</p>
          </div>
        )}

        {/* Back */}
        <Link to="/donors" style={styles.backLink}>
          Back to Donors
        </Link>
      </form>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "30px 20px",
    background:
      "linear-gradient(135deg, #fff7f7 0%, #ffffff 55%, #ffe4e6 100%)",
  },

  card: {
    width: "100%",
    maxWidth: "900px",
    padding: "40px",
    boxSizing: "border-box",
    borderRadius: "22px",
    backgroundColor: "#ffffff",
    boxShadow: "0 16px 40px rgba(0,0,0,0.08)",
  },

  header: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "18px",
    marginBottom: "35px",
  },

  iconCircle: {
    width: "72px",
    height: "72px",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffe4e6",
    color: "#e0002b",
    fontSize: "30px",
    flexShrink: 0,
  },

  title: {
    margin: "0 0 6px",
    color: "#e0002b",
    fontSize: "38px",
    fontWeight: "700",
  },

  subtitle: {
    margin: 0,
    color: "#666666",
    fontSize: "16px",
    lineHeight: "1.5",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    columnGap: "28px",
    rowGap: "24px",
  },

  inputBox: {
    display: "flex",
    alignItems: "center",
    padding: "15px 16px",
    border: "1px solid #dcdcdc",
    borderRadius: "10px",
    backgroundColor: "#ffffff",
  },

  icon: {
    color: "#e0002b",
    marginRight: "12px",
    fontSize: "18px",
    flexShrink: 0,
  },

  input: {
    width: "100%",
    minWidth: 0,
    border: "none",
    outline: "none",
    backgroundColor: "transparent",
    fontSize: "16px",
  },

  messageBox: {
    display: "flex",
    alignItems: "flex-start",
    marginTop: "28px",
    padding: "16px",
    border: "1px solid #dcdcdc",
    borderRadius: "10px",
    backgroundColor: "#ffffff",
  },

  messageIcon: {
    marginTop: "5px",
    marginRight: "12px",
    color: "#e0002b",
    fontSize: "18px",
    flexShrink: 0,
  },

  textarea: {
    width: "100%",
    border: "none",
    outline: "none",
    resize: "none",
    fontSize: "16px",
    fontFamily: "inherit",
    backgroundColor: "transparent",
    lineHeight: "1.6",
  },

  button: {
    width: "100%",
    marginTop: "30px",
    padding: "16px",
    border: "none",
    borderRadius: "10px",
    backgroundColor: "#e0002b",
    color: "#ffffff",
    fontSize: "19px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 10px 25px rgba(224,0,43,0.2)",
  },

  successBox: {
    marginTop: "20px",
    padding: "12px 16px",
    borderRadius: "10px",
    backgroundColor: "#ecfdf5",
    border: "1px solid #bbf7d0",
    textAlign: "center",
  },

  successMessage: {
    margin: 0,
    color: "#15803d",
    fontWeight: "600",
    fontSize: "16px",
  },

  errorBox: {
    marginTop: "20px",
    padding: "12px 16px",
    borderRadius: "10px",
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    textAlign: "center",
  },

  errorMessage: {
    margin: 0,
    color: "#dc2626",
    fontWeight: "600",
    fontSize: "16px",
  },

  backLink: {
    display: "block",
    marginTop: "22px",
    textAlign: "center",
    color: "#666666",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: "500",
  },
};

export default RequestBlood;
