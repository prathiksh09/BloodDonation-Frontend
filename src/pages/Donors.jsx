import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Donors = () => {
  const navigate = useNavigate();

  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // PAGINATION

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Number of donor cards per page
  const limit = 6;

  // FETCH DONORS

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const response = await axios.get(
          `https://blooddonation-backend-1.onrender.com/api/get-all-donors?page=${currentPage}&limit=${limit}`,
        );

        console.log("Donor data:", response.data);

        if (response.data.success) {
          setDonors(response.data.data);

          // Get total pages from backend
          setTotalPages(response.data.totalPages);
        } else {
          setErrorMessage(response.data.message || "Unable to fetch donors");
        }
      } catch (error) {
        console.log("Error fetching donors:", error);

        setErrorMessage(
          error.response?.data?.message ||
            error.message ||
            "Unable to connect to server",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDonors();
  }, [currentPage]);

  // PREVIOUS PAGE

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleContactDonor = (donorId) => {
    navigate(`/request-blood/${donorId}`);
  };

  if (loading) {
    return <div style={styles.loading}>Loading donors...</div>;
  }

  return (
    <>
      <Navbar />

      <div style={styles.container}>
        {/* PAGE HEADER */}
        <div style={styles.header}>
          <h1 style={styles.title}>Available Blood Donors</h1>

          <p style={styles.subtitle}>
            Find registered blood donors and contact them during emergencies.
          </p>
        </div>

        {/* ERROR */}
        {errorMessage && <p style={styles.error}>{errorMessage}</p>}

        {/* NO DONORS */}
        {donors.length === 0 && !errorMessage ? (
          <p style={styles.noDonors}>No donors found.</p>
        ) : (
          <>
            {/* DONOR CARDS */}
            <div style={styles.grid}>
              {donors.map((donor) => (
                <div key={donor._id} style={styles.card}>
                  {/* CARD HEADER */}
                  <div style={styles.cardHeader}>
                    {/* IMAGE + NAME */}
                    <div style={styles.profile}>
                      <img
                        src={`https://res.cloudinary.com/a7dja13r/image/upload/${donor.image}`}
                        alt={donor.donorName}
                        style={styles.donorImage}
                      />

                      <h2 style={styles.name}>{donor.donorName}</h2>
                    </div>
                  </div>

                  {/* DONOR DETAILS */}
                  <div style={styles.details}>
                    <p style={styles.age}>
                      <strong>Age: </strong>
                      {donor.age}
                    </p>

                    <p style={styles.detailText}>
                      <strong>Blood Group:</strong> {donor.bloodGroup}
                    </p>

                    <p style={styles.detailText}>
                      <strong>Address:</strong> {donor.address}
                    </p>

                    <p style={styles.detailText}>
                      <strong>Contact:</strong> {donor.contact}
                    </p>
                  </div>

                  {/* CONTACT BUTTON */}
                  <button
                    type="button"
                    style={styles.button}
                    onClick={() => handleContactDonor(donor._id)}
                  >
                    Contact Donor
                  </button>
                </div>
              ))}
            </div>

            {/* ==================================================
                PAGINATION
            ================================================== */}

            {totalPages > 1 && (
              <div style={styles.pagination}>
                {/* PREVIOUS */}
                <button
                  type="button"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  style={{
                    ...styles.pageButton,
                    ...(currentPage === 1
                      ? styles.disabledButton
                      : styles.activeButton),
                  }}
                >
                  −
                </button>

                {/* CURRENT PAGE */}
                <div style={styles.currentPage}>{currentPage}</div>

                {/* NEXT */}
                <button
                  type="button"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  style={{
                    ...styles.pageButton,
                    ...(currentPage === totalPages
                      ? styles.disabledButton
                      : styles.activeButton),
                  }}
                >
                  +
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    padding: "45px 5%",
    backgroundColor: "#fffafa",
  },

  header: {
    textAlign: "center",
    marginBottom: "40px",
  },

  title: {
    margin: "0 0 10px",
    color: "#18181b",
    fontSize: "40px",
  },

  subtitle: {
    margin: 0,
    color: "#71717a",
    fontSize: "16px",
  },

  grid: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    columnGap: "30px",
    rowGap: "30px",
  },

  card: {
    padding: "28px",
    borderRadius: "18px",
    backgroundColor: "#ffffff",
    border: "1px solid #f1d5d9",
    boxShadow: "0 10px 28px rgba(0,0,0,0.06)",
    boxSizing: "border-box",
  },

  cardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "20px",
    marginBottom: "24px",
  },

  profile: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },

  donorImage: {
    width: "100px",
    height: "90px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "3px solid #ffe4e6",
    marginBottom: "12px",
  },

  name: {
    margin: "0 0 5px",
    color: "#18181b",
    fontSize: "22px",
    textAlign: "center",
  },

  age: {
    margin: 0,
    color: "#52525b",
    fontSize: "14px",
  },

  details: {
    marginBottom: "22px",
  },

  detailText: {
    margin: "10px 0",
    color: "#52525b",
    fontSize: "15px",
    lineHeight: "1.5",
  },

  button: {
    width: "100%",
    padding: "13px",
    border: "none",
    borderRadius: "10px",
    backgroundColor: "#e0002b",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
  },

  // ==========================================================
  // PAGINATION STYLES
  // ==========================================================

  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "12px",
    marginTop: "40px",
    marginBottom: "20px",
  },

  pageButton: {
    width: "45px",
    height: "45px",
    borderRadius: "10px",
    border: "none",
    fontSize: "24px",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "0.2s",
  },

  activeButton: {
    backgroundColor: "#e0002ded",
    color: "#ffffff",
    cursor: "pointer",
    boxShadow: "0 5px 12px rgba(224, 0, 43, 0.2)",
  },

  disabledButton: {
    backgroundColor: "#e1e4e8",
    color: "#9ca3af",
    cursor: "not-allowed",
  },

  currentPage: {
    width: "45px",
    height: "45px",
    borderRadius: "12px",
    border: "1px solid #dddddd",
    backgroundColor: "#ffffff",
    color: "#18181b",
    fontSize: "20px",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
  },

  loading: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#e0002b",
    fontSize: "20px",
    fontWeight: "700",
  },

  error: {
    maxWidth: "1200px",
    margin: "0 auto 25px",
    textAlign: "center",
    color: "#dc2626",
    fontWeight: "600",
  },

  noDonors: {
    textAlign: "center",
    color: "#71717a",
    fontSize: "17px",
  },
};

export default Donors;
