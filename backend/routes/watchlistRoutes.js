const express = require('express');
const router = express.Router();
const {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  checkWatchlist,
} = require('../controllers/watchlistController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getWatchlist);
router.post('/', protect, addToWatchlist);
router.delete('/:id', protect, removeFromWatchlist);
router.get('/check/:tmdbId/:mediaType', protect, checkWatchlist);

module.exports = router;
