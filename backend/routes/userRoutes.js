// const express = require('express');
// const router = express.Router();
// const {
//   getUserProfile,
//   updateProfile,
//   getMyBlogs
// } = require('../controllers/userController');
// const { protect } = require('../middleware/auth');

// router.get('/profile', protect, updateProfile);
// router.put('/profile', protect, updateProfile);
// router.get('/my-blogs', protect, getMyBlogs);
// router.get('/:id', getUserProfile);

// module.exports = router;


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