const express = require('express');
const router = express.Router();
const {
  getTrending,
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  getPopularTV,
  getTopRatedTV,
  getMovieDetails,
  getTVDetails,
  getSeasonDetails,
  search,
  getGenres,
  discover,
} = require('../controllers/tmdbController');

router.get('/trending/:mediaType/:timeWindow', getTrending);
router.get('/movie/popular', getPopularMovies);
router.get('/movie/top-rated', getTopRatedMovies);
router.get('/movie/upcoming', getUpcomingMovies);
router.get('/tv/popular', getPopularTV);
router.get('/tv/top-rated', getTopRatedTV);
router.get('/movie/:id', getMovieDetails);
router.get('/tv/:id', getTVDetails);
router.get('/tv/:id/season/:seasonNumber', getSeasonDetails);
router.get('/search', search);
router.get('/genres/:type', getGenres);
router.get('/discover/:type', discover);

module.exports = router;
