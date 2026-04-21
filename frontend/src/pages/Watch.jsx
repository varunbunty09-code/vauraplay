import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Play } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Watch = () => {
  const { type, id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const season = searchParams.get('s') || 1;
  const episode = searchParams.get('e') || 1;
  
  const [playerUrl, setPlayerUrl] = useState('');
  const [contentTitle, setContentTitle] = useState('');
  const [isReady, setIsReady] = useState(false);
  const [posterPath, setPosterPath] = useState('');
  
  // Progress tracking refs (using refs to avoid re-renders)
  const elapsedRef = useRef(0);        // seconds watched this session
  const durationRef = useRef(0);       // total duration in seconds
  const previousTimeRef = useRef(0);   // previously saved currentTime
  const lastSaveRef = useRef(0);       // throttle saves
  const titleRef = useRef('');
  const posterRef = useRef('');
  const timerRef = useRef(null);

  // Fetch TMDB details for runtime + title + poster
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const { data } = await axios.get(`https://api.themoviedb.org/3/${type}/${id}?api_key=${import.meta.env.VITE_TMDB_API_KEY}`);
        setContentTitle(data.title || data.name);
        titleRef.current = data.title || data.name;
        
        const poster = data.poster_path || data.backdrop_path || '';
        setPosterPath(poster);
        posterRef.current = poster;

        // Get duration in seconds
        if (type === 'movie') {
          durationRef.current = (data.runtime || 120) * 60; // runtime is in minutes
        } else {
          // For TV, fetch episode details to get runtime
          try {
            const epData = await axios.get(`https://api.themoviedb.org/3/tv/${id}/season/${season}/episode/${episode}?api_key=${import.meta.env.VITE_TMDB_API_KEY}`);
            durationRef.current = (epData.data.runtime || data.episode_run_time?.[0] || 30) * 60;
          } catch {
            durationRef.current = (data.episode_run_time?.[0] || 30) * 60;
          }
        }
      } catch (err) {
        console.error('Failed to fetch details');
        durationRef.current = type === 'movie' ? 7200 : 1800; // fallback: 2h or 30m
      }
    };
    fetchDetails();
  }, [type, id, season, episode]);

  // Load previously saved progress
  useEffect(() => {
    const loadSavedProgress = async () => {
      if (!user) return;
      try {
        const url = type === 'tv' 
          ? `${API_URL}/progress/${id}/${type}?season=${season}&episode=${episode}`
          : `${API_URL}/progress/${id}/${type}`;
        const { data } = await axios.get(url);
        if (data && data.currentTime > 0) {
          previousTimeRef.current = data.currentTime;
        }
      } catch {
        // No previous progress
      }
    };
    loadSavedProgress();
  }, [id, type, season, episode, user]);

  // Save progress to backend
  const saveProgress = useCallback(async (force = false) => {
    if (!user) return;
    const now = Date.now();
    if (!force && now - lastSaveRef.current < 30000) return;
    lastSaveRef.current = now;

    const currentTime = previousTimeRef.current + elapsedRef.current;
    const duration = durationRef.current || 1;
    const progress = Math.min(Math.round((currentTime / duration) * 100), 100);

    if (currentTime <= 0) return;

    try {
      await axios.post(`${API_URL}/progress`, {
        tmdbId: parseInt(id),
        mediaType: type,
        progress,
        currentTime,
        duration,
        season: parseInt(season),
        episode: parseInt(episode),
        title: titleRef.current || document.title || 'Streaming',
        posterPath: posterRef.current,
      });
    } catch (err) {
      // Silently fail
    }
  }, [id, type, season, episode, user]);

  // Start elapsed time tracker & setup player
  useEffect(() => {
    // Construct Vidking embed URL
    let url = '';
    if (type === 'movie') {
      url = `https://www.vidking.net/embed/movie/${id}`;
    } else {
      url = `https://www.vidking.net/embed/tv/${id}/${season}/${episode}`;
    }

    const color = user?.preferences?.playerColor || '0dcaf0';
    const params = new URLSearchParams({
      color: color,
      autoPlay: 'true',
      nextEpisode: 'true',
      episodeSelector: 'true',
    });
    url += `?${params.toString()}`;
    
    setPlayerUrl(url);
    setIsReady(true);
    elapsedRef.current = 0;

    // Track time on page (1 second interval)
    timerRef.current = setInterval(() => {
      elapsedRef.current += 1;
      
      // Auto-save every 30 seconds
      if (elapsedRef.current % 30 === 0) {
        saveProgress();
      }
    }, 1000);

    // Save initial "started watching" after 5 seconds
    const initialSave = setTimeout(() => {
      saveProgress(true);
    }, 5000);

    // Cleanup: save progress when leaving the page
    const handleBeforeUnload = () => saveProgress(true);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(timerRef.current);
      clearTimeout(initialSave);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // Final save on unmount
      saveProgress(true);
    };
  }, [id, type, season, episode, user, saveProgress]);

  return (
    <div className="watch-page">
      <div className="player-header">
        <button className="back-btn" onClick={() => navigate(`/${type}/${id}`)}>
          <ArrowLeft size={22} />
        </button>
      </div>

      <div className="player-container">
        {!isReady ? (
          <div className="player-loader flex-center">
             <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}>
               <Play size={50} color="var(--primary)" />
             </motion.div>
          </div>
        ) : (
          <motion.div 
            className="iframe-wrapper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <iframe
              src={playerUrl}
              width="100%"
              height="100%"
              frameBorder="0"
              allowFullScreen
              allow="autoplay; encrypted-media; fullscreen"
              title="VauraPlay Player"
            ></iframe>
          </motion.div>
        )}
      </div>

      <style>{`
        .watch-page {
          background: #000;
          height: 100vh;
          width: 100vw;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        
        .player-header {
          position: absolute;
          top: 18px;
          left: 25px;
          z-index: 100;
        }

        .back-btn {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 0;
        }

        .back-btn:hover {
          color: white;
          transform: scale(1.2);
        }
        
        .player-container {
          flex: 1;
          position: relative;
          background: #000;
        }
        
        .iframe-wrapper {
          width: 100%;
          height: 100%;
        }
        
        .iframe-wrapper iframe {
          border: none;
        }
        
        .player-loader {
          position: absolute;
          inset: 0;
          background: #000;
        }
      `}</style>
    </div>
  );
};

export default Watch;
