const User = require('../models/User');
const Notification = require('../models/Notification');
const ActivityLog = require('../models/ActivityLog');
const { cloudinary } = require('../config/cloudinary');

// @desc    Update profile
// @route   PUT /api/users/profile
exports.updateProfile = async (req, res) => {
  try {
    const { username, preferences } = req.body;
    const user = await User.findById(req.user._id);

    if (username && username !== user.username) {
      const existing = await User.findOne({ username });
      if (existing) return res.status(400).json({ message: 'Username already taken' });
      user.username = username;
    }

    if (preferences) {
      user.preferences = { ...user.preferences, ...preferences };
    }

    await user.save({ validateBeforeSave: false });

    await ActivityLog.create({
      user: user._id,
      action: 'profile_update',
      details: 'Profile updated',
      ip: req.ip,
    });

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        preferences: user.preferences,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Upload avatar
// @route   POST /api/users/avatar
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const user = await User.findById(req.user._id);

    // Delete old avatar from Cloudinary if exists
    if (user.avatar.publicId) {
      await cloudinary.uploader.destroy(user.avatar.publicId);
    }

    user.avatar = {
      url: req.file.path,
      publicId: req.file.filename,
    };

    await user.save({ validateBeforeSave: false });

    await ActivityLog.create({
      user: user._id,
      action: 'avatar_upload',
      details: 'Avatar uploaded',
      ip: req.ip,
    });

    res.json({ avatar: user.avatar });
  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Change password
// @route   PUT /api/users/change-password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });

    user.password = newPassword;
    await user.save();

    await Notification.create({
      user: user._id,
      type: 'security',
      title: 'Password Changed',
      message: 'Your password was successfully changed.',
    });

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get notifications
// @route   GET /api/users/notifications
exports.getNotifications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Notification.countDocuments({ user: req.user._id });
    const unread = await Notification.countDocuments({ user: req.user._id, read: false });

    res.json({ notifications, total, unread, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/users/notifications/:id/read
exports.markNotificationRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ message: 'Marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/users/notifications/read-all
exports.markAllNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
    res.json({ message: 'All marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete account
// @route   DELETE /api/users/account
exports.deleteAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    // Delete avatar from Cloudinary
    if (user.avatar.publicId) {
      await cloudinary.uploader.destroy(user.avatar.publicId);
    }

    await User.findByIdAndDelete(req.user._id);
    await Notification.deleteMany({ user: req.user._id });

    res.json({ message: 'Account deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
