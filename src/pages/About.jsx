import { useRef } from "react";

import { FaHeartbeat, FaUsers, FaCode } from "react-icons/fa";

import heroImage from "../assets/About.png";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const About = () => {
  const heroImageRef = useRef(null);

  return (
    <>
      <Navbar />

      <main style={styles.page}>
        {/* HERO SECTION */}
        <section className="about-hero" style={styles.hero}>
          <div className="about-hero-content" style={styles.heroContent}>
            <span style={styles.badge}>About LifeLine</span>

            <h1 className="about-heading" style={styles.heading}>
              Connecting blood donors with people who need help.
            </h1>

            <p className="about-description" style={styles.description}>
              LifeLine is a simple blood donation platform designed to help
              users find available donors, send blood requests and communicate
              with donors during emergencies.
            </p>

            <div className="about-stats" style={styles.heroStats}>
              {/* STAT 1 */}
              <div className="about-stat-card" style={styles.statCard}>
                <FaUsers style={styles.statIcon} />

                <div>
                  <h3 style={styles.statNumber}>250+</h3>
                  <p style={styles.statLabel}>Registered Donors</p>
                </div>
              </div>

              {/* STAT 2 */}
              <div className="about-stat-card" style={styles.statCard}>
                <FaHeartbeat style={styles.statIcon} />

                <div>
                  <h3 style={styles.statNumber}>300+</h3>
                  <p style={styles.statLabel}>Lives Supported</p>
                </div>
              </div>
            </div>
          </div>

          {/* HERO IMAGE */}
          <img
            ref={heroImageRef}
            className="about-hero-image"
            src={heroImage}
            alt="Image"
            style={styles.heroImage}
          />
        </section>

        {/* PURPOSE SECTION */}
        <section className="about-mission" style={styles.missionSection}>
          <div style={styles.sectionHeading}>
            <span style={styles.smallTitle}>Our Purpose</span>

            <p style={styles.sectionDescription}>
              The application simplifies the process of finding donors and
              sending blood requests through one easy-to-use platform.
            </p>
          </div>

          <div className="about-cards" style={styles.cardsGrid}>
            {/* CARD 1 */}
            <div style={styles.infoCard}>
              <h3 style={styles.cardTitle}>Find Donors Easily</h3>

              <p style={styles.cardText}>
                Users can search and view donor details based on blood group,
                location and availability.
              </p>
            </div>

            {/* CARD 2 */}
            <div style={styles.infoCard}>
              <h3 style={styles.cardTitle}>Send Blood Requests</h3>

              <p style={styles.cardText}>
                Users can contact a selected donor and send their blood
                requirement details directly.
              </p>
            </div>

            {/* CARD 3 */}
            <div style={styles.infoCard}>
              <h3 style={styles.cardTitle}>Simple and Secure</h3>

              <p style={styles.cardText}>
                Login authentication and protected donor details help keep the
                application organized and reliable.
              </p>
            </div>
          </div>
        </section>

        {/* DEVELOPER SECTION */}
        <section className="about-developer" style={styles.developerSection}>
          <div style={styles.developerLine} />

          <div
            className="about-developer-content"
            style={styles.developerContent}
          >
            <span style={styles.developedText}>Developed by</span>

            <strong style={styles.developerName}>Prathiksh</strong>

            <span style={styles.divider}>|</span>

            <a
              href="https://www.codelabsystems.in/"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.company}
            >
              <div style={styles.companyIcon}>
                <FaCode />
              </div>

              <strong style={styles.companyName}>Codelab System</strong>
            </a>
          </div>

          <div style={styles.developerLine} />
        </section>
      </main>

      <Footer />
    </>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    overflowX: "hidden",
    backgroundColor: "#fffafa",
  },

  /* =========================
     HERO
  ========================= */

  hero: {
    width: "90%",
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "75px 0 55px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "70px",
  },

  heroContent: {
    width: "58%",
    maxWidth: "720px",
  },

  badge: {
    display: "inline-block",
    marginBottom: "20px",
    padding: "8px 16px",
    borderRadius: "25px",
    backgroundColor: "#ffe4e6",
    color: "#be123c",
    fontSize: "14px",
    fontWeight: "700",
  },

  heading: {
    margin: "0 0 24px",
    color: "#18181b",
    fontSize: "54px",
    lineHeight: "1.15",
    letterSpacing: "-1px",
  },

  description: {
    maxWidth: "680px",
    margin: 0,
    color: "#666666",
    fontSize: "18px",
    lineHeight: "1.8",
  },

  heroStats: {
    display: "flex",
    gap: "20px",
    marginTop: "36px",
    flexWrap: "wrap",
  },

  statCard: {
    minWidth: "210px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    padding: "18px",
    borderRadius: "14px",
    backgroundColor: "#ffffff",
    boxShadow: "0 8px 22px rgba(0,0,0,0.06)",
  },

  statIcon: {
    color: "#e0002b",
    fontSize: "28px",
  },

  statNumber: {
    margin: 0,
    color: "#e0002b",
    fontSize: "25px",
  },

  statLabel: {
    margin: "4px 0 0",
    color: "#71717a",
    fontSize: "14px",
  },

  /* =========================
     HERO IMAGE
  ========================= */

  heroImage: {
    width: "100%",
    maxWidth: "550px",
    height: "400px",
    borderRadius: "40px",
    display: "block",
  },

  /* =========================
     PURPOSE SECTION
  ========================= */

  missionSection: {
    padding: "65px 5% 80px",
    backgroundColor: "#ffffff",
  },

  sectionHeading: {
    maxWidth: "760px",
    margin: "0 auto 45px",
    textAlign: "center",
  },

  smallTitle: {
    color: "#e0002b",
    fontSize: "14px",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },

  sectionDescription: {
    margin: "14px 0 0",
    color: "#71717a",
    fontSize: "17px",
    lineHeight: "1.7",
  },

  cardsGrid: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "24px",
  },

  infoCard: {
    padding: "30px",
    border: "1px solid #f3d7da",
    borderRadius: "18px",
    backgroundColor: "#fffafa",
    boxShadow: "0 10px 25px rgba(0,0,0,0.04)",
  },

  cardTitle: {
    margin: "0 0 12px",
    color: "#18181b",
    fontSize: "21px",
  },

  cardText: {
    margin: 0,
    color: "#71717a",
    fontSize: "15px",
    lineHeight: "1.7",
  },

  /* =========================
     DEVELOPER SECTION
  ========================= */

  developerSection: {
    width: "90%",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "30px 0 50px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "24px",
  },

  developerLine: {
    flex: 1,
    height: "1px",
    backgroundColor: "#f4b9c1",
  },

  developerContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    whiteSpace: "nowrap",
  },

  developedText: {
    color: "#71717a",
    fontSize: "16px",
  },

  developerName: {
    color: "#e0002b",
    fontSize: "20px",
  },

  divider: {
    color: "#a1a1aa",
    fontSize: "22px",
  },

  company: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    color: "#18181b",
    textDecoration: "none",
    cursor: "pointer",
  },

  companyIcon: {
    width: "42px",
    height: "42px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "12px",
    backgroundColor: "#ffe4e6",
    color: "#e0002b",
    fontSize: "21px",
  },

  companyName: {
    color: "#18181b",
    fontSize: "18px",
  },
};

export default About;
