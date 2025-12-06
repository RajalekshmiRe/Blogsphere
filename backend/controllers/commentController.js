// controllers/commentController.js
const Comment = require('../models/Comment');
const Blog = require('../models/Blog');
const { validationResult } = require('express-validator');

// @desc    Add comment to blog
// @route   POST /api/comments
// @access  Private
exports.addComment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { blogId, content } = req.body;

    // Validate blogId and content
    if (!blogId || !content || content.trim() === '') {
      return res.status(400).json({ success: false, message: 'Blog ID and content are required' });
    }

    // Check if blog exists
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    // Create comment
    const comment = await Comment.create({
      blog: blogId,
      author: req.user._id,
      content
    });

    // Add comment to blog's comments array
    blog.comments = blog.comments || [];
    blog.comments.push(comment._id);
    await blog.save();

    // Populate author for frontend display - FIXED: Changed 'username' to 'name'
    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'name email profilePicture');

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      comment: populatedComment
    });

  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ success: false, message: 'Server error adding comment' });
  }
};

// @desc    Get all comments for a blog
// @route   GET /api/comments/blog/:blogId
// @access  Public
exports.getCommentsByBlog = async (req, res) => {
  try {
    // FIXED: Changed 'username' to 'name'
    const comments = await Comment.find({ blog: req.params.blogId })
      .populate('author', 'name email profilePicture')
      .sort({ createdAt: -1 });

    res.json({ success: true, comments, count: comments.length });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching comments' });
  }
};

// @desc    Update comment
// @route   PUT /api/comments/:id
// @access  Private
exports.updateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    // Check if user is comment author
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this comment' });
    }

    comment.content = req.body.content || comment.content;
    comment.updatedAt = Date.now();

    const updatedComment = await comment.save();
    
    // FIXED: Changed 'username' to 'name'
    const populatedComment = await Comment.findById(updatedComment._id)
      .populate('author', 'name email profilePicture');

    res.json({ success: true, message: 'Comment updated successfully', comment: populatedComment });
  } catch (error) {
    console.error('Update comment error:', error);
    res.status(500).json({ success: false, message: 'Server error updating comment' });
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    // Check if user is comment author or admin
    if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this comment' });
    }

    // Remove comment from blog's comments array
    await Blog.findByIdAndUpdate(comment.blog, {
      $pull: { comments: comment._id }
    });

    await comment.deleteOne();

    res.json({ success: true, message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ success: false, message: 'Server error deleting comment' });
  }
};

// @desc    Get all comments by user
// @route   GET /api/comments/user/:userId
// @access  Public
exports.getCommentsByUser = async (req, res) => {
  try {
    // FIXED: Changed 'username' to 'name'
    const comments = await Comment.find({ author: req.params.userId })
      .populate('blog', 'title')
      .populate('author', 'name email profilePicture')
      .sort({ createdAt: -1 });

    res.json({ success: true, comments, count: comments.length });
  } catch (error) {
    console.error('Get user comments error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching user comments' });
  }
};