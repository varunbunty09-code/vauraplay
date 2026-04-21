import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import tmdbService from '../services/tmdbService';
import { Play, Plus, Star, Calendar, Bookmark, List, Share2, MessageCircle, Copy, X, ExternalLink, Check, ThumbsUp, ThumbsDown, Heart } from 'lucide-react';

const TwitterIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
const FacebookIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>;
import { motion, AnimatePresence } from 'framer-motion';
import MovieRow from '../components/MovieRow';
import { DetailSkeleton } from '../components/skeleton/MovieSkeleton';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const TVDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [show, setShow] = useState(null);
    const [seasons, setSeasons] = useState([]);
    const [selectedSeason, setSelectedSeason] = useState(1);
    const [episodes, setEpisodes] = useState([]);
    const [selectedCast, setSelectedCast] = useState(null);
    const [castDetails, setCastDetails] = useState(null);
    const [castLoading, setCastLoading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [episodesLoading, setEpisodesLoading] = useState(false);
    const [showShare, setShowShare] = useState(false);
    const [selectedLang, setSelectedLang] = useState('en');
    const [contentRating, setContentRating] = useState('');
    const [inWatchlist, setInWatchlist] = useState(false);
    const [recommendations, setRecommendations] = useState([]);
    const [showRating, setShowRating] = useState(false);
    const [userRating, setUserRating] = useState(null);
    const [ratingFeedback, setRatingFeedback] = useState('');
    const [episodeProgressMap, setEpisodeProgressMap] = useState({});
    const [lastResumeEp, setLastResumeEp] = useState(null);

    const handleRate = (rating) => {
        setUserRating(rating);
        if (rating === 'loved') setRatingFeedback("Great choice! We'll recommend more like this.");
        else if (rating === 'liked') setRatingFeedback("Thanks! We'll fine-tune your recommendations.");
        else setRatingFeedback("Got it — we'll show fewer titles like this.");
        setTimeout(() => { setShowRating(false); setRatingFeedback(''); }, 2500);
    };

    useEffect(() => {
        const fetchShow = async () => {
            setLoading(true);
            try {
                const data = await tmdbService.getDetails(id, 'tv');
                setShow(data);
                setSeasons(data.seasons);
                
                // Find US rating if available
                const usRating = data.content_ratings?.results?.find(r => r.iso_3166_1 === 'US')?.rating;
                setContentRating(usRating || data.content_ratings?.results?.[0]?.rating || '');

                // Check if already in watchlist
                try {
                    const { data: wlData } = await axios.get(`${API_URL}/watchlist/check/${data.id}/tv`);
                    setInWatchlist(wlData.inWatchlist);
                } catch (e) {}

                // Use similar data already fetched by getDetails
                if (data.similar?.results) {
                    setRecommendations(data.similar.results);
                }
            } catch (err) {
                toast.error('Failed to load series details');
            } finally {
                setLoading(false);
            }
        };
        fetchShow();
        window.scrollTo(0, 0);
    }, [id]);

    // Fetch the most recent in-progress episode across ALL seasons for hero Resume button
    useEffect(() => {
        const fetchResumeEp = async () => {
            if (!user || !id) return;
            try {
                // No season filter = returns ALL progress for this show
                const { data } = await axios.get(`${API_URL}/progress/${id}/tv`);
                if (Array.isArray(data) && data.length > 0) {
                    const inProgress = data
                        .filter(p => p.currentTime > 0 && (p.progress || 0) < 95)
                        .sort((a, b) => new Date(b.lastWatched) - new Date(a.lastWatched));
                    if (inProgress.length > 0) {
                        setLastResumeEp(inProgress[0]);
                    }
                }
            } catch (err) {
                // Silently fail
            }
        };
        fetchResumeEp();
    }, [id, user]);

    const matchPercentage = show ? Math.floor(show.vote_average * 8 + 20) : 0;

    useEffect(() => {
        const fetchEpisodes = async () => {
            if (!id) return;
            setEpisodesLoading(true);
            try {
                const data = await tmdbService.getTVSeason(id, selectedSeason);
                setEpisodes(data.episodes || []);
            } catch (err) {
                console.error('Failed to load episodes');
            } finally {
                setEpisodesLoading(false);
            }
        };
        fetchEpisodes();
    }, [id, selectedSeason]);

    // Fetch watch progress for all episodes in the current season
    useEffect(() => {
        const fetchEpisodeProgress = async () => {
            if (!user || !id) return;
            try {
                const { data } = await axios.get(`${API_URL}/progress/${id}/tv?season=${selectedSeason}`);
                if (Array.isArray(data)) {
                    const map = {};
                    data.forEach(p => {
                        map[p.episode] = p;
                    });
                    setEpisodeProgressMap(map);
                }
            } catch (err) {
                // Silently fail
            }
        };
        fetchEpisodeProgress();
    }, [id, selectedSeason, user]);

    // Find the last watched episode in the CURRENT season for per-season context
    const lastWatchedEp = useMemo(() => {
        const inProgress = Object.values(episodeProgressMap)
            .filter(p => p.currentTime > 0 && (p.progress || 0) < 95)
            .sort((a, b) => new Date(b.lastWatched) - new Date(a.lastWatched));
        return inProgress.length > 0 ? inProgress[0] : null;
    }, [episodeProgressMap]);

    // Hero resume uses cross-season lastResumeEp, falling back to current season's lastWatchedEp
    const heroResumeEp = lastResumeEp || lastWatchedEp;

    const formatTime = (secs) => {
        if (!secs || secs <= 0) return '0:00';
        const h = Math.floor(secs / 3600);
        const m = Math.floor((secs % 3600) / 60);
        const s = Math.floor(secs % 60);
        if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        return `${m}:${String(s).padStart(2, '0')}`;
    };

    const toggleWatchlist = async () => {
        const prev = inWatchlist;
        setInWatchlist(!prev);
        try {
            if (prev) {
                const { data } = await axios.get(`${API_URL}/watchlist/check/${show.id}/tv`);
                if (data.item?._id) {
                    await axios.delete(`${API_URL}/watchlist/${data.item._id}`);
                    toast.success('Removed from watchlist');
                } else {
                    setInWatchlist(false);
                }
            } else {
                const { data } = await axios.post(`${API_URL}/watchlist`, {
                    tmdbId: show.id,
                    mediaType: 'tv',
                    title: show.name,
                    posterPath: show.poster_path,
                    backdropPath: show.backdrop_path,
                    overview: show.overview,
                    voteAverage: show.vote_average,
                });
                if (data.alreadyExists) {
                    toast.success('Already in watchlist');
                } else {
                    toast.success('Added to watchlist');
                }
                setInWatchlist(true);
            }
        } catch (err) {
            setInWatchlist(prev);
            toast.error(prev ? 'Failed to remove' : 'Failed to add');
        }
    };

    const openCastModal = async (person) => {
      setSelectedCast(person);
      setCastLoading(true);
      setCastDetails(null);
      try {
        const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY;
        const { data } = await axios.get(`https://api.themoviedb.org/3/person/${person.id}?api_key=${TMDB_KEY}&append_to_response=tv_credits`);
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

    const shareLinks = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent('Check out this show on VauraPlay: ' + window.location.href)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent('Check out ' + (show?.name || 'this') + ' on @VauraPlay')}&url=${encodeURIComponent(window.location.href)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`
    };

    if (loading) return <DetailSkeleton />;

    return (
        <div className="detail-page tv">
            <div className="detail-hero">
                <div className="backdrop-wrapper">
                    <img src={`https://image.tmdb.org/t/p/original${show.backdrop_path}`} alt={show.name} />
                    <div className="detail-gradient"></div>
                </div>
                <div className="container detail-content">
                    <div className="detail-main-split">
                        <div className="detail-left-content">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                                <div className="detail-meta-premium">
                                    <span className="match-tag">{matchPercentage}% match</span>
                                    <span className="year-val">{show.first_air_date?.split('-')[0]}</span>
                                    <span className="runtime-val">{show.number_of_seasons} Seasons</span>
                                    <span className="hd-badge">HD</span>
                                </div>

                                <h1 className="movie-hero-title">{show.name}</h1>
                                
                                {show.tagline && <p className="overview-premium">"{show.tagline}"</p>}
                                <p className="overview-main">{show.overview}</p>

                                {/* Language Selector */}
                                <div className="language-selector-netflix">
                                    {show.spoken_languages?.map(lang => (
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
                                  {heroResumeEp && (
                                    <div className="movie-progress-bar-wrapper">
                                      <div className="movie-progress-track">
                                        <div className="movie-progress-fill" style={{ width: `${heroResumeEp.progress}%` }} />
                                      </div>
                                      <span className="movie-progress-text">
                                        S{heroResumeEp.season}:E{heroResumeEp.episode} · {formatTime(heroResumeEp.currentTime)} / {formatTime(heroResumeEp.duration)}
                                      </span>
                                    </div>
                                  )}
                                  <div className="detail-actions">
                                    <Link to={heroResumeEp ? `/watch/tv/${show.id}?s=${heroResumeEp.season}&e=${heroResumeEp.episode}&lang=${selectedLang}` : `/watch/tv/${show.id}?s=${selectedSeason}&e=1&lang=${selectedLang}`} className="btn-primary">
                                        <Play size={20} fill="currentColor" /> {heroResumeEp ? `Resume S${heroResumeEp.season}:E${heroResumeEp.episode}` : 'Watch Now'}
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
                                        <button className={`btn-outline rate-btn ${userRating ? 'rated' : ''}`} onClick={() => setShowRating(!showRating)}>
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

                                    <button className="btn-outline btn-icon" onClick={() => setShowShare(true)}>
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
                                    {show.credits?.cast?.length > 0
                                        ? show.credits.cast.slice(0, 5).map(c => c.name).join(', ') + (show.credits.cast.length > 5 ? '...' : '')
                                        : 'Not available'}
                                </p>
                            </div>
                            <div className="sidebar-group">
                                <span className="label">Genres:</span>
                                <p className="sidebar-val">{show.genres?.length > 0 ? show.genres.map(g => g.name).join(', ') : 'Not available'}</p>
                            </div>
                            <div className="sidebar-group">
                                <span className="label">Maturity:</span>
                                <span className="rating-pill-static">{contentRating || 'U/A 13+'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container cast-section-v2">
                <h3>Top Cast</h3>
                {show.credits?.cast?.length > 0 ? (
                    <div className="cast-scroll-area">
                        {show.credits.cast.slice(0, 15).map(person => (
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

            <div className="container season-section">
                <div className="season-header-new">
                    <div className="title-area">
                        <h2>Episodes</h2>
                        <p>{episodes.length} items to watch</p>
                    </div>
                    <div className="season-dropdown-wrapper">
                        <select 
                            className="season-select-glass"
                            value={selectedSeason}
                            onChange={(e) => setSelectedSeason(Number(e.target.value))}
                        >
                            {seasons.filter(s => s.season_number > 0).map(s => (
                                <option key={s.id} value={s.season_number}>
                                    Season {s.season_number} ({s.episode_count} Episodes)
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {episodesLoading ? (
                    <div className="episodes-loader">
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                            <Play size={40} color="var(--primary)" fill="var(--primary)" />
                        </motion.div>
                        <p>Fetching episodes...</p>
                    </div>
                ) : (
                    <div className="episodes-stack">
                        {episodes.map(ep => (
                            <Link to={`/watch/tv/${id}?s=${selectedSeason}&e=${ep.episode_number}`} key={ep.id} className="episode-bar glass">
                                <div className="eb-thumb-wrap">
                                    <div className="eb-thumb">
                                        <img src={ep.still_path ? `https://image.tmdb.org/t/p/w300${ep.still_path}` : `https://image.tmdb.org/t/p/w300${show.backdrop_path}`} alt={ep.name} />
                                        <div className="eb-play-overlay"><Play size={20} fill="white" /></div>
                                    </div>
                                    {episodeProgressMap[ep.episode_number] && episodeProgressMap[ep.episode_number].currentTime > 0 && (
                                        <>
                                            <div className="ep-progress-track">
                                                <div className="ep-progress-fill" style={{ width: `${Math.min(episodeProgressMap[ep.episode_number].progress || 0, 100)}%` }} />
                                            </div>
                                            <span className="ep-time-text">
                                                {formatTime(episodeProgressMap[ep.episode_number].currentTime)} / {formatTime(episodeProgressMap[ep.episode_number].duration)}
                                            </span>
                                        </>
                                    )}
                                </div>
                                <div className="eb-info">
                                    <div className="eb-main">
                                        <span className="eb-num">Episode {ep.episode_number}</span>
                                        <h4 className="eb-title">{ep.name}</h4>
                                    </div>
                                    <p className="eb-overview">{ep.overview || 'No description available.'}</p>
                                </div>
                                <div className="eb-action">
                                    <button className="ep-play-mini"><Play size={16} fill="black" /></button>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {recommendations.length > 0 ? (
                <div className="container similar-section">
                    <MovieRow title="More Like This" items={recommendations} type="tv" />
                </div>
            ) : (
                <div className="container similar-section">
                    <h3 style={{ marginBottom: '1rem' }}>More Like This</h3>
                    <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No similar series found for this title.</p>
                </div>
            )}

            <AnimatePresence>
              {showShare && (
                <div className="share-modal-overlay" onClick={() => setShowShare(false)}>
                  <motion.div 
                    className="share-modal glass"
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    onClick={e => e.stopPropagation()}
                  >
                    <h3>Share this series</h3>
                    <div className="share-options">
                      <a href={shareLinks.whatsapp} target="_blank" rel="noreferrer" className="share-btn whatsapp">
                        <MessageCircle size={24} /> WhatsApp
                      </a>
                      <a href={shareLinks.twitter} target="_blank" rel="noreferrer" className="share-btn twitter">
                        <TwitterIcon /> Twitter
                      </a>
                      <a href={shareLinks.facebook} target="_blank" rel="noreferrer" className="share-btn facebook">
                        <FacebookIcon /> Facebook
                      </a>
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

                                    {castDetails.tv_credits?.cast?.length > 0 && (
                                        <div className="cast-filmography">
                                            <h4>Known For</h4>
                                            <div className="filmography-scroll">
                                                {castDetails.tv_credits.cast
                                                    .sort((a, b) => (b.vote_average * b.vote_count) - (a.vote_average * a.vote_count))
                                                    .slice(0, 10)
                                                    .map(m => (
                                                        <Link key={m.id + '-' + m.credit_id} to={`/tv/${m.id}`} className="filmography-item" onClick={closeCastModal}>
                                                            {m.poster_path ? (
                                                                <img src={`https://image.tmdb.org/t/p/w200${m.poster_path}`} alt={m.name} />
                                                            ) : (
                                                                <div className="film-placeholder">
                                                                    <span>{m.name}</span>
                                                                </div>
                                                            )}
                                                            <p>{m.name}</p>
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
                .tv .detail-hero { height: auto; min-height: 85vh; display: flex; align-items: flex-end; padding: 6rem 0; position: relative; }
                .detail-actions-wrapper { display: flex; flex-direction: column; gap: 0.5rem; }
                .movie-progress-bar-wrapper { display: flex; align-items: center; gap: 1rem; max-width: 400px; }
                .movie-progress-track { flex: 1; height: 4px; background: rgba(255,255,255,0.2); border-radius: 4px; overflow: hidden; }
                .movie-progress-fill { height: 100%; background: #e50914; border-radius: 4px; transition: width 0.3s ease; }
                .movie-progress-text { font-size: 0.85rem; color: var(--text-dim); white-space: nowrap; font-weight: 500; }
                .backdrop-wrapper { position: absolute; inset: 0; z-index: 0; }
                .backdrop-wrapper img { width: 100%; height: 100%; object-fit: cover; opacity: 0.6; }
                .detail-gradient { position: absolute; inset: 0; background: linear-gradient(to top, #0a0a0c 18%, transparent 95%), linear-gradient(to right, #0a0a0c 15%, transparent 85%); }
                .detail-content { position: relative; z-index: 10; }
                .detail-meta { display: flex; gap: 1.5rem; align-items: center; margin-bottom: 2rem; color: var(--text-dim); }
                .rating-pill { display: flex; align-items: center; gap: 0.4rem; padding: 0.4rem 1rem; border-radius: 20px; color: var(--primary); font-weight: 800; background: rgba(13, 202, 240, 0.15); border: 1.5px solid rgba(13, 202, 240, 0.3); box-shadow: 0 0 15px rgba(13, 202, 240, 0.1); }
                .age-pill { padding: 0.4rem 1rem; border-radius: 6px; font-weight: 800; font-size: 0.85rem; border: 1.5px solid var(--border-light); background: rgba(255,255,255,0.05); color: white; text-transform: uppercase; }
                .overview { max-width: 750px; line-height: 1.8; font-size: 1.15rem; color: var(--text-dim); margin-bottom: 2.5rem; }
                .detail-actions { display: flex; gap: 1.2rem; align-items: center; }

                .share-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(10px); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 2rem; }
                .share-modal { width: 100%; max-width: 480px; padding: 3rem; border-radius: 24px; text-align: center; position: relative; border: 1px solid rgba(255,255,255,0.1); }
                .share-modal h3 { margin-bottom: 2rem; }
                .share-options { display: flex; justify-content: center; gap: 2rem; margin-bottom: 2.5rem; }
                .share-btn { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; text-decoration: none; color: white; font-size: 0.8rem; transition: 0.3s; }
                .share-btn:hover { color: var(--primary); transform: translateY(-5px); }
                .whatsapp { color: #25D366; } .twitter { color: #1DA1F2; } .facebook { color: #1877F2; }
                .copy-link { display: flex; background: rgba(255,255,255,0.05); border: 1px solid var(--border-light); border-radius: 10px; padding: 0.5rem; margin-top: 1rem; }
                .copy-link input { flex: 1; background: none; border: none; color: var(--text-dim); padding: 0.5rem; font-size: 0.9rem; outline: none; }
                .copy-link button { background: var(--primary); border: none; padding: 0.5rem 1rem; border-radius: 8px; color: black; cursor: pointer; }
                .close-share { position: absolute; top: 1rem; right: 1rem; background: none; border: none; color: var(--text-muted); cursor: pointer; z-index: 10; }

                .season-section { padding: 5rem 0 8rem; }
                .season-header-new { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 3.5rem; border-bottom: 1px solid var(--border-light); padding-bottom: 2rem; }
                .title-area h2 { font-size: 2.4rem; margin-bottom: 0.5rem; }
                .title-area p { color: var(--text-muted); font-size: 1rem; }
                
                .season-select-glass {
                  background: rgba(255,255,255,0.05); border: 1.5px solid var(--border-light);
                  color: white; padding: 0.8rem 1.5rem; border-radius: 12px; font-size: 1rem;
                  font-weight: 600; cursor: pointer; min-width: 240px; outline: none;
                  transition: .3s; appearance: none;
                  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
                  background-repeat: no-repeat; background-position: right 1rem center; background-size: 1em;
                }
                .season-select-glass:focus { border-color: var(--primary); box-shadow: 0 0 15px var(--primary-glow); }
                .season-select-glass option { background: #0f0f12; color: white; padding: 1rem; }

                .episodes-stack { display: flex; flex-direction: column; gap: 1.2rem; }
                .episode-bar {
                  display: flex; align-items: center; gap: 2rem; padding: 1.2rem;
                  border-radius: 20px; text-decoration: none; color: inherit;
                  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                  border: 1px solid transparent;
                }
                .episode-bar:hover {
                  background: rgba(255,255,255,0.05); border-color: rgba(13, 202, 240, 0.2);
                  transform: scale(1.01); box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                }
                
                .eb-thumb-wrap { flex-shrink: 0; width: 220px; display: flex; flex-direction: column; }
                .eb-thumb {
                  width: 100%; aspect-ratio: 16/9; border-radius: 12px; overflow: hidden;
                  position: relative;
                }
                .eb-thumb img { width: 100%; height: 100%; object-fit: cover; transition: .5s; }
                .ep-progress-track { width: 100%; height: 3px; background: rgba(255,255,255,0.15); border-radius: 0 0 4px 4px; margin-top: -3px; position: relative; z-index: 2; }
                .ep-progress-fill { height: 100%; background: #e50914; border-radius: 0 0 4px 4px; transition: width 0.3s ease; }
                .ep-time-text { font-size: 0.75rem; color: var(--text-muted); margin-top: 0.4rem; display: block; font-weight: 500; }
                .episode-bar:hover .eb-thumb img { transform: scale(1.1); }
                .eb-play-overlay {
                  position: absolute; inset: 0; background: rgba(0,0,0,0.4);
                  display: flex; align-items: center; justify-content: center;
                  opacity: 0; transition: .3s;
                }
                .episode-bar:hover .eb-play-overlay { opacity: 1; }

                .eb-info { flex: 1; min-width: 0; }
                .eb-main { display: flex; align-items: center; gap: 1rem; margin-bottom: 0.8rem; }
                .eb-num { font-size: 0.8rem; font-weight: 800; color: var(--primary); letter-spacing: 1px; text-transform: uppercase; }
                .eb-title { font-size: 1.3rem; margin: 0; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .eb-overview { font-size: 0.95rem; color: var(--text-dim); line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

                .eb-action { padding: 0 1rem; }
                .ep-play-mini {
                  width: 45px; height: 45px; border-radius: 50%; background: white;
                  border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;
                  transition: .3s; opacity: 0.6;
                }
                .episode-bar:hover .ep-play-mini { opacity: 1; background: var(--primary); transform: rotate(360deg); }

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

                @media (max-width: 900px) {
                  .tv .detail-hero { padding-top: 120px; padding-bottom: 4rem; height: auto; min-height: auto; align-items: center; }
                  .detail-content { flex-direction: column; align-items: center; text-align: center; }
                  .detail-main-split { flex-direction: column; align-items: center; gap: 3rem; }
                  .detail-left-content { width: 100%; }
                  .detail-meta-premium, .detail-actions, .language-selector-netflix, .detail-actions-wrapper { justify-content: center; align-items: center; }
                  .movie-hero-title { font-size: 2.5rem; }
                  .overview-main, .overview-premium { max-width: 100%; margin-left: auto; margin-right: auto; }
                  .detail-right-sidebar { 
                    width: 100%; display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); 
                    gap: 1.5rem; border-left: none; padding-left: 0; padding-top: 2rem; 
                    border-top: 1px solid rgba(255,255,255,0.1); 
                  }
                  .sidebar-group { text-align: center; }

                  .episode-bar { flex-direction: column; align-items: flex-start; gap: 1.5rem; }
                  .eb-thumb-wrap { width: 100%; }
                  .eb-action { display: none; }
                  .season-header-new { flex-direction: column; align-items: flex-start; gap: 1.5rem; }
                  .season-select-glass { width: 100%; }
                }

                @media (max-width: 600px) {
                  .movie-hero-title { font-size: 2rem; }
                  .detail-actions { flex-direction: column; width: 100%; }
                  .detail-actions .btn-primary, .detail-actions .btn-outline { width: 100%; justify-content: center; }
                  .detail-meta-premium { flex-wrap: wrap; gap: 1rem; }
                  .language-selector-netflix { overflow-x: auto; width: 100%; padding-bottom: 0.5rem; }
                  .cast-modal { padding: 1.5rem; }
                  .cast-modal-header { flex-direction: column; align-items: center; text-align: center; }
                  .cast-modal-photo { width: 140px; }
                  .cast-modal-info { align-items: center; }
                }
            `}</style>
        </div>
    );
};

export default TVDetail;
