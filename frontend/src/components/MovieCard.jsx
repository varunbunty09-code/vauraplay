import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Play, Plus, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useWatchlist } from '../context/WatchlistContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const MovieCard = ({ item, type, showBadge = false }) => {
  const navigate = useNavigate();
  const { isInWatchlist, getWatchlistItemId, addToMap, removeFromMap } = useWatchlist();

  const mediaType = item.media_type || type;
  const title = item.title || item.name;
  const inWatchlist = isInWatchlist(item.id, mediaType);

  const toggleWatchlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (inWatchlist) {
        const itemId = getWatchlistItemId(item.id, mediaType);
        if (itemId) {
          await axios.delete(`${API_URL}/watchlist/${itemId}`);
          removeFromMap(item.id, mediaType);
          toast.success('Removed from watchlist');
        }
      } else {
        const { data } = await axios.post(`${API_URL}/watchlist`, {
          tmdbId: item.id, mediaType,
          title, posterPath: item.poster_path,
          backdropPath: item.backdrop_path,
          overview: item.overview,
          voteAverage: item.vote_average
        });
        addToMap(item.id, mediaType, data._id || data.item?._id);
        if (data.alreadyExists) {
          toast.success('Already in watchlist');
        } else {
          toast.success('Added to watchlist');
        }
      }
    } catch (err) {
      toast.error(inWatchlist ? 'Failed to remove' : 'Failed to add');
    }
  };

  const handlePlayClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/watch/${mediaType}/${item.id}`);
  };

  const [imgError, setImgError] = useState(false);

  const getImageUrl = (path) => {
    if (imgError || !path) return null;
    return `https://image.tmdb.org/t/p/w500${path}`;
  };

  return (
    <motion.div
      className="browse-movie-card"
      whileHover={{ scale: 1.05, zIndex: 10 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/${mediaType}/${item.id}`}>
        <div className="browse-card-image">
          {getImageUrl(item.poster_path) ? (
            <img 
              src={getImageUrl(item.poster_path)} 
              alt={title} 
              loading="lazy" 
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="browse-card-placeholder">
              <span className="placeholder-title">{title}</span>
              <div className="placeholder-icon">🎬</div>
            </div>
          )}
          <div className="browse-card-overlay">
            <div className="browse-overlay-top">
              <div className="browse-rating"><Star size={12} fill="var(--primary)" /> {item.vote_average?.toFixed(1)}</div>
            </div>
            <div className="browse-overlay-actions">
              <button className="browse-action-btn browse-play-btn" onClick={handlePlayClick} title="Watch Now">
                <Play size={16} fill="white" />
              </button>
              <button className={`browse-action-btn browse-wl-btn ${inWatchlist ? 'in-list' : ''}`} onClick={toggleWatchlist} title={inWatchlist ? 'Remove from list' : 'Add to list'}>
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
        <div className="browse-card-info">
          <p className="browse-card-title">{title}</p>
          {showBadge && <span className="browse-card-badge">{mediaType === 'movie' ? 'MOVIE' : 'TV SHOW'}</span>}
        </div>
      </Link>
    </motion.div>
  );
};

export default MovieCard;
