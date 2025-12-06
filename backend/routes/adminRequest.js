// routes/adminRequest.js
const express = require('express');
const router = express.Router();
const AdminRequest = require('../models/AdminRequest');
const User = require('../models/User');
const { protect, admin } = require('../middleware/auth');

// 1. User: submit a request (UPDATED - now accepts reason)
router.post('/request-admin', protect, async (req, res) => {
  try {
    const { reason } = req.body;

    // Validate reason
    if (!reason || reason.trim().length < 20) {
      return res.status(400).json({ 
        message: 'Please provide a detailed reason (at least 20 characters)' 
      });
    }

    // Check if user is already admin
    if (req.user.role === 'admin') {
      return res.status(400).json({ message: 'You already have admin access' });
    }

    // Check for existing request
    const existing = await AdminRequest.findOne({ user: req.user._id });
    if (existing) {
      // If previous request was rejected, allow new submission
      if (existing.status === 'rejected') {
        // Delete old rejected request
        await AdminRequest.deleteOne({ _id: existing._id });
      } else {
        return res.status(400).json({ 
          message: 'You already have a pending or approved request' 
        });
      }
    }

    // Create new request
    const reqDoc = new AdminRequest({ 
      user: req.user._id,
      reason: reason.trim()
    });
    await reqDoc.save();
    
    // Populate user details
    await reqDoc.populate('user', 'name email');

    return res.status(201).json({ 
      message: 'Request submitted successfully', 
      request: reqDoc 
    });
  } catch (err) {
    console.error('Error submitting admin request:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// 2. User: get their request status
router.get('/my-admin-request', protect, async (req, res) => {
  try {
    const reqDoc = await AdminRequest.findOne({ user: req.user._id })
      .populate('user', 'name email')
      .populate('respondedBy', 'name email')
      .sort({ createdAt: -1 });
    
    if (!reqDoc) {
      return res.status(404).json({ message: 'No request found' });
    }
    
    return res.json({ request: reqDoc });
  } catch (err) {
    console.error('Error fetching admin request:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// 3. User: delete/cancel request (only if pending)
router.delete('/cancel-request', protect, async (req, res) => {
  try {
    const reqDoc = await AdminRequest.findOne({ user: req.user._id });
    if (!reqDoc) {
      return res.status(404).json({ message: 'No request found' });
    }
    
    if (reqDoc.status !== 'pending') {
      return res.status(400).json({ 
        message: 'Cannot cancel request after admin decision' 
      });
    }

    await AdminRequest.deleteOne({ _id: reqDoc._id });
    return res.json({ message: 'Request cancelled successfully' });
  } catch (err) {
    console.error('Error cancelling request:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// --- Admin routes: list all requests, approve / reject ---

// 4. Admin: Get all requests (with optional status filter)
router.get('/all-requests', protect, admin, async (req, res) => {
  try {
    const { status } = req.query;
    
    let filter = {};
    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      filter.status = status;
    }

    const all = await AdminRequest.find(filter)
      .populate('user', 'name email')
      .populate('respondedBy', 'name email')
      .sort({ createdAt: -1 });
    
    return res.json({ 
      requests: all,
      count: all.length 
    });
  } catch (err) {
    console.error('Error fetching all requests:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// 5. Admin: Approve or reject a request (FIXED VERSION)
router.put('/requests/:id/decision', protect, admin, async (req, res) => {
  try {
    const { decision, adminResponse } = req.body;
    
    // Validate decision
    if (!['approved', 'rejected'].includes(decision)) {
      return res.status(400).json({ message: 'Invalid decision. Use "approved" or "rejected"' });
    }

    // Find request
    const reqDoc = await AdminRequest.findById(req.params.id).populate('user', 'name email role');
    if (!reqDoc) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Check if already processed
    if (reqDoc.status !== 'pending') {
      return res.status(400).json({ 
        message: 'This request has already been processed' 
      });
    }

    // Update request
    reqDoc.status = decision;
    reqDoc.adminResponse = adminResponse || '';
    reqDoc.respondedBy = req.user._id;
    reqDoc.respondedAt = new Date();
    await reqDoc.save();

    // If approved — promote user to admin role
    if (decision === 'approved') {
      console.log('Promoting user to admin:', reqDoc.user._id);
      
      const updatedUser = await User.findByIdAndUpdate(
        reqDoc.user._id,
        { role: 'admin' },
        { new: true, runValidators: true }
      );

      if (!updatedUser) {
        console.error('User not found for promotion:', reqDoc.user._id);
        return res.status(404).json({ message: 'User not found for promotion' });
      }

      console.log('User promoted successfully:', updatedUser.email, 'New role:', updatedUser.role);
    }

    // Populate details before sending response
    await reqDoc.populate('respondedBy', 'name email');

    return res.json({ 
      message: `Request ${decision} successfully`, 
      request: reqDoc 
    });
  } catch (err) {
    console.error('Error processing request decision:', err);
    return res.status(500).json({ 
      error: 'Server error',
      message: err.message 
    });
  }
});

// 6. Admin: Delete a request
router.delete('/requests/:id', protect, admin, async (req, res) => {
  try {
    const reqDoc = await AdminRequest.findById(req.params.id);
    if (!reqDoc) {
      return res.status(404).json({ message: 'Request not found' });
    }

    await AdminRequest.deleteOne({ _id: reqDoc._id });
    return res.json({ message: 'Request deleted successfully' });
  } catch (err) {
    console.error('Error deleting request:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;