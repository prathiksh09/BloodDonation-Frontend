import { useState } from "react";
import { FaUser, FaEnvelope, FaLock, FaImage } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const UserRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  // for adding image
  const [image, setImage] = useState(null);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // for handling image
  const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];

    setImage(selectedImage);
  };

  // Handle submit

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      // Create Fromdata

      const data = new FormData();

      // Add text fields

      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("password", formData.password);

      // adding for image
      if (image) {
        data.append("image", image);
      }

      const response = await axios.post(
        "http://localhost:5001/api/create-user",
        data,
      );

      if (response.data.success) {
        setMessage(response.data.message || "User registered successfully");

        setFormData({
          name: "",
          email: "",
          password: "",
        });

        setImage(null);

        // go to login
        setTimeout(() => {
          navigate("/user-login");
        }, 1200);
      } else {
        setMessage(response.data.message || "Registration failed");
      }
    } catch (error) {
      console.log(error);

      setMessage(
        error.response?.data?.message ||
          error.message ||
          "Unable to connect to the server",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form style={styles.card} onSubmit={handleSubmit}>
        <h1 style={styles.title}>User Register</h1>

        <p style={styles.subtitle}>
          Create an account to search donors and send blood requests.
        </p>

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

        <div style={styles.imageBox}>
          <FaImage style={styles.icon} />

          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            style={styles.fileInput}
          />
        </div>

        {image && <p style={styles.imageName}>Selected image: {image.name}</p>}

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

        {message && <p style={styles.message}>{message}</p>}

        <p style={styles.loginText}>
          Already have an account?{" "}
          <Link to="/user-login" style={styles.link}>
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
    backgroundColor: "#ffffff",
    padding: "42px",
    borderRadius: "20px",
    boxShadow: "0 14px 35px rgba(0,0,0,0.09)",
  },

  title: {
    margin: "0 0 10px",
    textAlign: "center",
    color: "#e0002b",
    fontSize: "36px",
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

  imageBox: {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
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

  fileInput: {
    width: "100%",
    fontSize: "14px",
    cursor: "pointer",
  },

  imageName: {
    margin: "0 0 20px",
    color: "#737373",
    fontSize: "14px",
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

export default UserRegister;
