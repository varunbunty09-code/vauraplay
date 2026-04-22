import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const WatchlistContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const WatchlistProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [watchlistMap, setWatchlistMap] = useState({}); // { "tmdbId_mediaType": _id }
  const [loaded, setLoaded] = useState(false);

  const fetchWatchlistIds = useCallback(async () => {
    if (!user) {
      setWatchlistMap({});
      setLoaded(true);
      return;
    }
    try {
      const { data } = await axios.get(`${API_URL}/watchlist/ids`);
      setWatchlistMap(data.watchlistMap || {});
    } catch (e) {
      // Silently fail - cards will just show + icon
    }
    setLoaded(true);
  }, [user]);

  useEffect(() => {
    if (authLoading) return;
    fetchWatchlistIds();
  }, [authLoading, fetchWatchlistIds]);

  const isInWatchlist = useCallback((tmdbId, mediaType) => {
    return !!watchlistMap[`${tmdbId}_${mediaType}`];
  }, [watchlistMap]);

  const getWatchlistItemId = useCallback((tmdbId, mediaType) => {
    return watchlistMap[`${tmdbId}_${mediaType}`];
  }, [watchlistMap]);

  const addToMap = useCallback((tmdbId, mediaType, itemId) => {
    setWatchlistMap(prev => ({ ...prev, [`${tmdbId}_${mediaType}`]: itemId }));
  }, []);

  const removeFromMap = useCallback((tmdbId, mediaType) => {
    setWatchlistMap(prev => {
      const next = { ...prev };
      delete next[`${tmdbId}_${mediaType}`];
      return next;
    });
  }, []);

  return (
    <WatchlistContext.Provider value={{
      watchlistMap,
      loaded,
      isInWatchlist,
      getWatchlistItemId,
      addToMap,
      removeFromMap,
      refresh: fetchWatchlistIds,
    }}>
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => useContext(WatchlistContext);
