const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false,
  },
  avatar: {
    url: { type: String, default: '' },
    publicId: { type: String, default: '' },
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  otp: {
    code: { type: String, select: false },
    expiresAt: { type: Date, select: false },
    purpose: { type: String, enum: ['signup', 'login', 'reset'], select: false },
  },
  resetPasswordToken: { type: String, select: false },
  resetPasswordExpire: { type: Date, select: false },
  lastLogin: { type: Date },
  loginHistory: [{
    ip: String,
    userAgent: String,
    timestamp: { type: Date, default: Date.now },
  }],
  preferences: {
    autoPlay: { type: Boolean, default: true },
    playerColor: { type: String, default: '0dcaf0' },
    emailNotifications: { type: Boolean, default: true },
  },
}, {
  timestamps: true,
});

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT
userSchema.methods.generateToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// Generate OTP
userSchema.methods.generateOTP = function (purpose) {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  this.otp = {
    code,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    purpose,
  };
  return code;
};

// Verify OTP
userSchema.methods.verifyOTP = function (code, purpose) {
  if (!this.otp || !this.otp.code) return false;
  if (this.otp.purpose !== purpose) return false;
  if (new Date() > this.otp.expiresAt) return false;
  return this.otp.code === code;
};

module.exports = mongoose.model('User', userSchema);
