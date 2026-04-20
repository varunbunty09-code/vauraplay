const crypto = require('crypto');
const User = require('../models/User');
const Notification = require('../models/Notification');
const ActivityLog = require('../models/ActivityLog');
const sendEmail = require('../utils/sendEmail');
const { otpEmail, welcomeEmail, loginNotificationEmail, forgotPasswordEmail } = require('../utils/emailTemplates');

// @desc    Register user (Step 1: send OTP)
// @route   POST /api/auth/signup
exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check existing user
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      if (existingUser.email === email) return res.status(400).json({ message: 'Email already registered' });
      return res.status(400).json({ message: 'Username already taken' });
    }

    // Create unverified user
    const user = await User.create({ username, email, password, isVerified: false });

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
      ip: req.ip,
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
      subject: '🎉 Welcome to VauraPlay!',
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
      ip: req.ip,
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
      ip: req.ip,
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

    // Send login notification
    if (user.preferences.emailNotifications) {
      await sendEmail({
        to: user.email,
        subject: '🔔 VauraPlay - New Login Detected',
        html: loginNotificationEmail(user.username, req.ip, req.headers['user-agent'], new Date()),
      });
    }

    // Create notification
    await Notification.create({
      user: user._id,
      type: 'login',
      title: 'New Login',
      message: `Login from ${req.ip} at ${new Date().toLocaleString()}`,
    });

    await ActivityLog.create({
      user: user._id,
      action: 'login',
      details: 'Login successful',
      ip: req.ip,
      userAgent: req.headers['user-agent'],
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
      ip: req.ip,
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
    });

    if (!user) return res.status(400).json({ message: 'Invalid or expired reset token' });

    user.password = req.body.password;
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
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
