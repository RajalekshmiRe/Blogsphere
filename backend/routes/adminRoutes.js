// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Blog = require('../models/Blog');
const AdminRequest = require('../models/AdminRequest');
const { protect, admin } = require('../middleware/auth');
const Notification = require('../models/Notification');
const { createNotification } = require('../utils/notificationHelper');
const upload = require('../middleware/upload');

// ==================== DASHBOARD STATS ====================

// GET dashboard statistics
router.get('/stats', protect, admin, async (req, res) => {
  try {
    const [
      totalUsers,
      totalBlogs,
      publishedBlogs,
      pendingRequests,
      totalAdmins,
      activeUsers
    ] = await Promise.all([
      User.countDocuments(),
      Blog.countDocuments(),
      Blog.countDocuments({ status: 'published' }),
      AdminRequest.countDocuments({ status: 'pending' }),
      User.countDocuments({ role: 'admin' }),
      User.countDocuments({ isActive: true })
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalBlogs,
        publishedBlogs,
        draftBlogs: totalBlogs - publishedBlogs,
        totalComments: 0,
        pendingRequests,
        totalAdmins,
        activeUsers,
        bannedUsers: totalUsers - activeUsers
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
});

// ==================== ANALYTICS ENDPOINT ====================
router.get('/analytics', protect, admin, async (req, res) => {
  try {
    const { timeRange } = req.query;
    const Comment = require('../models/Comment');
    
    let dateFilter = {};
    const now = new Date();
    
    if (timeRange === 'week') {
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);
      dateFilter = { createdAt: { $gte: weekAgo } };
    } else if (timeRange === 'month') {
      const monthAgo = new Date(now);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      dateFilter = { createdAt: { $gte: monthAgo } };
    } else if (timeRange === 'year') {
      const yearAgo = new Date(now);
      yearAgo.setFullYear(yearAgo.getFullYear() - 1);
      dateFilter = { createdAt: { $gte: yearAgo } };
    }

    const totalUsers = await User.countDocuments();
    const totalBlogs = await Blog.countDocuments();
    const totalComments = await Comment.countDocuments();
    
    const blogsWithViews = await Blog.aggregate([
      { $group: { _id: null, totalViews: { $sum: '$views' } } }
    ]);
    const totalViews = blogsWithViews.length > 0 ? blogsWithViews[0].totalViews : 0;

    const newUsers = timeRange !== 'all' ? await User.countDocuments(dateFilter) : totalUsers;
    const newBlogs = timeRange !== 'all' ? await Blog.countDocuments(dateFilter) : totalBlogs;
    const newComments = timeRange !== 'all' ? await Comment.countDocuments(dateFilter) : totalComments;

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const activeUsers = await User.countDocuments({ 
      isActive: true,
      updatedAt: { $gte: thirtyDaysAgo }
    });
    const bannedUsers = await User.countDocuments({ isActive: false });
    const adminUsers = await User.countDocuments({ role: 'admin' });

    const publishedBlogs = await Blog.countDocuments({ status: 'published' });
    const draftBlogs = await Blog.countDocuments({ status: 'draft' });

    const categories = await Blog.distinct('category');
    const totalCategories = categories.filter(cat => cat && cat.trim() !== '').length;

    const categoryData = [];
    for (const category of categories) {
      if (category && category.trim() !== '') {
        const count = await Blog.countDocuments({ category });
        categoryData.push({ name: category, value: count });
      }
    }

    const growthData = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date();
      monthStart.setMonth(monthStart.getMonth() - i);
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);
      
      const monthEnd = new Date(monthStart);
      monthEnd.setMonth(monthEnd.getMonth() + 1);

      const monthUsers = await User.countDocuments({
        createdAt: { $gte: monthStart, $lt: monthEnd }
      });
      const monthBlogs = await Blog.countDocuments({
        createdAt: { $gte: monthStart, $lt: monthEnd }
      });
      const monthComments = await Comment.countDocuments({
        createdAt: { $gte: monthStart, $lt: monthEnd }
      });

      const monthName = monthStart.toLocaleString('default', { month: 'short' });
      
      growthData.push({
        month: monthName,
        users: monthUsers,
        blogs: monthBlogs,
        comments: monthComments
      });
    }

    const blogsWithLikes = await Blog.aggregate([
      { $project: { likeCount: { $size: '$likes' } } },
      { $group: { _id: null, totalLikes: { $sum: '$likeCount' } } }
    ]);
    const totalLikes = blogsWithLikes.length > 0 ? blogsWithLikes[0].totalLikes : 0;

    res.json({
      success: true,
      data: {
        totalUsers,
        totalBlogs,
        totalComments,
        totalViews: totalViews.toString(),
        newUsers,
        newBlogs,
        newComments,
        activeUsers,
        bannedUsers,
        adminUsers,
        publishedBlogs,
        draftBlogs,
        totalCategories,
        totalLikes: totalLikes.toString(),
        totalShares: '0',
        avgReadTime: totalBlogs > 0 ? '5 min' : '0 min',
        bounceRate: '35%',
        growthData,
        categoryData: categoryData.length > 0 ? categoryData : [{ name: 'No categories', value: 1 }]
      }
    });

  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics data',
      error: error.message
    });
  }
});

// ==================== NOTIFICATION ROUTES ====================

// GET all notifications
router.get('/notifications', protect, admin, async (req, res) => {
  try {
    const { status, type, limit = 50 } = req.query;
    
    let query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (type) {
      query.type = type;
    }

    const notifications = await Notification.find(query)
      .populate('userId', 'name email')
      .populate('respondedBy', 'name email')
      .populate('requestId')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    const formattedNotifications = notifications.map(notif => ({
      id: notif._id,
      type: notif.type,
      message: notif.message,
      status: notif.status,
      requestId: notif.requestId?._id,
      userId: notif.userId?._id,
      userName: notif.userId?.name,
      reason: notif.reason,
      respondedBy: notif.respondedBy?.name,
      isRead: notif.isRead,
      date: notif.createdAt,
      updatedAt: notif.updatedAt
    }));

    res.json({
      success: true,
      data: formattedNotifications,
      count: formattedNotifications.length
    });

  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications',
      error: error.message
    });
  }
});

// GET unread notification count
router.get('/notifications/unread-count', protect, admin, async (req, res) => {
  try {
    const count = await Notification.countDocuments({ isRead: false });
    
    res.json({
      success: true,
      count
    });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch unread count',
      error: error.message
    });
  }
});

// PUT - Mark notification as read
router.put('/notifications/:id/read', protect, admin, async (req, res) => {
  try {
    const notificationId = req.params.id;

    if (!notificationId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid notification ID'
      });
    }

    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.json({
      success: true,
      message: 'Notification marked as read',
      data: notification
    });

  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read',
      error: error.message
    });
  }
});

// PUT - Mark all notifications as read
router.put('/notifications/mark-all-read', protect, admin, async (req, res) => {
  try {
    await Notification.updateMany(
      { isRead: false },
      { isRead: true }
    );

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });

  } catch (error) {
    console.error('Error marking all as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark all as read',
      error: error.message
    });
  }
});

// DELETE notification
router.delete('/notifications/:id', protect, admin, async (req, res) => {
  try {
    const notificationId = req.params.id;

    if (!notificationId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid notification ID'
      });
    }

    const notification = await Notification.findByIdAndDelete(notificationId);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete notification',
      error: error.message
    });
  }
});

// ==================== USER MANAGEMENT ====================

// GET all users
router.get('/users', protect, admin, async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: users,
      count: users.length
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
});

// PUT - Ban/Unban user WITH NOTIFICATION
router.put('/users/:id/ban', protect, admin, async (req, res) => {
  try {
    const userId = req.params.id;
    const { reason } = req.body;

    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    if (userId === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot ban yourself'
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot ban admin users'
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    // CREATE NOTIFICATION
    if (!user.isActive) {
      await createNotification({
        userId: user._id,
        message: `User "${user.name}" has been banned`,
        status: 'rejected',
        reason: reason || 'Violated community guidelines',
        respondedBy: req.user._id,
        type: 'user_report'
      });
    } else {
      await createNotification({
        userId: user._id,
        message: `User "${user.name}" has been unbanned`,
        status: 'approved',
        reason: 'Account reinstated',
        respondedBy: req.user._id,
        type: 'user_report'
      });
    }

    res.json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'banned'} successfully`,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error('Error toggling user status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user status',
      error: error.message
    });
  }
});

// DELETE user (permanent delete) WITH NOTIFICATION
router.delete('/users/:id', protect, admin, async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    if (userId === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete yourself'
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete admin users'
      });
    }

    const userName = user.name;
    await User.findByIdAndDelete(userId);
    await Blog.deleteMany({ author: userId });

    // CREATE NOTIFICATION FOR DELETED USER
    await createNotification({
      userId: req.user._id,
      message: `User "${userName}" and their blogs have been permanently deleted`,
      status: 'rejected',
      reason: 'User account permanently removed',
      respondedBy: req.user._id,
      type: 'user_report'
    });

    res.json({
      success: true,
      message: 'User and their blogs deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message
    });
  }
});

// ==================== BLOG MANAGEMENT WITH COMMENTS ====================

// GET all blogs with comment count
router.get('/blogs', protect, admin, async (req, res) => {
  try {
    const Comment = require('../models/Comment');
    
    const blogs = await Blog.find()
      .populate('author', 'name email')
      .sort({ createdAt: -1 });

    // Calculate comment count for each blog
    const blogsWithCounts = await Promise.all(
      blogs.map(async (blog) => {
        const commentCount = await Comment.countDocuments({ blog: blog._id });
        return {
          ...blog.toObject(),
          commentCount
        };
      })
    );

    res.json({
      success: true,
      data: blogsWithCounts,
      count: blogsWithCounts.length
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blogs',
      error: error.message
    });
  }
});

// ✅ NEW: GET single blog by ID (for AdminEditBlog)
router.get('/blogs/:id', protect, admin, async (req, res) => {
  try {
    const blogId = req.params.id;

    if (!blogId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid blog ID format'
      });
    }

    const blog = await Blog.findById(blogId).populate('author', 'name email');

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    res.json({
      success: true,
      data: blog
    });
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blog',
      error: error.message
    });
  }
});

// ✅ NEW: PUT - Update blog (for AdminEditBlog)
router.put('/blogs/:id', protect, admin, upload.single('image'), async (req, res) => {
  try {
    const blogId = req.params.id;
    const { title, description, content, category, status, tags } = req.body;

    if (!blogId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid blog ID format'
      });
    }

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    // Update fields
    if (title) blog.title = title;
    if (description) blog.description = description;
    if (content) blog.content = content;
    if (category) blog.category = category;
    if (status) blog.status = status;
    
    // Handle tags
    if (tags) {
      try {
        blog.tags = JSON.parse(tags);
      } catch (e) {
        blog.tags = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      }
    }

    // Handle image upload
    if (req.file) {
      blog.image = `/uploads/${req.file.filename}`;
    }

    await blog.save();

    const updatedBlog = await Blog.findById(blogId).populate('author', 'name email');

    res.json({
      success: true,
      message: 'Blog updated successfully',
      data: updatedBlog
    });
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update blog',
      error: error.message
    });
  }
});

// DELETE blog WITH NOTIFICATION
router.delete('/blogs/:id', protect, admin, async (req, res) => {
  try {
    const blogId = req.params.id;

    if (!blogId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid blog ID format'
      });
    }

    const blog = await Blog.findById(blogId).populate('author', 'name');

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    const blogTitle = blog.title;
    const authorId = blog.author._id;
    const authorName = blog.author.name;

    await Blog.findByIdAndDelete(blogId);

    // CREATE NOTIFICATION FOR BLOG DELETION
    await createNotification({
      userId: authorId,
      message: `Blog "${blogTitle}" by ${authorName} has been deleted by admin`,
      status: 'rejected',
      reason: 'Blog removed by admin moderation',
      respondedBy: req.user._id,
      type: 'blog_report'
    });

    res.json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete blog',
      error: error.message
    });
  }
});

// PUT - Update blog status WITH NOTIFICATION
router.put('/blogs/:id/status', protect, admin, async (req, res) => {
  try {
    const blogId = req.params.id;
    const { status } = req.body;

    if (!blogId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid blog ID format'
      });
    }

    if (!['draft', 'published'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Use "draft" or "published"'
      });
    }

    const blog = await Blog.findByIdAndUpdate(
      blogId,
      { status },
      { new: true }
    ).populate('author', 'name email');

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    // CREATE NOTIFICATION FOR BLOG STATUS CHANGE
    const notificationMessage = status === 'published' 
      ? `Blog "${blog.title}" has been published`
      : `Blog "${blog.title}" has been unpublished and moved to drafts`;

    await createNotification({
      userId: blog.author._id,
      message: notificationMessage,
      status: status === 'published' ? 'approved' : 'pending',
      reason: status === 'published' ? 'Blog approved and published' : 'Blog moved to drafts by admin',
      respondedBy: req.user._id,
      type: 'blog_report'
    });

    res.json({
      success: true,
      message: `Blog ${status === 'published' ? 'published' : 'unpublished'} successfully`,
      data: blog
    });
  } catch (error) {
    console.error('Error updating blog status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update blog status',
      error: error.message
    });
  }
});

// ==================== ADMIN REQUEST MANAGEMENT ====================
router.get('/requests', protect, admin, async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    if (status && status !== 'all' && ['pending', 'approved', 'rejected'].includes(status)) query.status = status;
    const requests = await AdminRequest.find(query).populate('user', 'name email').populate('respondedBy', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, data: requests, count: requests.length });
  } catch (error) {
    console.error('Error fetching admin requests:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch admin requests', error: error.message });
  }
});

router.put('/requests/:id/accept', protect, admin, async (req, res) => {
  try {
    const requestId = req.params.id;
    if (!requestId.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).json({ success: false, message: 'Invalid request ID format' });
    const adminRequest = await AdminRequest.findById(requestId).populate('user', 'name email role');
    if (!adminRequest) return res.status(404).json({ success: false, message: 'Admin request not found' });
    if (adminRequest.status !== 'pending') return res.status(400).json({ success: false, message: `This request has already been ${adminRequest.status}` });
    if (adminRequest.user.role === 'admin') return res.status(400).json({ success: false, message: 'User is already an admin' });
    adminRequest.status = 'approved';
    adminRequest.adminResponse = 'Your request has been approved';
    adminRequest.respondedBy = req.user._id;
    adminRequest.respondedAt = Date.now();
    await adminRequest.save();
    await User.findByIdAndUpdate(adminRequest.user._id, { role: 'admin' });
    await createNotification({ userId: adminRequest.user._id, requestId: adminRequest._id, message: `Admin request for "${adminRequest.user.name}" has been approved!`, status: 'approved', reason: adminRequest.adminResponse, respondedBy: req.user._id, type: 'admin_request' });
    res.json({ success: true, message: 'Admin request approved successfully', data: adminRequest });
  } catch (error) {
    console.error('Error accepting admin request:', error);
    res.status(500).json({ success: false, message: 'Failed to accept admin request', error: error.message });
  }
});

router.post('/requests/:id/approve', protect, admin, async (req, res) => {
  try {
    const requestId = req.params.id;
    const { response } = req.body;
    if (!requestId.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).json({ success: false, message: 'Invalid request ID format' });
    const adminRequest = await AdminRequest.findById(requestId).populate('user', 'name email role');
    if (!adminRequest) return res.status(404).json({ success: false, message: 'Admin request not found' });
    if (adminRequest.status !== 'pending') return res.status(400).json({ success: false, message: `This request has already been ${adminRequest.status}` });
    if (adminRequest.user.role === 'admin') return res.status(400).json({ success: false, message: 'User is already an admin' });
    adminRequest.status = 'approved';
    adminRequest.adminResponse = response || 'Your request has been approved';
    adminRequest.respondedBy = req.user._id;
    adminRequest.respondedAt = Date.now();
    await adminRequest.save();
    await User.findByIdAndUpdate(adminRequest.user._id, { role: 'admin' });
    await createNotification({ userId: adminRequest.user._id, requestId: adminRequest._id, message: `Admin request for "${adminRequest.user.name}" has been approved!`, status: 'approved', reason: adminRequest.adminResponse, respondedBy: req.user._id, type: 'admin_request' });
    res.json({ success: true, message: 'Admin request approved successfully', data: adminRequest });
  } catch (error) {
    console.error('Error approving admin request:', error);
    res.status(500).json({ success: false, message: 'Failed to approve admin request', error: error.message });
  }
});

router.post('/requests/:id/reject', protect, admin, async (req, res) => {
  try {
    const requestId = req.params.id;
    const { response } = req.body;
    if (!requestId.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).json({ success: false, message: 'Invalid request ID format' });
    const adminRequest = await AdminRequest.findById(requestId).populate('user', 'name email');
    if (!adminRequest) return res.status(404).json({ success: false, message: 'Admin request not found' });
    if (adminRequest.status !== 'pending') return res.status(400).json({ success: false, message: `This request has already been ${adminRequest.status}` });
    adminRequest.status = 'rejected';
    adminRequest.adminResponse = response || 'Your request has been rejected';
    adminRequest.respondedBy = req.user._id;
    adminRequest.respondedAt = Date.now();
    await adminRequest.save();
    await createNotification({ userId: adminRequest.user._id, requestId: adminRequest._id, message: `Admin request for "${adminRequest.user.name}" has been rejected`, status: 'rejected', reason: adminRequest.adminResponse, respondedBy: req.user._id, type: 'admin_request' });
    res.json({ success: true, message: 'Admin request rejected successfully', data: adminRequest });
  } catch (error) {
    console.error('Error rejecting admin request:', error);
    res.status(500).json({ success: false, message: 'Failed to reject admin request', error: error.message });
  }
});

module.exports = router;