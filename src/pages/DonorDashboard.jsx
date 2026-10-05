import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaTint,
  FaSignOutAlt,
  FaUser,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaClipboardList,
  FaCheck,
  FaTimes,
  FaCommentDots,
} from "react-icons/fa";

const DonorDashboard = () => {
  const navigate = useNavigate();

  // STATES

  const [donorDetails, setDonorDetails] = useState(null);
  const [requests, setRequests] = useState([]);
  const [feedback, setFeedback] = useState([]);

  // My Donation state
  const [myDonations, setMyDonations] = useState([]);
  const [myDonationLoading, setMyDonationLoading] = useState(false);

  const [activeMenu, setActiveMenu] = useState("dashboard");

  const [loading, setLoading] = useState(true);
  const [requestLoading, setRequestLoading] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [updatingRequest, setUpdatingRequest] = useState(null);

  // SIMPLE PAGINATION
  const [count, setCount] = useState(1);

  const requestsPerPage = 4;

  const totalPages = Math.ceil(requests.length / requestsPerPage);

  const currentPage = totalPages === 0 ? 1 : Math.min(count, totalPages);

  const startIndex = (currentPage - 1) * requestsPerPage;

  const endIndex = startIndex + requestsPerPage;

  const paginatedRequests = requests.slice(startIndex, endIndex);

  // PAGINATION

  const handleIncrement = () => {
    setCount((previousCount) => {
      if (previousCount < totalPages) {
        return previousCount + 1;
      }

      return previousCount;
    });
  };

  const handleDecrement = () => {
    setCount((previousCount) => {
      if (previousCount > 1) {
        return previousCount - 1;
      }

      return previousCount;
    });
  };

  // ==========================================================
  // GET DONOR TOKEN
  // ==========================================================

  const getToken = () => {
    return localStorage.getItem("donorToken");
  };

  // ==========================================================
  // LOGOUT
  // ==========================================================

  const handleLogout = () => {
    localStorage.removeItem("donorToken");
    localStorage.removeItem("donorEmail");

    navigate("/donor-login");
  };

  // FETCH DONOR DETAILS

  const fetchDonorDetails = async () => {
    try {
      const token = getToken();

      if (!token) {
        navigate("/donor-login");
        return;
      }

      const response = await axios.get(
        "http://localhost:5001/api/mydonor-details",
        {
          headers: {
            token: token,
          },
        },
      );

      console.log("Donor Details:", response.data);

      if (response.data.success) {
        setDonorDetails(response.data.data);
      }
    } catch (error) {
      console.error(
        "Donor Details Error:",
        error.response?.data || error.message,
      );

      if (error.response?.status === 401 || error.response?.status === 403) {
        handleLogout();
      }
    }
  };

  // ==========================================================
  // FETCH REQUESTS
  // ==========================================================

  const fetchRequests = async () => {
    try {
      const token = getToken();

      if (!token) {
        navigate("/donor-login");
        return;
      }

      setRequestLoading(true);

      const response = await axios.get(
        "http://localhost:5001/api/donor-requests",
        {
          headers: {
            token: token,
          },
        },
      );

      console.log("Api message", response.data.message);
      console.log("request data", response.data.data);

      if (response.data.message === "Donor requests found (from cache)") {
        console.log("DATA CAME FROM REDIS");
      } else {
        console.log("DATA CAME FROM MONGODB");
      }

      if (response.data.success) {
        setRequests(response.data.data || []);
      } else {
        setRequests([]);
      }
    } catch (error) {
      console.error("Requests Error:", error.response?.data || error.message);

      if (error.response?.status === 401 || error.response?.status === 403) {
        handleLogout();
      }
    } finally {
      setRequestLoading(false);
    }
  };

  // FETCH DONOR FEEDBACK

  const fetchDonorFeedback = async () => {
    try {
      const token = getToken();

      if (!token) {
        navigate("/donor-login");
        return;
      }

      setFeedbackLoading(true);

      const response = await axios.get(
        "http://localhost:5001/api/getDonorFeedback",
        {
          headers: {
            token: token,
          },
        },
      );

      console.log("Donor Feedback:", response.data);

      if (response.data.success) {
        setFeedback(response.data.data || []);
      } else {
        setFeedback([]);
      }
    } catch (error) {
      console.error("Feedback Error:", error.response?.data || error.message);

      if (error.response?.status === 401 || error.response?.status === 403) {
        handleLogout();
      }

      setFeedback([]);
    } finally {
      setFeedbackLoading(false);
    }
  };

  // FETCH MY DONATIONS

  const fetchMyDonations = async () => {
    try {
      const token = getToken();

      if (!token) {
        navigate("/donor-login");
        return;
      }

      setMyDonationLoading(true);

      const response = await axios.get(
        "http://localhost:5001/api/my-donations",
        {
          headers: {
            token: token,
          },
        },
      );

      console.log("My Donations:", response.data);

      if (response.data.success) {
        setMyDonations(response.data.data || []);
      } else {
        setMyDonations([]);
      }
    } catch (error) {
      console.error(
        "My Donations Error:",
        error.response?.data || error.message,
      );

      if (error.response?.status === 401 || error.response?.status === 403) {
        handleLogout();
      }

      setMyDonations([]);
    } finally {
      setMyDonationLoading(false);
    }
  };

  // GET FEEDBACK FOR REQUEST

  const getFeedbackForRequest = (requestId) => {
    if (!requestId) {
      return null;
    }

    return (
      feedback.find((item) => {
        const feedbackRequestId = item.requestId?._id || item.requestId;

        return String(feedbackRequestId) === String(requestId);
      }) || null
    );
  };

  // INITIAL DASHBOARD LOAD

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const token = getToken();

        if (!token) {
          navigate("/donor-login");
          return;
        }

        await Promise.all([
          fetchDonorDetails(),
          fetchRequests(),
          fetchDonorFeedback(),
        ]);
      } catch (error) {
        console.error("Dashboard Error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [navigate]);

  // UPDATE REQUEST STATUS

  const updateRequestStatus = async (requestId, status) => {
    try {
      const token = getToken();

      if (!token) {
        navigate("/donor-login");
        return;
      }

      setUpdatingRequest(requestId);

      const response = await axios.patch(
        `http://localhost:5001/api/${requestId}/status`,
        {
          status: status,
        },
        {
          headers: {
            token: token,
          },
        },
      );

      console.log("Status Update:", response.data);

      if (response.data.success) {
        setRequests((previousRequests) =>
          previousRequests.map((request) =>
            request._id === requestId
              ? {
                  ...request,
                  status: status,
                }
              : request,
          ),
        );

        await fetchDonorFeedback();
      }
    } catch (error) {
      console.error(
        "Update Status Error:",
        error.response?.data || error.message,
      );

      alert(error.response?.data?.message || "Unable to update request status");
    } finally {
      setUpdatingRequest(null);
    }
  };

  // MENU CHANGE

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);

    if (menu === "requests") {
      setCount(1);
      fetchRequests();
      fetchDonorFeedback();
    }

    if (menu === "dashboard") {
      fetchRequests();
      fetchDonorFeedback();
    }

    if (menu === "myDonation") {
      fetchMyDonations();
    }

    if (menu === "profile") {
      fetchDonorDetails();
    }
  };

  // ==========================================================
  // REQUEST COUNTS
  // ==========================================================

  const totalCount = requests.length;

  const pendingCount = requests.filter(
    (request) => String(request.status).toLowerCase() === "pending",
  ).length;

  const acceptedCount = requests.filter(
    (request) => String(request.status).toLowerCase() === "accepted",
  ).length;

  const rejectedCount = requests.filter(
    (request) => String(request.status).toLowerCase() === "rejected",
  ).length;

  // ==========================================================
  // STATUS STYLE
  // ==========================================================

  const getStatusStyle = (status) => {
    const currentStatus = String(status || "").toLowerCase();

    if (currentStatus === "accepted") {
      return styles.acceptedBadge;
    }

    if (currentStatus === "rejected") {
      return styles.rejectedBadge;
    }

    if (currentStatus === "completed") {
      return styles.completedBadge;
    }

    return styles.pendingBadge;
  };

  // ==========================================================
  // STATUS ICON
  // ==========================================================

  const getStatusIcon = (status) => {
    const currentStatus = String(status || "").toLowerCase();

    if (currentStatus === "accepted") {
      return <FaCheckCircle />;
    }

    if (currentStatus === "rejected") {
      return <FaTimesCircle />;
    }

    if (currentStatus === "completed") {
      return <FaCheckCircle />;
    }

    return <FaClock />;
  };

  // ==========================================================
  // FORMAT DATE
  // ==========================================================

  const formatDate = (date) => {
    if (!date) {
      return "Date not available";
    }

    try {
      return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "Date not available";
    }
  };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div style={styles.loading}>
        <FaTint style={styles.loadingIcon} />

        <p>Loading donor dashboard...</p>
      </div>
    );
  }

  // ==========================================================
  // DASHBOARD
  // ==========================================================

  return (
    <div style={styles.page}>
      {/* ====================================================
          SIDEBAR
      ==================================================== */}

      <aside style={styles.sidebar}>
        <div>
          {/* LOGO */}

          <div style={styles.logo}>
            <FaTint />
            <span>LifeLine</span>
          </div>

          <hr style={styles.sidebarLine} />

          {/* DASHBOARD */}

          <button
            type="button"
            onClick={() => handleMenuClick("dashboard")}
            style={
              activeMenu === "dashboard" ? styles.activeMenu : styles.menuButton
            }
          >
            <span>Dashboard</span>
          </button>

          {/* REQUESTS */}

          <button
            type="button"
            onClick={() => handleMenuClick("requests")}
            style={
              activeMenu === "requests" ? styles.activeMenu : styles.menuButton
            }
          >
            <span>Requests</span>

            {pendingCount > 0 && (
              <span style={styles.menuCount}>{pendingCount}</span>
            )}
          </button>

          {/* MY DONATION */}

          <button
            type="button"
            onClick={() => handleMenuClick("myDonation")}
            style={
              activeMenu === "myDonation"
                ? styles.activeMenu
                : styles.menuButton
            }
          >
            <span>Completed</span>
          </button>

          {/* PROFILE */}

          <button
            type="button"
            onClick={() => handleMenuClick("profile")}
            style={
              activeMenu === "profile" ? styles.activeMenu : styles.menuButton
            }
          >
            <span>Profile</span>
          </button>
        </div>

        {/* LOGOUT */}

        <button
          type="button"
          style={styles.logoutButton}
          onClick={handleLogout}
        >
          <FaSignOutAlt />

          <span>Logout</span>
        </button>
      </aside>

      {/* ======================================================
          MAIN CONTENT
      ====================================================== */}

      <main style={styles.mainContent}>
        {/* ====================================================
            DASHBOARD
        ==================================================== */}

        {activeMenu === "dashboard" && (
          <>
            {/* HEADER */}

            <div style={styles.header}>
              <h1 style={styles.title}>Donor Dashboard</h1>

              <p style={styles.subtitle}>
                View your request statistics and blood requests.
              </p>
            </div>

            {/* =================================================
                STATISTICS
            ================================================= */}

            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <div>
                  <p style={styles.statLabel}>Total Requests</p>

                  <h2 style={styles.statNumber}>{totalCount}</h2>
                </div>
              </div>

              <div style={styles.statCard}>
                <div>
                  <p style={styles.statLabel}>Pending</p>

                  <h2 style={styles.statNumber}>{pendingCount}</h2>
                </div>
              </div>

              <div style={styles.statCard}>
                <div>
                  <p style={styles.statLabel}>Accepted</p>

                  <h2 style={styles.statNumber}>{acceptedCount}</h2>
                </div>
              </div>

              <div style={styles.statCard}>
                <div>
                  <p style={styles.statLabel}>Rejected</p>

                  <h2 style={styles.statNumber}>{rejectedCount}</h2>
                </div>
              </div>
            </div>

            {/* =================================================
                RECENT REQUESTS
            ================================================= */}

            <div style={styles.dashboardRequestsCard}>
              <div style={styles.sectionHeader}>
                <div>
                  <h2 style={styles.sectionTitle}>Blood Requests</h2>

                  <p style={styles.sectionSubtitle}>Requests assigned to you</p>
                </div>
              </div>

              {requests.length === 0 ? (
                <div style={styles.emptyBox}>
                  <h3>No Requests Found</h3>

                  <p>There are no blood requests assigned to you.</p>
                </div>
              ) : (
                <div style={styles.miniRequestList}>
                  {requests.slice(0, 5).map((request) => (
                    <div key={request._id} style={styles.miniRequest}>
                      <div style={styles.miniRequestContent}>
                        <strong>{request.userName || "User Request"}</strong>

                        <span>
                          {request.location || "Location not available"}
                        </span>
                      </div>

                      <span style={getStatusStyle(request.status)}>
                        {getStatusIcon(request.status)}

                        {request.status || "pending"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* ====================================================
            REQUESTS PAGE
        ==================================================== */}

        {activeMenu === "requests" && (
          <>
            {/* HEADER */}

            <div style={styles.header}>
              <div style={styles.requestHeaderRow}>
                <div>
                  <h1 style={styles.title}>Blood Requests</h1>
                </div>
              </div>
            </div>

            <div style={styles.requestsContainer}>
              {requestLoading ? (
                <div style={styles.requestLoading}>
                  <FaTint style={styles.loadingIcon} />

                  <p>Loading requests from MongoDB...</p>
                </div>
              ) : requests.length === 0 ? (
                <div style={styles.emptyBox}>
                  <FaClipboardList style={styles.emptyIcon} />

                  <h2>No Blood Requests</h2>

                  <p>No requests have been assigned to this donor yet.</p>
                </div>
              ) : (
                <>
                  {/* CURRENT PAGE REQUESTS */}

                  <div style={styles.requestsGrid}>
                    {paginatedRequests.map((request) => {
                      const requestFeedback = getFeedbackForRequest(
                        request._id,
                      );

                      const currentStatus = String(
                        request.status || "",
                      ).toLowerCase();

                      return (
                        <div key={request._id} style={styles.requestCard}>
                          {/* REQUEST TOP */}

                          <div style={styles.requestTop}>
                            <div style={styles.requestUser}>
                              <div style={styles.userIcon}>
                                {request.userId?.image ? (
                                  <img
                                    src={`https://res.cloudinary.com/a7dja13r/image/upload/${request.userId.image}`}
                                    alt={request.userName || "User"}
                                    style={styles.userImage}
                                    onError={(e) => {
                                      e.currentTarget.style.display = "none";
                                    }}
                                  />
                                ) : (
                                  <FaUser />
                                )}
                              </div>

                              <div>
                                <h3 style={styles.requestName}>
                                  {request.userName || "Unknown User"}
                                </h3>

                                <span style={styles.requestDate}>
                                  {formatDate(request.createdAt)}
                                </span>
                              </div>
                            </div>

                            <span style={getStatusStyle(request.status)}>
                              {getStatusIcon(request.status)}

                              {request.status || "pending"}
                            </span>
                          </div>

                          {/* REQUEST DETAILS */}

                          <div style={styles.requestDetails}>
                            {/* AGE */}

                            <div style={styles.detailItem}>
                              <div style={styles.detailContent}>
                                <span>Age</span>

                                <strong>{request.age || "-"} Years</strong>
                              </div>
                            </div>

                            {/* LOCATION */}

                            <div style={styles.detailItem}>
                              <div style={styles.detailContent}>
                                <span>Location</span>

                                <strong>
                                  {request.location || "Not available"}
                                </strong>
                              </div>
                            </div>

                            {/* CONTACT */}

                            <div style={styles.detailItem}>
                              <div style={styles.detailContent}>
                                <span>Contact</span>

                                <strong>
                                  {request.contact || "Not available"}
                                </strong>
                              </div>
                            </div>
                          </div>

                          {/* REQUEST MESSAGE */}

                          <div style={styles.messageBox}>
                            <div style={styles.messageTitle}>
                              <span>Request Message</span>
                            </div>

                            <p>
                              {request.description || "No message provided."}
                            </p>
                          </div>

                          {/* ACCEPT / REJECT */}

                          {currentStatus === "pending" && (
                            <div style={styles.actionButtons}>
                              <button
                                type="button"
                                style={styles.acceptButton}
                                disabled={updatingRequest === request._id}
                                onClick={() =>
                                  updateRequestStatus(request._id, "accepted")
                                }
                              >
                                <FaCheck />

                                {updatingRequest === request._id
                                  ? "Updating..."
                                  : "Accept"}
                              </button>

                              <button
                                type="button"
                                style={styles.rejectButton}
                                disabled={updatingRequest === request._id}
                                onClick={() =>
                                  updateRequestStatus(request._id, "rejected")
                                }
                              >
                                <FaTimes />
                                Reject
                              </button>
                            </div>
                          )}

                          {/* ACCEPTED */}

                          {currentStatus === "accepted" && (
                            <div style={styles.acceptedMessage}>
                              <FaCheckCircle />

                              <span>You accepted this blood request.</span>
                            </div>
                          )}

                          {/* COMPLETED */}

                          {currentStatus === "completed" && (
                            <div style={styles.completedMessage}>
                              <FaCheckCircle />

                              <span>Donation completed successfully.</span>
                            </div>
                          )}

                          {/* USER FEEDBACK */}

                          {currentStatus === "completed" && requestFeedback && (
                            <div style={styles.feedbackBox}>
                              <div style={styles.feedbackHeader}>
                                <div style={styles.feedbackTitle}>
                                  <span>User Feedback</span>
                                </div>

                                <span style={styles.feedbackDate}>
                                  {formatDate(requestFeedback.createdAt)}
                                </span>
                              </div>

                              {/* USER */}

                              <div style={styles.feedbackUser}>
                                <div>
                                  <strong>
                                    {requestFeedback.userId?.name ||
                                      requestFeedback.requestId?.userName ||
                                      "User"}
                                  </strong>
                                </div>
                              </div>

                              {/* MESSAGE */}

                              <div style={styles.feedbackMessage}>
                                "{requestFeedback.message}"
                              </div>
                            </div>
                          )}

                          {/* NO FEEDBACK */}

                          {currentStatus === "completed" &&
                            !requestFeedback &&
                            !feedbackLoading && (
                              <div style={styles.noFeedbackBox}>
                                <FaCommentDots />

                                <span>No feedback received yet.</span>
                              </div>
                            )}

                          {/* REJECTED */}

                          {currentStatus === "rejected" && (
                            <div style={styles.rejectedMessage}>
                              <FaTimesCircle />

                              <span>You rejected this blood request.</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* SIMPLE PAGINATION */}

                  {totalPages > 1 && (
                    <div style={styles.pagenation}>
                      <div style={styles.btn}>
                        <button
                          type="button"
                          onClick={handleDecrement}
                          disabled={currentPage === 1}
                          style={
                            currentPage === 1
                              ? styles.pageButtonDisabled
                              : styles.pageButton
                          }
                        >
                          -
                        </button>

                        <p style={styles.pageNumber}>{currentPage}</p>

                        <button
                          type="button"
                          onClick={handleIncrement}
                          disabled={currentPage === totalPages}
                          style={
                            currentPage === totalPages
                              ? styles.pageButtonDisabled
                              : styles.pageButton
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        )}

        {/* ====================================================
            MY DONATION PAGE
        ==================================================== */}

        {activeMenu === "myDonation" && (
          <>
            {/* HEADER */}

            <div style={styles.header}>
              <div style={styles.requestHeaderRow}>
                <div>
                  <h1 style={styles.title}>My Donation</h1>

                  <p style={styles.subtitle}>
                    View your completed blood donations.
                  </p>
                </div>
              </div>
            </div>

            {/* DONATIONS */}

            <div style={styles.requestsContainer}>
              {myDonationLoading ? (
                <div style={styles.requestLoading}>
                  <FaTint style={styles.loadingIcon} />

                  <p>Loading completed donations...</p>
                </div>
              ) : myDonations.length === 0 ? (
                <div style={styles.emptyBox}>
                  <FaTint style={styles.emptyIcon} />

                  <h2>No Completed Donations</h2>

                  <p>Your completed donations will appear here.</p>
                </div>
              ) : (
                <div style={styles.donationList}>
                  {myDonations.map((donation) => (
                    <div key={donation._id} style={styles.donationCard}>
                      {/* USER IMAGE */}

                      <div style={styles.donationUserIcon}>
                        {donation.userId?.image ? (
                          <img
                            src={`https://res.cloudinary.com/a7dja13r/image/upload/${donation.userId.image}`}
                            alt="User"
                            style={styles.donationUserImage}
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <FaUser />
                        )}
                      </div>

                      <div style={styles.donationUserInfo}>
                        <strong>
                          {donation.userName || donation.userId?.name || "User"}
                        </strong>

                        <span>Completed</span>
                      </div>

                      <div style={styles.donationCompletedBadge}>
                        <FaCheckCircle />
                        Completed
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* ====================================================
            PROFILE PAGE
        ==================================================== */}

        {activeMenu === "profile" && (
          <>
            {/* HEADER */}

            <div style={styles.header}>
              <h1 style={styles.title}>My Profile</h1>

              <p style={styles.subtitle}>View your profile information.</p>
            </div>

            {donorDetails ? (
              <div style={styles.profilePageCard}>
                {/* PROFILE IMAGE */}

                <div style={styles.profilePageImageBox}>
                  {donorDetails.image ? (
                    <img
                      src={`https://res.cloudinary.com/a7dja13r/image/upload/${donorDetails.image}`}
                      alt="Donor"
                      style={styles.profilePageImage}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <FaUser style={styles.profilePageDefaultIcon} />
                  )}
                </div>

                {/* NAME */}

                <h2 style={styles.profilePageName}>
                  {donorDetails.donorName || "Donor"}
                </h2>

                <p style={styles.profilePageRole}>Blood Donor</p>

                {/* PROFILE DETAILS */}

                <div style={styles.profileDetailsGrid}>
                  {/* DONOR NAME */}

                  <div style={styles.profileDetailBox}>
                    <span style={styles.profileDetailLabel}>Name</span>

                    <strong style={styles.profileDetailValue}>
                      {donorDetails.donorName || "-"}
                    </strong>
                  </div>

                  {/* BLOOD GROUP */}

                  <div style={styles.profileDetailBox}>
                    <span style={styles.profileDetailLabel}>Blood Group</span>

                    <strong style={styles.profileBloodValue}>
                      {donorDetails.bloodGroup || "-"}
                    </strong>
                  </div>

                  {/* AGE */}

                  <div style={styles.profileDetailBox}>
                    <span style={styles.profileDetailLabel}>Age</span>

                    <strong style={styles.profileDetailValue}>
                      {donorDetails.age || "-"} Years
                    </strong>
                  </div>

                  {/* CONTACT */}

                  <div style={styles.profileDetailBox}>
                    <span style={styles.profileDetailLabel}>Contact</span>

                    <strong style={styles.profileDetailValue}>
                      {donorDetails.contact || "-"}
                    </strong>
                  </div>

                  {/* LOCATION */}

                  <div style={styles.profileDetailBox}>
                    <span style={styles.profileDetailLabel}>Location</span>

                    <strong style={styles.profileDetailValue}>
                      {donorDetails.address || "-"}
                    </strong>
                  </div>

                  {/* STATUS */}
                </div>
              </div>
            ) : (
              <div style={styles.emptyBox}>
                <FaUser style={styles.emptyIcon} />

                <h2>Profile Not Found</h2>

                <p>Unable to load donor profile information.</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

// ==========================================================
// STYLES
// ==========================================================

const styles = {
  // ==========================================================
  // PAGE
  // ==========================================================

  page: {
    minHeight: "100vh",
    backgroundColor: "#f6f8fb",
  },

  // ==========================================================
  // SIDEBAR
  // ==========================================================

  sidebar: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "245px",
    height: "100vh",
    padding: "28px 20px",
    boxSizing: "border-box",
    background: "linear-gradient(180deg, #f55454 0%, #bc2744 100%)",
    color: "#ffffff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    zIndex: 100,
  },

  logo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "25px",
    fontSize: "27px",
    fontWeight: "800",
  },

  sidebarLine: {
    border: "none",
    borderTop: "1px solid rgba(255,255,255,0.25)",
    marginBottom: "20px",
  },

  menuButton: {
    width: "100%",
    border: "none",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "13px 15px",
    marginBottom: "7px",
    borderRadius: "10px",
    backgroundColor: "transparent",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    textAlign: "left",
  },

  activeMenu: {
    width: "100%",
    border: "none",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "13px 15px",
    marginBottom: "7px",
    borderRadius: "10px",
    backgroundColor: "#ffffff",
    color: "#d92929",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    textAlign: "left",
  },

  menuCount: {
    marginLeft: "auto",
    minWidth: "22px",
    height: "22px",
    padding: "0 6px",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "20px",
    backgroundColor: "#ffffff",
    color: "#e8002d",
    fontSize: "11px",
    fontWeight: "800",
  },

  logoutButton: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "9px",
    padding: "13px",
    border: "1px solid rgba(255,255,255,0.55)",
    borderRadius: "10px",
    backgroundColor: "rgba(255,255,255,0.08)",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
  },

  // ==========================================================
  // MAIN
  // ==========================================================

  mainContent: {
    marginLeft: "245px",
    minHeight: "100vh",
    padding: "30px 35px",
    boxSizing: "border-box",
  },

  header: {
    maxWidth: "1250px",
    margin: "0 auto 20px",
  },

  title: {
    margin: 0,
    fontSize: "32px",
    color: "#111827",
  },

  subtitle: {
    margin: "5px 0 0",
    color: "#6b7280",
    fontSize: "14px",
  },

  requestHeaderRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "15px",
  },

  // ==========================================================
  // DASHBOARD PROFILE
  // ==========================================================

  profileCard: {
    maxWidth: "1250px",
    margin: "0 auto 20px",
    padding: "20px 22px",
    display: "grid",
    gridTemplateColumns: "1.5fr 1fr 1fr 1fr",
    alignItems: "center",
    gap: "15px",
    borderRadius: "16px",
    backgroundColor: "#ffffff",
    boxShadow: "0 6px 22px rgba(0,0,0,0.04)",
  },

  profileLeft: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },

  profileImageBox: {
    width: "75px",
    height: "75px",
    flexShrink: 0,
    borderRadius: "50%",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffe4e8",
  },

  profileImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  defaultProfileIcon: {
    fontSize: "30px",
    color: "#e8002d",
  },

  profileLabel: {
    margin: "0 0 3px",
    color: "#9ca3af",
    fontSize: "12px",
  },

  donorName: {
    margin: 0,
    fontSize: "23px",
    color: "#111827",
  },

  locationText: {
    margin: "5px 0 0",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    color: "#6b7280",
    fontSize: "13px",
  },

  profileInfoBox: {
    padding: "13px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    borderRadius: "11px",
    backgroundColor: "#f9fafb",
  },

  bloodInfoBox: {
    padding: "13px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    borderRadius: "11px",
    backgroundColor: "#fff1f3",
  },

  profileInfoIcon: {
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "9px",
    backgroundColor: "#ffe4e8",
    color: "#e8002d",
    fontSize: "14px",
  },

  bloodIconBox: {
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "9px",
    backgroundColor: "#ffe4e8",
    color: "#e8002d",
    fontSize: "14px",
  },

  infoLabel: {
    display: "block",
    marginBottom: "3px",
    color: "#6b7280",
    fontSize: "11px",
  },

  infoValue: {
    color: "#111827",
    fontSize: "14px",
  },

  bloodValue: {
    color: "#e8002d",
    fontSize: "19px",
  },

  // ==========================================================
  // STATISTICS
  // ==========================================================

  statsGrid: {
    maxWidth: "1250px",
    margin: "0 auto 20px",
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "15px",
  },

  statCard: {
    padding: "18px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    borderRadius: "14px",
    backgroundColor: "#ffffff",
    boxShadow: "0 6px 20px rgba(0,0,0,0.035)",
  },

  totalIcon: {
    width: "45px",
    height: "45px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "10px",
    backgroundColor: "#f3f4f6",
    color: "#374151",
  },

  pendingIcon: {
    width: "45px",
    height: "45px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "10px",
    backgroundColor: "#fff7d6",
    color: "#d97706",
  },

  acceptIcon: {
    width: "45px",
    height: "45px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "10px",
    backgroundColor: "#dcfce7",
    color: "#16a34a",
  },

  rejectIcon: {
    width: "45px",
    height: "45px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "10px",
    backgroundColor: "#fee2e2",
    color: "#dc2626",
  },

  statLabel: {
    margin: "0 0 2px",
    color: "#6b7280",
    fontSize: "15px",
  },

  statNumber: {
    margin: 0,
    fontSize: "30px",
    color: "#111827",
  },

  // ==========================================================
  // DASHBOARD REQUESTS
  // ==========================================================

  dashboardRequestsCard: {
    maxWidth: "1250px",
    margin: "0 auto",
    padding: "20px",
    boxSizing: "border-box",
    borderRadius: "16px",
    backgroundColor: "#ffffff",
    boxShadow: "0 6px 22px rgba(0,0,0,0.04)",
  },

  sectionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "15px",
    marginBottom: "15px",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "21px",
    color: "#111827",
  },

  sectionSubtitle: {
    margin: "4px 0 0",
    color: "#6b7280",
    fontSize: "13px",
  },

  viewRequestsButton: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    border: "none",
    borderRadius: "8px",
    padding: "9px 13px",
    backgroundColor: "#e8002d",
    color: "#ffffff",
    fontWeight: "700",
    fontSize: "13px",
    cursor: "pointer",
  },

  miniRequestList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  miniRequest: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px",
    border: "1px solid #eef0f3",
    borderRadius: "10px",
  },

  miniRequestIcon: {
    width: "38px",
    height: "38px",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "9px",
    backgroundColor: "#fff1f3",
    color: "#e8002d",
  },

  miniRequestContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    fontSize: "15px",
  },

  // ==========================================================
  // REQUESTS
  // ==========================================================

  requestsContainer: {
    maxWidth: "1250px",
    margin: "0 auto",
  },

  requestsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "16px",
    alignItems: "start",
  },

  requestCard: {
    padding: "17px",
    borderRadius: "15px",
    backgroundColor: "#ffffff",
    boxShadow: "0 5px 20px rgba(0,0,0,0.04)",
    border: "1px solid #eef0f3",
  },

  requestTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
    paddingBottom: "12px",
    borderBottom: "1px solid #eef0f3",
  },

  requestUser: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    minWidth: 0,
  },

  userIcon: {
    width: "42px",
    height: "42px",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    backgroundColor: "#ffe4e8",
    color: "#e8002d",
    fontSize: "14px",
    overflow: "hidden",
  },

  userImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "50%",
    display: "block",
  },

  requestName: {
    margin: 0,
    fontSize: "16px",
    color: "#111827",
  },

  requestDate: {
    display: "block",
    marginTop: "3px",
    fontSize: "10px",
    color: "#9ca3af",
  },

  pendingBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    padding: "5px 9px",
    borderRadius: "20px",
    backgroundColor: "#fff7d6",
    color: "#b45309",
    fontSize: "10px",
    fontWeight: "800",
    textTransform: "capitalize",
    flexShrink: 0,
  },

  acceptedBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    padding: "5px 9px",
    borderRadius: "20px",
    backgroundColor: "#dcfce7",
    color: "#15803d",
    fontSize: "10px",
    fontWeight: "800",
    textTransform: "capitalize",
    flexShrink: 0,
  },

  rejectedBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    padding: "5px 9px",
    borderRadius: "20px",
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    fontSize: "10px",
    fontWeight: "800",
    textTransform: "capitalize",
    flexShrink: 0,
  },

  completedBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    padding: "5px 9px",
    borderRadius: "20px",
    backgroundColor: "#dcfce7",
    color: "#15803d",
    fontSize: "10px",
    fontWeight: "800",
    textTransform: "capitalize",
    flexShrink: 0,
  },

  requestDetails: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "9px",
    padding: "13px 0",
  },

  detailItem: {
    minWidth: 0,
    display: "flex",
    alignItems: "center",
    gap: "7px",
    padding: "8px",
    borderRadius: "8px",
    backgroundColor: "#f9fafb",
  },

  detailIcon: {
    width: "28px",
    height: "28px",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "7px",
    backgroundColor: "#ffe4e8",
    color: "#e8002d",
    fontSize: "11px",
  },

  detailContent: {
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },

  messageBox: {
    padding: "11px",
    borderRadius: "9px",
    backgroundColor: "#f9fafb",
    marginBottom: "11px",
  },

  messageTitle: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    color: "#374151",
    fontWeight: "700",
    fontSize: "11px",
    marginBottom: "5px",
  },

  actionButtons: {
    display: "flex",
    gap: "8px",
    marginTop: "3px",
  },

  acceptButton: {
    flex: 1,
    border: "none",
    padding: "9px 12px",
    borderRadius: "8px",
    backgroundColor: "#16a34a",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    fontWeight: "700",
    fontSize: "12px",
    cursor: "pointer",
  },

  rejectButton: {
    padding: "9px 15px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#dc2626",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    fontWeight: "700",
    fontSize: "12px",
    cursor: "pointer",
  },

  acceptedMessage: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    padding: "9px 10px",
    borderRadius: "8px",
    backgroundColor: "#f0fdf4",
    color: "#15803d",
    fontSize: "11px",
    fontWeight: "700",
    marginBottom: "10px",
  },

  completedMessage: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    padding: "9px 10px",
    borderRadius: "8px",
    backgroundColor: "#f0fdf4",
    color: "#15803d",
    fontSize: "11px",
    fontWeight: "700",
    marginBottom: "10px",
  },

  rejectedMessage: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    padding: "9px 10px",
    borderRadius: "8px",
    backgroundColor: "#fff5f5",
    color: "#b91c1c",
    fontSize: "11px",
    fontWeight: "700",
    marginBottom: "10px",
  },

  // ==========================================================
  // FEEDBACK
  // ==========================================================

  feedbackBox: {
    marginTop: "10px",
    padding: "12px",
    borderRadius: "10px",
    backgroundColor: "#fff8f9",
    border: "1px solid #ffe1e6",
  },

  feedbackHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
    marginBottom: "9px",
  },

  feedbackTitle: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    color: "#e8002d",
    fontSize: "13px",
    fontWeight: "800",
  },

  feedbackDate: {
    color: "#9ca3af",
    fontSize: "12px",
  },

  feedbackUser: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "8px",
  },

  feedbackMessage: {
    padding: "9px 10px",
    borderRadius: "8px",
    backgroundColor: "#ffffff",
    color: "#374151",
    fontSize: "14px",
    lineHeight: "1.5",
    fontStyle: "italic",
  },

  noFeedbackBox: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    marginTop: "9px",
    padding: "8px 10px",
    borderRadius: "8px",
    backgroundColor: "#f9fafb",
    color: "#9ca3af",
    fontSize: "11px",
  },

  // ==========================================================
  // EMPTY / LOADING
  // ==========================================================

  emptyBox: {
    padding: "45px 20px",
    textAlign: "center",
    color: "#6b7280",
  },

  emptyIcon: {
    fontSize: "40px",
    color: "#d1d5db",
    marginBottom: "8px",
  },

  loading: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#e8002d",
    fontWeight: "700",
  },

  requestLoading: {
    padding: "70px 20px",
    textAlign: "center",
    color: "#e8002d",
    fontWeight: "700",
  },

  loadingIcon: {
    fontSize: "35px",
  },

  // ==========================================================
  // MY DONATION
  // ==========================================================

  donationList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  donationCard: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "16px 18px",
    borderRadius: "12px",
    backgroundColor: "#ffffff",
    border: "1px solid #eef0f3",
    boxShadow: "0 5px 20px rgba(0,0,0,0.04)",
  },

  donationUserIcon: {
    width: "42px",
    height: "42px",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    backgroundColor: "#ffe4e8",
    color: "#e8002d",
    overflow: "hidden",
  },

  donationUserImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "50%",
    display: "block",
  },

  donationUserInfo: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "3px",
  },

  donationCompletedBadge: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "7px 11px",
    borderRadius: "20px",
    backgroundColor: "#dcfce7",
    color: "#15803d",
    fontSize: "11px",
    fontWeight: "800",
  },

  // ==========================================================
  // PROFILE PAGE
  // ==========================================================

  profilePageCard: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "35px",
    boxSizing: "border-box",
    borderRadius: "18px",
    backgroundColor: "#ffffff",
    boxShadow: "0 6px 25px rgba(0,0,0,0.05)",
    border: "1px solid #eef0f3",
    textAlign: "center",
  },

  profilePageImageBox: {
    width: "120px",
    height: "120px",
    margin: "0 auto 15px",
    borderRadius: "50%",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffe4e8",
    border: "4px solid #fff1f3",
  },

  profilePageImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  profilePageDefaultIcon: {
    fontSize: "48px",
    color: "#e8002d",
  },

  profilePageName: {
    margin: "5px 0 3px",
    fontSize: "26px",
    color: "#111827",
  },

  profilePageRole: {
    margin: "0 0 28px",
    color: "#e8002d",
    fontSize: "14px",
    fontWeight: "600",
  },

  profileDetailsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "14px",
    textAlign: "left",
  },

  profileDetailBox: {
    padding: "16px",
    borderRadius: "11px",
    backgroundColor: "#f9fafb",
    border: "1px solid #eef0f3",
  },

  profileDetailLabel: {
    display: "block",
    marginBottom: "6px",
    color: "#6b7280",
    fontSize: "12px",
  },

  profileDetailValue: {
    color: "#111827",
    fontSize: "15px",
  },

  profileBloodValue: {
    color: "#e8002d",
    fontSize: "18px",
    fontWeight: "800",
  },

  // ==========================================================
  // PAGINATION
  // ==========================================================

  pagenation: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "25px",
    marginBottom: "20px",
  },

  btn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    padding: "5px 8px",
    borderRadius: "10px",
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    boxShadow: "0 3px 10px rgba(0,0,0,0.04)",
  },

  pageButton: {
    width: "34px",
    height: "34px",
    border: "none",
    borderRadius: "7px",
    backgroundColor: "#e8002d",
    color: "#ffffff",
    fontSize: "20px",
    fontWeight: "700",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  pageButtonDisabled: {
    width: "34px",
    height: "34px",
    border: "none",
    borderRadius: "7px",
    backgroundColor: "#e5e7eb",
    color: "#9ca3af",
    fontSize: "20px",
    fontWeight: "700",
    cursor: "not-allowed",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  pageNumber: {
    margin: 0,
    minWidth: "25px",
    textAlign: "center",
    color: "#111827",
    fontSize: "15px",
    fontWeight: "700",
  },
};

export default DonorDashboard;
