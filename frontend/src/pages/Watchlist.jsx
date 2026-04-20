import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MovieRow from '../components/MovieRow';
import { motion } from 'framer-motion';
import { Bookmark, PlayCircle, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

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

  const removeItem = async (itemId) => {
    try {
      await axios.delete(`${API_URL}/watchlist/${itemId}`);
      setItems(items.filter(item => item._id !== itemId));
      toast.success('Removed from watchlist');
    } catch (err) {
      toast.error('Failed to remove item');
    }
  };

  if (loading) return <div className="loading-screen" style={{height:'100vh'}}></div>;

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
        <div className="watchlist-grid">
           {items.map((item) => (
             <motion.div 
               key={item._id} 
               className="watchlist-card glass"
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               whileHover={{ y: -5 }}
             >
                <div className="card-thumb">
                   <img src={`https://image.tmdb.org/t/p/w500${item.posterPath}`} alt={item.title} />
                   <div className="card-actions">
                      <Link to={`/watch/${item.mediaType}/${item.tmdbId}`} className="play-btn"><PlayCircle size={40} /></Link>
                      <button className="del-btn" onClick={() => removeItem(item._id)}><Trash2 size={20} /></button>
                   </div>
                </div>
                <div className="card-info">
                   <Link to={`/${item.mediaType}/${item.tmdbId}`}><h4>{item.title}</h4></Link>
                   <span>{item.mediaType.toUpperCase()}</span>
                </div>
             </motion.div>
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
        
        .watchlist-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 2rem;
        }
        
        .watchlist-card {
          border-radius: var(--radius-md);
          overflow: hidden;
        }
        
        .card-thumb {
          position: relative;
          aspect-ratio: 2/3;
        }
        
        .card-thumb img { width: 100%; height: 100%; object-fit: cover; }
        
        .card-actions {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          opacity: 0;
          transition: var(--transition-fast);
        }
        
        .watchlist-card:hover .card-actions { opacity: 1; }
        
        .play-btn { color: white; transition: var(--transition-fast); }
        .play-btn:hover { color: var(--primary); transform: scale(1.1); }
        
        .del-btn {
          background: rgba(255,255,255,0.1);
          border: none;
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition-fast);
        }
        
        .del-btn:hover { background: var(--accent); }
        
        .card-info { padding: 1rem; }
        .card-info h4 { margin-bottom: 0.3rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 0.95rem; }
        .card-info h4 a { text-decoration: none; color: white; }
        .card-info span { font-size: 0.75rem; color: var(--text-muted); font-weight: 700; letter-spacing: 1px; }
      `}</style>
    </div>
  );
};

export default Watchlist;
