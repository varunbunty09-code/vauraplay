const express = require('express');
const router = express.Router();
const {
  signup,
  verifySignup,
  login,
  verifyLogin,
  forgotPassword,
  resetPassword,
  resendOTP,
  getMe,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/signup', signup);
router.post('/verify-signup', verifySignup);
router.post('/login', login);
router.post('/verify-login', verifyLogin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/resend-otp', resendOTP);
router.get('/me', protect, getMe);

module.exports = router;
