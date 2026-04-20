import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import tmdbService from '../services/tmdbService';
import MovieRow from '../components/MovieRow';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MovieRowSkeleton, GridSkeleton } from '../components/skeleton/MovieSkeleton';

const Browse = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const type = searchParams.get('type') || 'movie';
    const initialSearch = searchParams.get('search') || '';
    
    const [items, setItems] = useState([]);
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [localSearch, setLocalSearch] = useState(initialSearch);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            let data;
            if (initialSearch) {
                data = await tmdbService.search(initialSearch, type);
            } else if (selectedGenre) {
                data = await tmdbService.discover(type, { genre: selectedGenre });
            } else {
                data = await tmdbService.getPopular(type);
            }
            setItems(data || []);
        } catch (err) {
            console.error('Fetch failed');
        } finally {
            setLoading(false);
        }
    }, [type, initialSearch, selectedGenre]);

    useEffect(() => {
        const fetchGenres = async () => {
            const data = await tmdbService.getGenres(type);
            setGenres(data || []);
        };
        fetchGenres();
        fetchData();
        setLocalSearch(initialSearch);
    }, [type, fetchData, initialSearch]);

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            setSearchParams({ type, search: localSearch });
            setSelectedGenre('');
        }
    };

    const clearSearch = () => {
        setLocalSearch('');
        setSearchParams({ type });
    };

    const handleGenreSelect = (genreId) => {
        setSelectedGenre(genreId);
        setSearchParams({ type }); // Clear search query when selecting genre
        setShowFilters(false);
    };

    return (
        <div className="browse-page">
            <div className="container">
                <header className="browse-header">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h1 className="gradient-text">Explore {type === 'tv' ? 'TV Shows' : 'Movies'}</h1>
                        <p>Discover the latest and greatest content on VauraPlay.</p>
                    </motion.div>

                    <div className="browse-controls">
                        <div className="search-box-large glass">
                            <Search size={20} className="search-icon" />
                            <input 
                                type="text" 
                                placeholder={`Search for a ${type === 'tv' ? 'show' : 'movie'}...`}
                                value={localSearch}
                                onChange={(e) => setLocalSearch(e.target.value)}
                                onKeyDown={handleSearch}
                            />
                            {localSearch && <X size={18} className="clear-icon" onClick={clearSearch} />}
                        </div>
                        
                        <div className="filter-wrapper">
                            <button 
                                className={`btn-filter glass ${selectedGenre ? 'active' : ''}`}
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                <SlidersHorizontal size={18} />
                                <span>{selectedGenre ? genres.find(g => g.id == selectedGenre)?.name : 'Filters'}</span>
                            </button>

                            <AnimatePresence>
                                {showFilters && (
                                    <motion.div 
                                        className="genre-dropdown glass"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                    >
                                        <div className="genre-grid">
                                            <button 
                                                className={!selectedGenre ? 'active' : ''} 
                                                onClick={() => handleGenreSelect('')}
                                            >All Genres</button>
                                            {genres.map(genre => (
                                                <button 
                                                    key={genre.id}
                                                    className={selectedGenre == genre.id ? 'active' : ''}
                                                    onClick={() => handleGenreSelect(genre.id)}
                                                >
                                                    {genre.name}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </header>

                <div className="browse-results">
                    {loading ? (
                        <GridSkeleton />
                    ) : items.length > 0 ? (
                        <div className="results-grid-container">
                            <h3 className="results-title">
                                {initialSearch ? `Results for "${initialSearch}"` : selectedGenre ? `${genres.find(g => g.id == selectedGenre)?.name} ${type === 'tv' ? 'Series' : 'Movies'}` : 'Popular Now'}
                            </h3>
                            <div className="results-grid">
                                {items.map(item => (
                                    <div key={item.id} className="grid-card-wrapper">
                                        {/* We reuse the movie-card styling from MovieRow by adding a local definition or a component */}
                                        <div className="movie-card grid-version">
                                            <Link to={`/${item.media_type || type}/${item.id}`}>
                                                <div className="card-image">
                                                    <img src={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image'} alt={item.title || item.name} loading="lazy" />
                                                    <div className="card-overlay">
                                                        <div className="rating">★ {item.vote_average?.toFixed(1)}</div>
                                                    </div>
                                                </div>
                                                <p className="movie-title">{item.title || item.name}</p>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="no-results text-center">
                            <h3>No results found</h3>
                            <p>Try searching for something else or browse another category.</p>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .browse-page {
                    padding-top: 120px;
                    padding-bottom: 5rem;
                    min-height: 80vh;
                }
                
                .browse-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    margin-bottom: 3rem;
                    flex-wrap: wrap;
                    gap: 2rem;
                }
                
                .browse-controls {
                    display: flex;
                    gap: 1rem;
                    align-items: center;
                    flex: 1;
                    justify-content: flex-end;
                    min-width: 300px;
                }
                
                .search-box-large {
                    display: flex;
                    align-items: center;
                    padding: 0.8rem 1.5rem;
                    border-radius: 30px;
                    gap: 1rem;
                    flex: 1;
                    max-width: 500px;
                    transition: var(--transition-fast);
                }
                
                .search-box-large:focus-within {
                    border-color: var(--primary);
                    box-shadow: 0 0 20px var(--primary-glow);
                }
                
                .search-box-large input {
                    background: transparent;
                    border: none;
                    color: white;
                    outline: none;
                    width: 100%;
                    font-size: 1rem;
                }
                
                .search-icon { color: var(--text-muted); }
                .clear-icon { color: var(--text-muted); cursor: pointer; }
                .clear-icon:hover { color: white; }
                
                .filter-wrapper { position: relative; }
                
                .btn-filter {
                    display: flex;
                    align-items: center;
                    gap: 0.8rem;
                    padding: 0.8rem 1.5rem;
                    border-radius: 30px;
                    color: white;
                    border: 1px solid var(--border-light);
                    background: transparent;
                    cursor: pointer;
                    font-weight: 600;
                    transition: var(--transition-fast);
                }
                
                .btn-filter.active, .btn-filter:hover {
                    border-color: var(--primary);
                    color: var(--primary);
                }
                
                .genre-dropdown {
                    position: absolute;
                    top: 100%;
                    right: 0;
                    margin-top: 1rem;
                    padding: 1.5rem;
                    width: 400px;
                    z-index: 100;
                    border-radius: var(--radius-md);
                    box-shadow: 0 10px 40px rgba(0,0,0,0.8);
                }
                
                .genre-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 0.8rem;
                }
                
                .genre-grid button {
                    background: rgba(255,255,255,0.05);
                    border: 1px solid transparent;
                    padding: 0.6rem;
                    border-radius: 8px;
                    color: var(--text-dim);
                    cursor: pointer;
                    font-size: 0.85rem;
                    text-align: left;
                    transition: var(--transition-fast);
                }
                
                .genre-grid button:hover, .genre-grid button.active {
                    background: rgba(13, 202, 240, 0.1);
                    color: var(--primary);
                    border-color: var(--primary);
                }
                
                .results-grid-container { margin-top: 3rem; }
                .results-title { margin-bottom: 2rem; font-size: 1.5rem; color: var(--text-main); }
                .results-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 2rem; }
                
                .movie-card.grid-version { width: 100%; transition: 0.3s; }
                .movie-card.grid-version:hover { transform: scale(1.05); z-index: 10; }
                .movie-card.grid-version .card-image { height: 300px; border-radius: 12px; overflow: hidden; position: relative; background: var(--bg-card); }
                .movie-card.grid-version .card-image img { width: 100%; height: 100%; object-fit: cover; }
                .movie-card.grid-version .card-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.8), transparent); opacity: 0; transition: 0.3s; display: flex; align-items: flex-end; padding: 1rem; }
                .movie-card.grid-version:hover .card-overlay { opacity: 1; }
                .movie-card.grid-version .rating { color: white; font-weight: 700; font-size: 0.8rem; }
                .movie-card.grid-version .movie-title { margin-top: 0.8rem; font-size: 0.9rem; color: var(--text-dim); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

                .loader-container { height: 400px; }
                .no-results { padding: 5rem 0; }
                
                @media (max-width: 768px) {
                    .results-grid { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 1rem; }
                    .movie-card.grid-version .card-image { height: 210px; }
                }
                
                @media (max-width: 900px) {
                    .browse-header { flex-direction: column; align-items: flex-start; }
                    .browse-controls { width: 100%; flex-wrap: wrap; }
                    .search-box-large { max-width: none; width: 100%; }
                    .genre-dropdown { width: 100vw; left: -1.25rem; right: -1.25rem; position: fixed; bottom: 0; top: auto; border-radius: 20px 20px 0 0; }
                }
            `}</style>
        </div>
    );
};

export default Browse;
