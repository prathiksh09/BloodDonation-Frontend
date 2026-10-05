import { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const UserLogin = () => {
  const navigate = useNavigate();

  const [Data1, setData1] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // ==========================================================
  // HANDLE INPUT CHANGES
  // ==========================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setData1((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // ==========================================================
  // HANDLE LOGIN
  // ==========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const response = await axios.post(
        "https://blooddonation-backend-1.onrender.com/api/useLogin",
        Data1,
      );

      console.log("Login response:", response.data);

      // ========================================================
      // LOGIN SUCCESS
      // ========================================================

      if (response.data.success) {
        setMessage(response.data.message || "Login successful");

        localStorage.removeItem("userBlocked");

        localStorage.setItem("sessionRole", "user");

        // ======================================================
        // SAVE USER JWT
        // ======================================================

        localStorage.setItem("token", response.data.token);

        // Separate token used by UserBlockWatcher
        localStorage.setItem("userToken", response.data.token);

        if (response.data.user) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
        }

        // ======================================================
        // CLEAR FORM
        // ======================================================

        setData1({
          email: "",
          password: "",
        });

        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        setMessage(response.data.message || "Invalid email or password");
      }
    } catch (error) {
      console.log("Login Error:", error);

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
        <h1 style={styles.title}>User Login</h1>

        <p style={styles.subtitle}>
          Login to search blood donors and send requests.
        </p>

        {/* EMAIL */}

        <div style={styles.inputBox}>
          <FaEnvelope style={styles.icon} />

          <input
            type="email"
            name="email"
            value={Data1.email}
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
            value={Data1.password}
            onChange={handleChange}
            placeholder="Enter Password"
            style={styles.input}
            required
          />
        </div>

        {/* LOGIN BUTTON */}

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

        {/* MESSAGE */}

        {message && <p style={styles.message}>{message}</p>}

        {/* REGISTER */}

        <p style={styles.register}>
          Don't have an account?{" "}
          <Link to="/user-register" style={styles.link}>
            Register
          </Link>
        </p>
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
    background: "#f8f8f8",
    padding: "20px",
  },

  card: {
    width: "100%",
    maxWidth: "400px",
    background: "#fff",
    padding: "40px",
    boxSizing: "border-box",
    borderRadius: "15px",
    boxShadow: "0 10px 25px rgba(0,0,0,.08)",
  },

  title: {
    textAlign: "center",
    color: "#d90429",
    marginBottom: "10px",
    fontSize: "50px",
    fontWeight: "bold",
  },

  subtitle: {
    textAlign: "center",
    color: "gray",
    marginBottom: "30px",
    fontSize: "16px",
    lineHeight: "1.5",
  },

  inputBox: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "12px",
    marginBottom: "20px",
  },

  icon: {
    color: "#d90429",
    marginRight: "10px",
    fontSize: "18px",
    flexShrink: 0,
  },

  input: {
    border: "none",
    outline: "none",
    width: "100%",
    minWidth: 0,
    fontSize: "16px",
  },

  button: {
    width: "100%",
    padding: "13px",
    border: "none",
    borderRadius: "8px",
    background: "#d90429",
    color: "#fff",
    fontSize: "18px",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "10px",
  },

  message: {
    marginTop: "15px",
    textAlign: "center",
    color: "#d90429",
    fontWeight: "600",
  },

  register: {
    marginTop: "25px",
    textAlign: "center",
    fontSize: "16px",
  },

  link: {
    color: "#d90429",
    textDecoration: "none",
    fontWeight: "bold",
  },
};

export default UserLogin;
