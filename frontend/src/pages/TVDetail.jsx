import React, { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import tmdbService from '../services/tmdbService';
import { Play, Plus, Star, Calendar, Bookmark, List } from 'lucide-react';
import { motion } from 'framer-motion';
import MovieRow from '../components/MovieRow';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const TVDetail = () => {
    const { id } = useParams();
    const [show, setShow] = useState(null);
    const [seasons, setSeasons] = useState([]);
    const [selectedSeason, setSelectedSeason] = useState(1);
    const [loading, setLoading] = useState(true);

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
    }, [id]);

    if (loading) return <div className="loading-screen" style={{height:'100vh'}}></div>;

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

            <style>{`
                .season-section { padding: 4rem 0; }
                .season-selector { display: flex; gap: 1rem; overflow-x: auto; padding: 1rem 0; margin-bottom: 2rem; }
                .season-btn { padding: 0.8rem 1.5rem; border-radius: 10px; border: 1px solid var(--border-light); color: white; cursor: pointer; white-space: nowrap; }
                .season-btn.active { border-color: var(--primary); background: var(--primary-glow); color: var(--primary); }
            `}</style>
        </div>
    );
};

export default TVDetail;
