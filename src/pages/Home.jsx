import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import heroImage from "../assets/bannerimg.png";
import bannerImage from "../assets/backimg.png";
import {
  FaSearch,
  FaHandHoldingHeart,
  FaHeartbeat,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaBolt,
  FaArrowRight,
  FaTimes,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import Footer from "../components/Footer";

const Home = () => {
  const heroContentRef = useRef(null);
  const heroImageRef = useRef(null);

  const [highlights, setHighlights] = useState([]);
  const [loadingHighlights, setLoadingHighlights] = useState(true);
  const [selectedHighlight, setSelectedHighlight] = useState(null);

  const API_URL = "https://blooddonation-backend-1.onrender.com/api";

  // ==========================================================
  // GET BLOOD HIGHLIGHTS
  // ==========================================================

  useEffect(() => {
    const getHighlights = async () => {
      try {
        setLoadingHighlights(true);

        const response = await axios.get(`${API_URL}/highlights/active`);

        if (response.data.success) {
          setHighlights(response.data.highlights || []);
        } else {
          setHighlights([]);
        }
      } catch (error) {
        console.error("GET HIGHLIGHTS ERROR:", error);
        setHighlights([]);
      } finally {
        setLoadingHighlights(false);
      }
    };

    getHighlights();
  }, []);

  // ==========================================================
  // GSAP ANIMATION
  // ==========================================================

  useEffect(() => {
    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      timeline
        .fromTo(
          heroContentRef.current,
          {
            x: -100,
            opacity: 0,
          },
          {
            x: 0,
            opacity: 1,
            duration: 1.1,
          },
        )
        .fromTo(
          heroImageRef.current,
          {
            x: 100,
            opacity: 0,
          },
          {
            x: 0,
            opacity: 1,
            duration: 1.2,
          },
          "-=0.7",
        );
    });

    return () => ctx.revert();
  }, []);

  // ==========================================================
  // MODAL
  // ==========================================================

  const handleReadMore = (highlight) => {
    setSelectedHighlight(highlight);
  };

  const handleCloseModal = () => {
    setSelectedHighlight(null);
  };

  const handleModalBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  return (
    <>
      <main style={styles.page}>
        {/* ==================================================
            HERO SECTION
        ================================================== */}

        <section className="home-hero" style={styles.hero}>
          {/* LEFT SIDE */}

          <div ref={heroContentRef} className="home-left" style={styles.left}>
            <span style={styles.badge}>Donate blood, save lives</span>

            <h1 className="home-heading" style={styles.heading}>
              Your blood can be
              <span style={styles.redText}> someone’s hope.</span>
            </h1>

            <p className="home-description" style={styles.description}>
              Find available blood donors during emergencies, send blood
              requests, and connect directly with donors through a simple and
              trusted platform.
            </p>

            <div className="home-actions" style={styles.actions}>
              <Link
                to="/donors"
                className="home-action-btn"
                style={styles.primaryButton}
              >
                <FaSearch />
                Find Donors
              </Link>

              <Link
                to="/donor-register"
                className="home-action-btn"
                style={styles.secondaryButton}
              >
                <FaHandHoldingHeart />
                Become a Donor
              </Link>
            </div>

            {/* STATS */}

            <div className="home-stats" style={styles.stats}>
              <div className="home-stat-item" style={styles.statItem}>
                <h3 style={styles.statNumber}>250+</h3>
                <p style={styles.statText}>Registered Donors</p>
              </div>

              <div className="home-stat-item" style={styles.statItem}>
                <h3 style={styles.statNumber}>120+</h3>
                <p style={styles.statText}>Requests Completed</p>
              </div>

              <div className="home-stat-item" style={styles.statItem}>
                <h3 style={styles.statNumber}>300+</h3>
                <p style={styles.statText}>Lives Supported</p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE IMAGE */}

          <div className="home-right" style={styles.right}>
            <img
              ref={heroImageRef}
              className="home-hero-image"
              // added img from assest

              src={heroImage}
              alt="Blood donation"
              style={styles.heroImage}
            />
          </div>
        </section>

        {/* ==================================================
            BLOOD GROUP INFORMATION
        ================================================== */}

        <section className="blood-info-section" style={styles.bloodInfoSection}>
          <div style={styles.bloodInfoHeader}>
            <h2 className="blood-info-title" style={styles.bloodInfoTitle}>
              Know your blood group.
              <span style={styles.bloodInfoRedText}> Help save a life.</span>
            </h2>

            <p style={styles.bloodInfoDescription}>
              Learn about blood groups, their compatibility, donation
              information and receiving information.
            </p>
          </div>

          {/* LOADING */}

          {loadingHighlights && (
            <div style={styles.highlightMessage}>
              Loading blood information...
            </div>
          )}

          {/* NO DATA */}

          {!loadingHighlights && highlights.length === 0 && (
            <div style={styles.highlightMessage}>
              No blood group information available.
            </div>
          )}

          {/* Creating  Cards for highlight*/}

          {!loadingHighlights && highlights.length > 0 && (
            <div className="blood-info-grid" style={styles.bloodInfoGrid}>
              {highlights.map((highlight) => (
                <div
                  className="blood-info-card"
                  style={styles.bloodInfoCard}
                  key={highlight._id}
                >
                  {/* ==================================================
                      ADMIN UPLOADED BLOOD GROUP IMAGE
                  ================================================== */}

                  <div style={styles.bloodImageBox}>
                    {highlight.image ? (
                      <img
                        src={`https://res.cloudinary.com/a7dja13r/image/upload/${highlight.image}`}
                        alt={`${highlight.bloodGroup} blood group`}
                        style={styles.adminBloodImage}
                      />
                    ) : (
                      <div style={styles.noImageBox}>No image available</div>
                    )}
                  </div>

                  {/* ==================================================
                      CARD CONTENT
                  ================================================== */}

                  <div style={styles.bloodCardContent}>
                    <div style={styles.bloodCardTop}>
                      <h3 style={styles.bloodCardTitle}>
                        {highlight.bloodGroup} Blood Group
                      </h3>

                      <span style={styles.bloodTypeBadge}>
                        {highlight.bloodGroup}
                      </span>
                    </div>

                    <p style={styles.cardShortText}>
                      Learn about this blood group's compatibility and donation
                      information.
                    </p>

                    <button
                      type="button"
                      style={styles.readMoreButton}
                      onClick={() => handleReadMore(highlight)}
                    >
                      Read More
                      <FaArrowRight />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ==================================================
            READ MORE MODAL
        ================================================== */}

        {selectedHighlight && (
          <div style={styles.modalOverlay} onClick={handleModalBackdropClick}>
            <div style={styles.modal}>
              {/* MODAL HEADER */}

              <div style={styles.modalHeader}>
                {/* ADMIN UPLOADED IMAGE IN MODAL */}

                <div style={styles.modalBloodImageBox}>
                  {selectedHighlight.image ? (
                    <img
                      src={`https://res.cloudinary.com/a7dja13r/image/upload/${selectedHighlight.image}`}
                      alt={`${selectedHighlight.bloodGroup} blood group`}
                      style={styles.modalBloodImage}
                    />
                  ) : (
                    <div style={styles.modalNoImage}>No image</div>
                  )}
                </div>

                <div style={styles.modalHeaderText}>
                  <h2 style={styles.modalTitle}>
                    {selectedHighlight.bloodGroup} Blood Group
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={handleCloseModal}
                  style={styles.closeButton}
                >
                  <FaTimes />
                </button>
              </div>

              {/* MODAL BODY */}

              <div style={styles.modalBody}>
                {/* DESCRIPTION */}

                <div style={styles.modalSection}>
                  <h3 style={styles.modalSectionTitle}>
                    About {selectedHighlight.bloodGroup} Blood
                  </h3>

                  <p style={styles.modalDescription}>
                    {selectedHighlight.description}
                  </p>
                </div>

                {/* HEALTH / DISEASE INFORMATION */}

                {selectedHighlight.healthInfo && (
                  <div style={styles.healthInfoBox}>
                    <h3 style={styles.healthInfoTitle}>Disease Information</h3>

                    <p style={styles.healthInfoText}>
                      {selectedHighlight.healthInfo}
                    </p>
                  </div>
                )}

                {/* COMPATIBILITY */}

                <div style={styles.compatibilityGrid}>
                  {/* DONATE TO */}

                  <div style={styles.compatibilityCard}>
                    <div style={styles.compatibilityIcon}>
                      <FaHandHoldingHeart />
                    </div>

                    <div>
                      <h4 style={styles.compatibilityTitle}>Can Donate To</h4>

                      <p style={styles.compatibilityText}>
                        {selectedHighlight.donateTo || "Not specified"}
                      </p>
                    </div>
                  </div>

                  {/* RECEIVE FROM */}

                  <div style={styles.compatibilityCard}>
                    <div style={styles.compatibilityIcon}>
                      <FaHeartbeat />
                    </div>

                    <div>
                      <h4 style={styles.compatibilityTitle}>
                        Can Receive From
                      </h4>

                      <p style={styles.compatibilityText}>
                        {selectedHighlight.receiveFrom || "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* INFORMATION */}
              </div>

              {/* MODAL FOOTER */}

              <div style={styles.modalFooter}>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  style={styles.modalCloseButton}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================
            AWARENESS SECTION
        ================================================== */}

        <section className="awareness-section" style={styles.awarenessSection}>
          {/* IMAGE */}

          <div style={styles.awarenessImageContainer}>
            <img
              src={bannerImage}
              alt="Blood donation awareness"
              style={styles.awarenessImage}
            />
          </div>

          {/* CONTENT */}

          <div style={styles.awarenessContent}>
            <span style={styles.awarenessBadge}>Blood Donation Network</span>

            <h2 className="awareness-title" style={styles.awarenessTitle}>
              Help can reach someone faster when donors stay connected.
            </h2>

            <p style={styles.awarenessDescription}>
              LifeLine brings patients and blood donors together in one trusted
              platform. During an emergency, users can quickly search, contact a
              suitable donor and send their requirement details.
            </p>

            {/* BENEFITS */}

            <div style={styles.benefitList}>
              <div style={styles.benefitItem}>
                <div style={styles.benefitIcon}>
                  <FaBolt />
                </div>

                <div>
                  <h3 style={styles.benefitTitle}>Faster Emergency Support</h3>

                  <p style={styles.benefitText}>
                    Quickly find donors and send requests without unnecessary
                    delays.
                  </p>
                </div>
              </div>

              <div style={styles.benefitItem}>
                <div style={styles.benefitIcon}>
                  <FaMapMarkerAlt />
                </div>

                <div>
                  <h3 style={styles.benefitTitle}>Location-Based Search</h3>

                  <p style={styles.benefitText}>
                    Search for suitable blood donors based on their location.
                  </p>
                </div>
              </div>

              <div style={styles.benefitItem}>
                <div style={styles.benefitIcon}>
                  <FaShieldAlt />
                </div>

                <div>
                  <h3 style={styles.benefitTitle}>Protected Information</h3>

                  <p style={styles.benefitText}>
                    Authentication helps keep user and donor details organized
                    and secure.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

const styles = {
  page: {
    minHeight: "calc(100vh - 80px)",
    overflowX: "hidden",
    background:
      "linear-gradient(135deg, #fff7f7 0%, #ffffff 55%, #ffe4e6 100%)",
  },

  // ==========================================================
  // HERO
  // ==========================================================

  hero: {
    width: "90%",
    maxWidth: "1400px",
    minHeight: "650px",
    margin: "0 auto",
    padding: "60px 0",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "50px",
    boxSizing: "border-box",
  },

  left: {
    width: "55%",
    maxWidth: "700px",
  },

  badge: {
    display: "inline-block",
    padding: "9px 16px",
    marginBottom: "22px",
    borderRadius: "30px",
    backgroundColor: "#ffe4e6",
    color: "#be123c",
    fontWeight: "700",
    fontSize: "14px",
  },

  heading: {
    margin: 0,
    fontSize: "60px",
    lineHeight: "1.12",
    color: "#18181b",
    letterSpacing: "-1.5px",
  },

  redText: {
    color: "#e0002b",
  },

  description: {
    maxWidth: "650px",
    margin: "24px 0 32px",
    color: "#5f6368",
    fontSize: "18px",
    lineHeight: "1.8",
  },

  actions: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
  },

  primaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "9px",
    padding: "14px 24px",
    borderRadius: "10px",
    backgroundColor: "#e0002b",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "700",
    textDecoration: "none",
    boxShadow: "0 10px 22px rgba(224, 0, 43, 0.22)",
  },

  secondaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "9px",
    padding: "12px 24px",
    border: "2px solid #e0002b",
    borderRadius: "10px",
    backgroundColor: "#ffffff",
    color: "#e0002b",
    fontSize: "16px",
    fontWeight: "700",
    textDecoration: "none",
  },

  stats: {
    display: "flex",
    gap: "50px",
    marginTop: "48px",
    flexWrap: "wrap",
  },

  statItem: {
    minWidth: "130px",
  },

  statNumber: {
    margin: 0,
    color: "#e0002b",
    fontSize: "30px",
  },

  statText: {
    margin: "7px 0 0",
    color: "#71717a",
    fontSize: "14px",
  },

  // ==========================================================
  // HERO IMAGE
  // ==========================================================

  right: {
    width: "45%",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  },

  heroImage: {
    width: "100%",
    maxWidth: "700px",
    height: "380px",
    display: "block",
    borderRadius: "40px",
  },

  // ==========================================================
  // BLOOD INFORMATION
  // ==========================================================

  bloodInfoSection: {
    width: "90%",
    maxWidth: "1350px",
    margin: "0 auto 90px",
    padding: "70px 0",
  },

  bloodInfoHeader: {
    textAlign: "center",
    maxWidth: "760px",
    margin: "0 auto 48px",
  },

  bloodInfoTitle: {
    margin: "0 0 14px",
    color: "#18181b",
    fontSize: "43px",
    lineHeight: "1.2",
    letterSpacing: "-0.8px",
  },

  bloodInfoRedText: {
    color: "#e0002b",
  },

  bloodInfoDescription: {
    margin: 0,
    color: "#71717a",
    fontSize: "17px",
    lineHeight: "1.7",
  },

  bloodInfoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "24px",
  },

  bloodInfoCard: {
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    overflow: "hidden",
    border: "1px solid #f1f1f1",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.07)",
    minWidth: 0,
  },

  // ==========================================================
  // ADMIN UPLOADED IMAGE
  // ==========================================================

  bloodImageBox: {
    height: "190px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(145deg, #fff0f2 0%, #ffe1e5 100%)",
    position: "relative",
    overflow: "hidden",
  },

  adminBloodImage: {
    width: "100%",
    height: "190px",
    objectFit: "cover",
    display: "block",
  },

  noImageBox: {
    width: "100%",
    height: "190px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#71717a",
    fontSize: "14px",
    backgroundColor: "#f9fafb",
  },

  // ==========================================================
  // CARD CONTENT
  // ==========================================================

  bloodCardContent: {
    padding: "20px",
  },

  bloodCardTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
    marginBottom: "15px",
  },

  bloodCardTitle: {
    margin: 0,
    color: "#18181b",
    fontSize: "18px",
    lineHeight: "1.3",
  },

  bloodTypeBadge: {
    flexShrink: 0,
    padding: "6px 9px",
    borderRadius: "20px",
    backgroundColor: "#ffe4e6",
    color: "#e0002b",
    fontSize: "12px",
    fontWeight: "800",
  },

  cardShortText: {
    margin: "0 0 20px",
    color: "#71717a",
    fontSize: "13px",
    lineHeight: "1.6",
    minHeight: "42px",
  },

  readMoreButton: {
    width: "100%",
    border: "none",
    backgroundColor: "#fff0f2",
    color: "#e0002b",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "7px",
    fontSize: "14px",
    fontWeight: "800",
    cursor: "pointer",
    padding: "11px",
    borderRadius: "10px",
  },

  highlightMessage: {
    width: "100%",
    padding: "40px 20px",
    boxSizing: "border-box",
    textAlign: "center",
    color: "#71717a",
    fontSize: "16px",
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
  },

  // ==========================================================
  // MODAL
  // ==========================================================

  modalOverlay: {
    position: "fixed",
    width: "100%",
    inset: 0,
    zIndex: 9999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    boxSizing: "border-box",
    backgroundColor: "rgba(24, 24, 27, 0.65)",
    backdropFilter: "blur(5px)",
  },

  modal: {
    width: "100%",
    maxWidth: "900px",
    maxHeight: "90vh",
    overflowY: "auto",
    backgroundColor: "#ffffff",
    borderRadius: "24px",
    boxShadow: "0 30px 80px rgba(0,0,0,0.25)",
  },

  modalHeader: {
    padding: "24px 25px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    background: "linear-gradient(145deg, #f76767 0%, #b00020 100%)",
    color: "#ffffff",
  },

  // MODAL UPLOADED IMAGE

  modalBloodImageBox: {
    width: "65px",
    height: "65px",
    flexShrink: 0,
    borderRadius: "14px",
    overflow: "hidden",
    backgroundColor: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  modalBloodImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },

  modalNoImage: {
    color: "#e0002b",
    fontSize: "10px",
    fontWeight: "700",
    textAlign: "center",
  },

  modalHeaderText: {
    flex: 1,
  },

  modalTitle: {
    margin: 0,
    fontSize: "24px",
    fontWeight: "800",
  },

  closeButton: {
    width: "40px",
    height: "40px",
    flexShrink: 0,
    border: "none",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    color: "#ffffff",
    fontSize: "18px",
    cursor: "pointer",
  },

  modalBody: {
    padding: "28px",
  },

  modalSection: {
    marginBottom: "25px",
  },

  modalSectionTitle: {
    margin: "0 0 10px",
    color: "#18181b",
    fontSize: "19px",
  },

  modalDescription: {
    margin: 0,
    color: "#5f6368",
    fontSize: "15px",
    lineHeight: "1.8",
  },

  // ==========================================================
  // HEALTH INFORMATION
  // ==========================================================

  healthInfoBox: {
    marginBottom: "25px",
    padding: "18px",
    borderRadius: "15px",
    backgroundColor: "#fff7f7",
    border: "1px solid #ffe4e6",
  },

  healthInfoTitle: {
    margin: "0 0 8px",
    color: "#18181b",
    fontSize: "17px",
  },

  healthInfoText: {
    margin: 0,
    color: "#5f6368",
    fontSize: "14px",
    lineHeight: "1.7",
  },

  // ==========================================================
  // COMPATIBILITY
  // ==========================================================

  compatibilityGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px",
  },

  compatibilityCard: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    padding: "18px",
    borderRadius: "15px",
    backgroundColor: "#fff7f7",
    border: "1px solid #ffe4e6",
  },

  compatibilityIcon: {
    width: "42px",
    height: "42px",
    flexShrink: 0,
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffe4e6",
    color: "#e0002b",
    fontSize: "17px",
  },

  compatibilityTitle: {
    margin: "0 0 6px",
    color: "#18181b",
    fontSize: "14px",
  },

  compatibilityText: {
    margin: 0,
    color: "#e0002b",
    fontSize: "14px",
    fontWeight: "700",
    lineHeight: "1.5",
  },

  modalFooter: {
    padding: "18px 28px 25px",
    display: "flex",
    justifyContent: "flex-end",
    borderTop: "1px solid #f1f1f1",
  },

  modalCloseButton: {
    padding: "11px 20px",
    border: "1px solid #e4e4e7",
    borderRadius: "9px",
    backgroundColor: "#ffffff",
    color: "#52525b",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
  },

  // ==========================================================
  // AWARENESS SECTION
  // ==========================================================

  awarenessSection: {
    width: "90%",
    maxWidth: "1350px",
    margin: "40px auto 90px",
    padding: "70px 0",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    alignItems: "center",
    gap: "80px",
  },

  awarenessImageContainer: {
    width: "100%",
    borderRadius: "30px",
    overflow: "hidden",
  },

  awarenessImage: {
    width: "90%",
    height: "480px",
    display: "block",
    borderRadius: "50px",
  },

  awarenessContent: {
    maxWidth: "620px",
  },

  awarenessBadge: {
    display: "inline-block",
    padding: "9px 16px",
    borderRadius: "30px",
    backgroundColor: "#ffe4e6",
    color: "#e0002b",
    fontSize: "13px",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },

  awarenessTitle: {
    margin: "20px 0",
    color: "#18181b",
    fontSize: "43px",
    lineHeight: "1.25",
    letterSpacing: "-0.8px",
  },

  awarenessDescription: {
    margin: 0,
    color: "#67676d",
    fontSize: "17px",
    lineHeight: "1.8",
  },

  benefitList: {
    marginTop: "32px",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },

  benefitItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "15px",
    padding: "17px",
    borderRadius: "16px",
    backgroundColor: "#ffffff",
    boxShadow: "0 8px 24px rgba(0,0,0,0.055)",
  },

  benefitIcon: {
    width: "48px",
    height: "48px",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "14px",
    backgroundColor: "#ffe4e6",
    color: "#e0002b",
    fontSize: "20px",
  },

  benefitTitle: {
    margin: "0 0 5px",
    color: "#18181b",
    fontSize: "17px",
  },

  benefitText: {
    margin: 0,
    color: "#71717a",
    fontSize: "14px",
    lineHeight: "1.6",
  },
};

export default Home;
