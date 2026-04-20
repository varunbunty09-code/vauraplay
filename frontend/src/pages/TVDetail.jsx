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
    const [loading, setLoading] = useState(true);
    const [showShare, setShowShare] = useState(false);

    useEffect(() => {
        const fetchShow = async () => {
            setLoading(true);
            try {
                const data = await tmdbService.getDetails(id, 'tv');
                setShow(data);
                setSeasons(data.seasons);
            } catch (err) {
                toast.error('Failed to load series details');
            } finally {
                setLoading(false);
            }
        };
        fetchShow();
        window.scrollTo(0, 0);
    }, [id]);

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
                            <span>{show.number_of_seasons} Seasons</span>
                            <span>{show.first_air_date?.split('-')[0]}</span>
                        </div>
                        <p className="overview">{show.overview}</p>
                        
                        <div className="detail-actions">
                            <Link to={`/watch/tv/${show.id}?s=1&e=1`} className="btn-primary"><Play size={20} fill="currentColor" /> Watch Now</Link>
                            <button className="btn-outline"><Bookmark size={20} /> Add to List</button>
                            <button className="btn-outline" onClick={() => setShowShare(true)}><Share2 size={20} /></button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container season-section">
                <h3>Seasons & Episodes</h3>
                <div className="season-selector">
                   {seasons.filter(s => s.season_number > 0).map(s => (
                     <button 
                       key={s.id} 
                       className={`season-btn glass ${selectedSeason === s.season_number ? 'active' : ''}`}
                       onClick={() => setSelectedSeason(s.season_number)}
                     >
                       Season {s.season_number}
                     </button>
                   ))}
                </div>

                <div className="episode-grid">
                   <p className="text-muted">Select an episode to start watching season {selectedSeason}.</p>
                   {/* In a fuller app, we'd fetch actual episode list for the season here */}
                   <div className="flex-center" style={{padding: '3rem'}}>
                      <Link to={`/watch/tv/${id}?s=${selectedSeason}&e=1`} className="btn-outline"><List size={18} /> View Season {selectedSeason} Episodes</Link>
                   </div>
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
                .tv .detail-hero { height: auto; min-height: 80vh; display: flex; align-items: flex-end; padding: 4rem 0; position: relative; }
                .backdrop-wrapper { position: absolute; inset: 0; z-index: 0; }
                .backdrop-wrapper img { width: 100%; height: 100%; object-fit: cover; }
                .detail-gradient { position: absolute; inset: 0; background: linear-gradient(to top, #0a0a0c 10%, transparent 80%), linear-gradient(to right, #0a0a0c 10%, transparent 80%); }
                .detail-content { position: relative; z-index: 10; }
                .detail-meta { display: flex; gap: 1.5rem; align-items: center; margin-bottom: 2rem; color: var(--text-dim); }
                .overview { max-width: 700px; line-height: 1.7; font-size: 1.1rem; color: var(--text-dim); margin-bottom: 2rem; }
                .detail-actions { display: flex; gap: 1rem; }
                .season-section { padding: 4rem 0; }
                .season-selector { display: flex; gap: 1rem; overflow-x: auto; padding: 1rem 0; margin-bottom: 2rem; }
                .season-btn { padding: 0.8rem 1.5rem; border-radius: 10px; border: 1px solid var(--border-light); color: white; cursor: pointer; white-space: nowrap; transition: .3s; }
                .season-btn.active { border-color: var(--primary); background: var(--primary-glow); color: var(--primary); }
                
                .share-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(5px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 2rem; }
                .share-modal { width: 100%; max-width: 450px; padding: 2.5rem; border-radius: var(--radius-lg); text-align: center; position: relative; }
                .share-modal h3 { margin-bottom: 2rem; }
                .share-options { display: flex; justify-content: center; gap: 1.5rem; margin-bottom: 2rem; }
                .share-btn { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; text-decoration: none; color: white; font-size: 0.8rem; transition: 0.3s; }
                .share-btn:hover { color: var(--primary); transform: translateY(-5px); }
                .whatsapp { color: #25D366; }
                .twitter { color: #1DA1F2; }
                .facebook { color: #1877F2; }
                .copy-link { display: flex; background: rgba(255,255,255,0.05); border: 1px solid var(--border-light); border-radius: 10px; padding: 0.5rem; margin-top: 1rem; }
                .copy-link input { flex: 1; background: none; border: none; color: var(--text-dim); padding: 0.5rem; font-size: 0.9rem; outline: none; }
                .copy-link button { background: var(--primary); border: none; padding: 0.5rem 1rem; border-radius: 8px; color: black; cursor: pointer; }
                .close-share { position: absolute; top: 1rem; right: 1rem; background: none; border: none; color: var(--text-muted); cursor: pointer; }
            `}</style>
        </div>
    );
};

export default TVDetail;
