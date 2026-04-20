import React from 'react';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';

const Logo = ({ size = 24, fontSize = '1.5rem', className = '', to = '/' }) => {
  return (
    <Link to={to} className={`logo-component ${className}`}>
      <span className="logo-icon">
        <Play fill="var(--primary)" size={size} color="var(--primary)" />
      </span>
      <span className="logo-text" style={{ fontSize }}>
        VAURA<span>PLAY</span>
      </span>
      <style>{`
        .logo-component {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          transition: var(--transition-fast);
        }
        
        .logo-component:hover {
          opacity: 0.9;
          transform: scale(1.02);
        }
        
        .logo-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .logo-text {
          font-weight: 900;
          color: white;
          letter-spacing: 2px;
          text-transform: uppercase;
        }
        
        .logo-text span {
          color: var(--primary);
        }
      `}</style>
    </Link>
  );
};

export default Logo;
