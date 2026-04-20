const express = require('express');
const router = express.Router();
const {
  getContinueWatching,
  updateProgress,
  getProgress,
  getWatchHistory,
  clearWatchHistory,
} = require('../controllers/progressController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getContinueWatching);
router.post('/', protect, updateProgress);
router.get('/history', protect, getWatchHistory);
router.delete('/history', protect, clearWatchHistory);
router.get('/:tmdbId/:mediaType', protect, getProgress);

module.exports = router;
