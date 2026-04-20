const express = require('express');
const router = express.Router();
const {
  updateProfile,
  uploadAvatar,
  changePassword,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteAccount,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.put('/profile', protect, updateProfile);
router.post('/avatar', protect, upload.single('avatar'), uploadAvatar);
router.put('/change-password', protect, changePassword);
router.get('/notifications', protect, getNotifications);
router.put('/notifications/read-all', protect, markAllNotificationsRead);
router.put('/notifications/:id/read', protect, markNotificationRead);
router.delete('/account', protect, deleteAccount);

module.exports = router;
