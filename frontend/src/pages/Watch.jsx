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
  const lastSaveRef = useRef(0); // Throttle progress saves

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const { data } = await axios.get(`https://api.themoviedb.org/3/${type}/${id}?api_key=${import.meta.env.VITE_TMDB_API_KEY}`);
        setContentTitle(data.title || data.name);
      } catch (err) {
        console.error('Failed to fetch title');
      }
    };
    fetchDetails();
  }, [type, id]);


  // Throttled save: only save every 30 seconds
  const saveProgress = useCallback(async (progressData) => {
    const now = Date.now();
    if (now - lastSaveRef.current < 30000) return; // Skip if < 30s since last save
    lastSaveRef.current = now;

    try {
      await axios.post(`${API_URL}/progress`, {
        tmdbId: progressData.id || id,
        mediaType: progressData.mediaType || type,
        progress: progressData.progress,
        currentTime: progressData.currentTime,
        duration: progressData.duration,
        season: parseInt(progressData.season || season),
        episode: parseInt(progressData.episode || episode),
        title: document.title || 'Streaming'
      });
    } catch (err) {
      // Silently fail - don't interrupt playback
    }
  }, [id, type, season, episode]);

  useEffect(() => {
    // Construct Vidking embed URL per official docs:
    // Movies:  /embed/movie/{tmdbId}
    // TV:      /embed/tv/{tmdbId}/{season}/{episode}
    let url = '';
    if (type === 'movie') {
      url = `https://www.vidking.net/embed/movie/${id}`;
    } else {
      url = `https://www.vidking.net/embed/tv/${id}/${season}/${episode}`;
    }

    // URL Parameters per docs: color, autoPlay, nextEpisode, episodeSelector, progress
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

    // Listen for Vidking postMessage progress events
    // Event Data Structure (from docs):
    // { type: "PLAYER_EVENT", data: { event, currentTime, duration, progress, id, mediaType, season, episode, timestamp } }
    const handleMessage = (event) => {
      try {
        const raw = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        
        if (raw.type === 'PLAYER_EVENT' && raw.data) {
          const { event: playerEvent } = raw.data;

          switch (playerEvent) {
            case 'timeupdate':
              saveProgress(raw.data);
              break;
            case 'ended':
              // Save final progress at 100%
              lastSaveRef.current = 0; // Force save
              saveProgress({ ...raw.data, progress: 100 });
              break;
            case 'play':
            case 'pause':
            case 'seeked':
              // Can be used for analytics
              break;
          }
        }
      } catch (e) {
        // Not a Vidking message, ignore
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
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
