import { useState, useEffect, useCallback } from "react";
import {
  FaTint,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaMapMarkerAlt,
  FaPhone,
  FaCommentDots,
  FaEye,
  FaPlus,
  FaMinus,
  FaCheck,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";
import Footer from "../components/Footer";

const Status = () => {
  const navigate = useNavigate();

  // ==========================================================
  // REQUEST STATE
  // ==========================================================

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // ==========================================================
  // PAGINATION
  // ==========================================================

  const [page, setPage] = useState(1);

  const limit = 2;

  const [totalPages, setTotalPages] = useState(1);
  const [totalRequests, setTotalRequests] = useState(0);

  // ==========================================================
  // COMPLETE REQUEST STATE
  // ==========================================================

  const [completeLoading, setCompleteLoading] = useState(false);
  const [completeRequest, setCompleteRequest] = useState(null);
  const [completeError, setCompleteError] = useState("");

  // ==========================================================
  // FEEDBACK STATE
  // ==========================================================

  const [feedbackRequest, setFeedbackRequest] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackError, setFeedbackError] = useState("");
  const [feedbackSuccess, setFeedbackSuccess] = useState("");

  // ==========================================================
  // VIEW FEEDBACK STATE
  // ==========================================================

  const [viewFeedback, setViewFeedback] = useState(null);
  const [viewFeedbackLoading, setViewFeedbackLoading] = useState(false);
  const [viewFeedbackError, setViewFeedbackError] = useState("");

  // ==========================================================
  // FEEDBACK MAP
  // ==========================================================

  const [feedbackMap, setFeedbackMap] = useState({});

  // ==========================================================
  // GET USER TOKEN
  // ==========================================================

  const getUserToken = () => {
    return localStorage.getItem("token") || localStorage.getItem("userToken");
  };

  // ==========================================================
  // GET USER REQUESTS
  // ==========================================================

  const getUserRequest = useCallback(async () => {
    try {
      setErrorMessage("");

      const token = getUserToken();

      console.log("User token exists:", !!token);
      console.log("Current page:", page);
      console.log("Limit:", limit);

      // ------------------------------------------------------
      // TOKEN CHECK
      // ------------------------------------------------------

      if (!token) {
        setLoading(false);
        setErrorMessage("Please login first.");
        navigate("/user-login");
        return;
      }

      // ------------------------------------------------------
      // GET USER REQUESTS
      // ------------------------------------------------------

      const response = await axios.get(
        "https://blooddonation-backend-1.onrender.com/api/getUserRequest",
        {
          headers: {
            token: token,
          },
          params: {
            page: page,
            limit: limit,
          },
        },
      );

      console.log("User request response:", response.data);

      if (!response.data?.success) {
        setErrorMessage(
          response.data?.message || "Unable to fetch your blood requests.",
        );

        setRequests([]);
        setTotalRequests(0);
        setTotalPages(1);

        return;
      }

      const userRequests = Array.isArray(response.data.data)
        ? response.data.data
        : [];

      setRequests(userRequests);

      // TOTAL REQUESTS

      const responseTotalRequests = Number(
        response.data.totalRequests ??
          response.data.total ??
          response.data.pagination?.totalRequests ??
          response.data.pagination?.total ??
          0,
      );

      // TOTAL PAGES

      const calculatedPages = Math.max(
        1,
        Math.ceil(responseTotalRequests / limit),
      );

      const responseTotalPages = Math.max(
        1,
        Number(
          response.data.totalPages ??
            response.data.pagination?.totalPages ??
            calculatedPages,
        ),
      );

      setTotalRequests(responseTotalRequests);
      setTotalPages(responseTotalPages);

      console.log("Total Requests:", responseTotalRequests);

      console.log("Total Pages:", responseTotalPages);

      // INVALID PAGE

      if (page > responseTotalPages) {
        setPage(responseTotalPages);
        return;
      }

      // Can give feedback completed donation

      const feedbackRequests = userRequests.filter((request) => {
        const status = String(request?.status || "").toLowerCase();

        return status === "completed"; // only after complite
      });

      if (feedbackRequests.length === 0) {
        return;
      }

      // GET FEEDBACK

      const feedbackResults = await Promise.all(
        feedbackRequests.map(async (request) => {
          try {
            const feedbackResponse = await axios.get(
              `https://blooddonation-backend-1.onrender.com/api/getUserFeedback/${request._id}`,
              {
                headers: {
                  token: token,
                },
              },
            );

            if (feedbackResponse.data?.success) {
              return {
                requestId: request._id,
                feedback: feedbackResponse.data.data || null,
              };
            }

            return {
              requestId: request._id,
              feedback: null,
            };
          } catch (error) {
            if (error.response?.status === 404) {
              return {
                requestId: request._id,
                feedback: null,
              };
            }

            console.error(`Feedback error for ${request._id}:`, error);

            return {
              requestId: request._id,
              feedback: null,
            };
          }
        }),
      );

      // ------------------------------------------------------
      // CREATE FEEDBACK MAP
      // ------------------------------------------------------

      const newFeedbackMap = {};

      feedbackResults.forEach((item) => {
        newFeedbackMap[item.requestId] = item.feedback;
      });

      setFeedbackMap((previousMap) => ({
        ...previousMap,
        ...newFeedbackMap,
      }));
    } catch (error) {
      console.error("Get User Requests Error:", error);

      // ------------------------------------------------------
      // UNAUTHORIZED
      // ------------------------------------------------------

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userToken");

        setErrorMessage("Your session has expired. Please login again.");

        navigate("/user-login");

        return;
      }

      // SERVER ERROR

      if (error.response) {
        setErrorMessage(
          error.response.data?.message ||
            `Request failed with status ${error.response.status}`,
        );
      } else if (error.request) {
        setErrorMessage(
          "Unable to connect to backend server. Please make sure the server is running.",
        );
      } else {
        setErrorMessage("Something went wrong while loading your requests.");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate, page]);

  // ==========================================================
  // LOAD REQUESTS + POLLING
  // ==========================================================

  useEffect(() => {
    setLoading(true);

    getUserRequest();

    const interval = setInterval(() => {
      getUserRequest();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [getUserRequest]);

  // ==========================================================
  // COMPLETE REQUEST
  // ==========================================================

  const handleCompleteRequest = async () => {
    try {
      setCompleteError("");

      if (!completeRequest?._id) {
        setCompleteError("Request information not found.");

        return;
      }

      const token = getUserToken();

      if (!token) {
        navigate("/user-login");
        return;
      }

      setCompleteLoading(true);

      // COMPLETE API

      const response = await axios.patch(
        `https://blooddonation-backend-1.onrender.com/api/${completeRequest._id}/complete`,
        {},
        {
          headers: {
            token: token,
          },
        },
      );

      console.log("Complete request response:", response.data);

      if (response.data?.success) {
        const updatedRequest = response.data.data;

        setRequests((previousRequests) =>
          previousRequests.map((request) =>
            request._id === completeRequest._id
              ? {
                  ...request,
                  ...(updatedRequest || {}),
                  status: "completed",
                }
              : request,
          ),
        );

        setCompleteRequest(null);

        // ----------------------------------------------------
        // REFRESH FROM BACKEND / REDIS
        // ----------------------------------------------------

        await getUserRequest();
      } else {
        setCompleteError(
          response.data?.message || "Unable to complete request.",
        );
      }
    } catch (error) {
      console.error("Complete Request Error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userToken");

        navigate("/user-login");

        return;
      }

      setCompleteError(
        error.response?.data?.message ||
          "Unable to complete the blood request.",
      );
    } finally {
      setCompleteLoading(false);
    }
  };

  // PREVIOUS PAGE

  const handlePreviousPage = () => {
    if (page > 1) {
      setLoading(true);

      setPage((previousPage) => previousPage - 1);
    }
  };

  // ==========================================================
  // NEXT PAGE
  // ==========================================================

  const handleNextPage = () => {
    if (page < totalPages) {
      setLoading(true);

      setPage((previousPage) => previousPage + 1);
    }
  };

  // OPEN FEEDBACK MODAL

  const openFeedbackModal = (request) => {
    setFeedbackRequest(request);
    setFeedbackMessage("");
    setFeedbackError("");
    setFeedbackSuccess("");
  };

  // ==========================================================
  // SUBMIT FEEDBACK
  // ==========================================================

  const submitFeedback = async () => {
    try {
      setFeedbackError("");
      setFeedbackSuccess("");

      // ------------------------------------------------------
      // MESSAGE CHECK
      // ------------------------------------------------------

      if (!feedbackMessage.trim()) {
        setFeedbackError("Please enter your feedback.");

        return;
      }

      // ------------------------------------------------------
      // REQUEST CHECK
      // ------------------------------------------------------

      if (!feedbackRequest?._id) {
        setFeedbackError("Request information not found.");

        return;
      }

      // ------------------------------------------------------
      // TOKEN
      // ------------------------------------------------------

      const token = getUserToken();

      if (!token) {
        navigate("/user-login");
        return;
      }

      setFeedbackLoading(true);

      // ------------------------------------------------------
      // CREATE FEEDBACK
      // ------------------------------------------------------

      const response = await axios.post(
        "https://blooddonation-backend-1.onrender.com/api/createFeedback",
        {
          requestId: feedbackRequest._id,
          message: feedbackMessage.trim(),
        },
        {
          headers: {
            token: token,
          },
        },
      );

      console.log("Feedback response:", response.data);

      // ------------------------------------------------------
      // SUCCESS
      // ------------------------------------------------------

      if (response.data?.success) {
        const createdFeedback = response.data.data;

        setFeedbackSuccess("Feedback submitted successfully.");

        setFeedbackMessage("");

        setFeedbackMap((previousMap) => ({
          ...previousMap,
          [feedbackRequest._id]: createdFeedback,
        }));

        setTimeout(() => {
          setFeedbackRequest(null);
          setFeedbackSuccess("");
        }, 1500);
      } else {
        setFeedbackError(
          response.data?.message || "Unable to submit feedback.",
        );
      }
    } catch (error) {
      console.error("Submit Feedback Error:", error);

      // ------------------------------------------------------
      // ALREADY SUBMITTED
      // ------------------------------------------------------

      if (error.response?.status === 400) {
        setFeedbackError(
          error.response.data?.message ||
            "You have already submitted feedback.",
        );

        return;
      }

      // ------------------------------------------------------
      // UNAUTHORIZED
      // ------------------------------------------------------

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userToken");

        setFeedbackError("Your session has expired. Please login again.");

        setTimeout(() => {
          navigate("/user-login");
        }, 1000);

        return;
      }

      // ------------------------------------------------------
      // SERVER ERROR
      // ------------------------------------------------------

      if (error.response) {
        setFeedbackError(
          error.response.data?.message ||
            `Request failed with status ${error.response.status}`,
        );
      } else if (error.request) {
        setFeedbackError("Unable to connect to backend server.");
      } else {
        setFeedbackError("Something went wrong while submitting feedback.");
      }
    } finally {
      setFeedbackLoading(false);
    }
  };

  // ==========================================================
  // VIEW FEEDBACK
  // ==========================================================

  const handleViewFeedback = async (request) => {
    try {
      setViewFeedbackError("");
      setViewFeedbackLoading(true);

      const token = getUserToken();

      if (!token) {
        navigate("/user-login");
        return;
      }

      // ------------------------------------------------------
      // CHECK EXISTING FEEDBACK
      // ------------------------------------------------------

      const storedFeedback = feedbackMap[request._id];

      if (storedFeedback) {
        setViewFeedback(storedFeedback);
        setViewFeedbackLoading(false);

        return;
      }

      // ------------------------------------------------------
      // GET FEEDBACK
      // ------------------------------------------------------

      const response = await axios.get(
        `https://blooddonation-backend-1.onrender.com/api/getUserFeedback/${request._id}`,
        {
          headers: {
            token: token,
          },
        },
      );

      if (response.data?.success) {
        const feedback = response.data.data;

        setViewFeedback(feedback);

        setFeedbackMap((previousMap) => ({
          ...previousMap,
          [request._id]: feedback,
        }));
      } else {
        setViewFeedbackError(response.data?.message || "Feedback not found.");
      }
    } catch (error) {
      console.error("View Feedback Error:", error);

      if (error.response?.status === 404) {
        setViewFeedbackError("Feedback not found.");
      } else if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userToken");

        navigate("/user-login");
      } else {
        setViewFeedbackError(
          error.response?.data?.message || "Unable to load feedback.",
        );
      }
    } finally {
      setViewFeedbackLoading(false);
    }
  };

  // ==========================================================
  // CLOSE FEEDBACK MODAL
  // ==========================================================

  const closeFeedbackModal = () => {
    if (feedbackLoading) {
      return;
    }

    setFeedbackRequest(null);
    setFeedbackMessage("");
    setFeedbackError("");
    setFeedbackSuccess("");
  };

  // ==========================================================
  // CLOSE VIEW FEEDBACK
  // ==========================================================

  const closeViewFeedback = () => {
    setViewFeedback(null);
    setViewFeedbackError("");
  };

  // FORMAT DATE

  const formatDate = (date) => {
    if (!date) {
      return "Date unavailable";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Date unavailable";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ==========================================================
  // FORMAT STATUS
  // ==========================================================

  const formatStatus = (status) => {
    const normalizedStatus = String(status || "pending").toLowerCase();

    return normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1);
  };

  // ==========================================================
  // NORMALIZE STATUS
  // ==========================================================

  const normalizeStatus = (status) => {
    return String(status || "pending").toLowerCase();
  };

  // ==========================================================
  // STATUS STYLE
  // ==========================================================

  const getStatusStyle = (status) => {
    const normalizedStatus = normalizeStatus(status);

    switch (normalizedStatus) {
      case "accepted":
        return styles.acceptedStatus;

      case "completed":
        return styles.completedStatus;

      case "rejected":
        return styles.rejectedStatus;

      case "pending":
      default:
        return styles.pendingStatus;
    }
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <>
      <Navbar />

      <main style={styles.page}>
        <section style={styles.content}>
          <section style={styles.requestsSection}>
            {/* ==================================================
                HEADER
            ================================================== */}

            <div style={styles.sectionHeader}>
              <div>
                <h1 style={styles.sectionTitle}>My Blood Requests</h1>
              </div>
            </div>

            {/* ==================================================
                LOADING
            ================================================== */}

            {loading && (
              <div style={styles.centerMessage}>
                <FaTint style={styles.loadingIcon} />

                <p>Loading your blood requests...</p>
              </div>
            )}

            {/* ==================================================
                ERROR
            ================================================== */}

            {!loading && errorMessage && (
              <div style={styles.errorBox}>
                <FaTimesCircle />

                <p>{errorMessage}</p>
              </div>
            )}

            {/* ==================================================
                EMPTY
            ================================================== */}

            {!loading && !errorMessage && requests.length === 0 && (
              <div style={styles.emptyBox}>
                <h3>No Blood Requests Yet</h3>
              </div>
            )}

            {/* ==================================================
                REQUEST LIST
            ================================================== */}

            {!loading && !errorMessage && requests.length > 0 && (
              <>
                <div style={styles.requestList}>
                  {requests.map((request) => {
                    // DONOR OBJECT

                    const donor =
                      request?.donorId && typeof request.donorId === "object"
                        ? request.donorId
                        : null;

                    // DONOR NAME

                    const donorName =
                      donor?.donorName || donor?.name || "Donor";

                    // CONTACT

                    const donorContact =
                      donor?.contact ||
                      request?.contact ||
                      "Contact unavailable";

                    // ADDRESS

                    const donorAddress =
                      donor?.address ||
                      donor?.location ||
                      request?.location ||
                      "Location unavailable";

                    // BLOOD GROUP

                    const donorBloodGroup =
                      donor?.bloodGroup || request?.bloodGroup || "N/A";

                    // STATUS

                    const currentStatus = normalizeStatus(request?.status);

                    // FEEDBACK

                    const feedback = feedbackMap[request._id];

                    const hasFeedback = !!feedback;

                    return (
                      <article key={request._id} style={styles.requestCard}>
                        {/* ==================================================
                              REQUEST TOP
                          ================================================== */}

                        <div style={styles.requestTop}>
                          {/* For for donor images */}

                          <div style={styles.donorAvatar}>
                            {donor?.image ? (
                              <img
                                src={`https://res.cloudinary.com/a7dja13r/image/upload/${donor.image}`}
                                alt={donorName}
                                style={styles.donorImage}
                              />
                            ) : (
                              <FaTint />
                            )}
                          </div>
                          <div style={styles.donorDetails}>
                            <h2 style={styles.donorName}>{donorName}</h2>

                            <p style={styles.requestDate}>
                              Requested on {formatDate(request.createdAt)}
                            </p>
                          </div>
                          <span
                            style={{
                              ...styles.statusBadge,
                              ...getStatusStyle(currentStatus),
                            }}
                          >
                            {formatStatus(currentStatus)}
                          </span>
                        </div>

                        {/* ==================================================
                              DONOR DETAILS
                          ================================================== */}

                        <div style={styles.requestDetails}>
                          <p style={styles.requestDetail}>
                            <FaMapMarkerAlt style={styles.requestIcon} />

                            {donorAddress}
                          </p>

                          <p style={styles.requestDetail}>
                            <FaPhone style={styles.requestIcon} />

                            {donorContact}
                          </p>

                          <p style={styles.requestDetail}>
                            <FaTint style={styles.requestIcon} />

                            <span>
                              Blood Group: <strong>{donorBloodGroup}</strong>
                            </span>
                          </p>
                        </div>

                        {/* ==================================================
                              REQUEST MESSAGE
                          ================================================== */}

                        <div style={styles.messageBox}>
                          <p style={styles.messageLabel}>Request Message</p>

                          <p style={styles.messageText}>
                            {request.description || "No message provided."}
                          </p>
                        </div>

                        {/* ==================================================
                              PENDING
                          ================================================== */}

                        {currentStatus === "pending" && (
                          <div style={styles.pendingMessage}>
                            <FaClock />

                            <span>Waiting for donor response</span>
                          </div>
                        )}

                        {/* Accepting fucntion */}

                        {currentStatus === "accepted" && (
                          <>
                            <div style={styles.acceptedMessage}>
                              <FaCheckCircle />

                              <span>Donor accepted your request</span>
                            </div>

                            {/* COMPLETE BUTTON */}

                            <button
                              type="button"
                              style={styles.completeButton}
                              onClick={() => {
                                setCompleteRequest(request);
                                setCompleteError("");
                              }}
                            >
                              <FaCheck />
                              Complete Request
                            </button>
                          </>
                        )}

                        {/* ==================================================
                              COMPLETED
                          ================================================== */}

                        {currentStatus === "completed" && (
                          <>
                            <div style={styles.completedMessage}>
                              <FaCheckCircle />

                              <span>Blood request completed successfully</span>
                            </div>

                            {/* FEEDBACK */}

                            {!hasFeedback ? (
                              <button
                                type="button"
                                style={styles.feedbackButton}
                                onClick={() => openFeedbackModal(request)}
                              >
                                <FaCommentDots />
                                Give Feedback
                              </button>
                            ) : (
                              <div style={styles.feedbackSubmittedSection}>
                                <div style={styles.feedbackSubmitted}>
                                  <FaCheckCircle />

                                  <span>Feedback Submitted</span>
                                </div>

                                <button
                                  type="button"
                                  style={styles.viewFeedbackButton}
                                  onClick={() => handleViewFeedback(request)}
                                >
                                  <FaEye />
                                  View Feedback
                                </button>
                              </div>
                            )}
                          </>
                        )}

                        {/* ==================================================
                              REJECTED
                          ================================================== */}

                        {currentStatus === "rejected" && (
                          <div style={styles.rejectedMessage}>
                            <FaTimesCircle />

                            <span>Donor rejected your request</span>
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>

                {/* ==================================================
                      PAGINATION
                  ================================================== */}

                {totalRequests > 0 && (
                  <div style={styles.pagination}>
                    {/* PREVIOUS */}

                    <button
                      type="button"
                      onClick={handlePreviousPage}
                      disabled={page === 1}
                      aria-label="Previous page"
                      title="Previous page"
                      style={{
                        ...styles.paginationIconButton,
                        ...(page === 1 ? styles.disabledPaginationButton : {}),
                      }}
                    >
                      <FaMinus />
                    </button>

                    {/* CURRENT PAGE */}

                    <div style={styles.currentPageNumber}>{page}</div>

                    {/* NEXT */}

                    <button
                      type="button"
                      onClick={handleNextPage}
                      disabled={page >= totalPages}
                      aria-label="Next page"
                      title="Next page"
                      style={{
                        ...styles.paginationIconButton,
                        ...(page >= totalPages
                          ? styles.disabledPaginationButton
                          : {}),
                      }}
                    >
                      <FaPlus />
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        </section>

        {/* ==========================================================
            COMPLETE CONFIRMATION MODAL
        ========================================================== */}

        {completeRequest && (
          <div style={styles.modalOverlay}>
            <div style={styles.feedbackModal}>
              <h2 style={styles.feedbackTitle}>Complete Blood Request</h2>

              <p style={styles.feedbackSubtitle}>
                Have you received the blood from the donor?
              </p>

              {completeError && (
                <p style={styles.feedbackError}>{completeError}</p>
              )}

              <div style={styles.feedbackActions}>
                <button
                  type="button"
                  style={styles.cancelFeedbackButton}
                  onClick={() => {
                    if (!completeLoading) {
                      setCompleteRequest(null);
                      setCompleteError("");
                    }
                  }}
                  disabled={completeLoading}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  style={styles.completeConfirmButton}
                  onClick={handleCompleteRequest}
                  disabled={completeLoading}
                >
                  {completeLoading ? "Completing..." : "Yes, Complete"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================================
            GIVE FEEDBACK MODAL
        ========================================================== */}

        {feedbackRequest && (
          <div style={styles.modalOverlay}>
            <div style={styles.feedbackModal}>
              <h2 style={styles.feedbackTitle}>Give Feedback</h2>

              <p style={styles.feedbackSubtitle}>
                Share your experience with the donor.
              </p>

              <textarea
                value={feedbackMessage}
                onChange={(e) => setFeedbackMessage(e.target.value)}
                placeholder="Write your feedback..."
                style={styles.feedbackTextarea}
                rows="5"
                disabled={feedbackLoading}
              />

              {feedbackError && (
                <p style={styles.feedbackError}>{feedbackError}</p>
              )}

              {feedbackSuccess && (
                <p style={styles.feedbackSuccess}>{feedbackSuccess}</p>
              )}

              <div style={styles.feedbackActions}>
                <button
                  type="button"
                  style={styles.cancelFeedbackButton}
                  onClick={closeFeedbackModal}
                  disabled={feedbackLoading}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  style={styles.submitFeedbackButton}
                  onClick={submitFeedback}
                  disabled={feedbackLoading}
                >
                  {feedbackLoading ? "Submitting..." : "Submit Feedback"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================================
            VIEW FEEDBACK MODAL
        ========================================================== */}

        {viewFeedback && (
          <div style={styles.modalOverlay}>
            <div style={styles.feedbackModal}>
              <h2 style={styles.feedbackTitle}>Your Feedback</h2>

              <p style={styles.feedbackSubtitle}>
                Feedback you submitted to the donor.
              </p>

              <div style={styles.viewFeedbackDonor}>
                <FaTint />

                <div>
                  <strong>{viewFeedback.donorId?.donorName || "Donor"}</strong>

                  <p>
                    Blood Group: {viewFeedback.donorId?.bloodGroup || "N/A"}
                  </p>
                </div>
              </div>

              <div style={styles.viewFeedbackBox}>
                <p style={styles.viewFeedbackLabel}>Your Feedback</p>

                <p style={styles.viewFeedbackMessage}>
                  {viewFeedback.message || "No feedback message."}
                </p>
              </div>

              <p style={styles.viewFeedbackDate}>
                Submitted on {formatDate(viewFeedback.createdAt)}
              </p>

              <div style={styles.feedbackActions}>
                <button
                  type="button"
                  style={styles.cancelFeedbackButton}
                  onClick={closeViewFeedback}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================================
            VIEW FEEDBACK LOADING
        ========================================================== */}

        {viewFeedbackLoading && (
          <div style={styles.modalOverlay}>
            <div style={styles.loadingModal}>
              <FaTint style={styles.loadingIcon} />

              <p>Loading feedback...</p>
            </div>
          </div>
        )}

        {/* ==========================================================
            VIEW FEEDBACK ERROR
        ========================================================== */}

        {viewFeedbackError && (
          <div style={styles.modalOverlay}>
            <div style={styles.feedbackModal}>
              <p style={styles.feedbackError}>{viewFeedbackError}</p>

              <div style={styles.feedbackActions}>
                <button
                  type="button"
                  style={styles.cancelFeedbackButton}
                  onClick={() => setViewFeedbackError("")}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
};

// ==========================================================
// STYLES
// ==========================================================

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    color: "#18181b",
  },

  content: {
    width: "100%",
    boxSizing: "border-box",
    padding: "35px 5% 60px",
  },

  requestsSection: {
    width: "100%",
    maxWidth: "1370px",
    margin: "0 auto",
    padding: "28px",
    boxSizing: "border-box",
    borderRadius: "22px",
    backgroundColor: "#ffffff",
    boxShadow: "0 12px 35px rgba(0,0,0,0.055)",
  },

  sectionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    marginBottom: "15px",
  },

  sectionTitle: {
    margin: "0 0 7px",
    color: "#18181b",
    fontSize: "25px",
    fontWeight: "750",
  },

  requestList: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    gap: "20px",
  },

  requestCard: {
    width: "calc(50% - 10px)",
    padding: "22px",
    border: "1px solid #f0d3d7",
    borderRadius: "18px",
    backgroundColor: "#fffafa",
    boxSizing: "border-box",
  },

  requestTop: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    width: "100%",
  },

  donorAvatar: {
    width: "58px",
    height: "58px",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    overflow: "hidden",
    backgroundColor: "#ffe4e6",
    color: "#e0002b",
    fontSize: "22px",
  },

  donorImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  donorDetails: {
    minWidth: 0,
    flex: 1,
  },

  donorName: {
    margin: "0 0 4px",
    color: "#18181b",
    fontSize: "18px",
    fontWeight: "700",
  },

  requestDate: {
    margin: 0,
    color: "#71717a",
    fontSize: "13px",
  },

  statusBadge: {
    marginLeft: "auto",
    flexShrink: 0,
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "800",
    textTransform: "capitalize",
  },

  pendingStatus: {
    backgroundColor: "#fef3c7",
    color: "#b45309",
  },

  acceptedStatus: {
    backgroundColor: "#dcfce7",
    color: "#15803d",
  },

  completedStatus: {
    backgroundColor: "#dbeafe",
    color: "#1d4ed8",
  },

  rejectedStatus: {
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
  },

  requestDetails: {
    marginTop: "17px",
    display: "flex",
    flexDirection: "column",
    gap: "7px",
  },

  requestDetail: {
    margin: 0,
    display: "flex",
    alignItems: "center",
    gap: "9px",
    color: "#52525b",
    fontSize: "14px",
    lineHeight: "1.4",
  },

  requestIcon: {
    color: "#e0002b",
    flexShrink: 0,
    fontSize: "14px",
  },

  // requestId: {
  //   margin: "3px 0 0",
  //   color: "#a1a1aa",
  //   fontSize: "11px",
  //   wordBreak: "break-all",
  // },

  messageBox: {
    marginTop: "16px",
    padding: "14px",
    borderRadius: "12px",
    backgroundColor: "#ffffff",
    boxSizing: "border-box",
  },

  messageLabel: {
    margin: "0 0 6px",
    color: "#71717a",
    fontSize: "11px",
    fontWeight: "700",
  },

  messageText: {
    margin: 0,
    color: "#27272a",
    fontSize: "14px",
    lineHeight: "1.45",
  },

  pendingMessage: {
    marginTop: "16px",
    padding: "11px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    borderRadius: "10px",
    backgroundColor: "#fef3c7",
    color: "#b45309",
    fontSize: "13px",
    fontWeight: "700",
    boxSizing: "border-box",
  },

  acceptedMessage: {
    marginTop: "16px",
    padding: "11px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    borderRadius: "10px",
    backgroundColor: "#dcfce7",
    color: "#15803d",
    fontSize: "13px",
    fontWeight: "700",
    boxSizing: "border-box",
  },

  completedMessage: {
    marginTop: "16px",
    padding: "11px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    borderRadius: "10px",
    backgroundColor: "#dbeafe",
    color: "#1d4ed8",
    fontSize: "13px",
    fontWeight: "700",
    boxSizing: "border-box",
  },

  rejectedMessage: {
    marginTop: "16px",
    padding: "11px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    borderRadius: "10px",
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    fontSize: "13px",
    fontWeight: "700",
    boxSizing: "border-box",
  },

  // ==========================================================
  // COMPLETE BUTTON
  // ==========================================================

  completeButton: {
    marginTop: "10px",
    width: "100%",
    padding: "11px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    border: "none",
    borderRadius: "10px",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
    boxSizing: "border-box",
  },

  completeConfirmButton: {
    padding: "11px 18px",
    border: "none",
    borderRadius: "9px",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
  },

  feedbackButton: {
    marginTop: "10px",
    width: "100%",
    padding: "11px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    border: "none",
    borderRadius: "10px",
    backgroundColor: "#e0002b",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
    boxSizing: "border-box",
  },

  feedbackSubmittedSection: {
    marginTop: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  feedbackSubmitted: {
    padding: "11px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    borderRadius: "10px",
    backgroundColor: "#dcfce7",
    color: "#15803d",
    fontSize: "13px",
    fontWeight: "700",
  },

  viewFeedbackButton: {
    width: "100%",
    padding: "11px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    border: "1px solid #e0002b",
    borderRadius: "10px",
    backgroundColor: "#ffffff",
    color: "#e0002b",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
    boxSizing: "border-box",
  },

  // ==========================================================
  // PAGINATION
  // ==========================================================

  pagination: {
    marginTop: "30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    width: "100%",
  },

  paginationIconButton: {
    width: "44px",
    height: "44px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    borderRadius: "10px",
    backgroundColor: "#e0002b",
    color: "#ffffff",
    fontSize: "16px",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(224,0,43,0.18)",
  },

  disabledPaginationButton: {
    backgroundColor: "#e5e7eb",
    color: "#9ca3af",
    cursor: "not-allowed",
    boxShadow: "none",
  },

  currentPageNumber: {
    width: "44px",
    height: "44px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "10px",
    backgroundColor: "#ffffff",
    color: "#18181b",
    border: "1px solid #e4e4e7",
    fontSize: "15px",
    fontWeight: "800",
    boxSizing: "border-box",
  },

  // ==========================================================
  // LOADING / ERROR / EMPTY
  // ==========================================================

  centerMessage: {
    padding: "60px 20px",
    textAlign: "center",
    color: "#71717a",
  },

  loadingIcon: {
    fontSize: "35px",
    color: "#e0002b",
  },

  loadingModal: {
    width: "100%",
    maxWidth: "350px",
    padding: "35px",
    boxSizing: "border-box",
    borderRadius: "18px",
    backgroundColor: "#ffffff",
    textAlign: "center",
  },

  errorBox: {
    padding: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    borderRadius: "12px",
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    fontWeight: "600",
  },

  emptyBox: {
    padding: "60px 20px",
    textAlign: "center",
    color: "#71717a",
  },

  // Model

  modalOverlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    zIndex: 1000,
  },

  feedbackModal: {
    width: "100%",
    maxWidth: "500px",
    padding: "28px",
    boxSizing: "border-box",
    borderRadius: "18px",
    backgroundColor: "#ffffff",
    boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
  },

  feedbackTitle: {
    margin: "0 0 7px",
    color: "#18181b",
    fontSize: "24px",
    fontWeight: "750",
  },

  feedbackSubtitle: {
    margin: "0 0 20px",
    color: "#71717a",
    fontSize: "14px",
  },

  feedbackTextarea: {
    width: "100%",
    padding: "13px",
    boxSizing: "border-box",
    border: "1px solid #e4e4e7",
    borderRadius: "10px",
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit",
    fontSize: "14px",
    lineHeight: "1.5",
  },

  feedbackError: {
    margin: "10px 0 0",
    color: "#b91c1c",
    fontSize: "13px",
    fontWeight: "600",
  },

  feedbackSuccess: {
    margin: "10px 0 0",
    color: "#15803d",
    fontSize: "13px",
    fontWeight: "600",
  },

  feedbackActions: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
  },

  cancelFeedbackButton: {
    padding: "11px 18px",
    border: "1px solid #e4e4e7",
    borderRadius: "9px",
    backgroundColor: "#ffffff",
    color: "#52525b",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },

  submitFeedbackButton: {
    padding: "11px 18px",
    border: "none",
    borderRadius: "9px",
    backgroundColor: "#e0002b",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
  },

  viewFeedbackDonor: {
    padding: "14px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    borderRadius: "12px",
    backgroundColor: "#fff1f2",
    color: "#e0002b",
    marginBottom: "16px",
  },

  viewFeedbackBox: {
    padding: "18px",
    borderRadius: "12px",
    backgroundColor: "#f8fafc",
    border: "1px solid #e4e4e7",
  },

  viewFeedbackLabel: {
    margin: "0 0 8px",
    color: "#71717a",
    fontSize: "12px",
    fontWeight: "700",
  },

  viewFeedbackMessage: {
    margin: 0,
    color: "#27272a",
    fontSize: "15px",
    lineHeight: "1.6",
  },

  viewFeedbackDate: {
    margin: "14px 0 0",
    color: "#a1a1aa",
    fontSize: "12px",
  },
};

export default Status;
