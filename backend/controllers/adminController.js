const User = require('../models/User');
const Notification = require('../models/Notification');
const ActivityLog = require('../models/ActivityLog');
const WatchProgress = require('../models/WatchProgress');
const Watchlist = require('../models/Watchlist');
const sendEmail = require('../utils/sendEmail');
const { accountStatusEmail, movieUpdateEmail } = require('../utils/emailTemplates');

// @desc    Get all users (admin)
// @route   GET /api/admin/users
exports.getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search;

    let filter = {};
    if (search) {
      filter = {
        $or: [
          { username: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ],
      };
    }

    const users = await User.find(filter)
      .select('-__v')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await User.countDocuments(filter);

    res.json({ users, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get platform stats (admin)
// @route   GET /api/admin/stats
exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const verifiedUsers = await User.countDocuments({ isVerified: true });
    const bannedUsers = await User.countDocuments({ isActive: false });
    const totalWatchlistItems = await Watchlist.countDocuments();
    const totalWatchProgress = await WatchProgress.countDocuments();

    // Recent signups (last 7 days)
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentSignups = await User.countDocuments({ createdAt: { $gte: weekAgo } });

    // Recent activity (last 24h)
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentActivity = await ActivityLog.countDocuments({ createdAt: { $gte: dayAgo } });

    res.json({
      totalUsers,
      activeUsers,
      verifiedUsers,
      bannedUsers,
      totalWatchlistItems,
      totalWatchProgress,
      recentSignups,
      recentActivity,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Ban user (admin)
// @route   PUT /api/admin/users/:id/ban
exports.banUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin') return res.status(400).json({ message: 'Cannot ban admin' });

    user.isActive = false;
    await user.save({ validateBeforeSave: false });

    // Send account status email
    await sendEmail({
      to: user.email,
      subject: '⚠️ VauraPlay - Account Suspended',
      html: accountStatusEmail(user.username, 'suspended', req.body.reason),
    });

    await Notification.create({
      user: user._id,
      type: 'account',
      title: 'Account Suspended',
      message: req.body.reason || 'Your account has been suspended.',
    });

    await ActivityLog.create({
      user: req.user._id,
      action: 'admin_ban',
      details: `Banned user ${user.username}`,
      metadata: { targetUser: user._id, reason: req.body.reason },
      ip: req.ip,
    });

    res.json({ message: 'User banned successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Unban user (admin)
// @route   PUT /api/admin/users/:id/unban
exports.unbanUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isActive = true;
    await user.save({ validateBeforeSave: false });

    await sendEmail({
      to: user.email,
      subject: '✅ VauraPlay - Account Reactivated',
      html: accountStatusEmail(user.username, 'active'),
    });

    await Notification.create({
      user: user._id,
      type: 'account',
      title: 'Account Reactivated',
      message: 'Your account has been reactivated. Welcome back!',
    });

    await ActivityLog.create({
      user: req.user._id,
      action: 'admin_unban',
      details: `Unbanned user ${user.username}`,
      metadata: { targetUser: user._id },
      ip: req.ip,
    });

    res.json({ message: 'User unbanned successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Send movie update email to all users (admin)
// @route   POST /api/admin/send-update
exports.sendMovieUpdate = async (req, res) => {
  try {
    const { movies } = req.body; // Array of { title, overview }

    const users = await User.find({ 
      isActive: true, 
      isVerified: true,
      'preferences.emailNotifications': true,
    });

    let sent = 0;
    for (const user of users) {
      try {
        await sendEmail({
          to: user.email,
          subject: '🍿 VauraPlay - New Content Alert!',
          html: movieUpdateEmail(user.username, movies),
        });
        sent++;
      } catch (err) {
        console.error(`Failed to send to ${user.email}:`, err.message);
      }
    }

    await ActivityLog.create({
      user: req.user._id,
      action: 'admin_action',
      details: `Sent movie update emails to ${sent} users`,
      ip: req.ip,
    });

    res.json({ message: `Movie update sent to ${sent} users` });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get activity logs (admin)
// @route   GET /api/admin/logs
exports.getLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const action = req.query.action;

    let filter = {};
    if (action) filter.action = action;

    const logs = await ActivityLog.find(filter)
      .populate('user', 'username email avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await ActivityLog.countDocuments(filter);

    res.json({ logs, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Make user admin
// @route   PUT /api/admin/users/:id/make-admin
exports.makeAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = 'admin';
    await user.save({ validateBeforeSave: false });

    await ActivityLog.create({
      user: req.user._id,
      action: 'admin_action',
      details: `Made ${user.username} admin`,
      ip: req.ip,
    });

    res.json({ message: `${user.username} is now an admin` });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
