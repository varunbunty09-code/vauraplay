const axios = require('axios');

const TMDB_BASE = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const TMDB_KEY = () => process.env.TMDB_API_KEY;

const tmdbFetch = async (endpoint, params = {}) => {
  const url = `${TMDB_BASE}${endpoint}`;
  const response = await axios.get(url, {
    params: { api_key: TMDB_KEY(), ...params },
  });
  return response.data;
};

// @desc    Get trending movies/TV
// @route   GET /api/tmdb/trending/:mediaType/:timeWindow
exports.getTrending = async (req, res) => {
  try {
    const { mediaType, timeWindow } = req.params;
    const data = await tmdbFetch(`/trending/${mediaType}/${timeWindow}`);
    res.json(data);
  } catch (error) {
    console.error('TMDB trending error:', error.message);
    res.status(500).json({ message: 'Failed to fetch trending' });
  }
};

// @desc    Get popular movies
// @route   GET /api/tmdb/movie/popular
exports.getPopularMovies = async (req, res) => {
  try {
    const data = await tmdbFetch('/movie/popular', { page: req.query.page || 1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch popular movies' });
  }
};

// @desc    Get top rated movies
// @route   GET /api/tmdb/movie/top-rated
exports.getTopRatedMovies = async (req, res) => {
  try {
    const data = await tmdbFetch('/movie/top_rated', { page: req.query.page || 1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch top rated movies' });
  }
};

// @desc    Get upcoming movies
// @route   GET /api/tmdb/movie/upcoming
exports.getUpcomingMovies = async (req, res) => {
  try {
    const data = await tmdbFetch('/movie/upcoming', { page: req.query.page || 1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch upcoming movies' });
  }
};

// @desc    Get popular TV shows
// @route   GET /api/tmdb/tv/popular
exports.getPopularTV = async (req, res) => {
  try {
    const data = await tmdbFetch('/tv/popular', { page: req.query.page || 1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch popular TV' });
  }
};

// @desc    Get top rated TV shows
// @route   GET /api/tmdb/tv/top-rated
exports.getTopRatedTV = async (req, res) => {
  try {
    const data = await tmdbFetch('/tv/top_rated', { page: req.query.page || 1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch top rated TV' });
  }
};

// @desc    Get movie details
// @route   GET /api/tmdb/movie/:id
exports.getMovieDetails = async (req, res) => {
  try {
    const data = await tmdbFetch(`/movie/${req.params.id}`, {
      append_to_response: 'credits,similar,videos,images',
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch movie details' });
  }
};

// @desc    Get TV show details
// @route   GET /api/tmdb/tv/:id
exports.getTVDetails = async (req, res) => {
  try {
    const data = await tmdbFetch(`/tv/${req.params.id}`, {
      append_to_response: 'credits,similar,videos,images',
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch TV details' });
  }
};

// @desc    Get TV season details
// @route   GET /api/tmdb/tv/:id/season/:seasonNumber
exports.getSeasonDetails = async (req, res) => {
  try {
    const data = await tmdbFetch(`/tv/${req.params.id}/season/${req.params.seasonNumber}`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch season details' });
  }
};

// @desc    Search movies/TV
// @route   GET /api/tmdb/search
exports.search = async (req, res) => {
  try {
    const { query, page, type } = req.query;
    if (!query) return res.status(400).json({ message: 'Search query required' });

    const endpoint = type === 'tv' ? '/search/tv' : type === 'movie' ? '/search/movie' : '/search/multi';
    const data = await tmdbFetch(endpoint, { query, page: page || 1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Search failed' });
  }
};

// @desc    Get genres
// @route   GET /api/tmdb/genres/:type
exports.getGenres = async (req, res) => {
  try {
    const type = req.params.type === 'tv' ? 'tv' : 'movie';
    const data = await tmdbFetch(`/genre/${type}/list`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch genres' });
  }
};

// @desc    Discover movies/TV by genre
// @route   GET /api/tmdb/discover/:type
exports.discover = async (req, res) => {
  try {
    const type = req.params.type === 'tv' ? 'tv' : 'movie';
    const { genre, page, sort_by, year } = req.query;
    const params = { page: page || 1 };
    if (genre) params.with_genres = genre;
    if (sort_by) params.sort_by = sort_by;
    if (year) {
      if (type === 'movie') params.primary_release_year = year;
      else params.first_air_date_year = year;
    }
    const data = await tmdbFetch(`/discover/${type}`, params);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Discovery failed' });
  }
};
