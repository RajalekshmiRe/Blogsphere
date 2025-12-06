// backend/models/AdminRequest.js
const mongoose = require('mongoose');

const adminRequestSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  reason: {
    type: String,
    required: [true, 'Please provide a reason for requesting admin access'],
    minlength: [20, 'Reason must be at least 20 characters'],
    maxlength: [1000, 'Reason cannot exceed 1000 characters']
  },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  adminResponse: {
    type: String,
    default: ''
  },
  respondedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  respondedAt: {
    type: Date
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Add indexes for better query performance
adminRequestSchema.index({ user: 1, status: 1 });
adminRequestSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('AdminRequest', adminRequestSchema);