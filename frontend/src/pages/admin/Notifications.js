// // frontend/src/pages/admin/Notifications.js
// import { useEffect, useState, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import axiosInstance from "../../api/axiosInstance";

// export default function Notifications() {
//   const [notifications, setNotifications] = useState([]);
//   const [filteredNotifications, setFilteredNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [filterStatus, setFilterStatus] = useState("all");
//   const navigate = useNavigate();

//   const fetchNotifications = useCallback(async () => {
//     try {
//       setError(null);
//       const token = localStorage.getItem("token");

//       if (!token) {
//         navigate("/login");
//         return;
//       }

//       console.log("🔍 Fetching notifications...");
//       const res = await axiosInstance.get("/admin/notifications", {
//         headers: { Authorization: `Bearer ${token}` }
//       });
      
//       console.log("📦 API Response:", res.data);
      
//       if (res.data.success) {
//         const notifs = res.data.data || res.data.notifications || [];
//         console.log("✅ Notifications loaded:", notifs);
//         setNotifications(notifs);
//       } else {
//         console.error("❌ API returned success: false");
//         setError(res.data.message || "Failed to load notifications");
//       }
//     } catch (err) {
//       console.error("❌ Error fetching notifications:", err);
//       console.error("Response:", err.response?.data);
      
//       if (err.response?.status === 401 || err.response?.status === 403) {
//         localStorage.removeItem('token');
//         navigate("/login");
//       } else if (err.response?.status === 404) {
//         setError("Notifications endpoint not found. Check your backend routes.");
//       } else {
//         setError(err.response?.data?.message || "Error loading notifications");
//       }
//     } finally {
//       setLoading(false);
//     }
//   }, [navigate]);

//   useEffect(() => {
//     fetchNotifications();
//     const interval = setInterval(fetchNotifications, 30000);
//     return () => clearInterval(interval);
//   }, [fetchNotifications]);

//   useEffect(() => {
//     filterNotifications();
//   }, [notifications, filterStatus]);

//   const filterNotifications = () => {
//     if (filterStatus === "all") {
//       setFilteredNotifications(notifications);
//     } else {
//       setFilteredNotifications(
//         notifications.filter(
//           (n) => n.status?.toLowerCase() === filterStatus.toLowerCase()
//         )
//       );
//     }
//   };

//   const handleMarkAsRead = async (notificationId) => {
//     try {
//       const token = localStorage.getItem("token");
//       await axiosInstance.put(
//         `/admin/notifications/${notificationId}/read`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setNotifications(prev =>
//         prev.map(n => n.id === notificationId || n._id === notificationId ? { ...n, isRead: true } : n)
//       );
//     } catch (err) {
//       console.error("Error marking as read:", err);
//     }
//   };

//   const handleViewDetails = (notification) => {
//     // Mark as read
//     handleMarkAsRead(notification.id || notification._id);
    
//     // Route based on notification type
//     if (notification.type === 'admin_request' && notification.requestId) {
//       // Admin request notifications - go to requests page
//       navigate(`/admin/requests?highlight=${notification.requestId}`);
//     } else if (notification.type === 'user_report' || notification.message.includes('User') || notification.message.includes('banned') || notification.message.includes('unbanned')) {
//       // User-related notifications - go to users page
//       navigate('/admin/users');
//     } else if (notification.type === 'blog_report' || notification.message.includes('Blog')) {
//       // Blog-related notifications - go to blogs page
//       navigate('/admin/blogs');
//     } else {
//       // Default: go to dashboard
//       navigate('/admin');
//     }
//   };

//   const handleMarkAllAsRead = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       await axiosInstance.put(
//         '/admin/notifications/mark-all-read',
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
//     } catch (err) {
//       console.error("Error marking all as read:", err);
//       alert("Failed to mark all as read");
//     }
//   };

//   const handleDeleteNotification = async (notificationId) => {
//     if (!window.confirm("Are you sure you want to delete this notification?")) {
//       return;
//     }

//     try {
//       const token = localStorage.getItem("token");
//       await axiosInstance.delete(
//         `/admin/notifications/${notificationId}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setNotifications(prev => prev.filter(n => (n.id || n._id) !== notificationId));
//     } catch (err) {
//       console.error("Error deleting notification:", err);
//       alert("Failed to delete notification");
//     }
//   };

//   const statusColor = (status) => {
//     switch (status?.toLowerCase()) {
//       case "approved":
//         return "bg-green-100 text-green-800 border-green-200";
//       case "pending":
//         return "bg-yellow-100 text-yellow-800 border-yellow-200";
//       case "rejected":
//         return "bg-red-100 text-red-800 border-red-200";
//       default:
//         return "bg-gray-100 text-gray-800 border-gray-200";
//     }
//   };

//   const getStatusIcon = (status) => {
//     switch (status?.toLowerCase()) {
//       case "approved":
//         return (
//           <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//             <path
//               fillRule="evenodd"
//               d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
//               clipRule="evenodd"
//             />
//           </svg>
//         );
//       case "pending":
//         return (
//           <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//             <path
//               fillRule="evenodd"
//               d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
//               clipRule="evenodd"
//             />
//           </svg>
//         );
//       case "rejected":
//         return (
//           <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//             <path
//               fillRule="evenodd"
//               d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
//               clipRule="evenodd"
//             />
//           </svg>
//         );
//       default:
//         return null;
//     }
//   };

//   const getRelativeTime = (date) => {
//     const now = new Date();
//     const notifDate = new Date(date);
//     const diffMs = now - notifDate;
//     const diffMins = Math.floor(diffMs / 60000);
//     const diffHours = Math.floor(diffMs / 3600000);
//     const diffDays = Math.floor(diffMs / 86400000);

//     if (diffMins < 1) return "Just now";
//     if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
//     if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
//     if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
//     return notifDate.toLocaleDateString();
//   };

//   const stats = {
//     all: notifications.length,
//     pending: notifications.filter((n) => n.status?.toLowerCase() === "pending").length,
//     approved: notifications.filter((n) => n.status?.toLowerCase() === "approved").length,
//     rejected: notifications.filter((n) => n.status?.toLowerCase() === "rejected").length,
//     unread: notifications.filter((n) => !n.isRead).length
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
//         <div className="max-w-6xl mx-auto">
//           <div className="flex items-center gap-4 mb-6">
//             <button
//               onClick={() => navigate('/admin')}
//               className="flex items-center justify-center w-10 h-10 rounded-lg bg-white hover:bg-gray-100 border border-gray-200 transition-colors group shadow-sm"
//             >
//               <svg className="w-5 h-5 text-gray-600 group-hover:text-gray-900 group-hover:-translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//               </svg>
//             </button>
//             <h2 className="text-2xl font-bold">Notifications</h2>
//           </div>
//           <div className="flex items-center justify-center py-20">
//             <div className="text-center">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
//               <p className="mt-4 text-gray-600">Loading notifications...</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
//         <div className="max-w-6xl mx-auto">
//           <div className="flex items-center gap-4 mb-6">
//             <button
//               onClick={() => navigate('/admin')}
//               className="flex items-center justify-center w-10 h-10 rounded-lg bg-white hover:bg-gray-100 border border-gray-200 transition-colors group shadow-sm"
//             >
//               <svg className="w-5 h-5 text-gray-600 group-hover:text-gray-900 group-hover:-translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//               </svg>
//             </button>
//             <h2 className="text-2xl font-bold">Notifications</h2>
//           </div>
//           <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
//             <svg
//               className="mx-auto h-12 w-12 text-red-400 mb-4"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//               />
//             </svg>
//             <p className="text-red-800 text-lg mb-4">{error}</p>
//             <button
//               onClick={fetchNotifications}
//               className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
//             >
//               Try Again
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
//       <div className="max-w-6xl mx-auto">
//         {/* Header with Back Button */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => navigate('/admin')}
//               className="flex items-center justify-center w-10 h-10 rounded-lg bg-white hover:bg-gray-100 border border-gray-200 transition-colors group shadow-sm"
//               title="Back to Admin Panel"
//             >
//               <svg className="w-5 h-5 text-gray-600 group-hover:text-gray-900 group-hover:-translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//               </svg>
//             </button>
//             <div>
//               <h2 className="text-3xl font-bold text-gray-900">Notifications</h2>
//               <p className="text-gray-600 mt-1">
//                 All admin activity notifications
//                 {stats.unread > 0 && (
//                   <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
//                     {stats.unread} unread
//                   </span>
//                 )}
//               </p>
//             </div>
//           </div>
//           {stats.unread > 0 && (
//             <button
//               onClick={handleMarkAllAsRead}
//               className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200 shadow-sm"
//             >
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//               </svg>
//               Mark All Read
//             </button>
//           )}
//         </div>

//         {/* Statistics Cards */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//           <button
//             onClick={() => setFilterStatus("all")}
//             className={`p-4 rounded-lg border-2 transition ${
//               filterStatus === "all"
//                 ? "border-indigo-500 bg-indigo-50 shadow-md"
//                 : "border-gray-200 bg-white hover:border-gray-300"
//             }`}
//           >
//             <div className="text-2xl font-bold text-gray-900">{stats.all}</div>
//             <div className="text-sm text-gray-600">Total</div>
//           </button>
//           <button
//             onClick={() => setFilterStatus("pending")}
//             className={`p-4 rounded-lg border-2 transition ${
//               filterStatus === "pending"
//                 ? "border-yellow-500 bg-yellow-50 shadow-md"
//                 : "border-gray-200 bg-white hover:border-gray-300"
//             }`}
//           >
//             <div className="text-2xl font-bold text-yellow-700">
//               {stats.pending}
//             </div>
//             <div className="text-sm text-gray-600">Pending</div>
//           </button>
//           <button
//             onClick={() => setFilterStatus("approved")}
//             className={`p-4 rounded-lg border-2 transition ${
//               filterStatus === "approved"
//                 ? "border-green-500 bg-green-50 shadow-md"
//                 : "border-gray-200 bg-white hover:border-gray-300"
//             }`}
//           >
//             <div className="text-2xl font-bold text-green-700">
//               {stats.approved}
//             </div>
//             <div className="text-sm text-gray-600">Approved</div>
//           </button>
//           <button
//             onClick={() => setFilterStatus("rejected")}
//             className={`p-4 rounded-lg border-2 transition ${
//               filterStatus === "rejected"
//                 ? "border-red-500 bg-red-50 shadow-md"
//                 : "border-gray-200 bg-white hover:border-gray-300"
//             }`}
//           >
//             <div className="text-2xl font-bold text-red-700">
//               {stats.rejected}
//             </div>
//             <div className="text-sm text-gray-600">Rejected</div>
//           </button>
//         </div>

//         {/* Notifications List */}
//         {filteredNotifications.length === 0 ? (
//           <div className="bg-white border-2 border-gray-200 rounded-lg p-12 text-center">
//             <svg
//               className="mx-auto h-16 w-16 text-gray-400 mb-4"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
//               />
//             </svg>
//             <p className="text-gray-600 text-lg font-medium">
//               No {filterStatus !== "all" && filterStatus} notifications
//             </p>
//             <p className="text-gray-400 mt-2">
//               {filterStatus === "all"
//                 ? "You'll see all admin activity notifications here"
//                 : `Try changing the filter to see other notifications`}
//             </p>
//           </div>
//         ) : (
//           <div className="space-y-3">
//             {filteredNotifications.map((note) => (
//               <div
//                 key={note.id || note._id}
//                 className={`relative border-2 rounded-lg p-4 hover:shadow-lg transition duration-200 bg-white ${
//                   !note.isRead ? 'border-indigo-200 bg-indigo-50/30' : 'border-gray-200'
//                 }`}
//               >
//                 {!note.isRead && (
//                   <div className="absolute top-2 right-2">
//                     <span className="flex h-3 w-3">
//                       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
//                       <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
//                     </span>
//                   </div>
//                 )}
                
//                 <div className="flex items-start justify-between gap-4">
//                   <div className="flex items-start gap-3 flex-1">
//                     <div className={`mt-1 ${statusColor(note.status)} p-2 rounded-full`}>
//                       {getStatusIcon(note.status)}
//                     </div>
//                     <div className="flex-1">
//                       <p className="font-semibold text-gray-900 mb-1">
//                         {note.message}
//                       </p>
//                       {note.reason && (
//                         <p className="text-sm text-gray-600 mb-2 line-clamp-2">
//                           <span className="font-medium">Reason:</span> {note.reason}
//                         </p>
//                       )}
//                       <div className="flex flex-wrap gap-3 text-sm text-gray-500">
//                         <span className="flex items-center gap-1">
//                           <svg
//                             className="w-4 h-4"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={2}
//                               d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
//                             />
//                           </svg>
//                           {getRelativeTime(note.date || note.createdAt)}
//                         </span>
//                         {note.respondedBy && (
//                           <span className="flex items-center gap-1">
//                             <svg
//                               className="w-4 h-4"
//                               fill="none"
//                               stroke="currentColor"
//                               viewBox="0 0 24 24"
//                             >
//                               <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth={2}
//                                 d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//                               />
//                             </svg>
//                             By {note.respondedBy}
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                   <div className="flex flex-col items-end gap-2">
//                     <span
//                       className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap border ${statusColor(
//                         note.status
//                       )}`}
//                     >
//                       {note.status?.toUpperCase()}
//                     </span>
//                     <div className="flex gap-2">
//                       <button 
//                         onClick={() => handleViewDetails(note)}
//                         className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1"
//                       >
//                         View Details
//                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                         </svg>
//                       </button>
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleDeleteNotification(note.id || note._id);
//                         }}
//                         className="text-red-600 hover:text-red-800 text-sm"
//                         title="Delete notification"
//                       >
//                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                         </svg>
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


// frontend/src/pages/admin/Notifications.js
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const navigate = useNavigate();

  const fetchNotifications = useCallback(async () => {
    try {
      setError(null);
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const res = await axiosInstance.get("/admin/notifications", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data.success) {
        const notifs = res.data.data || res.data.notifications || [];
        setNotifications(notifs);
      } else {
        setError(res.data.message || "Failed to load notifications");
      }
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem('token');
        navigate("/login");
      } else {
        setError(err.response?.data?.message || "Error loading notifications");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  useEffect(() => {
    if (filterType === "all") {
      setFilteredNotifications(notifications);
    } else if (filterType === "blogs") {
      // Match both uppercase and lowercase, and check message content
      setFilteredNotifications(notifications.filter((n) => {
        const type = (n.type || '').toLowerCase();
        const message = (n.message || '').toLowerCase();
        return type.includes('blog') || message.includes('blog');
      }));
    } else if (filterType === "users") {
      // Match both uppercase and lowercase, and check message content
      setFilteredNotifications(notifications.filter((n) => {
        const type = (n.type || '').toLowerCase();
        const message = (n.message || '').toLowerCase();
        return type.includes('user') || 
               type.includes('account') || 
               message.includes('account') ||
               message.includes('banned') ||
               message.includes('unbanned');
      }));
    } else if (filterType === "admin_request") {
      setFilteredNotifications(notifications.filter((n) => {
        const type = (n.type || '').toLowerCase();
        const message = (n.message || '').toLowerCase();
        return type.includes('admin') || type.includes('request') || message.includes('admin request');
      }));
    } else {
      setFilteredNotifications(notifications.filter((n) => n.type === filterType));
    }
  }, [notifications, filterType]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");
      await axiosInstance.put(`/admin/notifications/${notificationId}/read`, {}, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications(prev => prev.map(n => 
        (n.id === notificationId || n._id === notificationId) ? { ...n, isRead: true } : n
      ));
    } catch (err) {
      toast.error("Failed to mark as read");
    }
  };

  const handleViewDetails = (notification) => {
    handleMarkAsRead(notification.id || notification._id);
    
    // Normalize type to lowercase for comparison
    const type = (notification.type || '').toLowerCase();
    const message = (notification.message || '').toLowerCase();
    
    // Check for admin request
    if (type.includes('admin') || type.includes('request') || message.includes('admin request')) {
      navigate(`/admin/requests${notification.requestId ? `?highlight=${notification.requestId}` : ''}`);
    }
    // Check for blog-related notifications
    else if (type.includes('blog') || message.includes('blog')) {
      if (notification.blogId) {
        navigate(`/blog/${notification.blogId}`);
      } else {
        navigate('/admin/blogs');
      }
    }
    // Check for user-related notifications (account banned, unbanned, user reports, etc.)
    else if (type.includes('user') || type.includes('account') || message.includes('account') || message.includes('banned') || message.includes('unbanned')) {
      if (notification.userId) {
        navigate(`/admin/users?highlight=${notification.userId}`);
      } else {
        navigate('/admin/users');
      }
    }
    // Check for comment notifications
    else if (type.includes('comment') || message.includes('comment')) {
      if (notification.blogId) {
        navigate(`/blog/${notification.blogId}#comments`);
      } else {
        navigate('/admin/blogs');
      }
    }
    // Default to admin dashboard
    else {
      navigate('/admin');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      await axiosInstance.put('/admin/notifications/mark-all-read', {}, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      toast.success("All notifications marked as read");
    } catch (err) {
      toast.error("Failed to mark all as read");
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    if (!window.confirm("Delete this notification?")) return;
    try {
      const token = localStorage.getItem("token");
      await axiosInstance.delete(`/admin/notifications/${notificationId}`, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications(prev => prev.filter(n => (n.id || n._id) !== notificationId));
      toast.success("Notification deleted");
    } catch (err) {
      toast.error("Failed to delete notification");
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm("Clear all notifications? This cannot be undone.")) return;
    try {
      const token = localStorage.getItem("token");
      await axiosInstance.delete('/admin/notifications/clear-all', 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications([]);
      toast.success("All notifications cleared");
    } catch (err) {
      toast.error("Failed to clear notifications");
    }
  };

  const getTypeConfig = (type) => {
    // Normalize type to lowercase for comparison
    const normalizedType = (type || '').toLowerCase();
    
    const configs = {
      admin_request: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' },
      new_blog: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
      blog_published: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
      blog_updated: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
      blog_deleted: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' },
      blog_report: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200' },
      new_user: { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-200' },
      user_banned: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' },
      user_unbanned: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
      user_report: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200' },
      new_comment: { bg: 'bg-cyan-100', text: 'text-cyan-800', border: 'border-cyan-200' },
      system: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' }
    };
    
    // Try to match normalized type
    for (const [key, value] of Object.entries(configs)) {
      if (normalizedType.includes(key.replace('_', ' ')) || normalizedType.includes(key)) {
        return value;
      }
    }
    
    return configs.system;
  };

  const getRelativeTime = (date) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffMs = now - notifDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return notifDate.toLocaleDateString();
  };

  // Calculate statistics based on notification types - Updated to handle different formats
  const stats = {
    all: notifications.length,
    admin_request: notifications.filter((n) => {
      const type = (n.type || '').toLowerCase();
      const message = (n.message || '').toLowerCase();
      return type.includes('admin') || type.includes('request') || message.includes('admin request');
    }).length,
    blogs: notifications.filter((n) => {
      const type = (n.type || '').toLowerCase();
      const message = (n.message || '').toLowerCase();
      return type.includes('blog') || message.includes('blog');
    }).length,
    users: notifications.filter((n) => {
      const type = (n.type || '').toLowerCase();
      const message = (n.message || '').toLowerCase();
      return type.includes('user') || 
             type.includes('account') || 
             message.includes('account') ||
             message.includes('banned') ||
             message.includes('unbanned');
    }).length,
    unread: notifications.filter((n) => !n.isRead).length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading notifications...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-6xl mx-auto">
          <button onClick={() => navigate('/admin')} className="mb-4 px-4 py-2 bg-white rounded-lg border">
            ← Back
          </button>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800 text-lg mb-4">{error}</p>
            <button onClick={fetchNotifications} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/admin')} className="w-10 h-10 rounded-lg bg-white hover:bg-gray-100 border flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Notifications</h2>
              <p className="text-gray-600 mt-1">
                Platform activity and updates
                {stats.unread > 0 && (
                  <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    {stats.unread} unread
                  </span>
                )}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {stats.unread > 0 && (
              <button onClick={handleMarkAllAsRead} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                ✓ Mark All Read
              </button>
            )}
            {notifications.length > 0 && (
              <button onClick={handleClearAll} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                🗑️ Clear All
              </button>
            )}
          </div>
        </div>

        {/* Filter Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { key: 'all', label: 'All', color: 'indigo' },
            { key: 'admin_request', label: 'Requests', color: 'purple' },
            { key: 'blogs', label: 'Blogs', color: 'blue' },
            { key: 'users', label: 'Users', color: 'green' }
          ].map(({ key, label, color }) => (
            <button
              key={key}
              onClick={() => setFilterType(key)}
              className={`p-4 rounded-lg border-2 transition ${
                filterType === key
                  ? `border-${color}-500 bg-${color}-50 shadow-md`
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className={`text-2xl font-bold ${filterType === key ? `text-${color}-700` : 'text-gray-900'}`}>
                {stats[key]}
              </div>
              <div className="text-sm text-gray-600">{label}</div>
            </button>
          ))}
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <div className="bg-white border-2 border-gray-200 rounded-lg p-12 text-center">
            <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <p className="text-gray-600 text-lg font-medium">No notifications</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((note) => {
              const config = getTypeConfig(note.type);
              return (
                <div
                  key={note.id || note._id}
                  className={`relative border-2 rounded-lg p-4 hover:shadow-lg transition bg-white ${
                    !note.isRead ? 'border-indigo-200 bg-indigo-50/30' : 'border-gray-200'
                  }`}
                >
                  {!note.isRead && (
                    <div className="absolute top-2 right-2">
                      <span className="flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`mt-1 ${config.bg} ${config.text} p-2 rounded-full`}>
                        📌
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 mb-1">{note.message}</p>
                        {note.reason && (
                          <p className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">Reason:</span> {note.reason}
                          </p>
                        )}
                        <div className="flex gap-3 text-sm text-gray-500">
                          <span>🕐 {getRelativeTime(note.date || note.createdAt)}</span>
                          {note.respondedBy && <span>👤 By {note.respondedBy}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${config.bg} ${config.text} ${config.border}`}>
                        {note.type?.replace(/_/g, ' ').toUpperCase()}
                      </span>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleViewDetails(note)}
                          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                        >
                          View Details →
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNotification(note.id || note._id);
                          }}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}