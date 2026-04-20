const mongoose = require('mongoose');

const watchProgressSchema = new mongoose.Schema({
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
  title: { type: String, required: true },
  posterPath: { type: String },
  progress: { type: Number, default: 0 }, // percentage
  currentTime: { type: Number, default: 0 }, // seconds
  duration: { type: Number, default: 0 }, // total seconds
  season: { type: Number },
  episode: { type: Number },
  completed: { type: Boolean, default: false },
  lastWatched: { type: Date, default: Date.now },
}, {
  timestamps: true,
});

// Compound index
watchProgressSchema.index({ user: 1, tmdbId: 1, mediaType: 1, season: 1, episode: 1 }, { unique: true });

module.exports = mongoose.model('WatchProgress', watchProgressSchema);
