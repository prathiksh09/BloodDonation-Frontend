import { useState } from "react";
import { FaEnvelope, FaLock, } from "react-icons/fa";
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

  // ==========================================================
  // GO TO DONOR LOGIN
  // ==========================================================

  const handleDonorLogin = () => {
    navigate("/donor-login");
  };

  return (
    <div style={styles.container}>
      <form style={styles.card} onSubmit={handleSubmit}>
        {/* ==================================================
            TITLE
        ================================================== */}

        <div style={styles.headingArea}>
          

          <h1 style={styles.title}>User Login</h1>

          <p style={styles.subtitle}>
            Login to search blood donors and send requests.
          </p>
        </div>

        {/* ==================================================
            USER / DONOR SWITCH
        ================================================== */}

        <div style={styles.switchContainer}>
          {/* USER */}

          <button
            type="button"
            style={{
              ...styles.switchButton,
              ...styles.activeSwitch,
            }}
          >
          
            <span>User Login</span>
          </button>

          {/* DONOR */}

          <button
            type="button"
            onClick={handleDonorLogin}
            style={{
              ...styles.switchButton,
              ...styles.inactiveSwitch,
            }}
          >
            
            <span>Donor Login</span>
          </button>
        </div>

        {/* ==================================================
            EMAIL
        ================================================== */}

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

        {/* ==================================================
            PASSWORD
        ================================================== */}

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

        {/* ==================================================
            LOGIN BUTTON
        ================================================== */}

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

        {/* ==================================================
            MESSAGE
        ================================================== */}

        {message && <p style={styles.message}>{message}</p>}

        {/* ==================================================
            REGISTER
        ================================================== */}

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

    background:
      "linear-gradient(135deg, #fff5f6 0%, #f8f8f8 50%, #ffffff 100%)",

    padding: "30px 20px",

    boxSizing: "border-box",
  },

  card: {
    width: "100%",
    maxWidth: "420px",

    background: "#ffffff",

    padding: "38px",

    boxSizing: "border-box",

    borderRadius: "18px",

    boxShadow: "0 15px 40px rgba(0, 0, 0, 0.10)",

    border: "1px solid #f0f0f0",
  },

  // ========================================================
  // HEADING
  // ========================================================

  headingArea: {
    textAlign: "center",
  },

  title: {
    textAlign: "center",

    color: "#d90429",

    margin: "0 0 8px",

    fontSize: "32px",

    fontWeight: "700",
  },

  subtitle: {
    textAlign: "center",

    color: "#777777",

    margin: "0 0 25px",

    fontSize: "14px",

    lineHeight: "1.5",
  },

  // ========================================================
  // USER / DONOR SWITCH
  // ========================================================

  switchContainer: {
    display: "flex",

    width: "100%",

    backgroundColor: "#f5f5f5",

    borderRadius: "10px",

    padding: "4px",

    marginBottom: "25px",

    boxSizing: "border-box",
  },

  switchButton: {
    flex: 1,

    height: "43px",

    border: "none",

    borderRadius: "8px",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    gap: "7px",

    fontSize: "14px",

    fontWeight: "600",

    cursor: "pointer",

    transition: "all 0.2s ease",
  },

  activeSwitch: {
    backgroundColor: "#d90429",

    color: "#ffffff",

    boxShadow: "0 3px 8px rgba(217, 4, 41, 0.25)",
  },

  inactiveSwitch: {
    backgroundColor: "transparent",

    color: "#555555",
  },

  // ========================================================
  // INPUT
  // ========================================================

  inputBox: {
    display: "flex",

    alignItems: "center",

    border: "1px solid #dddddd",

    borderRadius: "9px",

    padding: "12px 13px",

    marginBottom: "17px",

    backgroundColor: "#ffffff",

    transition: "border 0.2s ease",

    boxSizing: "border-box",
  },

  icon: {
    color: "#d90429",

    marginRight: "10px",

    fontSize: "17px",

    flexShrink: 0,
  },

  input: {
    border: "none",

    outline: "none",

    width: "100%",

    minWidth: 0,

    fontSize: "15px",

    color: "#333333",

    backgroundColor: "transparent",
  },

  // ========================================================
  // LOGIN BUTTON
  // ========================================================

  button: {
    width: "100%",

    padding: "13px",

    border: "none",

    borderRadius: "9px",

    background: "#d90429",

    color: "#ffffff",

    fontSize: "16px",

    cursor: "pointer",

    fontWeight: "700",

    marginTop: "5px",

    boxShadow: "0 5px 12px rgba(217, 4, 41, 0.20)",
  },

  // ========================================================
  // MESSAGE
  // ========================================================

  message: {
    marginTop: "15px",

    marginBottom: "0",

    textAlign: "center",

    color: "#d90429",

    fontWeight: "600",

    fontSize: "14px",
  },

  // ========================================================
  // REGISTER
  // ========================================================

  register: {
    marginTop: "22px",

    marginBottom: "0",

    textAlign: "center",

    fontSize: "14px",

    color: "#555555",
  },

  link: {
    color: "#d90429",

    textDecoration: "none",

    fontWeight: "700",
  },
};

export default UserLogin;
