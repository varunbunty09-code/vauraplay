import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, Bell, User, Play, LogOut, Menu, X, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/landing');
  };

  if (location.pathname === '/landing' || location.pathname === '/login' || location.pathname === '/signup') {
    return null; // Hide navbar on auth/landing pages if preferred, or keep a simple version
  }

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled glass' : ''}`}>
      <div className="container nav-content">
        <div className="nav-left">
          <Link to="/" className="logo">
            <span className="logo-icon"><Play fill="var(--primary)" size={24} /></span>
            <span className="logo-text">VAURA<span>PLAY</span></span>
          </Link>
          
          <ul className="nav-links">
            <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link></li>
            <li><Link to="/browse?type=movie" className={location.pathname === '/browse' ? 'active' : ''}>Movies</Link></li>
            <li><Link to="/browse?type=tv">TV Shows</Link></li>
            <li><Link to="/watchlist">My List</Link></li>
          </ul>
        </div>

        <div className="nav-right">
          <div className="search-bar glass">
            <Search size={18} />
            <input type="text" placeholder="Search movies, TV shows..." />
          </div>

          <button className="icon-btn"><Bell size={20} /></button>
          
          <div className="profile-menu-container">
            <button className="profile-btn" onClick={() => setProfileMenuOpen(!profileMenuOpen)}>
              <img src={user?.avatar?.url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'} alt="Avatar" />
            </button>
            
            <AnimatePresence>
              {profileMenuOpen && (
                <motion.div 
                  className="profile-dropdown glass"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  <div className="dropdown-header">
                    <p className="username">{user?.username}</p>
                    <p className="email">{user?.email}</p>
                  </div>
                  <ul>
                    <li><Link to="/profile"><User size={16} /> Profile</Link></li>
                    {user?.role === 'admin' && (
                      <li><Link to="/admin"><LayoutDashboard size={16} /> Admin Panel</Link></li>
                    )}
                    <li className="divider"></li>
                    <li onClick={handleLogout} className="logout"><LogOut size={16} /> Sign Out</li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <button className="mobile-toggle" onClick={() => setMobileMenuOpen(true)}>
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="mobile-overlay"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className="mobile-header">
              <Link to="/" className="logo" onClick={() => setMobileMenuOpen(false)}>
                <Play fill="var(--primary)" size={24} />
                <span className="logo-text">VAURA<span>PLAY</span></span>
              </Link>
              <button className="close-btn" onClick={() => setMobileMenuOpen(false)}>
                <X size={28} />
              </button>
            </div>
            
            <ul className="mobile-links">
              <li><Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link></li>
              <li><Link to="/browse?type=movie" onClick={() => setMobileMenuOpen(false)}>Movies</Link></li>
              <li><Link to="/browse?type=tv" onClick={() => setMobileMenuOpen(false)}>TV Shows</Link></li>
              <li><Link to="/watchlist" onClick={() => setMobileMenuOpen(false)}>My List</Link></li>
              <li className="mobile-divider"></li>
              <li><Link to="/profile" onClick={() => setMobileMenuOpen(false)}>Profile Settings</Link></li>
              <li onClick={handleLogout} className="logout-mobile">Sign Out</li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 80px;
          z-index: 1000;
          transition: var(--transition-smooth);
          display: flex;
          align-items: center;
        }
        
        .navbar.scrolled {
          height: 70px;
          background: rgba(10, 10, 12, 0.95);
          backdrop-filter: blur(20px);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
        }
        
        .nav-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }
        
        .nav-left, .nav-right {
          display: flex;
          align-items: center;
          gap: 2rem;
        }
        
        .logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
        }
        
        .logo-text {
          font-size: 1.5rem;
          font-weight: 900;
          color: var(--text-main);
          letter-spacing: 2px;
        }
        
        .logo-text span {
          color: var(--primary);
        }
        
        .nav-links {
          list-style: none;
          display: flex;
          gap: 1.5rem;
        }
        
        .nav-links a {
          text-decoration: none;
          color: var(--text-dim);
          font-weight: 500;
          font-size: 0.95rem;
          transition: var(--transition-fast);
        }
        
        .nav-links a:hover, .nav-links a.active {
          color: var(--primary);
        }
        
        .search-bar {
          display: flex;
          align-items: center;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          gap: 0.8rem;
          width: 250px;
        }
        
        .search-bar input {
          background: transparent;
          border: none;
          color: white;
          outline: none;
          width: 100%;
          font-size: 0.85rem;
        }
        
        .icon-btn {
          background: transparent;
          border: none;
          color: var(--text-dim);
          cursor: pointer;
          transition: var(--transition-fast);
        }
        
        .icon-btn:hover {
          color: var(--primary);
        }
        
        .profile-btn {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          overflow: hidden;
          border: 2px solid transparent;
          cursor: pointer;
          background: none;
          padding: 0;
          transition: var(--transition-fast);
        }
        
        .profile-btn:hover {
          border-color: var(--primary);
        }
        
        .profile-btn img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .profile-menu-container {
          position: relative;
        }
        
        .profile-dropdown {
          position: absolute;
          top: 50px;
          right: 0;
          width: 220px;
          border-radius: var(--radius-md);
          padding: 0.5rem;
          box-shadow: 0 10px 40px rgba(0,0,0,0.8);
        }
        
        .dropdown-header {
          padding: 1rem;
          border-bottom: 1px solid var(--border-light);
        }
        
        .dropdown-header .username {
          font-weight: 700;
          color: white;
        }
        
        .dropdown-header .email {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        
        .profile-dropdown ul {
          list-style: none;
          padding: 0.5rem 0;
        }
        
        .profile-dropdown li {
          padding: 0.7rem 1rem;
          display: flex;
          align-items: center;
          gap: 0.8rem;
          font-size: 0.9rem;
          color: var(--text-dim);
          cursor: pointer;
          transition: var(--transition-fast);
          border-radius: 8px;
        }
        
        .profile-dropdown li a {
            text-decoration: none;
            color: inherit;
            display: flex;
            align-items: center;
            gap: inherit;
            width: 100%;
        }

        .profile-dropdown li:hover {
          background: rgba(255,255,255,0.05);
          color: var(--primary);
        }
        
        .profile-dropdown li.logout:hover {
          color: var(--accent);
        }
        
        .divider {
          height: 1px;
          background: var(--border-light);
          margin: 0.5rem 0;
          padding: 0 !important;
        }
        
        .mobile-toggle {
          display: none;
          background: none;
          border: none;
          color: white;
          padding: 0.5rem;
          cursor: pointer;
        }
        
        /* Mobile Overlay Styles */
        .mobile-overlay {
          position: fixed;
          inset: 0;
          background: var(--bg-main);
          z-index: 2000;
          padding: 2rem;
          display: flex;
          flex-direction: column;
        }
        
        .mobile-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 3rem;
        }
        
        .close-btn {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
        }
        
        .mobile-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        
        .mobile-links a, .logout-mobile {
          text-decoration: none;
          color: white;
          font-size: 1.5rem;
          font-weight: 700;
        }
        
        .mobile-divider {
          height: 1px;
          background: var(--border-light);
          margin: 1rem 0;
        }
        
        .logout-mobile {
          color: var(--accent);
        }
        
        @media (max-width: 900px) {
          .nav-links, .search-bar, .icon-btn, .profile-menu-container {
            display: none;
          }
          .mobile-toggle {
            display: block;
          }
           .nav-right {
             gap: 0.5rem;
           }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
