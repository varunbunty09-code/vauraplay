import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { GridSkeleton } from '../components/skeleton/MovieSkeleton';
import MovieCard from '../components/MovieCard';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Watchlist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWatchlist = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/watchlist`);
      setItems(data.watchlist);
    } catch (err) {
      toast.error('Failed to load watchlist');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  if (loading) return (
    <div className="watchlist-page container">
      <GridSkeleton />
    </div>
  );

  return (
    <div className="watchlist-page container">
      <div className="watchlist-header">
         <h1>My Library</h1>
         <p>You have {items.length} titles saved in your list</p>
      </div>

      {items.length === 0 ? (
        <div className="empty-state glass flex-center">
            <Bookmark size={60} color="var(--text-muted)" />
            <h2>Your watchlist is empty</h2>
            <p>Start adding movies and shows to watch them later.</p>
            <Link to="/" className="btn-primary">Browse Content</Link>
        </div>
      ) : (
        <div className="browse-grid">
           {items.map((item) => (
             <MovieCard
               key={item._id}
               item={{
                 id: item.tmdbId,
                 title: item.title,
                 name: item.title,
                 poster_path: item.posterPath,
                 backdrop_path: item.backdropPath,
                 overview: item.overview,
                 vote_average: item.voteAverage || 0,
               }}
               type={item.mediaType}
             />
           ))}
        </div>
      )}

      <style>{`
        .watchlist-page { padding-top: 120px; padding-bottom: 5rem; }
        .watchlist-header { margin-bottom: 3rem; }
        .watchlist-header h1 { margin-bottom: 0.5rem; }
        
        .empty-state {
          flex-direction: column;
          padding: 5rem;
          border-radius: var(--radius-lg);
          gap: 1.5rem;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default Watchlist;
