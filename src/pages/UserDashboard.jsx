// import { useState, useEffect, useCallback } from "react";
// import {
//   FaTint,
//   FaClock,
//   FaCheckCircle,
//   FaTimesCircle,
//   FaMapMarkerAlt,
//   FaPhone,
//   FaSearch,
//   FaCommentDots,
//   FaEye,
// } from "react-icons/fa";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";

// const Status = () => {
//   const navigate = useNavigate();

//   // ==========================================================
//   // REQUEST STATE
//   // ==========================================================

//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [errorMessage, setErrorMessage] = useState("");

//   // ==========================================================
//   // FEEDBACK STATE
//   // ==========================================================

//   const [feedbackRequest, setFeedbackRequest] = useState(null);
//   const [feedbackMessage, setFeedbackMessage] = useState("");
//   const [feedbackLoading, setFeedbackLoading] = useState(false);
//   const [feedbackError, setFeedbackError] = useState("");
//   const [feedbackSuccess, setFeedbackSuccess] = useState("");

//   // ==========================================================
//   // VIEW FEEDBACK STATE
//   // ==========================================================

//   const [viewFeedback, setViewFeedback] = useState(null);
//   const [viewFeedbackLoading, setViewFeedbackLoading] = useState(false);
//   const [viewFeedbackError, setViewFeedbackError] = useState("");

//   // ==========================================================
//   // FEEDBACK MAP
//   // ==========================================================

//   const [feedbackMap, setFeedbackMap] = useState({});

//   // ==========================================================
//   // GET USER TOKEN
//   // ==========================================================

//   const getUserToken = () => {
//     return localStorage.getItem("token") || localStorage.getItem("userToken");
//   };

//   // ==========================================================
//   // GET USER REQUESTS
//   // ==========================================================

//   const getUserRequest = useCallback(async () => {
//     try {
//       setErrorMessage("");

//       const token = getUserToken();

//       console.log("User token exists:", !!token);

//       // TOKEN CHECK
//       if (!token) {
//         setLoading(false);
//         setErrorMessage("Please login first.");
//         navigate("/user-login");
//         return;
//       }

//       // GET USER REQUESTS
//       const response = await axios.get(
//         "https://blooddonation-backend-1.onrender.com/api/getUserRequest",
//         {
//           headers: {
//             token: token,
//           },
//         },
//       );

//       console.log("User request response:", response.data);

//       if (!response.data.success) {
//         setErrorMessage(
//           response.data.message || "Unable to fetch your blood requests.",
//         );
//         return;
//       }

//       const userRequests = response.data.data || [];

//       setRequests(userRequests);

//       // GET FEEDBACK FOR ACCEPTED REQUESTS
//       const acceptedRequests = userRequests.filter(
//         (request) => request.status === "accepted",
//       );

//       if (acceptedRequests.length === 0) {
//         setFeedbackMap({});
//         return;
//       }

//       const feedbackResults = await Promise.all(
//         acceptedRequests.map(async (request) => {
//           try {
//             const feedbackResponse = await axios.get(
//               `https://blooddonation-backend-1.onrender.com/api/getUserFeedback/${request._id}`,
//               {
//                 headers: {
//                   token: token,
//                 },
//               },
//             );

//             if (feedbackResponse.data?.success) {
//               return {
//                 requestId: request._id,
//                 feedback: feedbackResponse.data.data,
//               };
//             }

//             return {
//               requestId: request._id,
//               feedback: null,
//             };
//           } catch (error) {
//             if (error.response?.status === 404) {
//               return {
//                 requestId: request._id,
//                 feedback: null,
//               };
//             }

//             console.error(`Feedback error for ${request._id}:`, error);

//             return {
//               requestId: request._id,
//               feedback: null,
//             };
//           }
//         }),
//       );

//       const newFeedbackMap = {};

//       feedbackResults.forEach((item) => {
//         newFeedbackMap[item.requestId] = item.feedback;
//       });

//       setFeedbackMap(newFeedbackMap);
//     } catch (error) {
//       console.error("Get User Requests Error:", error);

//       // UNAUTHORIZED
//       if (error.response?.status === 401) {
//         localStorage.removeItem("token");
//         localStorage.removeItem("userToken");

//         setErrorMessage("Your session has expired. Please login again.");

//         navigate("/user-login");
//         return;
//       }

//       // SERVER ERROR
//       if (error.response) {
//         setErrorMessage(
//           error.response.data?.message ||
//             `Request failed with status ${error.response.status}`,
//         );
//       } else if (error.request) {
//         setErrorMessage(
//           "Unable to connect to backend server. Please make sure the server is running.",
//         );
//       } else {
//         setErrorMessage("Something went wrong while loading your requests.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   }, [navigate]);

//   // ==========================================================
//   // LOAD REQUESTS
//   // ==========================================================

//   useEffect(() => {
//     getUserRequest();

//     const interval = setInterval(() => {
//       getUserRequest();
//     }, 5000);

//     return () => clearInterval(interval);
//   }, [getUserRequest]);

//   // ==========================================================
//   // OPEN FEEDBACK MODAL
//   // ==========================================================

//   const openFeedbackModal = (request) => {
//     setFeedbackRequest(request);
//     setFeedbackMessage("");
//     setFeedbackError("");
//     setFeedbackSuccess("");
//   };

//   // ==========================================================
//   // SUBMIT FEEDBACK
//   // ==========================================================

//   const submitFeedback = async () => {
//     try {
//       setFeedbackError("");
//       setFeedbackSuccess("");

//       if (!feedbackMessage.trim()) {
//         setFeedbackError("Please enter your feedback.");
//         return;
//       }

//       if (!feedbackRequest?._id) {
//         setFeedbackError("Request information not found.");
//         return;
//       }

//       const token = getUserToken();

//       if (!token) {
//         navigate("/user-login");
//         return;
//       }

//       setFeedbackLoading(true);

//       const response = await axios.post(
//         "https://blooddonation-backend-1.onrender.com/api/createFeedback",
//         {
//           requestId: feedbackRequest._id,
//           message: feedbackMessage.trim(),
//         },
//         {
//           headers: {
//             token: token,
//           },
//         },
//       );

//       console.log("Feedback response:", response.data);

//       if (response.data?.success) {
//         const createdFeedback = response.data.data;

//         setFeedbackSuccess("Feedback submitted successfully.");

//         setFeedbackMessage("");

//         setFeedbackMap((prev) => ({
//           ...prev,
//           [feedbackRequest._id]: createdFeedback,
//         }));

//         setTimeout(() => {
//           setFeedbackRequest(null);
//           setFeedbackSuccess("");
//         }, 1500);
//       } else {
//         setFeedbackError(
//           response.data?.message || "Unable to submit feedback.",
//         );
//       }
//     } catch (error) {
//       console.error("Submit Feedback Error:", error);

//       if (error.response?.status === 400) {
//         setFeedbackError(
//           error.response.data?.message ||
//             "You have already submitted feedback.",
//         );
//         return;
//       }

//       if (error.response?.status === 401) {
//         localStorage.removeItem("token");
//         localStorage.removeItem("userToken");

//         setFeedbackError("Your session has expired. Please login again.");

//         setTimeout(() => {
//           navigate("/user-login");
//         }, 1000);

//         return;
//       }

//       if (error.response) {
//         setFeedbackError(
//           error.response.data?.message ||
//             `Request failed with status ${error.response.status}`,
//         );
//       } else if (error.request) {
//         setFeedbackError("Unable to connect to backend server.");
//       } else {
//         setFeedbackError("Something went wrong while submitting feedback.");
//       }
//     } finally {
//       setFeedbackLoading(false);
//     }
//   };

//   // ==========================================================
//   // VIEW FEEDBACK
//   // ==========================================================

//   const handleViewFeedback = async (request) => {
//     try {
//       setViewFeedbackError("");
//       setViewFeedbackLoading(true);

//       const token = getUserToken();

//       if (!token) {
//         navigate("/user-login");
//         return;
//       }

//       const storedFeedback = feedbackMap[request._id];

//       if (storedFeedback) {
//         setViewFeedback(storedFeedback);
//         setViewFeedbackLoading(false);
//         return;
//       }

//       const response = await axios.get(
//         `https://blooddonation-backend-1.onrender.com/api/getUserFeedback/${request._id}`,
//         {
//           headers: {
//             token: token,
//           },
//         },
//       );

//       if (response.data?.success) {
//         const feedback = response.data.data;

//         setViewFeedback(feedback);

//         setFeedbackMap((prev) => ({
//           ...prev,
//           [request._id]: feedback,
//         }));
//       } else {
//         setViewFeedbackError(response.data?.message || "Feedback not found.");
//       }
//     } catch (error) {
//       console.error("View Feedback Error:", error);

//       if (error.response?.status === 404) {
//         setViewFeedbackError("Feedback not found.");
//       } else if (error.response?.status === 401) {
//         localStorage.removeItem("token");
//         localStorage.removeItem("userToken");

//         navigate("/user-login");
//       } else {
//         setViewFeedbackError(
//           error.response?.data?.message || "Unable to load feedback.",
//         );
//       }
//     } finally {
//       setViewFeedbackLoading(false);
//     }
//   };

//   // ==========================================================
//   // CLOSE FEEDBACK MODAL
//   // ==========================================================

//   const closeFeedbackModal = () => {
//     if (feedbackLoading) {
//       return;
//     }

//     setFeedbackRequest(null);
//     setFeedbackMessage("");
//     setFeedbackError("");
//     setFeedbackSuccess("");
//   };

//   // ==========================================================
//   // CLOSE VIEW FEEDBACK
//   // ==========================================================

//   const closeViewFeedback = () => {
//     setViewFeedback(null);
//     setViewFeedbackError("");
//   };

//   // ==========================================================
//   // FORMAT DATE
//   // ==========================================================

//   const formatDate = (date) => {
//     if (!date) {
//       return "Date unavailable";
//     }

//     const parsedDate = new Date(date);

//     if (Number.isNaN(parsedDate.getTime())) {
//       return "Date unavailable";
//     }

//     return parsedDate.toLocaleDateString("en-IN", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     });
//   };

//   // ==========================================================
//   // FORMAT STATUS
//   // ==========================================================

//   const formatStatus = (status) => {
//     if (!status) {
//       return "Pending";
//     }

//     return status.charAt(0).toUpperCase() + status.slice(1);
//   };

//   // ==========================================================
//   // STATUS STYLE
//   // ==========================================================

//   const getStatusStyle = (status) => {
//     switch (status) {
//       case "accepted":
//         return styles.acceptedStatus;

//       case "rejected":
//         return styles.rejectedStatus;

//       case "pending":
//       default:
//         return styles.pendingStatus;
//     }
//   };

//   // ==========================================================
//   // RENDER
//   // ==========================================================

//   return (
//     <main style={styles.page}>
//       <section style={styles.content}>
//         <section style={styles.requestsSection}>
//           <div style={styles.sectionHeader}>
//             <div>
//               <h1 style={styles.sectionTitle}>My Blood Requests</h1>

//               <p style={styles.sectionText}>
//                 View the latest status of requests sent to donors.
//               </p>
//             </div>

//             <Link to="/donors" style={styles.findDonorButton}>
//               <FaSearch />
//               Find Donor
//             </Link>
//           </div>

//           {loading && (
//             <div style={styles.centerMessage}>
//               <FaTint style={styles.loadingIcon} />
//               <p>Loading your blood requests...</p>
//             </div>
//           )}

//           {!loading && errorMessage && (
//             <div style={styles.errorBox}>
//               <FaTimesCircle />
//               <p>{errorMessage}</p>
//             </div>
//           )}

//           {!loading && !errorMessage && requests.length === 0 && (
//             <div style={styles.emptyBox}>
//               <FaTint style={styles.emptyIcon} />

//               <h3>No Blood Requests Yet</h3>

//               <p>You have not sent any blood requests.</p>

//               <Link to="/donors" style={styles.emptyButton}>
//                 <FaSearch />
//                 Find a Donor
//               </Link>
//             </div>
//           )}

//           {!loading && !errorMessage && requests.length > 0 && (
//             <div style={styles.requestList}>
//               {requests.map((request) => {
//                 const donor =
//                   request.donorId && typeof request.donorId === "object"
//                     ? request.donorId
//                     : null;

//                 const donorName = donor?.donorName || "Donor";

//                 const donorContact =
//                   donor?.contact || request.contact || "Contact unavailable";

//                 const donorAddress =
//                   donor?.address ||
//                   request.location ||
//                   "Location unavailable";

//                 const donorBloodGroup =
//                   donor?.bloodGroup || request.bloodGroup || "N/A";

//                 const currentStatus = request.status || "pending";

//                 const feedback = feedbackMap[request._id];

//                 const hasFeedback = !!feedback;

//                 return (
//                   <article key={request._id} style={styles.requestCard}>
//                     <div style={styles.requestTop}>
//                       <div style={styles.donorAvatar}>
//                         {donor?.image ? (
//                           <img
//                             src={`https://blooddonation-backend-1.onrender.com/uploads/${donor.image}`}
//                             alt={donorName}
//                             style={styles.donorImage}
//                           />
//                         ) : (
//                           <FaTint />
//                         )}
//                       </div>

//                       <div style={styles.donorDetails}>
//                         <h2 style={styles.donorName}>{donorName}</h2>

//                         <p style={styles.requestDate}>
//                           Requested on {formatDate(request.createdAt)}
//                         </p>
//                       </div>

//                       <span
//                         style={{
//                           ...styles.statusBadge,
//                           ...getStatusStyle(currentStatus),
//                         }}
//                       >
//                         {formatStatus(currentStatus)}
//                       </span>
//                     </div>

//                     <div style={styles.requestDetails}>
//                       <p style={styles.requestDetail}>
//                         <FaMapMarkerAlt style={styles.requestIcon} />
//                         {donorAddress}
//                       </p>

//                       <p style={styles.requestDetail}>
//                         <FaPhone style={styles.requestIcon} />
//                         {donorContact}
//                       </p>

//                       <p style={styles.requestDetail}>
//                         <FaTint style={styles.requestIcon} />

//                         <span>
//                           Blood Group: <strong>{donorBloodGroup}</strong>
//                         </span>
//                       </p>

//                       <p style={styles.requestId}>
//                         Request ID: {request._id}
//                       </p>
//                     </div>

//                     <div style={styles.messageBox}>
//                       <p style={styles.messageLabel}>Request Message</p>

//                       <p style={styles.messageText}>
//                         {request.description || "No message provided."}
//                       </p>
//                     </div>

//                     {currentStatus === "pending" && (
//                       <div style={styles.pendingMessage}>
//                         <FaClock />
//                         <span>Waiting for donor response</span>
//                       </div>
//                     )}

//                     {currentStatus === "accepted" && (
//                       <>
//                         <div style={styles.acceptedMessage}>
//                           <FaCheckCircle />
//                           <span>Donor accepted your request</span>
//                         </div>

//                         {!hasFeedback ? (
//                           <button
//                             type="button"
//                             style={styles.feedbackButton}
//                             onClick={() => openFeedbackModal(request)}
//                           >
//                             <FaCommentDots />
//                             Give Feedback
//                           </button>
//                         ) : (
//                           <div style={styles.feedbackSubmittedSection}>
//                             <div style={styles.feedbackSubmitted}>
//                               <FaCheckCircle />
//                               <span>Feedback Submitted</span>
//                             </div>

//                             <button
//                               type="button"
//                               style={styles.viewFeedbackButton}
//                               onClick={() => handleViewFeedback(request)}
//                             >
//                               <FaEye />
//                               View Feedback
//                             </button>
//                           </div>
//                         )}
//                       </>
//                     )}

//                     {currentStatus === "rejected" && (
//                       <div style={styles.rejectedMessage}>
//                         <FaTimesCircle />
//                         <span>Donor rejected your request</span>
//                       </div>
//                     )}
//                   </article>
//                 );
//               })}
//             </div>
//           )}
//         </section>
//       </section>

//       {/* GIVE FEEDBACK MODAL */}

//       {feedbackRequest && (
//         <div style={styles.modalOverlay}>
//           <div style={styles.feedbackModal}>
//             <h2 style={styles.feedbackTitle}>Give Feedback</h2>

//             <p style={styles.feedbackSubtitle}>
//               Share your experience with the donor.
//             </p>

//             <textarea
//               value={feedbackMessage}
//               onChange={(e) => setFeedbackMessage(e.target.value)}
//               placeholder="Write your feedback..."
//               style={styles.feedbackTextarea}
//               rows="5"
//               disabled={feedbackLoading}
//             />

//             {feedbackError && (
//               <p style={styles.feedbackError}>{feedbackError}</p>
//             )}

//             {feedbackSuccess && (
//               <p style={styles.feedbackSuccess}>{feedbackSuccess}</p>
//             )}

//             <div style={styles.feedbackActions}>
//               <button
//                 type="button"
//                 style={styles.cancelFeedbackButton}
//                 onClick={closeFeedbackModal}
//                 disabled={feedbackLoading}
//               >
//                 Cancel
//               </button>

//               <button
//                 type="button"
//                 style={styles.submitFeedbackButton}
//                 onClick={submitFeedback}
//                 disabled={feedbackLoading}
//               >
//                 {feedbackLoading ? "Submitting..." : "Submit Feedback"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* VIEW FEEDBACK MODAL */}

//       {viewFeedback && (
//         <div style={styles.modalOverlay}>
//           <div style={styles.feedbackModal}>
//             <h2 style={styles.feedbackTitle}>Your Feedback</h2>

//             <p style={styles.feedbackSubtitle}>
//               Feedback you submitted to the donor.
//             </p>

//             <div style={styles.viewFeedbackDonor}>
//               <FaTint />

//               <div>
//                 <strong>
//                   {viewFeedback.donorId?.donorName || "Donor"}
//                 </strong>

//                 <p>
//                   Blood Group:{" "}
//                   {viewFeedback.donorId?.bloodGroup || "N/A"}
//                 </p>
//               </div>
//             </div>

//             <div style={styles.viewFeedbackBox}>
//               <p style={styles.viewFeedbackLabel}>Your Feedback</p>

//               <p style={styles.viewFeedbackMessage}>
//                 {viewFeedback.message || "No feedback message."}
//               </p>
//             </div>

//             <p style={styles.viewFeedbackDate}>
//               Submitted on {formatDate(viewFeedback.createdAt)}
//             </p>

//             <div style={styles.feedbackActions}>
//               <button
//                 type="button"
//                 style={styles.cancelFeedbackButton}
//                 onClick={closeViewFeedback}
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* VIEW FEEDBACK LOADING */}

//       {viewFeedbackLoading && (
//         <div style={styles.modalOverlay}>
//           <div style={styles.loadingModal}>
//             <FaTint style={styles.loadingIcon} />
//             <p>Loading feedback...</p>
//           </div>
//         </div>
//       )}

//       {/* VIEW FEEDBACK ERROR */}

//       {viewFeedbackError && (
//         <div style={styles.modalOverlay}>
//           <div style={styles.feedbackModal}>
//             <p style={styles.feedbackError}>{viewFeedbackError}</p>

//             <div style={styles.feedbackActions}>
//               <button
//                 type="button"
//                 style={styles.cancelFeedbackButton}
//                 onClick={() => setViewFeedbackError("")}
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </main>
//   );
// };

// // ==========================================================
// // STYLES
// // ==========================================================

// const styles = {
//   page: {
//     minHeight: "100vh",
//     backgroundColor: "#f8fafc",
//     color: "#18181b",
//   },

//   content: {
//     width: "100%",
//     boxSizing: "border-box",
//     padding: "40px 7% 60px",
//   },

//   requestsSection: {
//     width: "100%",
//     maxWidth: "1370px",
//     margin: "0 auto",
//     padding: "32px",
//     boxSizing: "border-box",
//     borderRadius: "22px",
//     backgroundColor: "#ffffff",
//     boxShadow: "0 12px 35px rgba(0,0,0,0.055)",
//   },

//   sectionHeader: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     gap: "25px",
//     marginBottom: "30px",
//   },

//   sectionTitle: {
//     margin: "0 0 8px",
//     color: "#18181b",
//     fontSize: "30px",
//     fontWeight: "750",
//   },

//   sectionText: {
//     margin: 0,
//     color: "#71717a",
//     fontSize: "15px",
//   },

//   findDonorButton: {
//     minWidth: "155px",
//     padding: "13px 19px",
//     boxSizing: "border-box",
//     display: "inline-flex",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: "9px",
//     borderRadius: "10px",
//     backgroundColor: "#e0002b",
//     color: "#ffffff",
//     textDecoration: "none",
//     fontSize: "15px",
//     fontWeight: "700",
//   },

//   requestList: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "20px",
//   },

//   requestCard: {
//     padding: "26px",
//     border: "1px solid #f0d3d7",
//     borderRadius: "18px",
//     backgroundColor: "#fffafa",
//     boxSizing: "border-box",
//   },

//   requestTop: {
//     display: "flex",
//     alignItems: "center",
//     gap: "15px",
//   },

//   donorAvatar: {
//     width: "64px",
//     height: "64px",
//     flexShrink: 0,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     borderRadius: "50%",
//     overflow: "hidden",
//     backgroundColor: "#ffe4e6",
//     color: "#e0002b",
//     fontSize: "25px",
//   },

//   donorImage: {
//     width: "100%",
//     height: "100%",
//     objectFit: "cover",
//   },

//   donorDetails: {
//     minWidth: 0,
//   },

//   donorName: {
//     margin: "0 0 6px",
//     color: "#18181b",
//     fontSize: "20px",
//     fontWeight: "700",
//   },

//   requestDate: {
//     margin: 0,
//     color: "#71717a",
//     fontSize: "14px",
//   },

//   statusBadge: {
//     marginLeft: "auto",
//     padding: "7px 13px",
//     borderRadius: "20px",
//     fontSize: "12px",
//     fontWeight: "800",
//     textTransform: "capitalize",
//   },

//   pendingStatus: {
//     backgroundColor: "#fef3c7",
//     color: "#b45309",
//   },

//   acceptedStatus: {
//     backgroundColor: "#dcfce7",
//     color: "#15803d",
//   },

//   rejectedStatus: {
//     backgroundColor: "#fee2e2",
//     color: "#b91c1c",
//   },

//   requestDetails: {
//     marginTop: "22px",
//     display: "flex",
//     flexDirection: "column",
//     gap: "11px",
//   },

//   requestDetail: {
//     margin: 0,
//     display: "flex",
//     alignItems: "center",
//     gap: "10px",
//     color: "#52525b",
//     fontSize: "15px",
//   },

//   requestIcon: {
//     color: "#e0002b",
//     flexShrink: 0,
//     fontSize: "15px",
//   },

//   requestId: {
//     margin: "2px 0 0",
//     color: "#a1a1aa",
//     fontSize: "12px",
//     wordBreak: "break-all",
//   },

//   messageBox: {
//     marginTop: "20px",
//     padding: "17px",
//     borderRadius: "13px",
//     backgroundColor: "#ffffff",
//   },

//   messageLabel: {
//     margin: "0 0 7px",
//     color: "#71717a",
//     fontSize: "12px",
//     fontWeight: "700",
//   },

//   messageText: {
//     margin: 0,
//     color: "#27272a",
//     fontSize: "15px",
//     lineHeight: "1.55",
//   },

//   pendingMessage: {
//     marginTop: "20px",
//     padding: "12px",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: "9px",
//     borderRadius: "10px",
//     backgroundColor: "#fef3c7",
//     color: "#b45309",
//     fontSize: "14px",
//     fontWeight: "700",
//   },

//   acceptedMessage: {
//     marginTop: "20px",
//     padding: "13px",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: "9px",
//     borderRadius: "10px",
//     backgroundColor: "#dcfce7",
//     color: "#15803d",
//     fontSize: "15px",
//     fontWeight: "700",
//   },

//   rejectedMessage: {
//     marginTop: "20px",
//     padding: "13px",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: "9px",
//     borderRadius: "10px",
//     backgroundColor: "#fee2e2",
//     color: "#b91c1c",
//     fontSize: "15px",
//     fontWeight: "700",
//   },

//   feedbackButton: {
//     marginTop: "12px",
//     width: "100%",
//     padding: "13px",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: "9px",
//     border: "none",
//     borderRadius: "10px",
//     backgroundColor: "#e0002b",
//     color: "#ffffff",
//     fontSize: "14px",
//     fontWeight: "700",
//     cursor: "pointer",
//   },

//   feedbackSubmittedSection: {
//     marginTop: "12px",
//     display: "flex",
//     flexDirection: "column",
//     gap: "10px",
//   },

//   feedbackSubmitted: {
//     padding: "13px",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: "9px",
//     borderRadius: "10px",
//     backgroundColor: "#dcfce7",
//     color: "#15803d",
//     fontSize: "14px",
//     fontWeight: "700",
//   },

//   viewFeedbackButton: {
//     width: "100%",
//     padding: "13px",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: "9px",
//     border: "1px solid #e0002b",
//     borderRadius: "10px",
//     backgroundColor: "#ffffff",
//     color: "#e0002b",
//     fontSize: "14px",
//     fontWeight: "700",
//     cursor: "pointer",
//   },

//   centerMessage: {
//     padding: "60px 20px",
//     textAlign: "center",
//     color: "#71717a",
//   },

//   loadingIcon: {
//     fontSize: "35px",
//     color: "#e0002b",
//   },

//   loadingModal: {
//     width: "100%",
//     maxWidth: "350px",
//     padding: "35px",
//     boxSizing: "border-box",
//     borderRadius: "18px",
//     backgroundColor: "#ffffff",
//     textAlign: "center",
//   },

//   errorBox: {
//     padding: "20px",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: "10px",
//     borderRadius: "12px",
//     backgroundColor: "#fee2e2",
//     color: "#b91c1c",
//     fontWeight: "600",
//   },

//   emptyBox: {
//     padding: "60px 20px",
//     textAlign: "center",
//     color: "#71717a",
//   },

//   emptyIcon: {
//     fontSize: "48px",
//     color: "#e0002b",
//   },

//   emptyButton: {
//     marginTop: "18px",
//     padding: "12px 19px",
//     display: "inline-flex",
//     alignItems: "center",
//     gap: "8px",
//     borderRadius: "9px",
//     backgroundColor: "#e0002b",
//     color: "#ffffff",
//     textDecoration: "none",
//     fontWeight: "700",
//   },

//   modalOverlay: {
//     position: "fixed",
//     inset: 0,
//     backgroundColor: "rgba(0,0,0,0.45)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: "20px",
//     zIndex: 1000,
//   },

//   feedbackModal: {
//     width: "100%",
//     maxWidth: "500px",
//     padding: "28px",
//     boxSizing: "border-box",
//     borderRadius: "18px",
//     backgroundColor: "#ffffff",
//     boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
//   },

//   feedbackTitle: {
//     margin: "0 0 7px",
//     color: "#18181b",
//     fontSize: "24px",
//     fontWeight: "750",
//   },

//   feedbackSubtitle: {
//     margin: "0 0 20px",
//     color: "#71717a",
//     fontSize: "14px",
//   },

//   feedbackTextarea: {
//     width: "100%",
//     padding: "13px",
//     boxSizing: "border-box",
//     border: "1px solid #e4e4e7",
//     borderRadius: "10px",
//     outline: "none",
//     resize: "vertical",
//     fontFamily: "inherit",
//     fontSize: "14px",
//     lineHeight: "1.5",
//   },

//   feedbackError: {
//     margin: "10px 0 0",
//     color: "#b91c1c",
//     fontSize: "13px",
//     fontWeight: "600",
//   },

//   feedbackSuccess: {
//     margin: "10px 0 0",
//     color: "#15803d",
//     fontSize: "13px",
//     fontWeight: "600",
//   },

//   feedbackActions: {
//     marginTop: "20px",
//     display: "flex",
//     justifyContent: "flex-end",
//     gap: "10px",
//   },

//   cancelFeedbackButton: {
//     padding: "11px 18px",
//     border: "1px solid #e4e4e7",
//     borderRadius: "9px",
//     backgroundColor: "#ffffff",
//     color: "#52525b",
//     fontSize: "14px",
//     fontWeight: "600",
//     cursor: "pointer",
//   },

//   submitFeedbackButton: {
//     padding: "11px 18px",
//     border: "none",
//     borderRadius: "9px",
//     backgroundColor: "#e0002b",
//     color: "#ffffff",
//     fontSize: "14px",
//     fontWeight: "700",
//     cursor: "pointer",
//   },

//   viewFeedbackDonor: {
//     padding: "14px",
//     display: "flex",
//     alignItems: "center",
//     gap: "12px",
//     borderRadius: "12px",
//     backgroundColor: "#fff1f2",
//     color: "#e0002b",
//     marginBottom: "16px",
//   },

//   viewFeedbackBox: {
//     padding: "18px",
//     borderRadius: "12px",
//     backgroundColor: "#f8fafc",
//     border: "1px solid #e4e4e7",
//   },

//   viewFeedbackLabel: {
//     margin: "0 0 8px",
//     color: "#71717a",
//     fontSize: "12px",
//     fontWeight: "700",
//   },

//   viewFeedbackMessage: {
//     margin: 0,
//     color: "#27272a",
//     fontSize: "15px",
//     lineHeight: "1.6",
//   },

//   viewFeedbackDate: {
//     margin: "14px 0 0",
//     color: "#a1a1aa",
//     fontSize: "12px",
//   },
// };

// export default Status;
