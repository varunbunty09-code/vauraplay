import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import tmdbService from '../services/tmdbService';
import { Play, Plus, Star, Clock, Calendar, Bookmark, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import MovieRow from '../components/MovieRow';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inWatchlist, setInWatchlist] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true);
      try {
        const data = await tmdbService.getDetails(id, 'movie');
        setMovie(data);
        checkWatchlist();
      } catch (err) {
        toast.error('Failed to load movie details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMovie();
    window.scrollTo(0, 0);
  }, [id]);

  const checkWatchlist = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/watchlist/check/${id}/movie`);
      setInWatchlist(data.inWatchlist);
    } catch (err) {}
  };

  const toggleWatchlist = async () => {
    try {
      if (inWatchlist) {
         // Get the item ID first - normally we'd store it
         const { data } = await axios.get(`${API_URL}/watchlist/check/${id}/movie`);
         await axios.delete(`${API_URL}/watchlist/${data.item._id}`);
         setInWatchlist(false);
         toast.success('Removed from watchlist');
      } else {
        await axios.post(`${API_URL}/watchlist`, {
          tmdbId: id,
          mediaType: 'movie',
          title: movie.title,
          posterPath: movie.poster_path,
          backdropPath: movie.backdrop_path,
          overview: movie.overview,
          voteAverage: movie.vote_average
        });
        setInWatchlist(true);
        toast.success('Added to watchlist');
      }
    } catch (err) {
      toast.error('Watchlist error');
    }
  };

  if (loading) return <div className="loading-screen" style={{height:'100vh'}}></div>;
  if (!movie) return <div className="error-screen container">Movie not found</div>;

  return (
    <div className="detail-page">
      <div className="detail-hero">
        <div className="backdrop-wrapper">
          <img src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`} alt={movie.title} />
          <div className="detail-gradient"></div>
        </div>

        <div className="container detail-content">
          <div className="detail-side">
            <motion.div 
               className="detail-poster"
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1 }}
            >
              <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
            </motion.div>
          </div>

          <div className="detail-main">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="detail-meta">
                <span className="rating-pill glass"><Star size={14} fill="var(--primary)" /> {movie.vote_average.toFixed(1)}</span>
                <span><Calendar size={14} /> {new Date(movie.release_date).getFullYear()}</span>
                <span><Clock size={14} /> {movie.runtime} min</span>
              </div>

              <h1>{movie.title}</h1>
              <div className="genres">
                {movie.genres?.map(g => <span key={g.id} className="genre-tag">{g.name}</span>)}
              </div>

              <p className="overview">{movie.overview}</p>

              <div className="detail-actions">
                <Link to={`/watch/movie/${movie.id}`} className="btn-primary">
                  <Play size={20} fill="currentColor" /> Play Now
                </Link>
                <button className={`btn-outline ${inWatchlist ? 'active' : ''}`} onClick={toggleWatchlist}>
                  <Bookmark size={20} fill={inWatchlist ? 'var(--primary)' : 'none'} /> 
                  {inWatchlist ? 'In Library' : 'Add to List'}
                </button>
                <button className="btn-outline"><Share2 size={20} /></button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container extra-info">
         {movie.credits?.cast && (
           <div className="cast-section">
             <h3>Top Cast</h3>
             <div className="cast-grid">
                {movie.credits.cast.slice(0, 6).map(person => (
                  <div key={person.id} className="cast-card">
                    <img src={person.profile_path ? `https://image.tmdb.org/t/p/w200${person.profile_path}` : 'https://via.placeholder.com/200x300?text=No+Photo'} alt={person.name} />
                    <p className="name">{person.name}</p>
                    <p className="char">{person.character}</p>
                  </div>
                ))}
             </div>
           </div>
         )}

         {movie.similar?.results.length > 0 && (
           <div className="similar-section">
              <MovieRow title="Similar Movies" items={movie.similar.results} />
           </div>
         )}
      </div>

      <style>{`
        .detail-page {
          padding-bottom: 5rem;
        }
        
        .detail-hero {
          height: 80vh;
          position: relative;
          display: flex;
          align-items: flex-end;
          padding-bottom: 4rem;
        }
        
        .backdrop-wrapper {
          position: absolute;
          inset: 0;
          z-index: 0;
        }
        
        .backdrop-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .detail-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, #0a0a0c 5%, transparent 60%),
                      linear-gradient(to right, #0a0a0c 10%, transparent 80%);
        }
        
        .detail-content {
          position: relative;
          z-index: 10;
          display: flex;
          gap: 3rem;
          align-items: flex-end;
        }
        
        .detail-poster {
          width: 300px;
          aspect-ratio: 2/3;
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(0,0,0,0.8);
          border: 1px solid var(--border-light);
        }
        
        .detail-poster img { width: 100%; height: 100%; object-fit: cover; }
        
        .detail-main {
          flex: 1;
        }
        
        .detail-meta {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 1rem;
          font-size: 0.9rem;
          color: var(--text-dim);
          align-items: center;
        }
        
        .rating-pill {
          padding: 0.3rem 0.8rem;
          border-radius: 20px;
          color: var(--primary);
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        
        .detail-main h1 {
          font-size: 3.5rem;
          margin-bottom: 1rem;
        }
        
        .genres {
          display: flex;
          gap: 0.8rem;
          margin-bottom: 1.5rem;
        }
        
        .genre-tag {
          font-size: 0.8rem;
          padding: 0.3rem 1rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--border-light);
          border-radius: 20px;
          color: var(--text-dim);
        }
        
        .overview {
          max-width: 700px;
          margin-bottom: 2rem;
          font-size: 1.1rem;
          color: var(--text-dim);
          line-height: 1.7;
        }
        
        .detail-actions {
          display: flex;
          gap: 1rem;
        }
        
        .extra-info {
          margin-top: 4rem;
        }
        
        .cast-section {
          margin-bottom: 4rem;
        }
        
        .cast-section h3 { margin-bottom: 2rem; }
        
        .cast-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 1.5rem;
        }
        
        .cast-card img {
          width: 100%;
          border-radius: var(--radius-md);
          margin-bottom: 0.5rem;
        }
        
        .cast-card .name { font-weight: 700; font-size: 0.9rem; }
        .cast-card .char { font-size: 0.8rem; color: var(--text-muted); }

        @media (max-width: 900px) {
          .detail-hero { height: auto; padding-top: 100px; }
          .detail-content { flex-direction: column; align-items: center; text-align: center; }
          .detail-meta, .genres, .detail-actions { justify-content: center; }
          .detail-poster { width: 200px; }
          .detail-main h1 { font-size: 2.5rem; }
        }
      `}</style>
    </div>
  );
};

export default MovieDetail;
