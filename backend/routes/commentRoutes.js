const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const {
  addComment,
  getCommentsByBlog,
  updateComment,
  deleteComment,
  getCommentsByUser
} = require('../controllers/commentController');

// Validation middleware
const commentValidation = [
  body('content').trim().isLength({ min: 1 }).withMessage('Comment cannot be empty'),
  body('blogId').notEmpty().withMessage('Blog ID is required')
];

// Public routes
router.get('/blog/:blogId', getCommentsByBlog);
router.get('/user/:userId', getCommentsByUser);

// Protected routes
router.post('/', protect, commentValidation, addComment);
router.put('/:id', protect, updateComment);
router.delete('/:id', protect, deleteComment);

module.exports = router;
