// // backend/controllers/blogController.js
// const Blog = require('../models/Blog');
// const Notification = require('../models/Notification');
// const User = require('../models/User');

// // ============================================
// // HELPER: Create notification
// // ============================================
// const createNotification = async (notificationData) => {
//   try {
//     const notification = new Notification(notificationData);
//     await notification.save();
//     console.log('✅ Notification created:', notification);
//     return notification;
//   } catch (error) {
//     console.error('❌ Error creating notification:', error);
//   }
// };

// // ============================================
// // CREATE BLOG
// // ============================================
// const createBlog = async (req, res) => {
//   try {
//     const { title, content, excerpt, tags, coverImage } = req.body;

//     const blog = new Blog({
//       title,
//       content,
//       excerpt,
//       tags: tags || [],
//       coverImage,
//       author: req.user._id,
//       status: 'draft'
//     });

//     await blog.save();
    
//     res.status(201).json({
//       success: true,
//       message: 'Blog created successfully',
//       blog
//     });
//   } catch (error) {
//     console.error('Error creating blog:', error);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// };

// // ============================================
// // GET ALL BLOGS
// // ============================================
// const getBlogs = async (req, res) => {
//   try {
//     const { status, author, search, page = 1, limit = 10 } = req.query;
    
//     const query = {};
    
//     // Only show published blogs to non-authenticated users
//     if (!req.user) {
//       query.status = 'published';
//     } else if (status) {
//       query.status = status;
//     }
    
//     if (author) {
//       query.author = author;
//     }
    
//     if (search) {
//       query.$or = [
//         { title: { $regex: search, $options: 'i' } },
//         { content: { $regex: search, $options: 'i' } }
//       ];
//     }

//     const blogs = await Blog.find(query)
//       .populate('author', 'username email profilePicture')
//       .sort({ createdAt: -1 })
//       .skip((page - 1) * limit)
//       .limit(parseInt(limit));

//     const total = await Blog.countDocuments(query);

//     res.json({
//       success: true,
//       blogs,
//       pagination: {
//         page: parseInt(page),
//         limit: parseInt(limit),
//         total,
//         pages: Math.ceil(total / limit)
//       }
//     });
//   } catch (error) {
//     console.error('Error fetching blogs:', error);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// };

// // ============================================
// // GET BLOG BY ID
// // ============================================
// const getBlogById = async (req, res) => {
//   try {
//     const blog = await Blog.findById(req.params.id)
//       .populate('author', 'username email profilePicture')
//       .populate('comments.author', 'username profilePicture');

//     if (!blog) {
//       return res.status(404).json({ success: false, message: 'Blog not found' });
//     }

//     // Increment views
//     blog.views += 1;
//     await blog.save();

//     res.json({ success: true, blog });
//   } catch (error) {
//     console.error('Error fetching blog:', error);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// };

// // ============================================
// // UPDATE BLOG
// // ============================================
// const updateBlog = async (req, res) => {
//   try {
//     const blog = await Blog.findById(req.params.id);

//     if (!blog) {
//       return res.status(404).json({ success: false, message: 'Blog not found' });
//     }

//     // Permission check
//     if (blog.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
//       return res.status(403).json({ success: false, message: 'Unauthorized' });
//     }

//     // --- Extract fields ---
//     const {
//       title,
//       description,
//       content,
//       category,
//       status,
//       excerpt,
//       tags
//     } = req.body;

//     // --- Update basic fields ---
//     blog.title = title || blog.title;
//     blog.description = description || blog.description;
//     blog.content = content || blog.content;
//     blog.category = category || blog.category;
//     blog.status = status || blog.status;
//     blog.excerpt = excerpt || blog.excerpt;

//     // --- Parse tags ---
//     if (tags) {
//       try {
//         blog.tags = JSON.parse(tags); // frontend sends JSON string
//       } catch {
//         blog.tags = tags.split(',').map(t => t.trim());
//       }
//     }

//     // --- Image Upload (multer required) ---
//     if (req.file) {
//       blog.coverImage = req.file.path;     // store path
//     }

//     blog.updatedAt = Date.now();
//     await blog.save();

//     res.json({ success: true, message: 'Blog updated successfully', blog });

//   } catch (error) {
//     console.error('Error updating blog:', error);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// };


// // ============================================
// // DELETE BLOG
// // ============================================
// const deleteBlog = async (req, res) => {
//   try {
//     const blog = await Blog.findById(req.params.id);

//     if (!blog) {
//       return res.status(404).json({ success: false, message: 'Blog not found' });
//     }

//     // Check permission
//     if (blog.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
//       return res.status(403).json({ success: false, message: 'Unauthorized' });
//     }

//     await Blog.findByIdAndDelete(req.params.id);

//     res.json({
//       success: true,
//       message: 'Blog deleted successfully'
//     });
//   } catch (error) {
//     console.error('Error deleting blog:', error);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// };


// // backend/controllers/blogController.js - PUBLISH & UNPUBLISH SECTIONS

// const publishBlog = async (req, res) => {
//   try {
//     const { blogId } = req.params;
//     const blog = await Blog.findById(blogId).populate('author', 'username name');
    
//     if (!blog) {
//       return res.status(404).json({ success: false, message: "Blog not found" });
//     }

//     if (blog.author._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
//       return res.status(403).json({ success: false, message: "Unauthorized" });
//     }

//     const wasUnpublished = blog.unpublishedAt && blog.status === 'draft';
//     const requiresApproval = req.user.role !== 'admin';
    
//     if (requiresApproval) {
//       blog.status = 'pending';
//       await blog.save();
      
//       // ✅ Smart message
//       const message = wasUnpublished 
//         ? `Blog "${blog.title}" has been resubmitted for approval after being unpublished`
//         : `Blog "${blog.title}" has been submitted for approval`;
      
//       await createNotification({
//         type: 'blog_action',
//         message,
//         reason: wasUnpublished ? 'Blog resubmitted - awaiting review' : 'Blog submitted for approval',
//         status: 'pending',
//         blogId: blog._id,
//         userId: blog.author._id,
//         isRead: false
//       });
      
//       return res.json({ success: true, message: "Blog submitted for approval", blog });
//     } else {
//       blog.status = 'published';
//       blog.publishedAt = new Date();
//       await blog.save();
      
//       const message = wasUnpublished
//         ? `Blog "${blog.title}" has been republished`
//         : `Blog "${blog.title}" has been published`;
      
//       await createNotification({
//         type: 'blog_action',
//         message,
//         reason: wasUnpublished ? 'Blog republished' : 'Blog published',
//         status: 'approved',
//         blogId: blog._id,
//         userId: blog.author._id,
//         respondedBy: req.user._id,
//         isRead: false
//       });
      
//       return res.json({ success: true, message: wasUnpublished ? "Blog republished" : "Blog published", blog });
//     }
//   } catch (error) {
//     console.error('Error publishing blog:', error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };
// // ============================================
// // UNPUBLISH BLOG (track unpublish history)
// // ============================================
// const unpublishBlog = async (req, res) => {
//   try {
//     const { blogId } = req.params;
//     const { reason } = req.body;
    
//     const blog = await Blog.findById(blogId).populate('author', 'username name');
    
//     if (!blog) {
//       return res.status(404).json({ success: false, message: "Blog not found" });
//     }

//     // Check permission
//     if (blog.author._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
//       return res.status(403).json({ success: false, message: "Unauthorized" });
//     }

//     const wasPublished = blog.status === 'published';
    
//     // Immediately move to drafts
//     blog.status = 'draft';
//     blog.unpublishedAt = new Date(); // ✅ Track when it was unpublished
//     await blog.save();
    
//     // ✅ Smart notification - always APPROVED since action is complete
//     await createNotification({
//       type: 'blog_action',
//       message: `Blog "${blog.title}" has been unpublished and moved to drafts`,
//       reason: reason || (wasPublished ? 'Blog unpublished by admin' : 'Blog moved to drafts by admin'),
//       status: 'approved', // ✅ Always approved - action is complete
//       blogId: blog._id,
//       userId: blog.author._id,
//       respondedBy: req.user._id,
//       isRead: false
//     });
    
//     return res.json({ 
//       success: true, 
//       message: "Blog unpublished successfully",
//       blog
//     });
//   } catch (error) {
//     console.error('Error unpublishing blog:', error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // ============================================
// // APPROVE BLOG (Admin only)
// // ============================================
// const approveBlog = async (req, res) => {
//   try {
//     const { blogId } = req.params;
    
//     const blog = await Blog.findById(blogId).populate('author', 'username');
    
//     if (!blog) {
//       return res.status(404).json({ success: false, message: "Blog not found" });
//     }

//     if (blog.status !== 'pending') {
//       return res.status(400).json({ success: false, message: "Blog is not pending approval" });
//     }

//     // Approve and publish
//     blog.status = 'published';
//     blog.publishedAt = new Date();
//     await blog.save();
    
//     // Update existing PENDING notification to APPROVED
//     await Notification.findOneAndUpdate(
//       { blogId: blog._id, status: 'pending' },
//       { 
//         status: 'approved',
//         message: `Blog "${blog.title}" has been approved and published`,
//         reason: 'Blog approved by admin',
//         respondedBy: req.user._id,
//         updatedAt: new Date()
//       }
//     );
    
//     return res.json({ 
//       success: true, 
//       message: "Blog approved and published",
//       blog
//     });
//   } catch (error) {
//     console.error('Error approving blog:', error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // ============================================
// // REJECT BLOG (Admin only)
// // ============================================
// const rejectBlog = async (req, res) => {
//   try {
//     const { blogId } = req.params;
//     const { reason } = req.body;
    
//     const blog = await Blog.findById(blogId).populate('author', 'username');
    
//     if (!blog) {
//       return res.status(404).json({ success: false, message: "Blog not found" });
//     }

//     if (blog.status !== 'pending') {
//       return res.status(400).json({ success: false, message: "Blog is not pending approval" });
//     }

//     // Reject and move to drafts
//     blog.status = 'rejected';
//     await blog.save();
    
//     // Update existing PENDING notification to REJECTED
//     await Notification.findOneAndUpdate(
//       { blogId: blog._id, status: 'pending' },
//       { 
//         status: 'rejected',
//         message: `Blog "${blog.title}" has been rejected`,
//         reason: reason || 'Blog rejected by admin',
//         respondedBy: req.user._id,
//         updatedAt: new Date()
//       }
//     );
    
//     return res.json({ 
//       success: true, 
//       message: "Blog rejected",
//       blog
//     });
//   } catch (error) {
//     console.error('Error rejecting blog:', error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // ============================================
// // LIKE BLOG
// // ============================================
// const likeBlog = async (req, res) => {
//   try {
//     const blog = await Blog.findById(req.params.id);

//     if (!blog) {
//       return res.status(404).json({ success: false, message: 'Blog not found' });
//     }

//     // Check if already liked
//     if (blog.likes.includes(req.user._id)) {
//       return res.status(400).json({ success: false, message: 'Blog already liked' });
//     }

//     blog.likes.push(req.user._id);
//     await blog.save();

//     res.json({
//       success: true,
//       message: 'Blog liked successfully',
//       likes: blog.likes.length
//     });
//   } catch (error) {
//     console.error('Error liking blog:', error);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// };

// // ============================================
// // UNLIKE BLOG
// // ============================================
// const unlikeBlog = async (req, res) => {
//   try {
//     const blog = await Blog.findById(req.params.id);

//     if (!blog) {
//       return res.status(404).json({ success: false, message: 'Blog not found' });
//     }

//     blog.likes = blog.likes.filter(
//       (userId) => userId.toString() !== req.user._id.toString()
//     );
//     await blog.save();

//     res.json({
//       success: true,
//       message: 'Blog unliked successfully',
//       likes: blog.likes.length
//     });
//   } catch (error) {
//     console.error('Error unliking blog:', error);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// };

// // ============================================
// // COMMENT ON BLOG
// // ============================================
// const commentOnBlog = async (req, res) => {
//   try {
//     const { content } = req.body;
//     const blog = await Blog.findById(req.params.id);

//     if (!blog) {
//       return res.status(404).json({ success: false, message: 'Blog not found' });
//     }

//     const comment = {
//       author: req.user._id,
//       content,
//       createdAt: new Date()
//     };

//     blog.comments.push(comment);
//     await blog.save();

//     const populatedBlog = await Blog.findById(blog._id)
//       .populate('comments.author', 'username profilePicture');

//     res.json({
//       success: true,
//       message: 'Comment added successfully',
//       comments: populatedBlog.comments
//     });
//   } catch (error) {
//     console.error('Error commenting on blog:', error);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// };

// // ============================================
// // DELETE COMMENT
// // ============================================
// const deleteComment = async (req, res) => {
//   try {
//     const { commentId } = req.params;
//     const blog = await Blog.findById(req.params.id);

//     if (!blog) {
//       return res.status(404).json({ success: false, message: 'Blog not found' });
//     }

//     const comment = blog.comments.id(commentId);

//     if (!comment) {
//       return res.status(404).json({ success: false, message: 'Comment not found' });
//     }

//     // Check permission
//     if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
//       return res.status(403).json({ success: false, message: 'Unauthorized' });
//     }

//     blog.comments.pull(commentId);
//     await blog.save();

//     res.json({
//       success: true,
//       message: 'Comment deleted successfully'
//     });
//   } catch (error) {
//     console.error('Error deleting comment:', error);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// };

// // ============================================
// // EXPORTS
// // ============================================
// module.exports = {
//   createBlog,
//   getBlogs,
//   getBlogById,
//   updateBlog,
//   deleteBlog,
//   publishBlog,
//   unpublishBlog,
//   approveBlog,
//   rejectBlog,
//   likeBlog,
//   unlikeBlog,
//   commentOnBlog,
//   deleteComment
// };




// backend/controllers/blogController.js
const Blog = require('../models/Blog');
const Notification = require('../models/Notification');
const User = require('../models/User');

// ============================================
// HELPER: Create notification
// ============================================
const createNotification = async (notificationData) => {
  try {
    const notification = new Notification(notificationData);
    await notification.save();
    console.log('✅ Notification created:', notification);
    return notification;
  } catch (error) {
    console.error('❌ Error creating notification:', error);
  }
};

// ============================================
// CREATE BLOG
// ============================================
const createBlog = async (req, res) => {
  try {
    const { title, content, excerpt, tags, coverImage } = req.body;

    const blog = new Blog({
      title,
      content,
      excerpt,
      tags: tags || [],
      coverImage,
      author: req.user._id,
      status: 'draft'
    });

    await blog.save();
    
    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      blog
    });
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ============================================
// GET ALL BLOGS
// ============================================
const getBlogs = async (req, res) => {
  try {
    const { status, author, search, page = 1, limit = 10 } = req.query;
    
    const query = {};
    
    // Only show published blogs to non-authenticated users
    if (!req.user) {
      query.status = 'published';
    } else if (status) {
      query.status = status;
    }
    
    if (author) {
      query.author = author;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    const blogs = await Blog.find(query)
      .populate('author', 'username email profilePicture')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Blog.countDocuments(query);

    res.json({
      success: true,
      blogs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ============================================
// GET BLOG BY ID
// ============================================
const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'username email profilePicture')
      .populate('comments.author', 'username profilePicture');

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    // Increment views
    blog.views += 1;
    await blog.save();

    res.json({ success: true, blog });
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ============================================
// UPDATE BLOG
// ============================================
const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    // Permission check
    if (blog.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    // --- Extract fields ---
    const {
      title,
      description,
      content,
      category,
      status,
      excerpt,
      tags
    } = req.body;

    // --- Update basic fields ---
    blog.title = title || blog.title;
    blog.description = description || blog.description;
    blog.content = content || blog.content;
    blog.category = category || blog.category;
    blog.status = status || blog.status;
    blog.excerpt = excerpt || blog.excerpt;

    // --- Parse tags ---
    if (tags) {
      try {
        blog.tags = JSON.parse(tags); // frontend sends JSON string
      } catch {
        blog.tags = tags.split(',').map(t => t.trim());
      }
    }

    // --- Image Upload (multer required) ---
    if (req.file) {
      blog.coverImage = req.file.path;     // store path
    }

    blog.updatedAt = Date.now();
    await blog.save();

    res.json({ success: true, message: 'Blog updated successfully', blog });

  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ============================================
// DELETE BLOG
// ============================================
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    // Check permission
    if (blog.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    await Blog.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ============================================
// PUBLISH BLOG
// ============================================
const publishBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const blog = await Blog.findById(blogId).populate('author', 'username name');
    
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    if (blog.author._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const wasUnpublished = blog.unpublishedAt && blog.status === 'draft';
    const requiresApproval = req.user.role !== 'admin';
    
    if (requiresApproval) {
      blog.status = 'pending';
      await blog.save();
      
      // ✅ Smart message
      const message = wasUnpublished 
        ? `Blog "${blog.title}" has been resubmitted for approval after being unpublished`
        : `Blog "${blog.title}" has been submitted for approval`;
      
      await createNotification({
        type: 'blog_action',
        message,
        reason: wasUnpublished ? 'Blog resubmitted - awaiting review' : 'Blog submitted for approval',
        status: 'pending',
        blogId: blog._id,
        userId: blog.author._id,
        isRead: false
      });
      
      return res.json({ success: true, message: "Blog submitted for approval", blog });
    } else {
      blog.status = 'published';
      blog.publishedAt = new Date();
      await blog.save();
      
      const message = wasUnpublished
        ? `Blog "${blog.title}" has been republished`
        : `Blog "${blog.title}" has been published`;
      
      await createNotification({
        type: 'blog_action',
        message,
        reason: wasUnpublished ? 'Blog republished' : 'Blog published',
        status: 'approved',
        blogId: blog._id,
        userId: blog.author._id,
        respondedBy: req.user._id,
        isRead: false
      });
      
      return res.json({ success: true, message: wasUnpublished ? "Blog republished" : "Blog published", blog });
    }
  } catch (error) {
    console.error('Error publishing blog:', error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ============================================
// UNPUBLISH BLOG (track unpublish history)
// ============================================
const unpublishBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { reason } = req.body;
    
    const blog = await Blog.findById(blogId).populate('author', 'username name');
    
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    // Check permission
    if (blog.author._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const wasPublished = blog.status === 'published';
    
    // Immediately move to drafts
    blog.status = 'draft';
    blog.unpublishedAt = new Date(); // ✅ Track when it was unpublished
    await blog.save();
    
    // ✅ Smart notification - always APPROVED since action is complete
    await createNotification({
      type: 'blog_action',
      message: `Blog "${blog.title}" has been unpublished and moved to drafts`,
      reason: reason || (wasPublished ? 'Blog unpublished by admin' : 'Blog moved to drafts by admin'),
      status: 'approved', // ✅ Always approved - action is complete
      blogId: blog._id,
      userId: blog.author._id,
      respondedBy: req.user._id,
      isRead: false
    });
    
    return res.json({ 
      success: true, 
      message: "Blog unpublished successfully",
      blog
    });
  } catch (error) {
    console.error('Error unpublishing blog:', error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ============================================
// APPROVE BLOG (Admin only)
// ============================================
const approveBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    
    const blog = await Blog.findById(blogId).populate('author', 'username');
    
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    if (blog.status !== 'pending') {
      return res.status(400).json({ success: false, message: "Blog is not pending approval" });
    }

    // Approve and publish
    blog.status = 'published';
    blog.publishedAt = new Date();
    await blog.save();
    
    // Update existing PENDING notification to APPROVED
    await Notification.findOneAndUpdate(
      { blogId: blog._id, status: 'pending' },
      { 
        status: 'approved',
        message: `Blog "${blog.title}" has been approved and published`,
        reason: 'Blog approved by admin',
        respondedBy: req.user._id,
        updatedAt: new Date()
      }
    );
    
    return res.json({ 
      success: true, 
      message: "Blog approved and published",
      blog
    });
  } catch (error) {
    console.error('Error approving blog:', error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ============================================
// REJECT BLOG (Admin only)
// ============================================
const rejectBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { reason } = req.body;
    
    const blog = await Blog.findById(blogId).populate('author', 'username');
    
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    if (blog.status !== 'pending') {
      return res.status(400).json({ success: false, message: "Blog is not pending approval" });
    }

    // Reject and move to drafts
    blog.status = 'rejected';
    await blog.save();
    
    // Update existing PENDING notification to REJECTED
    await Notification.findOneAndUpdate(
      { blogId: blog._id, status: 'pending' },
      { 
        status: 'rejected',
        message: `Blog "${blog.title}" has been rejected`,
        reason: reason || 'Blog rejected by admin',
        respondedBy: req.user._id,
        updatedAt: new Date()
      }
    );
    
    return res.json({ 
      success: true, 
      message: "Blog rejected",
      blog
    });
  } catch (error) {
    console.error('Error rejecting blog:', error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ============================================
// LIKE BLOG
// ============================================
const likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    // Check if already liked
    if (blog.likes.includes(req.user._id)) {
      return res.status(400).json({ success: false, message: 'Blog already liked' });
    }

    blog.likes.push(req.user._id);
    await blog.save();

    res.json({
      success: true,
      message: 'Blog liked successfully',
      likes: blog.likes.length
    });
  } catch (error) {
    console.error('Error liking blog:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ============================================
// UNLIKE BLOG
// ============================================
const unlikeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    blog.likes = blog.likes.filter(
      (userId) => userId.toString() !== req.user._id.toString()
    );
    await blog.save();

    res.json({
      success: true,
      message: 'Blog unliked successfully',
      likes: blog.likes.length
    });
  } catch (error) {
    console.error('Error unliking blog:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ============================================
// EXPORTS
// ============================================
module.exports = {
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
};