import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const MovieRow = ({ title, items, type = 'movie' }) => {
  const rowRef = useRef(null);

  const scroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const getImageUrl = (path) => path ? `https://image.tmdb.org/t/p/w500${path}` : 'https://via.placeholder.com/500x750?text=No+Image';

  return (
    <div className="movie-row-container">
      <h3 className="row-title">{title}</h3>
      
      <div className="row-wrapper">
        <button className="row-arrow left" onClick={() => scroll('left')}><ChevronLeft /></button>
        
        <div className="movie-row" ref={rowRef}>
          {items?.map((item) => (
            <motion.div 
              key={item.id} 
              className="movie-card"
              whileHover={{ scale: 1.05, zIndex: 10 }}
              transition={{ duration: 0.3 }}
            >
              <Link to={`/${item.media_type || type}/${item.id}`}>
                <div className="card-image">
                  <img src={getImageUrl(item.poster_path)} alt={item.title || item.name} loading="lazy" />
                  <div className="card-overlay">
                    <div className="rating"><Star size={12} fill="var(--primary)" /> {item.vote_average?.toFixed(1)}</div>
                  </div>
                </div>
                <p className="movie-title">{item.title || item.name}</p>
              </Link>
            </motion.div>
          ))}
        </div>
        
        <button className="row-arrow right" onClick={() => scroll('right')}><ChevronRight /></button>
      </div>

      <style>{`
        .movie-row-container {
          margin-bottom: 3rem;
          padding: 0 4%;
        }
        
        .row-title {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: var(--text-main);
        }
        
        .row-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        
        .movie-row {
          display: flex;
          gap: 1rem;
          overflow-x: auto;
          scroll-behavior: smooth;
          padding: 1rem 0;
          scrollbar-width: none;
        }
        
        .movie-row::-webkit-scrollbar {
          display: none;
        }
        
        .movie-card {
          flex: 0 0 200px;
          width: 200px;
          cursor: pointer;
          transition: transform 0.3s ease;
        }
        
        .card-image {
          position: relative;
          width: 100%;
          height: 300px;
          border-radius: var(--radius-md);
          overflow: hidden;
          background: var(--bg-card);
        }
        
        .card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        
        .card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
          opacity: 0;
          transition: var(--transition-fast);
          display: flex;
          align-items: flex-end;
          padding: 1rem;
        }
        
        .movie-card:hover .card-overlay {
          opacity: 1;
        }
        
        .rating {
          font-size: 0.8rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.3rem;
          color: white;
        }
        
        .movie-title {
          margin-top: 0.8rem;
          font-size: 0.9rem;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: var(--text-dim);
          text-align: left;
        }
        
        .row-arrow {
          position: absolute;
          z-index: 5;
          background: rgba(0,0,0,0.5);
          border: none;
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          opacity: 0;
          transition: var(--transition-fast);
        }
        
        .row-wrapper:hover .row-arrow {
          opacity: 1;
        }
        
        .row-arrow:hover {
          background: var(--primary);
          color: black;
          transform: scale(1.1);
        }
        
        .left { left: -20px; }
        .right { right: -20px; }
        
        @media (max-width: 768px) {
          .movie-card { flex: 0 0 140px; width: 140px; }
          .card-image { height: 210px; }
          .row-arrow { display: none; }
        }
      `}</style>
    </div>
  );
};

export default MovieRow;
