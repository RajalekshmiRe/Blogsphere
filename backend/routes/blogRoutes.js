// backend/routes/blogRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { 
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  publishBlog,
  unpublishBlog,
  approveBlog,
  rejectBlog,
  likeBlog,
  unlikeBlog,
  commentOnBlog,
  deleteComment
} = require('../controllers/blogController');
const { authenticate, isAdmin } = require('../middleware/auth');
const Blog = require('../models/Blog');

// Public routes
router.get('/', getBlogs);
router.get('/:id', getBlogById);

// ✅ NEW: Get blogs by author (for user dashboard)
router.get('/author/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const blogs = await Blog.find({ author: userId })
      .populate('author', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: blogs,
      count: blogs.length
    });
  } catch (error) {
    console.error('Error fetching blogs by author:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blogs',
      error: error.message
    });
  }
});

// Protected routes (require authentication)
router.post('/', authenticate, createBlog);
router.put('/:id', authenticate, upload.single('image'), updateBlog);
router.delete('/:id', authenticate, deleteBlog);

// Blog actions
router.post('/:blogId/publish', authenticate, publishBlog);
router.post('/:blogId/unpublish', authenticate, unpublishBlog);

// Admin only routes
router.post('/:blogId/approve', authenticate, isAdmin, approveBlog);
router.post('/:blogId/reject', authenticate, isAdmin, rejectBlog);

// Like/Unlike
router.post('/:id/like', authenticate, likeBlog);
router.delete('/:id/like', authenticate, unlikeBlog);

// Comments
router.post('/:id/comment', authenticate, commentOnBlog);
router.delete('/:id/comment/:commentId', authenticate, deleteComment);

module.exports = router;