// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  getUserBlogs,
  getAllUsers
} = require('../controllers/userController');

// @route   GET /api/users
router.get('/', getAllUsers);

// @route   GET /api/users/:id
router.get('/:id', getUserProfile);

// @route   GET /api/users/:id/blogs
router.get('/:id/blogs', getUserBlogs);

module.exports = router;