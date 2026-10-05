import { useState } from "react";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaUser,
  FaCommentAlt,
} from "react-icons/fa";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setSuccessMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        "https://blooddonation-backend-1.onrender.com/api/contact/create",
        formData,
      );
      if (response.data.message) {
        setSuccessMessage(response.data.message);

        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
        });
      }
    } catch (error) {
      console.log("Contact From Error:", error);

      setSuccessMessage(
        error.response?.data?.message || "Unable to send message",
      );
    }
  };

  return (
    <>
      <Navbar />

      <main style={styles.page}>
        <section className="contact-wrapper" style={styles.contactWrapper}>
          {/* LEFT SIDE */}
          <div className="contact-left" style={styles.leftSection}>
            <span style={styles.badge}>Contact Us</span>

            <h1 className="contact-title" style={styles.title}>
              We’re here to help when every second matters.
            </h1>

            <p className="contact-description" style={styles.description}>
              Have questions about blood donation, donor registration, or blood
              requests? Reach out to us and we’ll help you with the information
              you need.
            </p>

            <div style={styles.contactDetails}>
              <div style={styles.contactItem}>
                <div style={styles.contactIcon}>
                  <FaEnvelope />
                </div>

                <div>
                  <p style={styles.contactLabel}>Email</p>
                  <h3 style={styles.contactValue}>Lifeline@gmail.com</h3>
                </div>
              </div>

              <div style={styles.contactItem}>
                <div style={styles.contactIcon}>
                  <FaPhone />
                </div>

                <div>
                  <p style={styles.contactLabel}>Phone</p>
                  <h3 style={styles.contactValue}>+91 9876543210</h3>
                </div>
              </div>

              <div style={styles.contactItem}>
                <div style={styles.contactIcon}>
                  <FaMapMarkerAlt />
                </div>

                <div>
                  <p style={styles.contactLabel}>Location</p>
                  <h3 style={styles.contactValue}>Karnataka, India</h3>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE FORM */}
          <form
            className="contact-form"
            style={styles.formCard}
            onSubmit={handleSubmit}
          >
            <div style={styles.formHeader}>
              <h2 style={styles.formTitle}>Send Us a Message</h2>

              <p style={styles.formSubtitle}>
                Fill in the form below and we’ll get back to you.
              </p>
            </div>

            <div style={styles.inputBox}>
              <FaUser style={styles.inputIcon} />

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter Your Name"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.inputBox}>
              <FaEnvelope style={styles.inputIcon} />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter Your Email"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.inputBox}>
              <FaPhone style={styles.inputIcon} />

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter Contact Number"
                pattern="[0-9]{10}"
                maxLength="10"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.messageBox}>
              <FaCommentAlt style={styles.messageIcon} />

              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Enter Your Message"
                rows="5"
                style={styles.textarea}
                required
              />
            </div>

            <button type="submit" style={styles.button}>
              Send Message
            </button>

            {successMessage && (
              <p style={styles.successMessage}>{successMessage}</p>
            )}
          </form>
        </section>
      </main>

      <Footer />
    </>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    padding: "70px 20px",
    overflowX: "hidden",
    background:
      "linear-gradient(135deg, #fff7f7 0%, #ffffff 55%, #ffe4e6 100%)",
  },

  contactWrapper: {
    width: "90%",
    maxWidth: "1200px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "60px",
    alignItems: "center",
  },

  leftSection: {
    width: "100%",
    maxWidth: "560px",
  },

  badge: {
    display: "inline-block",
    padding: "8px 16px",
    marginBottom: "20px",
    borderRadius: "30px",
    backgroundColor: "#ffe4e6",
    color: "#e0002b",
    fontSize: "14px",
    fontWeight: "700",
  },

  title: {
    margin: "0 0 22px",
    color: "#18181b",
    fontSize: "44px",
    lineHeight: "1.2",
  },

  description: {
    margin: 0,
    color: "#666666",
    fontSize: "17px",
    lineHeight: "1.8",
  },

  contactDetails: {
    marginTop: "35px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  contactItem: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },

  contactIcon: {
    width: "52px",
    height: "52px",
    flexShrink: 0,
    borderRadius: "15px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffe4e6",
    color: "#e0002b",
    fontSize: "20px",
  },

  contactLabel: {
    margin: "0 0 4px",
    color: "#71717a",
    fontSize: "13px",
  },

  contactValue: {
    margin: 0,
    color: "#18181b",
    fontSize: "16px",
    wordBreak: "break-word",
  },

  formCard: {
    width: "100%",
    padding: "40px",
    boxSizing: "border-box",
    borderRadius: "22px",
    backgroundColor: "#ffffff",
    boxShadow: "0 18px 45px rgba(0,0,0,0.09)",
  },

  formHeader: {
    marginBottom: "28px",
    textAlign: "center",
  },

  formTitle: {
    margin: "0 0 8px",
    color: "#e0002b",
    fontSize: "32px",
  },

  formSubtitle: {
    margin: 0,
    color: "#71717a",
    fontSize: "15px",
  },

  inputBox: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    marginBottom: "18px",
    padding: "14px 16px",
    boxSizing: "border-box",
    border: "1px solid #dcdcdc",
    borderRadius: "10px",
  },

  inputIcon: {
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
    backgroundColor: "transparent",
    fontSize: "15px",
  },

  messageBox: {
    width: "100%",
    display: "flex",
    alignItems: "flex-start",
    padding: "15px 16px",
    boxSizing: "border-box",
    border: "1px solid #dcdcdc",
    borderRadius: "10px",
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
    minWidth: 0,
    border: "none",
    outline: "none",
    resize: "none",
    backgroundColor: "transparent",
    fontFamily: "inherit",
    fontSize: "15px",
    lineHeight: "1.6",
  },

  button: {
    width: "100%",
    marginTop: "22px",
    padding: "15px",
    border: "none",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "9px",
    backgroundColor: "#e0002b",
    color: "#ffffff",
    fontSize: "17px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 10px 22px rgba(224,0,43,0.2)",
  },

  successMessage: {
    margin: "18px 0 0",
    textAlign: "center",
    color: "#15803d",
    fontSize: "14px",
    fontWeight: "700",
  },
};

export default Contact;
