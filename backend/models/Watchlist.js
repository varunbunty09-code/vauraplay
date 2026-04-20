const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema({
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
  backdropPath: { type: String },
  overview: { type: String },
  releaseDate: { type: String },
  voteAverage: { type: Number },
  genres: [{ type: String }],
}, {
  timestamps: true,
});

// Compound index to prevent duplicates
watchlistSchema.index({ user: 1, tmdbId: 1, mediaType: 1 }, { unique: true });

module.exports = mongoose.model('Watchlist', watchlistSchema);
