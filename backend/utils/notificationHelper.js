// backend/utils/notificationHelper.js
const Notification = require('../models/Notification');

/**
 * Create a notification
 * @param {Object} notificationData - Notification data
 * @param {String} notificationData.userId - User ID to notify
 * @param {String} notificationData.message - Notification message
 * @param {String} notificationData.status - Status: pending, approved, rejected
 * @param {String} notificationData.type - Type: admin_request, blog_action, user_report, etc.
 * @param {String} notificationData.reason - Reason for notification
 * @param {String} notificationData.respondedBy - Admin ID who responded
 * @param {String} notificationData.requestId - Related request ID (optional)
 * @param {String} notificationData.blogId - Related blog ID (optional)
 */
const createNotification = async (notificationData) => {
  try {
    const notification = new Notification({
      userId: notificationData.userId,
      message: notificationData.message,
      status: notificationData.status || 'pending',
      type: notificationData.type || 'system',
      reason: notificationData.reason || '',
      respondedBy: notificationData.respondedBy || null,
      requestId: notificationData.requestId || null,
      blogId: notificationData.blogId || null,
      isRead: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await notification.save();
    console.log('✅ Notification created successfully:', notification);
    return notification;
  } catch (error) {
    console.error('❌ Error creating notification:', error);
    throw error;
  }
};

module.exports = { createNotification };