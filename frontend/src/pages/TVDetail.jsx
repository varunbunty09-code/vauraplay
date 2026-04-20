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
                            <button className="btn-outline"><Plus size={20} /> Add to List</button>
                            <button className="btn-outline" onClick={() => setShowShare(true)}><Share2 size={20} /></button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container season-section">
                <div className="season-layout">
                    <aside className="season-sidebar">
                        <h3>Seasons</h3>
                        <div className="season-stack">
                            {seasons.filter(s => s.season_number > 0).map(s => (
                                <button 
                                    key={s.id} 
                                    className={`season-stack-item ${selectedSeason === s.season_number ? 'active' : ''}`}
                                    onClick={() => setSelectedSeason(s.season_number)}
                                >
                                    <div className="s-info">
                                        <span className="s-name">Season {s.season_number}</span>
                                        <span className="s-count">{s.episode_count} Episodes</span>
                                    </div>
                                    <div className="s-active-indicator"></div>
                                </button>
                            ))}
                        </div>
                    </aside>

                    <main className="episodes-container">
                        <div className="episodes-header">
                            <h2>{seasons.find(s => s.season_number === selectedSeason)?.name || `Season ${selectedSeason}`}</h2>
                            <p className="text-muted">{episodes.length} Episodes available</p>
                        </div>

                        {episodesLoading ? (
                            <div className="episodes-loader">
                                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                                    <Play size={40} color="var(--primary)" fill="var(--primary)" />
                                </motion.div>
                                <p>Loading Episodes...</p>
                            </div>
                        ) : (
                            <div className="episodes-grid">
                                {episodes.map(ep => (
                                    <Link to={`/watch/tv/${id}?s=${selectedSeason}&e=${ep.episode_number}`} key={ep.id} className="episode-card glass">
                                        <div className="ep-thumb">
                                            <img src={ep.still_path ? `https://image.tmdb.org/t/p/w300${ep.still_path}` : `https://image.tmdb.org/t/p/w300${show.backdrop_path}`} alt={ep.name} />
                                            <div className="ep-overlay"><Play size={24} fill="white" /></div>
                                            <span className="ep-num">E{ep.episode_number}</span>
                                        </div>
                                        <div className="ep-info">
                                            <h4>{ep.name}</h4>
                                            <p>{ep.overview || 'No description available for this episode.'}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </main>
                </div>
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

                .season-section { padding: 6rem 0; }
                .season-layout { display: grid; grid-template-columns: 320px 1fr; gap: 4rem; }
                
                .season-sidebar h3 { margin-bottom: 2rem; font-size: 1.5rem; }
                .season-stack { display: flex; flex-direction: column; gap: 0.8rem; }
                .season-stack-item {
                  background: rgba(255,255,255,0.03); border: 1px solid var(--border-light);
                  padding: 1.2rem 1.5rem; border-radius: 16px; color: white; cursor: pointer;
                  display: flex; justify-content: space-between; align-items: center;
                  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); position: relative; overflow: hidden;
                }
                .season-stack-item:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.2); transform: translateX(5px); }
                .season-stack-item.active { background: rgba(13, 202, 240, 0.1); border-color: var(--primary); }
                .s-info { display: flex; flex-direction: column; gap: 0.3rem; text-align: left; }
                .s-name { font-weight: 700; font-size: 1.1rem; }
                .s-count { font-size: 0.8rem; color: var(--text-muted); font-weight: 500; }
                .s-active-indicator { position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: var(--primary); transition: 0.3s; opacity: 0; }
                .season-stack-item.active .s-active-indicator { opacity: 1; }
                .season-stack-item.active .s-name { color: var(--primary); }

                .episodes-container { min-width: 0; }
                .episodes-header { margin-bottom: 3rem; border-bottom: 1px solid var(--border-light); padding-bottom: 1.5rem; }
                .episodes-header h2 { font-size: 2.2rem; margin-bottom: 0.5rem; }
                .episodes-loader { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 6rem 0; gap: 1.5rem; color: var(--text-muted); }
                
                .episodes-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 2.5rem; }
                .episode-card { display: flex; flex-direction: column; border-radius: var(--radius-md); overflow: hidden; transition: .3s; text-decoration: none; color: inherit; background: rgba(255,255,255,0.02); border: 1px solid transparent; }
                .episode-card:hover { transform: translateY(-10px); border-color: var(--primary); background: rgba(255,255,255,0.06); box-shadow: 0 15px 40px rgba(0,0,0,0.6); }
                .ep-thumb { position: relative; aspect-ratio: 16/9; overflow: hidden; }
                .ep-thumb img { width: 100%; height: 100%; object-fit: cover; transition: .6s; }
                .episode-card:hover .ep-thumb img { transform: scale(1.1); }
                .ep-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; opacity: 0; transition: .3s; }
                .episode-card:hover .ep-overlay { opacity: 1; }
                .ep-num { position: absolute; bottom: 15px; right: 15px; background: var(--primary); color: black; font-weight: 800; font-size: 0.85rem; padding: 0.3rem 0.8rem; border-radius: 6px; box-shadow: 0 4px 10px rgba(13, 202, 240, 0.4); }
                
                .ep-info { padding: 1.8rem; }
                .ep-info h4 { margin-bottom: 0.8rem; font-size: 1.2rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--primary); }
                .ep-info p { font-size: 0.95rem; color: var(--text-dim); line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }

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

                @media (max-width: 1100px) {
                  .season-layout { grid-template-columns: 1fr; gap: 3rem; }
                  .season-stack { flex-direction: row; overflow-x: auto; padding-bottom: 1rem; scrollbar-width: none; }
                  .season-stack::-webkit-scrollbar { display: none; }
                  .season-stack-item { min-width: 200px; }
                  .s-active-indicator { left: 0; right: 0; bottom: 0; top: auto; height: 3px; width: 100%; }
                }

                @media (max-width: 768px) {
                  .tv .detail-hero { min-height: 70vh; padding: 4rem 0; }
                  .detail-meta { flex-wrap: wrap; gap: 1rem; }
                  .episodes-grid { grid-template-columns: 1fr; }
                  .episodes-header h2 { font-size: 1.8rem; }
                }
            `}</style>
        </div>
    );
};

export default TVDetail;
