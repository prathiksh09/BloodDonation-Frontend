import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaGithub,
  FaLinkedin,
  FaInstagram,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        {/* Logo */}
        <div style={styles.column}>
          <div style={styles.logo}>
            {/* <FaTint style={styles.logoIcon} /> */}
            <h2>LifeLine</h2>
          </div>

          <p style={styles.text}>
            LifeLine helps people find blood donors quickly during emergencies
            and saves valuable time when every second matters.
          </p>
        </div>

        {/* Quick Links */}
        <div style={styles.column}>
          <h3 style={styles.heading}>Quick Links</h3>

          <a href="/" style={styles.link}>
            Home
          </a>

          <a href="/about" style={styles.link}>
            About
          </a>

          <a href="/donors" style={styles.link}>
            Donors
          </a>

          <a href="/contact" style={styles.link}>
            Contact
          </a>
        </div>

        {/* Contact */}
        <div style={styles.column}>
          <h3 style={styles.heading}>Contact</h3>

          <p style={styles.info}>
            <FaEnvelope /> Lifeline@gmail.com
          </p>

          <p style={styles.info}>
            <FaPhone /> +91 9876543210
          </p>

          <p style={styles.info}>
            <FaMapMarkerAlt /> Karnataka, India
          </p>
        </div>

        {/* Developer */}
        <div style={styles.column}>
          <h3 style={styles.heading}>Developer</h3>

          <p style={styles.developer}>Prathiksh</p>

          <div style={styles.social}>
            <a
              href="https://github.com/prathiksh09"
              target="_blank"
              style={styles.socialIcon}
              aria-label="GitHub"
            >
              <FaGithub style={styles.socialIcon} />
            </a>

            <a
              href="https://www.linkedin.com/in/prathiksh-gowda-bbb0a1421"
              target="_blank"
              style={styles.socialIcon}
              aria-label="LinkedIn"
            >
              <FaLinkedin style={styles.socialIcon} />
            </a>
            <FaInstagram style={styles.socialIcon} />
          </div>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    background: "#111827",
    color: "#ffffff",
    marginTop: "60px",
    padding: "60px 8% 20px",
  },

  container: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
    gap: "40px",
  },

  column: {
    display: "flex",
    flexDirection: "column",
  },

  logo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "18px",
  },

  logoIcon: {
    color: "#ef4444",
    fontSize: "34px",
  },

  text: {
    color: "#cbd5e1",
    lineHeight: "1.8",
    fontSize: "15px",
  },

  heading: {
    marginBottom: "20px",
    color: "#ffffff",
  },

  link: {
    color: "#cbd5e1",
    textDecoration: "none",
    marginBottom: "12px",
    transition: ".3s",
  },

  info: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#cbd5e1",
    marginBottom: "15px",
  },

  developer: {
    fontSize: "20px",
    fontWeight: "700",
    marginBottom: "18px",
    color: "#ffffff",
  },

  company: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    textDecoration: "none",
    color: "#ef4444",
    fontWeight: "700",
    marginBottom: "22px",
  },

  social: {
    display: "flex",
    gap: "16px",
  },

  socialIcon: {
    fontSize: "25px",
    cursor: "pointer",
    color: "#ffffff",
  },

  copy: {
    textAlign: "center",
    color: "#9ca3af",
    fontSize: "14px",
  },
};

export default Footer;
