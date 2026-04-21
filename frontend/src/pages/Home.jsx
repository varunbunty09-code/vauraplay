import React, { useState, useEffect } from 'react';
import tmdbService from '../services/tmdbService';
import MovieRow from '../components/MovieRow';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Info, Plus, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HeroSkeleton, MovieRowSkeleton } from '../components/skeleton/MovieSkeleton';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Home = () => {
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [trendingTV, setTrendingTV] = useState([]);
  const [heroMovie, setHeroMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [heroInWatchlist, setHeroInWatchlist] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trend, pop, top, tvTrend] = await Promise.all([
          tmdbService.getTrending('movie'),
          tmdbService.getPopular('movie'),
          tmdbService.getTopRated('movie'),
          tmdbService.getTrending('tv')
        ]);
        
        setTrending(trend);
        setPopular(pop);
        setTopRated(top);
        setTrendingTV(tvTrend);
        
        // Pick a random movie for the hero section
        const hero = trend[Math.floor(Math.random() * 5)];
        setHeroMovie(hero);

        // Check if hero is in watchlist
        if (hero) {
          try {
            const { data } = await axios.get(`${API_URL}/watchlist/check/${hero.id}/movie`);
            setHeroInWatchlist(data.inWatchlist);
          } catch (e) {}
        }
      } catch (err) {
        console.error('Failed to fetch home data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const toggleHeroWatchlist = async () => {
    if (!heroMovie) return;
    
    // Optimistic Update
    const previousState = heroInWatchlist;
    setHeroInWatchlist(!previousState);
    
    try {
      if (previousState) {
        const { data } = await axios.get(`${API_URL}/watchlist/check/${heroMovie.id}/movie`);
        await axios.delete(`${API_URL}/watchlist/${data.item._id}`);
        toast.success('Removed from watchlist');
      } else {
        await axios.post(`${API_URL}/watchlist`, {
          tmdbId: heroMovie.id, mediaType: 'movie',
          title: heroMovie.title || heroMovie.name,
          posterPath: heroMovie.poster_path,
          backdropPath: heroMovie.backdrop_path,
          overview: heroMovie.overview,
          voteAverage: heroMovie.vote_average
        });
        toast.success('Added to watchlist');
      }
    } catch (err) {
      // Rollback on error
      setHeroInWatchlist(previousState);
      toast.error('Watchlist Error');
    }
  };

  const [heroError, setHeroError] = useState(false);

  if (loading) return (
    <div className="home-page-loading">
      <HeroSkeleton />
      <div style={{ marginTop: '-150px', position: 'relative', zIndex: 20 }}>
        <MovieRowSkeleton />
        <MovieRowSkeleton />
      </div>
    </div>
  );

  return (
    <div className="home-page">
      {/* Hero Movie Section */}
      {heroMovie && (
        <section className="home-hero">
          <div className="hero-backdrop">
            {heroMovie.backdrop_path && !heroError ? (
              <img 
                src={`https://image.tmdb.org/t/p/original${heroMovie.backdrop_path}`} 
                alt={heroMovie.title} 
                onError={() => setHeroError(true)}
              />
            ) : (
              <div className="backdrop-placeholder" />
            )}
            <div className="hero-gradient"></div>
          </div>
          
          <div className="hero-info container">
            <motion.h1 
              initial={{ opacity: 0, x: -30 }} 
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {heroMovie.title || heroMovie.name}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -30 }} 
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              {heroMovie.overview?.substring(0, 150)}...
            </motion.p>
            
            <motion.div 
              className="hero-actions"
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Link to={`/watch/movie/${heroMovie.id}`} className="btn-primary">
                <Play size={20} fill="currentColor" /> Play Now
              </Link>
              <Link to={`/movie/${heroMovie.id}`} className="btn-outline">
                <Info size={20} /> More Info
              </Link>
              <button
                className={`btn-outline add-list ${heroInWatchlist ? 'added' : ''}`}
                onClick={toggleHeroWatchlist}
              >
                <AnimatePresence mode="wait">
                  {heroInWatchlist ? (
                    <motion.span key="check" initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: 180 }} transition={{ type: 'spring', stiffness: 300, damping: 15 }}>
                      <Check size={20} />
                    </motion.span>
                  ) : (
                    <motion.span key="plus" initial={{ scale: 0, rotate: 180 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: -180 }} transition={{ type: 'spring', stiffness: 300, damping: 15 }}>
                      <Plus size={20} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          </div>
        </section>
      )}

      {/* Movie Rows */}
      <div className="rows-container">
        <MovieRow title="Trending Now" items={trending} />
        <MovieRow title="Popular Movies" items={popular} />
        <MovieRow title="Top Rated Classics" items={topRated} />
        <MovieRow title="Popular TV Shows" items={trendingTV} type="tv" />
      </div>

      <style>{`
        .home-page { padding-bottom: 5rem; }
        .home-hero { height: 92vh; position: relative; display: flex; align-items: flex-end; margin-bottom: -60px; overflow: hidden; }
        .hero-backdrop { position: absolute; inset: 0; z-index: 0; }
        .hero-backdrop img { width: 100%; height: 100%; object-fit: cover; object-position: center 20%; }
        .hero-gradient { position: absolute; inset: 0; background: linear-gradient(to right, #0a0a0c 30%, transparent 80%), linear-gradient(to top, #0a0a0c 15%, transparent 50%); }
        .hero-info.container { margin: 0 0 0 0 !important; max-width: 800px; padding-bottom: 10rem; position: relative; z-index: 10; padding-left: 5%; text-align: left; }
        .hero-info h1 { font-size: clamp(3rem, 7vw, 5rem); margin-bottom: 1.2rem; text-shadow: 0 4px 30px rgba(0,0,0,0.8); line-height: 1; font-weight: 900; color: #fff; }
        .hero-info p { font-size: 1.15rem; margin-bottom: 2.5rem; color: rgba(255,255,255,0.9); line-height: 1.6; text-shadow: 0 2px 10px rgba(0,0,0,0.5); max-width: 600px; }
        .hero-actions { display: flex; gap: 1.2rem; align-items: center; justify-content: flex-start; }
        .btn-primary { padding: 1rem 2.5rem; font-size: 1.1rem; border-radius: 8px; }
        .btn-outline { padding: 1rem 2.5rem; font-size: 1.1rem; border-radius: 8px; backdrop-filter: blur(10px); background: rgba(255,255,255,0.1); }
        .add-list { width: 56px; height: 56px; padding: 0; display: flex; align-items: center; justify-content: center; border-radius: 50% !important; transition: all 0.3s ease; }
        .add-list span { display: flex; align-items: center; justify-content: center; }
        .add-list.added { border-color: var(--primary); color: var(--primary); background: rgba(13, 202, 240, 0.15); }
        .rows-container { position: relative; z-index: 20; padding-top: 2rem; }

        @media (max-width: 768px) {
          .home-hero { height: 75vh; }
          .hero-info.container { padding-bottom: 6rem; padding-left: 1.5rem; max-width: 100%; }
          .hero-info h1 { font-size: 2.5rem; }
          .hero-info p { font-size: 1rem; margin-bottom: 1.5rem; }
          .hero-actions { gap: 0.8rem; }
          .btn-primary, .btn-outline { padding: 0.8rem 1.5rem; font-size: 1rem; }
          .add-list { width: 48px; height: 48px; }
        }
      `}</style>
    </div>
  );
};

export default Home;
