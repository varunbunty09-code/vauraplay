const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  action: {
    type: String,
    required: true,
    enum: ['signup', 'login', 'logout', 'password_reset', 'profile_update', 
           'avatar_upload', 'watchlist_add', 'watchlist_remove', 'watch_start',
           'admin_ban', 'admin_unban', 'admin_action', 'otp_request', 'account_verified'],
  },
  details: { type: String },
  ip: { type: String },
  userAgent: { type: String },
  metadata: { type: mongoose.Schema.Types.Mixed },
}, {
  timestamps: true,
});

activityLogSchema.index({ user: 1, createdAt: -1 });
activityLogSchema.index({ action: 1, createdAt: -1 });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
