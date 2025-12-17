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
//     const { title, content, description, category, tags, status } = req.body;

//     // ✅ Handle image URL - works for both Cloudinary and local storage
//     let featuredImage = null;
//     if (req.file) {
//       // Cloudinary returns secure_url directly
//       if (req.file.secure_url) {
//         featuredImage = req.file.secure_url;
//         console.log('☁️ Cloudinary URL:', featuredImage);
//       } 
//       // Local storage returns filename
//       else if (req.file.filename) {
//         featuredImage = `/uploads/${req.file.filename}`;
//         console.log('📁 Local path:', featuredImage);
//       }
//       // Fallback to path (some multer versions)
//       else if (req.file.path) {
//         featuredImage = req.file.path;
//         console.log('📁 File path:', featuredImage);
//       }
//     }

//     const blog = new Blog({
//       title,
//       content,
//       description,
//       category,
//       tags: tags ? JSON.parse(tags) : [],
//       featuredImage, // ✅ Store the full URL or relative path
//       author: req.user._id,
//       status: status || 'draft'
//     });

//     await blog.save();

//     res.status(201).json({
//       success: true,
//       message: 'Blog created successfully',
//       data: blog
//     });
//   } catch (error) {
//     console.error('Error creating blog:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Server error',
//       error: error.message 
//     });
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

//     // ✅ Handle image update - works for both Cloudinary and local storage
// if (req.file) {
//   if (req.file.secure_url) {
//     blog.featuredImage = req.file.secure_url;
//     console.log('☁️ Updated Cloudinary URL:', req.file.secure_url);
//   } 
//   else if (req.file.filename) {
//     blog.featuredImage = `/uploads/${req.file.filename}`;
//     console.log('📁 Updated local path:', `/uploads/${req.file.filename}`);
//   }
//   else if (req.file.path) {
//     blog.featuredImage = req.file.path;
//     console.log('📁 Updated file path:', req.file.path);
//   }
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

// // ============================================
// // PUBLISH BLOG
// // ============================================
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
//   unlikeBlog
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
    const { title, content, description, category, tags, status } = req.body;

    // ✅ Handle image URL - works for both Cloudinary and local storage
    let featuredImage = null;
    if (req.file) {
      // Cloudinary returns secure_url directly
      if (req.file.secure_url) {
        featuredImage = req.file.secure_url;
        console.log('☁️ Cloudinary URL:', featuredImage);
      } 
      // Local storage returns filename
      else if (req.file.filename) {
        featuredImage = `/uploads/${req.file.filename}`;
        console.log('📁 Local path:', featuredImage);
      }
      // Fallback to path (some multer versions)
      else if (req.file.path) {
        featuredImage = req.file.path;
        console.log('📁 File path:', featuredImage);
      }
    }

    const blog = new Blog({
      title,
      content,
      description,
      category,
      tags: tags ? JSON.parse(tags) : [],
      featuredImage,
      author: req.user._id,
      status: status || 'draft'
    });

    await blog.save();

    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      data: blog
    });
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
};

// ============================================
// GET ALL BLOGS
// ============================================
const getBlogs = async (req, res) => {
  try {
    const { status, author, search, page = 1, limit = 10, category } = req.query;
    
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

    if (category && category !== 'All') {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const blogs = await Blog.find(query)
      .populate('author', 'name email profilePicture')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Blog.countDocuments(query);

    res.json({
      success: true,
      data: blogs,
      blogs,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
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
      .populate('author', 'name email profilePicture')
      .populate('comments.author', 'name profilePicture');

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    // Increment views
    blog.views += 1;
    await blog.save();

    res.json({ 
      success: true, 
      data: blog,
      blog 
    });
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
        blog.tags = JSON.parse(tags);
      } catch {
        blog.tags = tags.split(',').map(t => t.trim());
      }
    }

    // ✅ Handle image update - works for both Cloudinary and local storage
    if (req.file) {
      if (req.file.secure_url) {
        blog.featuredImage = req.file.secure_url;
        console.log('☁️ Updated Cloudinary URL:', req.file.secure_url);
      } 
      else if (req.file.filename) {
        blog.featuredImage = `/uploads/${req.file.filename}`;
        console.log('📁 Updated local path:', `/uploads/${req.file.filename}`);
      }
      else if (req.file.path) {
        blog.featuredImage = req.file.path;
        console.log('📁 Updated file path:', req.file.path);
      }
    }

    blog.updatedAt = Date.now();
    await blog.save();

    res.json({ 
      success: true, 
      message: 'Blog updated successfully', 
      data: blog,
      blog 
    });

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
    const blog = await Blog.findById(blogId).populate('author', 'name');
    
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
      
      return res.json({ success: true, message: "Blog submitted for approval", data: blog, blog });
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
      
      return res.json({ success: true, message: wasUnpublished ? "Blog republished" : "Blog published", data: blog, blog });
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
    
    const blog = await Blog.findById(blogId).populate('author', 'name');
    
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
    blog.unpublishedAt = new Date();
    await blog.save();
    
    await createNotification({
      type: 'blog_action',
      message: `Blog "${blog.title}" has been unpublished and moved to drafts`,
      reason: reason || (wasPublished ? 'Blog unpublished by admin' : 'Blog moved to drafts by admin'),
      status: 'approved',
      blogId: blog._id,
      userId: blog.author._id,
      respondedBy: req.user._id,
      isRead: false
    });
    
    return res.json({ 
      success: true, 
      message: "Blog unpublished successfully",
      data: blog,
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
    
    const blog = await Blog.findById(blogId).populate('author', 'name');
    
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
      data: blog,
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
    
    const blog = await Blog.findById(blogId).populate('author', 'name');
    
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
      data: blog,
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
      blog.likes = blog.likes.filter(
        (userId) => userId.toString() !== req.user._id.toString()
      );
      await blog.save();
      return res.json({
        success: true,
        message: 'Blog unliked successfully',
        likes: blog.likes.length
      });
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