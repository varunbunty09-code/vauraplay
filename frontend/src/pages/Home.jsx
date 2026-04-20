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
  const [addingHero, setAddingHero] = useState(false);

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
    if (!heroMovie || addingHero) return;
    setAddingHero(true);
    try {
      if (heroInWatchlist) {
        const { data } = await axios.get(`${API_URL}/watchlist/check/${heroMovie.id}/movie`);
        await axios.delete(`${API_URL}/watchlist/${data.item._id}`);
        setHeroInWatchlist(false);
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
        setHeroInWatchlist(true);
        toast.success('Added to watchlist');
      }
    } catch (err) {
      toast.error('Watchlist error');
    } finally {
      setAddingHero(false);
    }
  };

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
            <img src={`https://image.tmdb.org/t/p/original${heroMovie.backdrop_path}`} alt={heroMovie.title} />
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
                disabled={addingHero}
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
        .home-hero { height: 85vh; position: relative; display: flex; align-items: center; margin-bottom: -50px; }
        .hero-backdrop { position: absolute; inset: 0; z-index: 0; }
        .hero-backdrop img { width: 100%; height: 100%; object-fit: cover; }
        .hero-gradient { position: absolute; inset: 0; background: linear-gradient(to right, #0a0a0c 10%, transparent 60%), linear-gradient(to top, #0a0a0c 5%, transparent 40%); }
        .hero-info { position: relative; z-index: 10; max-width: 700px; }
        .hero-info h1 { font-size: 4rem; margin-bottom: 1rem; text-shadow: 0 4px 20px rgba(0,0,0,0.5); }
        .hero-info p { font-size: 1.1rem; margin-bottom: 2rem; color: rgba(255,255,255,0.8); }
        .hero-actions { display: flex; gap: 1rem; align-items: center; }
        .add-list { width: 48px; height: 48px; padding: 0; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: all 0.3s ease; overflow: hidden; }
        .add-list span { display: flex; align-items: center; justify-content: center; }
        .add-list.added { border-color: var(--primary); color: var(--primary); background: rgba(13, 202, 240, 0.15); }
        .rows-container { position: relative; z-index: 20; margin-top: -100px; }

        @media (max-width: 768px) {
          .home-hero { height: 70vh; }
          .hero-info h1 { font-size: 2.5rem; }
          .rows-container { margin-top: 0; }
        }
      `}</style>
    </div>
  );
};

export default Home;
