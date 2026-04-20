import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const tmdbService = {
  getTrending: async (type = 'movie', time = 'day') => {
    const { data } = await axios.get(`${API_URL}/tmdb/trending/${type}/${time}`);
    return data.results;
  },
  
  getPopular: async (type = 'movie') => {
    const { data } = await axios.get(`${API_URL}/tmdb/${type}/popular`);
    return data.results;
  },
  
  getTopRated: async (type = 'movie') => {
    const { data } = await axios.get(`${API_URL}/tmdb/${type}/top-rated`);
    return data.results;
  },
  
  getDetails: async (id, type = 'movie') => {
    const { data } = await axios.get(`${API_URL}/tmdb/${type}/${id}`);
    return data;
  },

  getTVSeason: async (id, seasonNumber) => {
    const { data } = await axios.get(`${API_URL}/tmdb/tv/${id}/season/${seasonNumber}`);
    return data;
  },
  
  search: async (query, type = 'multi') => {
    const { data } = await axios.get(`${API_URL}/tmdb/search`, { params: { query, type } });
    return data.results;
  },

  getGenres: async (type = 'movie') => {
    const { data } = await axios.get(`${API_URL}/tmdb/genres/${type}`);
    return data.genres;
  },

  discover: async (type = 'movie', params = {}) => {
    const { data } = await axios.get(`${API_URL}/tmdb/discover/${type}`, { params });
    return data.results;
  }
};

export default tmdbService;
