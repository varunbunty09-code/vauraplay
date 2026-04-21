import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import tmdbService from '../services/tmdbService';
import { Play, Plus, Star, Clock, Calendar, Bookmark, Share2, MessageCircle, Copy, X, ExternalLink, Check, ThumbsUp, ThumbsDown, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MovieRow from '../components/MovieRow';
import { DetailSkeleton } from '../components/skeleton/MovieSkeleton';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY;

// Inline brand SVGs — lucide-react removed brand icons in v1+
const TwitterIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
const FacebookIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>;

const MovieDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [selectedCast, setSelectedCast] = useState(null);
  const [castDetails, setCastDetails] = useState(null);
  const [castLoading, setCastLoading] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [userRating, setUserRating] = useState(null); // 'loved', 'liked', 'disliked'
  const [ratingFeedback, setRatingFeedback] = useState('');
  const [selectedLang, setSelectedLang] = useState('en');
  const [watchProgress, setWatchProgress] = useState(null);

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

  // Fetch watch progress for this movie
  useEffect(() => {
    const fetchProgress = async () => {
      if (!user) return;
      try {
        const { data } = await axios.get(`${API_URL}/progress/${id}/movie`);
        if (data && data.currentTime > 0) {
          setWatchProgress(data);
        }
      } catch (err) {
        // Silently fail
      }
    };
    fetchProgress();
  }, [id, user]);

  const formatTime = (secs) => {
    if (!secs || secs <= 0) return '0:00';
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.floor(secs % 60);
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  const hasProgress = watchProgress && watchProgress.currentTime > 0 && (watchProgress.progress || 0) < 95;

  const matchPercentage = movie ? Math.floor(movie.vote_average * 8 + 20) : 0;

  const checkWatchlist = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/watchlist/check/${id}/movie`);
      setInWatchlist(data.inWatchlist);
    } catch (err) {}
  };

  const toggleWatchlist = async () => {
    const previousState = inWatchlist;
    setInWatchlist(!previousState);
    try {
      if (previousState) {
        const { data } = await axios.get(`${API_URL}/watchlist/check/${id}/movie`);
        if (data.item?._id) {
          await axios.delete(`${API_URL}/watchlist/${data.item._id}`);
          toast.success('Removed from watchlist');
        } else {
          setInWatchlist(false);
        }
      } else {
        const { data } = await axios.post(`${API_URL}/watchlist`, {
          tmdbId: id, mediaType: 'movie', title: movie.title,
          posterPath: movie.poster_path, backdropPath: movie.backdrop_path,
          overview: movie.overview, voteAverage: movie.vote_average
        });
        if (data.alreadyExists) {
          toast.success('Already in watchlist');
        } else {
          toast.success('Added to watchlist');
        }
        setInWatchlist(true);
      }
    } catch (err) {
      setInWatchlist(previousState);
      toast.error(previousState ? 'Failed to remove' : 'Failed to add');
    }
  };

  const openCastModal = async (person) => {
    setSelectedCast(person);
    setCastLoading(true);
    setCastDetails(null);
    try {
      const { data } = await axios.get(`https://api.themoviedb.org/3/person/${person.id}?api_key=${TMDB_KEY}&append_to_response=movie_credits`);
      setCastDetails(data);
    } catch (err) {
      toast.error('Failed to load actor details');
    } finally {
      setCastLoading(false);
    }
  };

  const closeCastModal = () => { setSelectedCast(null); setCastDetails(null); };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  const handleRate = (rating) => {
    setUserRating(rating);
    if (rating === 'loved') setRatingFeedback("Great choice! We'll recommend more like this.");
    else if (rating === 'liked') setRatingFeedback("Thanks! We'll fine-tune your recommendations.");
    else setRatingFeedback("Got it — we'll show fewer titles like this.");
    setTimeout(() => { setShowRating(false); setRatingFeedback(''); }, 2500);
  };

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent('Check out this movie on VauraPlay: ' + window.location.href)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent('Check out ' + (movie?.title || 'this') + ' on @VauraPlay')}&url=${encodeURIComponent(window.location.href)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`
  };

  if (loading) return <DetailSkeleton />;
  if (!movie) return <div className="error-screen container">Movie not found</div>;

  const [backdropError, setBackdropError] = useState(false);

  return (
    <div className="detail-page">
      <div className="detail-hero">
        <div className="backdrop-wrapper">
          {movie.backdrop_path && !backdropError ? (
            <img 
              src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`} 
              alt={movie.title} 
              onError={() => setBackdropError(true)}
            />
          ) : (
            <div className="backdrop-placeholder" />
          )}
          <div className="detail-gradient"></div>
        </div>

        <div className="container detail-content">
          <div className="detail-main-split">
            <div className="detail-left-content">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="detail-meta-premium">
                  <span className="match-tag">{matchPercentage}% match</span>
                  <span className="year-val">{new Date(movie.release_date).getFullYear()}</span>
                  <span className="runtime-val">{movie.runtime}m</span>
                  <span className="hd-badge">HD</span>
                </div>

                <h1 className="movie-hero-title">{movie.title}</h1>
                
                {movie.tagline && <p className="overview-premium">"{movie.tagline}"</p>}
                <p className="overview-main">{movie.overview}</p>

                {/* Language Selector */}
                <div className="language-selector-netflix">
                  {movie.spoken_languages?.map(lang => (
                    <button 
                      key={lang.iso_639_1} 
                      className={`lang-tab ${selectedLang === lang.iso_639_1 ? 'active' : ''}`}
                      onClick={() => setSelectedLang(lang.iso_639_1)}
                    >
                      {lang.english_name}
                    </button>
                  ))}
                </div>

                <div className="detail-actions-wrapper">
                  {hasProgress && (
                    <div className="movie-progress-bar-wrapper">
                      <div className="movie-progress-track">
                        <div className="movie-progress-fill" style={{ width: `${watchProgress.progress}%` }} />
                      </div>
                      <span className="movie-progress-text">
                        {formatTime(watchProgress.currentTime)} / {formatTime(watchProgress.duration)}
                      </span>
                    </div>
                  )}
                  <div className="detail-actions">
                    <Link to={`/watch/movie/${movie.id}?lang=${selectedLang}`} className="btn-primary">
                      <Play size={20} fill="currentColor" /> {hasProgress ? 'Resume' : 'Play Now'}
                    </Link>

                  <motion.button
                    className={`btn-outline watchlist-toggle ${inWatchlist ? 'active' : ''}`}
                    onClick={toggleWatchlist}
                    whileTap={{ scale: 0.95 }}
                  >
                    <AnimatePresence mode="wait">
                      {inWatchlist ? (
                        <motion.span key="in" className="wl-inner" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} transition={{ duration: 0.2 }}>
                          <Check size={20} /> In Library
                        </motion.span>
                      ) : (
                        <motion.span key="out" className="wl-inner" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} transition={{ duration: 0.2 }}>
                          <Plus size={20} /> Add to List
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>

                  <div className="rating-wrapper">
                    <button className={`btn-outline rate-btn ${userRating ? 'rated' : ''}`} onClick={() => setShowRating(!showRating)} title="Rate this title">
                      {userRating === 'loved' ? <Heart size={20} fill="#f43f5e" color="#f43f5e" /> : userRating === 'liked' ? <ThumbsUp size={20} color="var(--primary)" /> : userRating === 'disliked' ? <ThumbsDown size={20} color="var(--text-muted)" /> : <ThumbsUp size={20} />}
                    </button>
                    <AnimatePresence>
                      {showRating && (
                        <motion.div className="rating-panel glass" initial={{ opacity: 0, y: 10, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.9 }}>
                          {ratingFeedback ? (
                            <motion.p className="rating-feedback" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{ratingFeedback}</motion.p>
                          ) : (
                            <>
                              <button className={`emoji-btn ${userRating === 'loved' ? 'selected' : ''}`} onClick={() => handleRate('loved')} title="Loved it"><span className="emoji">❤️</span><span className="emoji-label">Loved</span></button>
                              <button className={`emoji-btn ${userRating === 'liked' ? 'selected' : ''}`} onClick={() => handleRate('liked')} title="Liked it"><span className="emoji">👍</span><span className="emoji-label">Good</span></button>
                              <button className={`emoji-btn ${userRating === 'disliked' ? 'selected' : ''}`} onClick={() => handleRate('disliked')} title="Not for me"><span className="emoji">👎</span><span className="emoji-label">Not for me</span></button>
                            </>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                    <button className="btn-outline btn-icon" onClick={() => setShowShare(true)} title="Share">
                      <Share2 size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="detail-right-sidebar">
              <div className="sidebar-group">
                <span className="label">Cast:</span>
                <p className="sidebar-val">
                  {movie.credits?.cast?.slice(0, 5).map(c => c.name).join(', ')}
                  {movie.credits?.cast?.length > 5 && '...'}
                </p>
              </div>
              <div className="sidebar-group">
                <span className="label">Genres:</span>
                <p className="sidebar-val">{movie.genres?.map(g => g.name).join(', ')}</p>
              </div>
              <div className="sidebar-group">
                <span className="label">Maturity:</span>
                <span className="rating-pill-static">U/A 18+ [A]</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container cast-section-v2">
        <h3>Top Cast</h3>
        {movie.credits?.cast?.length > 0 ? (
          <div className="cast-scroll-area">
            {movie.credits.cast.slice(0, 15).map(person => (
              <div key={person.id} className="cast-card-v2" onClick={() => openCastModal(person)}>
                <div className="cast-img-wrapper">
                  {person.profile_path ? (
                    <img src={`https://image.tmdb.org/t/p/w200${person.profile_path}`} alt={person.name} />
                  ) : (
                    <div className="cast-placeholder">
                      <Bookmark size={30} color="var(--text-muted)" />
                    </div>
                  )}
                </div>
                <div className="cast-info-v2">
                  <p className="name">{person.name}</p>
                  <p className="char">{person.character}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', padding: '1rem 0' }}>Cast information is not available for this title.</p>
        )}
      </div>

      <div className="container similar-section">
        {movie.similar?.results?.length > 0 ? (
          <MovieRow title="More Like This" items={movie.similar.results} />
        ) : (
          <>
            <h3 style={{ marginBottom: '1rem' }}>More Like This</h3>
            <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No similar movies found for this title.</p>
          </>
        )}
      </div>

      {/* Share Modal */}
      <AnimatePresence>
        {showShare && (
          <div className="share-modal-overlay" onClick={() => setShowShare(false)}>
            <motion.div className="share-modal glass" initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} onClick={e => e.stopPropagation()}>
              <h3>Share this movie</h3>
              <div className="share-options">
                <a href={shareLinks.whatsapp} target="_blank" rel="noreferrer" className="share-btn whatsapp"><MessageCircle size={24} /> WhatsApp</a>
                <a href={shareLinks.twitter} target="_blank" rel="noreferrer" className="share-btn twitter"><TwitterIcon /> Twitter</a>
                <a href={shareLinks.facebook} target="_blank" rel="noreferrer" className="share-btn facebook"><FacebookIcon /> Facebook</a>
              </div>
              <div className="copy-link">
                <input type="text" readOnly value={window.location.href} />
                <button onClick={copyToClipboard}><Copy size={18} /></button>
              </div>
              <button className="close-share" onClick={() => setShowShare(false)}><X size={20} /></button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cast Detail Modal */}
      <AnimatePresence>
        {selectedCast && (
          <div className="share-modal-overlay" onClick={closeCastModal}>
            <motion.div className="cast-modal glass" initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} onClick={e => e.stopPropagation()}>
              <button className="close-share" onClick={closeCastModal}><X size={20} /></button>
              {castLoading ? (
                <div className="cast-modal-loading">
                  <div className="cast-modal-avatar-skeleton skeleton-shimmer" />
                  <div className="cast-modal-text-skeleton skeleton-shimmer" />
                  <div className="cast-modal-text-skeleton short skeleton-shimmer" />
                </div>
              ) : castDetails ? (
                <>
                  <div className="cast-modal-header">
                    <div className="cast-modal-photo-wrapper">
                      {castDetails.profile_path ? (
                        <img src={`https://image.tmdb.org/t/p/w300${castDetails.profile_path}`} alt={castDetails.name} className="cast-modal-photo" />
                      ) : (
                        <div className="cast-modal-placeholder">
                          <Bookmark size={40} color="var(--text-muted)" />
                        </div>
                      )}
                    </div>
                    <div className="cast-modal-info">
                      <h2>{castDetails.name}</h2>
                      {castDetails.birthday && <p className="cast-meta-item">🎂 {new Date(castDetails.birthday).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>}
                      {castDetails.place_of_birth && <p className="cast-meta-item">📍 {castDetails.place_of_birth}</p>}
                      {castDetails.known_for_department && <p className="cast-meta-item">🎭 {castDetails.known_for_department}</p>}
                      <a href={`https://www.themoviedb.org/person/${castDetails.id}`} target="_blank" rel="noreferrer" className="tmdb-link"><ExternalLink size={14} /> View on TMDB</a>
                    </div>
                  </div>

                  {castDetails.biography && (
                    <div className="cast-bio">
                      <h4>Biography</h4>
                      <p>{castDetails.biography.length > 400 ? castDetails.biography.substring(0, 400) + '...' : castDetails.biography}</p>
                    </div>
                  )}

                  {castDetails.movie_credits?.cast?.length > 0 && (
                    <div className="cast-filmography">
                      <h4>Known For</h4>
                      <div className="filmography-scroll">
                        {castDetails.movie_credits.cast
                          .sort((a, b) => (b.vote_average * b.vote_count) - (a.vote_average * a.vote_count))
                          .slice(0, 10)
                          .map(m => (
                            <Link key={m.id + '-' + m.credit_id} to={`/movie/${m.id}`} className="filmography-item" onClick={closeCastModal}>
                              {m.poster_path ? (
                                <img src={`https://image.tmdb.org/t/p/w200${m.poster_path}`} alt={m.title} />
                              ) : (
                                <div className="film-placeholder">
                                  <span>{m.title}</span>
                                </div>
                              )}
                              <p>{m.title}</p>
                            </Link>
                          ))
                        }
                      </div>
                    </div>
                  )}
                </>
              ) : null}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .detail-page { padding-bottom: 5rem; }
        .detail-actions-wrapper { display: flex; flex-direction: column; gap: 0.5rem; }
        .movie-progress-bar-wrapper { display: flex; align-items: center; gap: 1rem; max-width: 400px; }
        .movie-progress-track { flex: 1; height: 4px; background: rgba(255,255,255,0.2); border-radius: 4px; overflow: hidden; }
        .movie-progress-fill { height: 100%; background: #e50914; border-radius: 4px; transition: width 0.3s ease; }
        .movie-progress-text { font-size: 0.85rem; color: var(--text-dim); white-space: nowrap; font-weight: 500; }
        .detail-hero { height: auto; min-height: 85vh; display: flex; align-items: flex-end; padding: 6rem 0; position: relative; }
        .backdrop-wrapper { position: absolute; inset: 0; z-index: 0; }
        .backdrop-wrapper img { width: 100%; height: 100%; object-fit: cover; }
        .detail-gradient { position: absolute; inset: 0; background: linear-gradient(to top, #0a0a0c 18%, transparent 95%), linear-gradient(to right, #0a0a0c 15%, transparent 85%); }
        .detail-content { position: relative; z-index: 10; display: flex; gap: 3rem; align-items: flex-end; }
        .detail-poster { width: 300px; aspect-ratio: 2/3; border-radius: var(--radius-lg); overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.8); border: 1px solid var(--border-light); }
        .detail-poster img { width: 100%; height: 100%; object-fit: cover; }
        .detail-main { flex: 1; }
        .detail-meta { display: flex; gap: 1.5rem; margin-bottom: 1rem; font-size: 0.9rem; color: var(--text-dim); align-items: center; }
        .rating-pill { padding: 0.3rem 0.8rem; border-radius: 20px; color: var(--primary); font-weight: 700; display: flex; align-items: center; gap: 0.4rem; }
        .detail-main h1 { font-size: 3.5rem; margin-bottom: 1rem; }
        .genres { display: flex; gap: 0.8rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
        .genre-tag { font-size: 0.8rem; padding: 0.3rem 1rem; background: rgba(255,255,255,0.05); border: 1px solid var(--border-light); border-radius: 20px; color: var(--text-dim); }
        .overview { max-width: 700px; margin-bottom: 2rem; font-size: 1.1rem; color: var(--text-dim); line-height: 1.7; }
        .detail-actions { display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; }
        .extra-info { margin-top: 4rem; }
        .cast-section { margin-bottom: 4rem; }
        .cast-section h3 { margin-bottom: 2rem; }
        .cast-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 1.5rem; }
        .cast-card { cursor: pointer; transition: transform 0.3s ease; }
        .cast-card:hover { transform: translateY(-8px); }
        .cast-card img { width: 100%; aspect-ratio: 2/3; object-fit: cover; border-radius: var(--radius-md); margin-bottom: 0.5rem; }
        .cast-card .name { font-weight: 700; font-size: 0.9rem; }
        .cast-card .char { font-size: 0.8rem; color: var(--text-muted); }

        @media (max-width: 900px) {
          .detail-hero { height: auto; padding-top: 100px; }
          .detail-content { flex-direction: column; align-items: center; text-align: center; }
          .detail-meta, .genres, .detail-actions { justify-content: center; }
          .detail-poster { width: 200px; }
          .detail-main h1 { font-size: 2.5rem; }
        }

        /* Share Modal */
        .share-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(5px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 2rem; }
        .share-modal { width: 100%; max-width: 450px; padding: 2.5rem; border-radius: var(--radius-lg); text-align: center; position: relative; }
        .share-modal h3 { margin-bottom: 2rem; }
        .share-options { display: flex; justify-content: center; gap: 1.5rem; margin-bottom: 2rem; }
        .share-btn { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; text-decoration: none; color: white; font-size: 0.8rem; transition: 0.3s; }
        .share-btn:hover { color: var(--primary); transform: translateY(-5px); }
        .whatsapp { color: #25D366; } .twitter { color: #1DA1F2; } .facebook { color: #1877F2; }
        .copy-link { display: flex; background: rgba(255,255,255,0.05); border: 1px solid var(--border-light); border-radius: 10px; padding: 0.5rem; margin-top: 1rem; }
        .copy-link input { flex: 1; background: none; border: none; color: var(--text-dim); padding: 0.5rem; font-size: 0.9rem; outline: none; }
        .copy-link button { background: var(--primary); border: none; padding: 0.5rem 1rem; border-radius: 8px; color: black; cursor: pointer; }
        .close-share { position: absolute; top: 1rem; right: 1rem; background: none; border: none; color: var(--text-muted); cursor: pointer; z-index: 10; }

        /* Cast Modal */
        .cast-modal { width: 100%; max-width: 650px; max-height: 85vh; overflow-y: auto; padding: 2.5rem; border-radius: var(--radius-lg); position: relative; scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.1) transparent; }
        .cast-modal-header { display: flex; gap: 2rem; margin-bottom: 2rem; }
        .cast-modal-photo { width: 180px; aspect-ratio: 2/3; object-fit: cover; border-radius: var(--radius-md); flex-shrink: 0; }
        .cast-modal-info { display: flex; flex-direction: column; gap: 0.5rem; }
        .cast-modal-info h2 { font-size: 2rem; margin-bottom: 0.5rem; background: linear-gradient(135deg, #fff 0%, var(--primary) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .cast-meta-item { font-size: 0.9rem; color: var(--text-dim); }
        .tmdb-link { display: inline-flex; align-items: center; gap: 0.5rem; color: var(--primary); text-decoration: none; font-size: 0.85rem; font-weight: 600; margin-top: 0.5rem; transition: 0.3s; }
        .tmdb-link:hover { opacity: 0.8; }
        .cast-bio { margin-bottom: 2rem; }
        .cast-bio h4 { margin-bottom: 0.8rem; color: var(--primary); font-size: 1rem; }
        .cast-bio p { font-size: 0.9rem; color: var(--text-dim); line-height: 1.7; }
        .cast-filmography h4 { margin-bottom: 1rem; color: var(--primary); font-size: 1rem; }
        .filmography-scroll { display: flex; gap: 1rem; overflow-x: auto; padding-bottom: 1rem; scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.1) transparent; }
        .filmography-item { flex: 0 0 120px; text-decoration: none; transition: 0.3s; }
        .filmography-item:hover { transform: scale(1.05); }
        .filmography-item img { width: 100%; height: 180px; object-fit: cover; border-radius: 8px; margin-bottom: 0.5rem; }
        .filmography-item p { font-size: 0.8rem; color: var(--text-dim); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .cast-modal-loading { display: flex; flex-direction: column; align-items: center; gap: 1rem; padding: 3rem; }
        .cast-modal-avatar-skeleton { width: 150px; height: 225px; border-radius: var(--radius-md); }
        .cast-modal-text-skeleton { width: 200px; height: 20px; border-radius: 4px; }
        .cast-modal-text-skeleton.short { width: 120px; }
        .skeleton-shimmer { background: linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.08) 37%, rgba(255,255,255,0.03) 63%); background-size: 400% 100%; animation: skeleton-loading 1.4s ease infinite; }
        @keyframes skeleton-loading { 0% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @media (max-width: 600px) {
          .cast-modal { padding: 1.5rem; }
          .cast-modal-header { flex-direction: column; align-items: center; text-align: center; }
          .cast-modal-photo { width: 140px; }
          .cast-modal-info { align-items: center; }
        }
      `}</style>
    </div>
  );
};

export default MovieDetail;
