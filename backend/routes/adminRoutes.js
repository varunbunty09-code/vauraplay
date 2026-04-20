const express = require('express');
const router = express.Router();
const {
  getUsers,
  getStats,
  banUser,
  unbanUser,
  sendMovieUpdate,
  getLogs,
  makeAdmin,
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');

router.use(protect, admin); // All admin routes require auth + admin role

router.get('/users', getUsers);
router.get('/stats', getStats);
router.put('/users/:id/ban', banUser);
router.put('/users/:id/unban', unbanUser);
router.put('/users/:id/make-admin', makeAdmin);
router.post('/send-update', sendMovieUpdate);
router.get('/logs', getLogs);

module.exports = router;
