const express = require('express');
const router = express.Router();
const {
  signup,
  verifySignup,
  login,
  verifyLogin,
  forgotPassword,
  resetPassword,
  verifyResetToken,
  resendOTP,
  getMe,
  requestEmailChange,
  verifyEmailChange,
  requestDeleteAccount,
  confirmDeleteAccount,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/signup', signup);
router.post('/verify-signup', verifySignup);
router.post('/login', login);
router.post('/verify-login', verifyLogin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/verify-reset-token/:token', verifyResetToken);
router.post('/resend-otp', resendOTP);
router.get('/me', protect, getMe);

// Email change & Account deletion (protected)
router.post('/request-email-change', protect, requestEmailChange);
router.post('/verify-email-change', protect, verifyEmailChange);
router.post('/request-delete-account', protect, requestDeleteAccount);
router.post('/confirm-delete-account', protect, confirmDeleteAccount);

module.exports = router;
