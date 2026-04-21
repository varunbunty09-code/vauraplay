const WatchProgress = require('../models/WatchProgress');

// @desc    Get continue watching list
// @route   GET /api/progress
exports.getContinueWatching = async (req, res) => {
  try {
    const progress = await WatchProgress.find({
      user: req.user._id,
      completed: false,
      progress: { $gt: 0, $lt: 95 },
    })
      .sort({ lastWatched: -1 })
      .limit(20);

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update watch progress
// @route   POST /api/progress
exports.updateProgress = async (req, res) => {
  try {
    const { tmdbId, mediaType, title, posterPath, progress, currentTime, duration, season, episode } = req.body;

    const filter = {
      user: req.user._id,
      tmdbId,
      mediaType,
    };

    if (mediaType === 'tv') {
      filter.season = season;
      filter.episode = episode;
    }

    const update = {
      title,
      posterPath,
      progress,
      currentTime,
      duration,
      lastWatched: new Date(),
      completed: progress >= 95,
    };

    if (mediaType === 'tv') {
      update.season = season;
      update.episode = episode;
    }

    const doc = await WatchProgress.findOneAndUpdate(
      filter,
      { $set: update },
      { upsert: true, new: true }
    );

    res.json(doc);
  } catch (error) {
    console.error('Progress update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get progress for specific content
// @route   GET /api/progress/:tmdbId/:mediaType
exports.getProgress = async (req, res) => {
  try {
    const tmdbId = parseInt(req.params.tmdbId);
    const filter = {
      user: req.user._id,
      tmdbId,
      mediaType: req.params.mediaType,
    };

    if (req.query.season) filter.season = parseInt(req.query.season);
    if (req.query.episode) filter.episode = parseInt(req.query.episode);

    // For TV shows without a specific episode, return all episode progress for that season
    if (req.params.mediaType === 'tv' && !req.query.episode) {
      const progressList = await WatchProgress.find(filter).sort({ episode: 1 });
      return res.json(progressList);
    }

    const progress = await WatchProgress.findOne(filter);
    res.json(progress || { progress: 0, currentTime: 0, duration: 0 });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get watch history
// @route   GET /api/progress/history
exports.getWatchHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const history = await WatchProgress.find({ user: req.user._id })
      .sort({ lastWatched: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await WatchProgress.countDocuments({ user: req.user._id });

    res.json({ history, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Clear watch history
// @route   DELETE /api/progress/history
exports.clearWatchHistory = async (req, res) => {
  try {
    await WatchProgress.deleteMany({ user: req.user._id });
    res.json({ message: 'Watch history cleared' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
