// controllers/userController.js
const User = require('../models/User');
const Blog = require('../models/Blog');

// @desc    Get user profile
// @route   GET /api/users/:id
// @access  Public
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's blog count
    const blogCount = await Blog.countDocuments({ author: user._id });

    res.json({
      ...user.toObject(),
      blogCount
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(500).json({ message: 'Server error fetching user profile' });
  }
};

// @desc    Get user's authored blogs
// @route   GET /api/users/:id/blogs
// @access  Public
exports.getUserBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.params.id })
      .populate('author', 'username email profilePicture')
      .sort({ createdAt: -1 });

    res.json({ blogs, count: blogs.length });
  } catch (error) {
    console.error('Get user blogs error:', error);
    res.status(500).json({ message: 'Server error fetching user blogs' });
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Public (or Admin only - you can change)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ users, count: users.length });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error fetching users' });
  }
};