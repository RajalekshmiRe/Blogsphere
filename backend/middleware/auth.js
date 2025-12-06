// backend/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Authenticate user
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ No token provided or invalid format');
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required - No token provided'
      });
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('🎫 Token received, verifying...');

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token decoded:', { userId: decoded.userId });
    
    // Find user
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      console.log('❌ User not found for ID:', decoded.userId);
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token - User not found'
      });
    }

    // Check if user is banned
    if (user.isBanned || !user.isActive) {
      console.log('❌ User account is banned:', user.email);
      return res.status(403).json({ 
        success: false, 
        message: 'Your account has been banned'
      });
    }

    console.log('✅ Authentication successful for:', user.email, 'Role:', user.role);

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error('❌ Auth middleware error:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired'
      });
    }
    
    res.status(401).json({ 
      success: false, 
      message: 'Authentication failed'
    });
  }
};

// Check if user is admin
const isAdmin = (req, res, next) => {
  console.log('🔍 Checking admin access for:', req.user?.email, 'Role:', req.user?.role);
  
  if (req.user && req.user.role === 'admin') {
    console.log('✅ Admin access granted');
    next();
  } else {
    console.log('❌ Admin access denied');
    res.status(403).json({ 
      success: false, 
      message: 'Admin access required'
    });
  }
};

// Export with multiple names for compatibility
module.exports = { 
  authenticate,
  protect: authenticate,  // Alias for compatibility
  isAdmin,
  admin: isAdmin          // Alias for compatibility
};