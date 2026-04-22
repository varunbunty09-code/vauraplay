const Reaction = require('../models/Reaction');

// @desc    Get user reaction for a specific item
// @route   GET /api/reactions/:tmdbId/:mediaType
// @access  Private
exports.getReaction = async (req, res) => {
  try {
    const { tmdbId, mediaType } = req.params;
    const reaction = await Reaction.findOne({
      user: req.user._id,
      tmdbId,
      mediaType
    });

    res.json({ reaction: reaction ? reaction.reaction : null });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update or create a reaction
// @route   POST /api/reactions
// @access  Private
exports.updateReaction = async (req, res) => {
  try {
    const { tmdbId, mediaType, reaction } = req.body;

    if (!['loved', 'liked', 'disliked'].includes(reaction)) {
      return res.status(400).json({ message: 'Invalid reaction type' });
    }

    const updatedReaction = await Reaction.findOneAndUpdate(
      { user: req.user._id, tmdbId, mediaType },
      { reaction },
      { upsert: true, new: true }
    );

    res.json(updatedReaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove a reaction
// @route   DELETE /api/reactions/:tmdbId/:mediaType
// @access  Private
exports.removeReaction = async (req, res) => {
  try {
    const { tmdbId, mediaType } = req.params;
    await Reaction.findOneAndDelete({
      user: req.user._id,
      tmdbId,
      mediaType
    });

    res.json({ message: 'Reaction removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
