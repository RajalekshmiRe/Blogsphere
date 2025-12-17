// backend/middleware/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Determine if we should use Cloudinary or local storage
const useCloudinary = process.env.NODE_ENV === 'production';

let storage;

if (useCloudinary) {
  // ✅ PRODUCTION: Use Cloudinary
  console.log('📦 Using Cloudinary storage for uploads');
  const { storage: cloudinaryStorage } = require('../config/cloudinary');
  storage = cloudinaryStorage;
} else {
  // ✅ DEVELOPMENT: Use local storage
  console.log('📁 Using local storage for uploads');
  
  // Ensure uploads directory exists
  const uploadsDir = path.join(__dirname, '../uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('✅ Created uploads directory:', uploadsDir);
  }

  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      const filename = `blog-${uniqueSuffix}${ext}`;
      console.log('💾 Saving file locally:', filename);
      cb(null, filename);
    }
  });
}

// Multer configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    console.log('🔍 Validating file:', file.originalname, file.mimetype);
    
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      console.log('✅ File validation passed');
      return cb(null, true);
    } else {
      console.log('❌ File validation failed');
      cb(new Error('Only image files (JPEG, PNG, GIF, WebP) are allowed!'));
    }
  }
});

// Export single file upload middleware
module.exports = upload.single('image');
