// frontend/src/api/adminApi.js
import axiosInstance from "./axiosInstance";

// ==================== DASHBOARD STATS ====================
export const getAdminStats = async () => {
  try {
    const response = await axiosInstance.get("/admin/stats");
    return {
      success: true,
      data: response.data.data || response.data
    };
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    throw error;
  }
};

// ==================== ANALYTICS ====================
export const getAnalytics = async (timeRange = 'all') => {
  try {
    const response = await axiosInstance.get(`/admin/analytics?timeRange=${timeRange}`);
    return {
      success: true,
      data: response.data.data || response.data
    };
  } catch (error) {
    console.error("Error fetching analytics:", error);
    throw error;
  }
};

// ==================== NOTIFICATIONS ====================
export const getNotifications = async (status = 'all') => {
  try {
    const response = await axiosInstance.get(`/admin/notifications?status=${status}`);
    return {
      success: true,
      data: response.data.data || response.data,
      count: response.data.count || 0
    };
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

export const getUnreadNotificationCount = async () => {
  try {
    const response = await axiosInstance.get("/admin/notifications/unread-count");
    return {
      success: true,
      count: response.data.count || 0
    };
  } catch (error) {
    console.error("Error fetching unread count:", error);
    throw error;
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await axiosInstance.put(`/admin/notifications/${notificationId}/read`);
    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};

export const markAllNotificationsAsRead = async () => {
  try {
    const response = await axiosInstance.put("/admin/notifications/mark-all-read");
    return {
      success: true,
      message: response.data.message
    };
  } catch (error) {
    console.error("Error marking all as read:", error);
    throw error;
  }
};

export const deleteNotification = async (notificationId) => {
  try {
    const response = await axiosInstance.delete(`/admin/notifications/${notificationId}`);
    return {
      success: true,
      message: response.data.message
    };
  } catch (error) {
    console.error("Error deleting notification:", error);
    throw error;
  }
};

// ==================== USERS ====================
export const getAllUsers = async () => {
  try {
    const response = await axiosInstance.get("/admin/users");
    return {
      success: true,
      data: response.data.data || response.data,
      count: response.data.count || 0
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const banUser = async (userId) => {
  try {
    const response = await axiosInstance.put(`/admin/users/${userId}/ban`);
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    };
  } catch (error) {
    console.error("Error banning user:", error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await axiosInstance.delete(`/admin/users/${userId}`);
    return {
      success: true,
      message: response.data.message
    };
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

// ==================== BLOGS ====================
export const getAllBlogs = async () => {
  try {
    const response = await axiosInstance.get("/admin/blogs");
    return {
      success: true,
      data: response.data.data || response.data,
      count: response.data.count || 0
    };
  } catch (error) {
    console.error("Error fetching blogs:", error);
    throw error;
  }
};

export const deleteBlog = async (blogId) => {
  try {
    const response = await axiosInstance.delete(`/admin/blogs/${blogId}`);
    return {
      success: true,
      message: response.data.message
    };
  } catch (error) {
    console.error("Error deleting blog:", error);
    throw error;
  }
};

export const updateBlogStatus = async (blogId, status) => {
  try {
    const response = await axiosInstance.put(`/admin/blogs/${blogId}/status`, { status });
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    };
  } catch (error) {
    console.error("Error updating blog status:", error);
    throw error;
  }
};

// ==================== ADMIN REQUESTS ====================
export const getAdminRequests = async (status = 'all') => {
  try {
    const response = await axiosInstance.get(`/admin/requests?status=${status}`);
    return {
      success: true,
      data: response.data.data || response.data,
      count: response.data.count || 0
    };
  } catch (error) {
    console.error("Error fetching admin requests:", error);
    throw error;
  }
};

export const approveAdminRequest = async (requestId, response = '') => {
  try {
    const res = await axiosInstance.post(`/admin/requests/${requestId}/approve`, { response });
    return {
      success: true,
      data: res.data.data,
      message: res.data.message
    };
  } catch (error) {
    console.error("Error approving admin request:", error);
    throw error;
  }
};

export const rejectAdminRequest = async (requestId, response = '') => {
  try {
    const res = await axiosInstance.post(`/admin/requests/${requestId}/reject`, { response });
    return {
      success: true,
      data: res.data.data,
      message: res.data.message
    };
  } catch (error) {
    console.error("Error rejecting admin request:", error);
    throw error;
  }
};