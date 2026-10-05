import { useState } from "react";
import { FaEnvelope, FaLock,  } from "react-icons/fa";

import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const DonorLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const response = await axios.post(
        "http://localhost:5001/api/useLogin1",
        formData,
      );

      console.log("Donor login response:", response.data);

      if (response.data.success) {
        setMessage(response.data.message || "Donor login successful");

        // Store donor token
        localStorage.setItem("donorToken", response.data.token);

        setFormData({
          email: "",
          password: "",
        });

        // Go to donor dashboard
        setTimeout(() => {
          navigate("/donor-dashboard");
        }, 1000);
      } else {
        setMessage(response.data.message || "Invalid email or password");
      }
    } catch (error) {
      console.log("Donor Login Error:", error);

      setMessage(
        error.response?.data?.message ||
          error.message ||
          "Unable to connect to server",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form style={styles.card} onSubmit={handleSubmit}>
   

        <h1 style={styles.title}>Donor Login</h1>

        <p style={styles.subtitle}>
          Login to manage your donor profile and blood requests.
        </p>

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

        <div style={styles.inputBox}>
          <FaLock style={styles.icon} />

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter Password"
            style={styles.input}
            required
          />
        </div>

        <button
          type="submit"
          style={{
            ...styles.button,
            opacity: loading ? 0.7 : 1,
          }}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {message && <p style={styles.message}>{message}</p>}

        <p style={styles.registerText}>
          Don&apos;t have a donor account?{" "}
          <Link to="/donor-register" style={styles.link}>
            Register
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
    lineHeight: "1.5",
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
  },

  input: {
    width: "100%",
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
  },

  registerText: {
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

export default DonorLogin;
