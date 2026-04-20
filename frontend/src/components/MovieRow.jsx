import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Star, Play, Plus, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const MovieCard = ({ item, type }) => {
  const navigate = useNavigate();
  const [inWatchlist, setInWatchlist] = useState(false);
  const [checked, setChecked] = useState(false);
  const [busy, setBusy] = useState(false);

  const mediaType = item.media_type || type;
  const title = item.title || item.name;

  // Check watchlist status on first hover
  const handleMouseEnter = async () => {
    if (checked) return;
    try {
      const { data } = await axios.get(`${API_URL}/watchlist/check/${item.id}/${mediaType}`);
      setInWatchlist(data.inWatchlist);
    } catch (e) {}
    setChecked(true);
  };

  const toggleWatchlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (busy) return;
    setBusy(true);
    try {
      if (inWatchlist) {
        const { data } = await axios.get(`${API_URL}/watchlist/check/${item.id}/${mediaType}`);
        await axios.delete(`${API_URL}/watchlist/${data.item._id}`);
        setInWatchlist(false);
        toast.success('Removed from watchlist');
      } else {
        await axios.post(`${API_URL}/watchlist`, {
          tmdbId: item.id, mediaType,
          title, posterPath: item.poster_path,
          backdropPath: item.backdrop_path,
          overview: item.overview,
          voteAverage: item.vote_average
        });
        setInWatchlist(true);
        toast.success('Added to watchlist');
      }
    } catch (err) {
      toast.error('Watchlist error');
    } finally {
      setBusy(false);
    }
  };

  const handlePlayClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/watch/${mediaType}/${item.id}`);
  };

  const getImageUrl = (path) => path ? `https://image.tmdb.org/t/p/w500${path}` : 'https://via.placeholder.com/500x750?text=No+Image';

  return (
    <motion.div
      className="movie-card"
      whileHover={{ scale: 1.05, zIndex: 10 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={handleMouseEnter}
    >
      <Link to={`/${mediaType}/${item.id}`}>
        <div className="card-image">
          <img src={getImageUrl(item.poster_path)} alt={title} loading="lazy" />
          <div className="card-overlay">
            <div className="card-overlay-top">
              <div className="rating"><Star size={12} fill="var(--primary)" /> {item.vote_average?.toFixed(1)}</div>
            </div>
            <div className="card-overlay-actions">
              <button className="card-action-btn play-btn" onClick={handlePlayClick} title="Watch Now">
                <Play size={16} fill="white" />
              </button>
              <button className={`card-action-btn watchlist-btn ${inWatchlist ? 'in-list' : ''}`} onClick={toggleWatchlist} title={inWatchlist ? 'Remove from list' : 'Add to list'}>
                <AnimatePresence mode="wait">
                  {inWatchlist ? (
                    <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 400, damping: 15 }}>
                      <Check size={16} />
                    </motion.span>
                  ) : (
                    <motion.span key="plus" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 400, damping: 15 }}>
                      <Plus size={16} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
        <p className="movie-title">{title}</p>
      </Link>
    </motion.div>
  );
};

const MovieRow = ({ title, items, type = 'movie' }) => {
  const rowRef = useRef(null);

  const scroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="movie-row-container">
      <h3 className="row-title">{title}</h3>
      
      <div className="row-wrapper">
        <button className="row-arrow left" onClick={() => scroll('left')}><ChevronLeft /></button>
        
        <div className="movie-row" ref={rowRef}>
          {items?.map((item) => (
            <MovieCard key={item.id} item={item} type={type} />
          ))}
        </div>
        
        <button className="row-arrow right" onClick={() => scroll('right')}><ChevronRight /></button>
      </div>

      <style>{`
        .movie-row-container { margin-bottom: 3rem; padding: 0 4%; }
        .row-title { font-size: 1.5rem; margin-bottom: 1rem; color: var(--text-main); }
        .row-wrapper { position: relative; display: flex; align-items: center; }
        .movie-row { display: flex; gap: 1rem; overflow-x: auto; scroll-behavior: smooth; padding: 1rem 0; scrollbar-width: none; }
        .movie-row::-webkit-scrollbar { display: none; }
        .movie-card { flex: 0 0 200px; width: 200px; cursor: pointer; transition: transform 0.3s ease; }
        .card-image { position: relative; width: 100%; height: 300px; border-radius: var(--radius-md); overflow: hidden; background: var(--bg-card); }
        .card-image img { width: 100%; height: 100%; object-fit: cover; display: block; }
        
        .card-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 40%, transparent 100%);
          opacity: 0; transition: opacity 0.3s ease;
          display: flex; flex-direction: column; justify-content: space-between; padding: 0.8rem;
        }
        .movie-card:hover .card-overlay { opacity: 1; }
        
        .card-overlay-top { display: flex; justify-content: flex-end; }
        .rating { font-size: 0.8rem; font-weight: 700; display: flex; align-items: center; gap: 0.3rem; color: white; background: rgba(0,0,0,0.5); padding: 0.25rem 0.6rem; border-radius: 20px; }
        
        .card-overlay-actions { display: flex; gap: 0.5rem; justify-content: center; }
        .card-action-btn {
          width: 36px; height: 36px; border-radius: 50%; border: 1.5px solid rgba(255,255,255,0.5);
          background: rgba(0,0,0,0.6); color: white; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.25s ease; backdrop-filter: blur(4px);
        }
        .card-action-btn span { display: flex; align-items: center; justify-content: center; }
        .card-action-btn:hover { transform: scale(1.15); }
        .play-btn:hover { background: var(--primary); border-color: var(--primary); color: black; }
        .watchlist-btn.in-list { border-color: var(--primary); color: var(--primary); background: rgba(13,202,240,0.2); }
        .watchlist-btn:hover { border-color: var(--primary); }
        
        .movie-title { margin-top: 0.8rem; font-size: 0.9rem; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--text-dim); text-align: left; }
        
        .row-arrow { position: absolute; z-index: 5; background: rgba(0,0,0,0.5); border: none; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; opacity: 0; transition: var(--transition-fast); }
        .row-wrapper:hover .row-arrow { opacity: 1; }
        .row-arrow:hover { background: var(--primary); color: black; transform: scale(1.1); }
        .left { left: -20px; }
        .right { right: -20px; }
        
        @media (max-width: 768px) {
          .movie-card { flex: 0 0 140px; width: 140px; }
          .card-image { height: 210px; }
          .row-arrow { display: none; }
          .card-overlay { opacity: 1; } /* Always show on mobile since no hover */
          .card-action-btn { width: 30px; height: 30px; }
        }
      `}</style>
    </div>
  );
};

export default MovieRow;
