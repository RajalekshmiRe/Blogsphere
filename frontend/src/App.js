import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateBlog from "./pages/CreateBlog";

// User pages
import MyBlogs from "./pages/MyBlogs";
import EditBlog from "./pages/EditBlog";
import ViewBlog from "./pages/ViewBlog";
import UserDashboard from "./pages/UserDashboard";
import RequestAdminAccess from "./pages/RequestAdminAccess";

// Admin components
import AdminRoute from "./components/admin/AdminRoute";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminBlogs from "./pages/admin/AdminBlogs";
import AdminEditBlog from "./pages/admin/AdminEditBlog";
import AdminRequests from "./pages/admin/AdminRequests";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import Notifications from "./pages/admin/Notifications";
import ExportReports from "./pages/admin/ExportReports";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { ErrorBoundary } from "./components/ErrorBoundary";

function App() {
  // Block permission popups on mount
  React.useEffect(() => {
    // Prevent mDNS local network scanning
    if (navigator.permissions?.query) {
      const originalQuery = navigator.permissions.query.bind(navigator.permissions);
      navigator.permissions.query = async (descriptor) => {
        if (descriptor.name === 'local-network' || descriptor.name === 'local-devices') {
          return Promise.resolve({ state: 'denied', onchange: null });
        }
        return originalQuery(descriptor);
      };
    }

    // Block media device access
    if (navigator.mediaDevices?.getUserMedia) {
      const originalGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
      navigator.mediaDevices.getUserMedia = () => {
        return Promise.reject(new DOMException('Permission denied', 'NotAllowedError'));
      };
    }

    // Block geolocation
    if (navigator.geolocation?.getCurrentPosition) {
      const originalGetPosition = navigator.geolocation.getCurrentPosition;
      navigator.geolocation.getCurrentPosition = () => {
        // Do nothing - silently fail
      };
    }
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Navbar />

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />

        <ErrorBoundary>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Blog Routes - For ALL Users */}
            <Route path="/create-blog" element={<CreateBlog />} />
            <Route path="/blog/:blogId" element={<ViewBlog />} />
            <Route path="/edit-blog/:blogId" element={<EditBlog />} />

            {/* User Dashboard Routes */}
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/my-blogs" element={<MyBlogs />} />
            <Route path="/request-admin" element={<RequestAdminAccess />} />

            {/* Admin Routes (Protected with Layout) */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="blogs" element={<AdminBlogs />} />
              <Route path="edit-blog/:blogId" element={<AdminEditBlog />} />
              <Route path="requests" element={<AdminRequests />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="reports" element={<ExportReports />} />
            </Route>
          </Routes>
        </ErrorBoundary>
      </Router>
    </AuthProvider>
  );
}

export default App;