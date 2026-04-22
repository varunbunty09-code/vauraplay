const mongoose = require('mongoose');

const reactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tmdbId: {
    type: Number,
    required: true,
  },
  mediaType: {
    type: String,
    enum: ['movie', 'tv'],
    required: true,
  },
  reaction: {
    type: String,
    enum: ['loved', 'liked', 'disliked'],
    required: true,
  },
}, {
  timestamps: true,
});

// One reaction per user per content
reactionSchema.index({ user: 1, tmdbId: 1, mediaType: 1 }, { unique: true });

module.exports = mongoose.model('Reaction', reactionSchema);
