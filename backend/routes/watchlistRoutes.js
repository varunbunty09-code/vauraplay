const express = require('express');
const router = express.Router();
const {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  checkWatchlist,
  getWatchlistIds,
} = require('../controllers/watchlistController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getWatchlist);
router.get('/ids', protect, getWatchlistIds);
router.post('/', protect, addToWatchlist);
router.delete('/:id', protect, removeFromWatchlist);
router.get('/check/:tmdbId/:mediaType', protect, checkWatchlist);

module.exports = router;
