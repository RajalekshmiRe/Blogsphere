// backend/routes/blogRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
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
  unlikeBlog
} = require('../controllers/blogController');
const { authenticate, isAdmin } = require('../middleware/auth');
const Blog = require('../models/Blog');

// ==============================
// PUBLIC ROUTES
// ==============================
router.get('/', getBlogs);

// ✅ Get blogs by author (MUST be before "/:id")
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

// ✅ Single blog (keep LAST)
router.get('/:id', getBlogById);

// ==============================
// PROTECTED ROUTES - ✅ FIXED FIELD NAME
// ==============================
// router.post('/', authenticate, upload.single('featuredImage'), createBlog);
// router.put('/:id', authenticate, upload.single('featuredImage'), updateBlog);
router.post('/', authenticate, upload, createBlog);
router.put('/:id', authenticate, upload, updateBlog);

router.delete('/:id', authenticate, deleteBlog);

// ==============================
// BLOG ACTIONS
// ==============================
router.post('/:blogId/publish', authenticate, publishBlog);
router.post('/:blogId/unpublish', authenticate, unpublishBlog);

// ==============================
// ADMIN ONLY
// ==============================
router.post('/:blogId/approve', authenticate, isAdmin, approveBlog);
router.post('/:blogId/reject', authenticate, isAdmin, rejectBlog);

// ==============================
// LIKE / UNLIKE
// ==============================
router.post('/:id/like', authenticate, likeBlog);
router.delete('/:id/like', authenticate, unlikeBlog);

module.exports = router;