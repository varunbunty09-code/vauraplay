import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Maximize, Settings, SkipForward } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Watch = () => {
  const { type, id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const season = searchParams.get('s') || 1;
  const episode = searchParams.get('e') || 1;
  
  const [playerUrl, setPlayerUrl] = useState('');
  const [isReady, setIsReady] = useState(false);
  const playerRef = useRef(null);

  useEffect(() => {
    // Construct Vidking URL
    let url = '';
    if (type === 'movie') {
      url = `https://www.vidking.net/embed/movie/${id}`;
    } else {
      url = `https://www.vidking.net/embed/tv/${id}/${season}/${episode}`;
    }

    // Add preferences
    const color = user?.preferences?.playerColor || '0dcaf0';
    url += `?color=${color}&autoPlay=${user?.preferences?.autoPlay || true}&episodeSelector=true&nextEpisode=true`;
    
    setPlayerUrl(url);
    setIsReady(true);

    // Listen for progress events from Vidking
    const handleMessage = (event) => {
      try {
        if (typeof event.data === 'string') {
          const data = JSON.parse(event.data);
          
          if (data.type === 'PLAYER_EVENT' && data.data.event === 'timeupdate') {
            saveProgress(data.data);
          }
        }
      } catch (e) {
        // Not a JSON message or unrelated
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [id, type, season, episode, user]);

  const saveProgress = async (progressData) => {
    // Only save progress every 30 seconds to avoid spamming the server
    // (In a real app, we might throttle this)
    try {
      await axios.post(`${API_URL}/progress`, {
        tmdbId: id,
        mediaType: type,
        progress: progressData.progress,
        currentTime: progressData.currentTime,
        duration: progressData.duration,
        season: parseInt(season),
        episode: parseInt(episode),
        title: 'Streaming Now...' // Ideally fetch title first
      });
    } catch (err) {
      console.error('Failed to save progress');
    }
  };

  return (
    <div className="watch-page">
      <div className="player-header container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} /> Back
        </button>
        <div className="playing-info text-center">
            <h3>{type === 'movie' ? 'Watching Movie' : `S${season} : E${episode}`}</h3>
        </div>
      </div>

      <div className="player-container">
        {!isReady ? (
          <div className="player-loader flex-center">
             <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity }}>
               <img src="/logo.svg" alt="Loading..." width={80} />
             </motion.div>
          </div>
        ) : (
          <motion.div 
            className="iframe-wrapper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <iframe
              ref={playerRef}
              src={playerUrl}
              width="100%"
              height="100%"
              frameBorder="0"
              allowFullScreen
              title="Vaura Player"
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
        }
        
        .player-header {
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          color: white;
          z-index: 10;
        }
        
        .back-btn {
          background: none;
          border: none;
          color: white;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          font-weight: 600;
          transition: var(--transition-fast);
        }
        
        .back-btn:hover {
          color: var(--primary);
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
