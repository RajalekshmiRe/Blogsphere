// // backend/server.js
// const express = require('express');
// const dotenv = require('dotenv');
// const cors = require('cors');
// const path = require('path');
// const fs = require('fs');
// const connectDB = require('./config/db');

// // Load environment variables
// dotenv.config();

// // Connect to MongoDB
// connectDB();

// const app = express();

// // Create uploads directory if it doesn't exist
// const uploadsDir = path.join(__dirname, 'uploads');
// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir, { recursive: true });
//   console.log('✅ Created uploads directory');
// }

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Serve uploaded files
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // ==========================
// // 🚀 REGISTER ALL ROUTES HERE
// // ==========================

// // Auth
// app.use('/api/auth', require('./routes/authRoutes'));

// // Blogs
// app.use('/api/blogs', require('./routes/blogRoutes'));

// // Comments
// app.use('/api/comments', require('./routes/commentRoutes'));

// // Users
// app.use('/api/users', require('./routes/userRoutes'));

// // Admin Requests
// app.use('/api/admin-requests', require('./routes/adminRequest'));

// // Admin Routes (Dashboard, Notifications, Analytics, Users, Blogs)
// app.use('/api/admin', require('./routes/adminRoutes'));
// // Test route
// app.get('/', (req, res) => {
//   res.json({ message: 'Blogging Platform API is running!' });
// });

// // ==========================
// // GLOBAL ERROR HANDLER
// // ==========================
// app.use((err, req, res, next) => {
//   console.error('=== ERROR HANDLER ===');
//   console.error('Error:', err.message);
//   console.error('Stack:', err.stack);

//   // Multer file size error
//   if (err.code === 'LIMIT_FILE_SIZE') {
//     return res.status(400).json({
//       success: false,
//       message: 'File too large. Maximum size is 5MB'
//     });
//   }

//   if (err.message === 'Only image files are allowed!') {
//     return res.status(400).json({
//       success: false,
//       message: 'Only image files (JPEG, PNG, GIF, WebP) are allowed'
//     });
//   }

//   res.status(500).json({
//     success: false,
//     message: err.message || 'Server Error',
//     ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
//   });
// });

// // Start Server
// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
//   console.log(`📁 Uploads directory: ${uploadsDir}`);
//   console.log(`🌐 API Base URL: http://localhost:${PORT}`);
//   console.log(`✅ Admin Request Routes enabled`);
//   console.log(`✅ Admin Dashboard API enabled`);
//   console.log(`✅ Notifications API enabled`);
//   console.log(`✅ Export Reports API enabled`);
// });




// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('✅ Created uploads directory');
}

// ==========================
// 🔒 CORS CONFIGURATION
// ==========================
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://blogsphere-sgud.onrender.com',
  'https://blogging-platform-ecru.vercel.app',
  'https://blogging-platform-git-main-rajalekshmi-rejis-projects.vercel.app',
  'https://blogging-platform-6255qtymy-rajalekshmi-rejis-projects.vercel.app',
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (Postman, mobile apps, etc.)
    if (!origin) return callback(null, true);
    
    // Check if origin is allowed or matches Vercel pattern
    const isAllowed = allowedOrigins.includes(origin) || 
                     /^https:\/\/blogging-platform.*\.vercel\.app$/.test(origin);
    
    if (isAllowed) {
      console.log('✅ CORS allowed origin:', origin);
      callback(null, true);
    } else {
      console.log('❌ CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ==========================
// 🚀 REGISTER ALL ROUTES HERE
// ==========================

// Auth
app.use('/api/auth', require('./routes/authRoutes'));

// Blogs
app.use('/api/blogs', require('./routes/blogRoutes'));

// Comments
app.use('/api/comments', require('./routes/commentRoutes'));

// Users
app.use('/api/users', require('./routes/userRoutes'));

// Admin Requests
app.use('/api/admin-requests', require('./routes/adminRequest'));

// Admin Routes (Dashboard, Notifications, Analytics, Users, Blogs)
app.use('/api/admin', require('./routes/adminRoutes'));

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Blogging Platform API is running!',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// ==========================
// GLOBAL ERROR HANDLER
// ==========================
app.use((err, req, res, next) => {
  console.error('=== ERROR HANDLER ===');
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);

  // Multer file size error
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File too large. Maximum size is 5MB'
    });
  }

  if (err.message === 'Only image files are allowed!') {
    return res.status(400).json({
      success: false,
      message: 'Only image files (JPEG, PNG, GIF, WebP) are allowed'
    });
  }

  // CORS error
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      message: 'CORS policy: Origin not allowed'
    });
  }

  res.status(500).json({
    success: false,
    message: err.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📁 Uploads directory: ${uploadsDir}`);
  console.log(`🌐 API Base URL: http://localhost:${PORT}`);
  console.log(`✅ Admin Request Routes enabled`);
  console.log(`✅ Admin Dashboard API enabled`);
  console.log(`✅ Notifications API enabled`);
  console.log(`✅ Export Reports API enabled`);
});