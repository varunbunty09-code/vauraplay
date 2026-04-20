import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import tmdbService from '../services/tmdbService';
import MovieRow from '../components/MovieRow';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';

const Browse = () => {
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type') || 'movie';
    
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBrowseData = async () => {
            setLoading(true);
            try {
                const data = await tmdbService.getPopular(type);
                setItems(data);
            } catch (err) {
                console.error('Browse fetch failed');
            } finally {
                setLoading(false);
            }
        };
        fetchBrowseData();
    }, [type]);

    return (
        <div className="browse-page container">
            <div className="browse-header flex-between" style={{ paddingTop: '120px', marginBottom: '3rem' }}>
                <div>
                   <h1 className="gradient-text" style={{ textTransform: 'capitalize' }}>Explore {type === 'tv' ? 'TV Shows' : 'Movies'}</h1>
                   <p>Discover the latest and greatest content on VauraPlay.</p>
                </div>
                <div className="flex-center" style={{ gap: '1rem' }}>
                   <div className="search-box glass" style={{ width: '300px' }}>
                      <Search size={18} />
                      <input type="text" placeholder={`Search ${type}...`} />
                   </div>
                   <button className="btn-outline"><SlidersHorizontal size={18} /> Filters</button>
                </div>
            </div>

            <div className="browse-grid">
               <MovieRow title="Popular Now" items={items} type={type} />
            </div>

            <style>{`
                .browse-page { padding-bottom: 5rem; }
                .browse-grid { margin-top: 2rem; }
            `}</style>
        </div>
    );
};

export default Browse;
