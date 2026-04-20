const Watchlist = require('../models/Watchlist');
const ActivityLog = require('../models/ActivityLog');

// @desc    Get user watchlist
// @route   GET /api/watchlist
exports.getWatchlist = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const type = req.query.type; // 'movie' or 'tv'

    const filter = { user: req.user._id };
    if (type) filter.mediaType = type;

    const watchlist = await Watchlist.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Watchlist.countDocuments(filter);

    res.json({ watchlist, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add to watchlist
// @route   POST /api/watchlist
exports.addToWatchlist = async (req, res) => {
  try {
    const { tmdbId, mediaType, title, posterPath, backdropPath, overview, releaseDate, voteAverage, genres } = req.body;

    const existing = await Watchlist.findOne({ user: req.user._id, tmdbId, mediaType });
    if (existing) return res.status(400).json({ message: 'Already in watchlist' });

    const item = await Watchlist.create({
      user: req.user._id,
      tmdbId,
      mediaType,
      title,
      posterPath,
      backdropPath,
      overview,
      releaseDate,
      voteAverage,
      genres,
    });

    await ActivityLog.create({
      user: req.user._id,
      action: 'watchlist_add',
      details: `Added ${title} to watchlist`,
      ip: req.ip,
    });

    res.status(201).json(item);
  } catch (error) {
    console.error('Watchlist add error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Remove from watchlist
// @route   DELETE /api/watchlist/:id
exports.removeFromWatchlist = async (req, res) => {
  try {
    const item = await Watchlist.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!item) return res.status(404).json({ message: 'Item not found' });

    await ActivityLog.create({
      user: req.user._id,
      action: 'watchlist_remove',
      details: `Removed ${item.title} from watchlist`,
      ip: req.ip,
    });

    res.json({ message: 'Removed from watchlist' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Check if item is in watchlist
// @route   GET /api/watchlist/check/:tmdbId/:mediaType
exports.checkWatchlist = async (req, res) => {
  try {
    const item = await Watchlist.findOne({
      user: req.user._id,
      tmdbId: req.params.tmdbId,
      mediaType: req.params.mediaType,
    });
    res.json({ inWatchlist: !!item, item });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
