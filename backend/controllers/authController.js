const crypto = require('crypto');
const User = require('../models/User');
const Notification = require('../models/Notification');
const ActivityLog = require('../models/ActivityLog');
const sendEmail = require('../utils/sendEmail');
const { otpEmail, welcomeEmail, loginNotificationEmail, forgotPasswordEmail, emailChangeOtpEmail, deleteAccountOtpEmail, accountDeletedEmail } = require('../utils/emailTemplates');
const { getLocationFromIP, formatLocation } = require('../utils/geoLocation');

const getDeviceInfo = (userAgent) => {
  if (!userAgent) return 'Unknown Device';
  
  let os = 'Unknown OS';
  if (userAgent.includes('Windows')) os = 'Windows';
  else if (userAgent.includes('Macintosh')) os = 'macOS';
  else if (userAgent.includes('Android')) os = 'Android';
  else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) os = 'iOS';
  else if (userAgent.includes('Linux')) os = 'Linux';

  let browser = 'Unknown Browser';
  if (userAgent.includes('Chrome')) browser = 'Chrome';
  else if (userAgent.includes('Firefox')) browser = 'Firefox';
  else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) browser = 'Safari';
  else if (userAgent.includes('Edge')) browser = 'Edge';
  else if (userAgent.includes('MSIE') || userAgent.includes('Trident')) browser = 'Internet Explorer';

  return `${browser} on ${os}`;
};

const getClientIp = (req) => {
  const xForwardedFor = req.headers['x-forwarded-for'];
  if (xForwardedFor) return xForwardedFor.split(',')[0].trim();
  return req.ip === '::1' ? '127.0.0.1' : req.ip;
};


// @desc    Register user (Step 1: send OTP)
// @route   POST /api/auth/signup
exports.signup = async (req, res) => {
  try {
    const { username, email, password, phone } = req.body;

    // Check existing user
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      if (existingUser.email === email) return res.status(400).json({ message: 'Email already registered' });
      return res.status(400).json({ message: 'Username already taken' });
    }

    if (!phone || phone.length < 10) {
      return res.status(400).json({ message: 'A valid phone number is required' });
    }

    // Create unverified user
    const user = await User.create({ username, email, password, phone, isVerified: false });

    // Generate and send OTP
    const otp = user.generateOTP('signup');
    await user.save({ validateBeforeSave: false });

    await sendEmail({
      to: email,
      subject: '🎬 VauraPlay - Verify Your Account',
      html: otpEmail(username, otp, 'signup'),
    });

    await ActivityLog.create({
      user: user._id,
      action: 'signup',
      details: 'User registered, OTP sent',
      ip: getClientIp(req),
      userAgent: req.headers['user-agent'],
    });

    res.status(201).json({
      message: 'OTP sent to your email',
      userId: user._id,
      email: user.email,
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
};

// @desc    Verify signup OTP (Step 2)
// @route   POST /api/auth/verify-signup
exports.verifySignup = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const user = await User.findById(userId).select('+otp.code +otp.expiresAt +otp.purpose');
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.verifyOTP(otp, 'signup')) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.isVerified = true;
    user.otp = undefined;
    await user.save({ validateBeforeSave: false });

    // Send welcome email
    await sendEmail({
      to: user.email,
      subject: '🍿 Welcome to VauraPlay - Enjoy Unlimited Movies!',
      html: welcomeEmail(user.username),
    });

    // Create welcome notification
    await Notification.create({
      user: user._id,
      type: 'welcome',
      title: 'Welcome to VauraPlay! 🎬',
      message: 'Your account has been verified. Start exploring 50,000+ movies and TV shows!',
    });

    await ActivityLog.create({
      user: user._id,
      action: 'account_verified',
      details: 'Account verified via OTP',
      ip: getClientIp(req),
      userAgent: req.headers['user-agent'],
    });

    const token = user.generateToken();

    res.json({
      message: 'Account verified successfully',
      token,
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
    console.error('Verify signup error:', error);
    res.status(500).json({ message: 'Server error during verification' });
  }
};

// @desc    Login (Step 1: verify credentials, send OTP)
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    if (!user.isActive) return res.status(403).json({ message: 'Account has been suspended' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

    if (!user.isVerified) {
      // Resend OTP for unverified accounts
      const otp = user.generateOTP('signup');
      await user.save({ validateBeforeSave: false });
      await sendEmail({
        to: user.email,
        subject: '🎬 VauraPlay - Verify Your Account',
        html: otpEmail(user.username, otp, 'signup'),
      });
      return res.status(403).json({
        message: 'Account not verified. New OTP sent.',
        userId: user._id,
        requiresVerification: true,
      });
    }

    // Generate login OTP
    const otp = user.generateOTP('login');
    await user.save({ validateBeforeSave: false });

    await sendEmail({
      to: user.email,
      subject: '🔐 VauraPlay - Login Verification',
      html: otpEmail(user.username, otp, 'login'),
    });

    await ActivityLog.create({
      user: user._id,
      action: 'otp_request',
      details: 'Login OTP requested',
      ip: getClientIp(req),
      userAgent: req.headers['user-agent'],
    });

    res.json({
      message: 'OTP sent to your email',
      userId: user._id,
      requiresOTP: true,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// @desc    Verify login OTP (Step 2)
// @route   POST /api/auth/verify-login
exports.verifyLogin = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const user = await User.findById(userId).select('+otp.code +otp.expiresAt +otp.purpose');
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.verifyOTP(otp, 'login')) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.otp = undefined;
    user.lastLogin = new Date();
    user.loginHistory.push({
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      timestamp: new Date(),
    });

    // Keep only last 10 login entries
    if (user.loginHistory.length > 10) {
      user.loginHistory = user.loginHistory.slice(-10);
    }

    await user.save({ validateBeforeSave: false });

    const ip = getClientIp(req);
    const device = getDeviceInfo(req.headers['user-agent']);
    const timestamp = new Date();

    // Fetch geolocation from IP
    const location = await getLocationFromIP(ip);
    const locationStr = formatLocation(location);

    // Send login notification email
    if (user.preferences.emailNotifications) {
      await sendEmail({
        to: user.email,
        subject: '🔔 VauraPlay - New Login Detected',
        html: loginNotificationEmail(user.username, ip, device, timestamp, location),
      });
    }

    // Create notification with location metadata
    await Notification.create({
      user: user._id,
      type: 'login',
      title: 'New Login',
      message: `Login from ${ip} · ${locationStr}`,
      metadata: { ip, device, location, timestamp },
    });

    await ActivityLog.create({
      user: user._id,
      action: 'login',
      details: `Login from ${locationStr}`,
      ip,
      userAgent: req.headers['user-agent'],
      metadata: { location, device },
    });

    const token = user.generateToken();

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        preferences: user.preferences,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    console.error('Verify login error:', error);
    res.status(500).json({ message: 'Server error during login verification' });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'No account with that email' });

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
    await user.save({ validateBeforeSave: false });

    await sendEmail({
      to: user.email,
      subject: '🔐 VauraPlay - Password Reset',
      html: forgotPasswordEmail(user.username, resetToken),
    });

    await ActivityLog.create({
      user: user._id,
      action: 'password_reset',
      details: 'Password reset requested',
      ip: getClientIp(req),
      userAgent: req.headers['user-agent'],
    });

    res.json({ message: 'Password reset link sent to your email' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password/:token
exports.resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: new Date() },
    }).select('+password +previousPasswords');

    if (!user) return res.status(400).json({ message: 'Invalid or expired reset token' });

    const { password } = req.body;

    // Check if same as current password
    const isSameAsCurrent = await user.comparePassword(password);
    if (isSameAsCurrent) {
      return res.status(400).json({ message: 'New password cannot be the same as your current password' });
    }

    // Check against previous passwords
    const wasUsedBefore = await user.checkPreviousPasswords(password);
    if (wasUsedBefore) {
      return res.status(400).json({ message: 'This password was used previously. Please choose a new one.' });
    }

    // Store old hash for archiving in pre-save hook
    user._previousPasswordHash = user.password;
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    await Notification.create({
      user: user._id,
      type: 'security',
      title: 'Password Changed',
      message: 'Your password was successfully reset.',
    });

    res.json({ message: 'Password reset successful. Please login.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Verify reset token & return masked email
// @route   GET /api/auth/verify-reset-token/:token
exports.verifyResetToken = async (req, res) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: new Date() },
    });
    if (!user) return res.status(400).json({ message: 'Invalid or expired reset token' });

    // Return masked email (e.g. m***h@gmail.com)
    const email = user.email;
    const [local, domain] = email.split('@');
    const masked = local[0] + '***' + local[local.length - 1] + '@' + domain;

    res.json({ email: masked, fullEmail: email });
  } catch (error) {
    console.error('Verify reset token error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
exports.resendOTP = async (req, res) => {
  try {
    const { userId, purpose } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = user.generateOTP(purpose || 'login');
    await user.save({ validateBeforeSave: false });

    await sendEmail({
      to: user.email,
      subject: '🔐 VauraPlay - New Verification Code',
      html: otpEmail(user.username, otp, purpose || 'login'),
    });

    res.json({ message: 'New OTP sent to your email' });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        preferences: user.preferences,
        isVerified: user.isVerified,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        phone: user.phone || '',
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Request email change (Step 1: send OTP to current email)
// @route   POST /api/auth/request-email-change
exports.requestEmailChange = async (req, res) => {
  try {
    const { newEmail } = req.body;
    if (!newEmail) return res.status(400).json({ message: 'New email is required' });

    // Check if new email is already in use
    const existing = await User.findOne({ email: newEmail });
    if (existing) return res.status(400).json({ message: 'Email already in use by another account' });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Store pending email in a temp field
    user.pendingEmail = newEmail;
    const otp = user.generateOTP('email_change');
    await user.save({ validateBeforeSave: false });

    // Send OTP to current email for verification
    await sendEmail({
      to: user.email,
      subject: '📧 VauraPlay - Email Change Verification',
      html: emailChangeOtpEmail(user.username, otp, newEmail),
    });

    res.json({ message: 'Verification code sent to your current email' });
  } catch (error) {
    console.error('Request email change error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Verify email change (Step 2: verify OTP and update email)
// @route   POST /api/auth/verify-email-change
exports.verifyEmailChange = async (req, res) => {
  try {
    const { otp } = req.body;
    const user = await User.findById(req.user._id).select('+otp.code +otp.expiresAt +otp.purpose');
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.verifyOTP(otp, 'email_change')) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    if (!user.pendingEmail) {
      return res.status(400).json({ message: 'No pending email change found' });
    }

    const oldEmail = user.email;
    
    // Store old email in history
    if (!user.previousEmails) user.previousEmails = [];
    user.previousEmails.push({ email: oldEmail, changedAt: new Date() });

    user.email = user.pendingEmail;
    user.pendingEmail = undefined;
    user.otp = undefined;
    await user.save({ validateBeforeSave: false });

    await ActivityLog.create({
      user: user._id,
      action: 'email_changed',
      details: `Email changed from ${oldEmail} to ${user.email}`,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json({
      message: 'Email changed successfully',
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
    console.error('Verify email change error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Request account deletion (Step 1: send OTP)
// @route   POST /api/auth/request-delete-account
exports.requestDeleteAccount = async (req, res) => {
  try {
    const { reason } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.deleteReason = reason || 'No reason provided';
    const otp = user.generateOTP('delete_account');
    await user.save({ validateBeforeSave: false });

    await sendEmail({
      to: user.email,
      subject: '⚠️ VauraPlay - Account Deletion Confirmation',
      html: deleteAccountOtpEmail(user.username, otp),
    });

    res.json({ message: 'Verification code sent to your email. Enter it to confirm deletion.' });
  } catch (error) {
    console.error('Request delete account error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Confirm account deletion (Step 2: verify OTP and delete)
// @route   POST /api/auth/confirm-delete-account
exports.confirmDeleteAccount = async (req, res) => {
  try {
    const { otp } = req.body;
    const user = await User.findById(req.user._id).select('+otp.code +otp.expiresAt +otp.purpose');
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.verifyOTP(otp, 'delete_account')) {
      return res.status(400).json({ message: 'Invalid or expired OTP. Account was NOT deleted.' });
    }

    const username = user.username;
    const email = user.email;

    // Send farewell email BEFORE deleting
    await sendEmail({
      to: email,
      subject: '👋 VauraPlay - Account Deleted',
      html: accountDeletedEmail(username, email),
    });

    // Delete all related data
    const Watchlist = require('../models/Watchlist');
    const Progress = require('../models/Progress');

    await Promise.all([
      Watchlist.deleteMany({ user: user._id }),
      Notification.deleteMany({ user: user._id }),
      ActivityLog.deleteMany({ user: user._id }),
      Progress.deleteMany({ user: user._id }),
    ]);

    // Delete the user
    await User.findByIdAndDelete(user._id);

    res.json({ message: 'Account permanently deleted. We\'re sorry to see you go.' });
  } catch (error) {
    console.error('Confirm delete account error:', error);
    res.status(500).json({ message: 'Server error during account deletion' });
  }
};
