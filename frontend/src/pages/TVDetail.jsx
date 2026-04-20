import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import tmdbService from '../services/tmdbService';
import { Play, Plus, Star, Calendar, Bookmark, List, Share2, MessageCircle, Copy, X } from 'lucide-react';

const TwitterIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
const FacebookIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>;
import { motion, AnimatePresence } from 'framer-motion';
import MovieRow from '../components/MovieRow';
import { DetailSkeleton } from '../components/skeleton/MovieSkeleton';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const TVDetail = () => {
    const { id } = useParams();
    const [show, setShow] = useState(null);
    const [seasons, setSeasons] = useState([]);
    const [selectedSeason, setSelectedSeason] = useState(1);
    const [episodes, setEpisodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [episodesLoading, setEpisodesLoading] = useState(false);
    const [showShare, setShowShare] = useState(false);
    const [contentRating, setContentRating] = useState('');
    const [inWatchlist, setInWatchlist] = useState(false);

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
            } catch (err) {
                toast.error('Failed to load series details');
            } finally {
                setLoading(false);
            }
        };
        fetchShow();
        window.scrollTo(0, 0);
    }, [id]);

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

    const toggleWatchlist = async () => {
        const prev = inWatchlist;
        setInWatchlist(!prev);
        try {
            if (prev) {
                const { data } = await axios.get(`${API_URL}/watchlist/check/${show.id}/tv`);
                await axios.delete(`${API_URL}/watchlist/${data.item._id}`);
                toast.success('Removed from watchlist');
            } else {
                await axios.post(`${API_URL}/watchlist`, {
                    tmdbId: show.id,
                    mediaType: 'tv',
                    title: show.name,
                    posterPath: show.poster_path,
                    backdropPath: show.backdrop_path,
                    overview: show.overview,
                    voteAverage: show.vote_average,
                });
                toast.success('Added to watchlist');
            }
        } catch (err) {
            setInWatchlist(prev);
            toast.error('Failed to update watchlist');
        }
    };

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
                    <div className="detail-main">
                        <h1>{show.name}</h1>
                        <div className="detail-meta">
                            <span className="rating-pill glass"><Star size={14} fill="var(--primary)" /> {show.vote_average.toFixed(1)}</span>
                            {contentRating && <span className="age-pill glass">{contentRating}</span>}
                            <span>{show.number_of_seasons} Seasons</span>
                            <span>{show.first_air_date?.split('-')[0]}</span>
                        </div>
                        <p className="overview">{show.overview}</p>
                        
                        <div className="detail-actions">
                            <Link to={`/watch/tv/${show.id}?s=1&e=1`} className="btn-primary"><Play size={20} fill="currentColor" /> Watch Now</Link>
                            <button className={`btn-outline ${inWatchlist ? 'in-list' : ''}`} onClick={toggleWatchlist}>
                                {inWatchlist ? <><Bookmark size={20} fill="var(--primary)" /> In My List</> : <><Plus size={20} /> Add to List</>}
                            </button>
                            <button className="btn-outline" onClick={() => setShowShare(true)}><Share2 size={20} /></button>
                        </div>
                    </div>
                </div>
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
                                <div className="eb-thumb">
                                    <img src={ep.still_path ? `https://image.tmdb.org/t/p/w300${ep.still_path}` : `https://image.tmdb.org/t/p/w300${show.backdrop_path}`} alt={ep.name} />
                                    <div className="eb-play-overlay"><Play size={20} fill="white" /></div>
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

            <style>{`
                .tv .detail-hero { height: auto; min-height: 85vh; display: flex; align-items: flex-end; padding: 6rem 0; position: relative; }
                .backdrop-wrapper { position: absolute; inset: 0; z-index: 0; }
                .backdrop-wrapper img { width: 100%; height: 100%; object-fit: cover; opacity: 0.6; }
                .detail-gradient { position: absolute; inset: 0; background: linear-gradient(to top, #0a0a0c 18%, transparent 95%), linear-gradient(to right, #0a0a0c 15%, transparent 85%); }
                .detail-content { position: relative; z-index: 10; }
                .detail-meta { display: flex; gap: 1.5rem; align-items: center; margin-bottom: 2rem; color: var(--text-dim); }
                .rating-pill { display: flex; align-items: center; gap: 0.4rem; padding: 0.4rem 1rem; border-radius: 20px; color: var(--primary); font-weight: 800; background: rgba(13, 202, 240, 0.15); border: 1.5px solid rgba(13, 202, 240, 0.3); box-shadow: 0 0 15px rgba(13, 202, 240, 0.1); }
                .age-pill { padding: 0.4rem 1rem; border-radius: 6px; font-weight: 800; font-size: 0.85rem; border: 1.5px solid var(--border-light); background: rgba(255,255,255,0.05); color: white; text-transform: uppercase; }
                .overview { max-width: 750px; line-height: 1.8; font-size: 1.15rem; color: var(--text-dim); margin-bottom: 2.5rem; }
                .detail-actions { display: flex; gap: 1.2rem; }

                .share-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(10px); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 2rem; }
                .share-modal { width: 100%; max-width: 480px; padding: 3rem; border-radius: 24px; text-align: center; position: relative; border: 1px solid rgba(255,255,255,0.1); }
                .share-options { display: flex; justify-content: center; gap: 2rem; margin-bottom: 2.5rem; }
                .share-btn { display: flex; flex-direction: column; align-items: center; gap: 0.8rem; text-decoration: none; color: white; font-size: 0.9rem; transition: 0.3s; }
                .copy-link { display: flex; background: rgba(255,255,255,0.06); border: 1px solid var(--border-light); border-radius: 12px; padding: 0.6rem; margin-top: 1.5rem; }
                .copy-link input { flex: 1; background: none; border: none; color: var(--text-dim); padding: 0.6rem; font-size: 0.95rem; outline: none; }
                .copy-link button { background: var(--primary); border: none; padding: 0.7rem 1.2rem; border-radius: 10px; color: black; cursor: pointer; transition: 0.3s; }
                .copy-link button:hover { transform: scale(1.05); }
                .close-share { position: absolute; top: 1.5rem; right: 1.5rem; background: rgba(255,255,255,0.05); border: none; color: var(--text-muted); cursor: pointer; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: 0.3s; }
                .close-share:hover { background: rgba(255,255,255,0.1); color: white; transform: rotate(90deg); }

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
                
                .eb-thumb {
                  width: 220px; aspect-ratio: 16/9; border-radius: 12px; overflow: hidden;
                  position: relative; flex-shrink: 0;
                }
                .eb-thumb img { width: 100%; height: 100%; object-fit: cover; transition: .5s; }
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

                @media (max-width: 900px) {
                  .episode-bar { flex-direction: column; align-items: flex-start; gap: 1.5rem; }
                  .eb-thumb { width: 100%; }
                  .eb-action { display: none; }
                  .season-header-new { flex-direction: column; align-items: flex-start; gap: 1.5rem; }
                  .season-select-glass { width: 100%; }
                }
            `}</style>
        </div>
    );
};

export default TVDetail;
