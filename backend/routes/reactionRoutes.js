const express = require('express');
const router = express.Router();
const { getReaction, updateReaction, removeReaction } = require('../controllers/reactionController');
const { protect } = require('../middleware/auth');

// All reaction routes are protected
router.use(protect);

router.get('/:tmdbId/:mediaType', getReaction);
router.post('/', updateReaction);
router.delete('/:tmdbId/:mediaType', removeReaction);

module.exports = router;
