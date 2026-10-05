import { useState } from "react";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";

import { Link, useNavigate } from "react-router-dom";

import axios from "axios";

const DonorRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // HANDLE INPUT CHANGE
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setMessage("");
  };

  // HANDLE REGISTER
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const response = await axios.post(
        "https://blooddonation-backend-1.onrender.com/api/registerDonor",
        formData,
      );

      console.log("Donor Register Response:", response.data);

      if (response.data.success) {
        setMessage(
          response.data.message || "Donor account registered successfully",
        );

        // Save donor JWT token
        localStorage.setItem("donorToken", response.data.token);

        // Save donor email if required later
        localStorage.setItem("donorEmail", formData.email);

        // Clear form
        setFormData({
          name: "",
          email: "",
          password: "",
        });

        // Go to Donor Details page
        setTimeout(() => {
          navigate("/donor-details");
        }, 1000);
      } else {
        // express-validator may return array
        if (Array.isArray(response.data.message)) {
          const validationMessage = response.data.message
            .map((error) => error.msg)
            .join(", ");

          setMessage(validationMessage);
        } else {
          setMessage(response.data.message || "Donor registration failed");
        }
      }
    } catch (error) {
      console.log("Donor Register Error:", error);

      const backendMessage = error.response?.data?.message;

      // Handle express-validator error array
      if (Array.isArray(backendMessage)) {
        const validationMessage = backendMessage
          .map((error) => error.msg)
          .join(", ");

        setMessage(validationMessage);
      } else {
        setMessage(
          backendMessage || error.message || "Unable to connect to server",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form style={styles.card} onSubmit={handleSubmit}>
        <h1 style={styles.title}>Donor Register</h1>

        <p style={styles.subtitle}>Create your donor account first.</p>

        {/* NAME */}
        <div style={styles.inputBox}>
          <FaUser style={styles.icon} />

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter Name"
            style={styles.input}
            required
          />
        </div>

        {/* EMAIL */}
        <div style={styles.inputBox}>
          <FaEnvelope style={styles.icon} />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter Email"
            style={styles.input}
            required
          />
        </div>

        {/* PASSWORD */}
        <div style={styles.inputBox}>
          <FaLock style={styles.icon} />

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter Password"
            style={styles.input}
            minLength="6"
            required
          />
        </div>

        {/* REGISTER BUTTON */}
        <button
          type="submit"
          style={{
            ...styles.button,
            opacity: loading ? 0.7 : 1,
          }}
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        {/* MESSAGE */}
        {message && <p style={styles.message}>{message}</p>}

        {/* LOGIN */}
        <p style={styles.loginText}>
          Already have a donor account?{" "}
          <Link to="/donor-login" style={styles.link}>
            Login
          </Link>
        </p>
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
    maxWidth: "460px",
    padding: "42px",
    boxSizing: "border-box",
    borderRadius: "20px",
    backgroundColor: "#ffffff",
    boxShadow: "0 14px 35px rgba(0,0,0,0.09)",
  },

  title: {
    margin: "0 0 10px",
    textAlign: "center",
    color: "#e0002b",
    fontSize: "38px",
  },

  subtitle: {
    margin: "0 0 30px",
    textAlign: "center",
    color: "#737373",
    fontSize: "16px",
  },

  inputBox: {
    display: "flex",
    alignItems: "center",
    marginBottom: "20px",
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

  button: {
    width: "100%",
    padding: "14px",
    border: "none",
    borderRadius: "10px",
    backgroundColor: "#e0002b",
    color: "#ffffff",
    fontSize: "17px",
    fontWeight: "700",
    cursor: "pointer",
  },

  message: {
    marginTop: "18px",
    textAlign: "center",
    color: "#e0002b",
    fontWeight: "600",
    lineHeight: "1.5",
  },

  loginText: {
    marginTop: "22px",
    textAlign: "center",
    color: "#222222",
  },

  link: {
    color: "#e0002b",
    fontWeight: "700",
    textDecoration: "none",
  },
};

export default DonorRegister;
