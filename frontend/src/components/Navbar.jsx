import React, { useState, useEffect, useRef } from 'react';
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
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  const notifications = [
    { id: 1, title: 'Welcome to VauraPlay!', message: 'Start exploring over 75,000+ movies.', time: '2m ago', unread: true },
    { id: 2, title: 'New Movie Added', message: 'Michael (2025) is now available to stream.', time: '1h ago', unread: true },
    { id: 3, title: 'Admin Message', message: 'The server will undergo maintenance at midnight.', time: '3h ago', unread: false }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setProfileMenuOpen(false);
    navigate('/landing');
  };

  const handleSearchCommit = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
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

          {user && (
            <ul className="nav-links">
              <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link></li>
              <li><Link to="/browse?type=movie" className={location.pathname === '/browse' ? 'active' : ''}>Movies</Link></li>
              <li><Link to="/browse?type=tv">TV Shows</Link></li>
              <li><Link to="/watchlist">My List</Link></li>
            </ul>
          )}
        </div>

        <div className="nav-right">
          {user ? (
            <>
              <div className="search-bar glass">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Search movies, TV shows..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchCommit}
                />
              </div>

              <div className="notification-container" ref={notificationRef}>
                <button className="icon-btn" onClick={() => setNotificationsOpen(!notificationsOpen)}>
                  <Bell size={20} />
                  <span className="badge-count">2</span>
                </button>

                <AnimatePresence>
                  {notificationsOpen && (
                    <motion.div
                      className="notification-dropdown glass"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                    >
                      <div className="dropdown-header">
                        <h3>Notifications</h3>
                        <button className="text-btn">Mark all read</button>
                      </div>
                      <div className="notification-list">
                        {notifications.map(notif => (
                          <div key={notif.id} className={`notification-item ${notif.unread ? 'unread' : ''}`}>
                            <div className="notif-content">
                              <p className="notif-title">{notif.title}</p>
                              <p className="notif-msg">{notif.message}</p>
                              <p className="notif-time">{notif.time}</p>
                            </div>
                            {notif.unread && <span className="unread-dot"></span>}
                          </div>
                        ))}
                      </div>
                      <div className="dropdown-footer">
                        <Link to="/help" onClick={() => setNotificationsOpen(false)}>View all activity</Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="profile-menu-container" ref={profileRef}>
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
                        <p className="username">{user?.username || 'User'}</p>
                        <p className="email">{user?.email}</p>
                      </div>
                      <ul>
                        <li onClick={() => setProfileMenuOpen(false)}><Link to="/profile"><User size={16} /> Profile</Link></li>
                        {user?.role === 'admin' && (
                          <li onClick={() => setProfileMenuOpen(false)}><Link to="/admin"><LayoutDashboard size={16} /> Admin Panel</Link></li>
                        )}
                        <li className="divider"></li>
                        <li onClick={handleLogout} className="logout"><LogOut size={16} /> Sign Out</li>
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <div className="auth-btns">
              <Link to="/login" className="btn-text">Sign In</Link>
              <Link to="/signup" className="btn-primary-sm">Get Started</Link>
            </div>
          )}

          {user && (
            <button className="mobile-toggle" onClick={() => setMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
          )}
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
        
        .profile-dropdown, .notification-dropdown {
          position: absolute;
          top: 50px;
          right: 0;
          width: 320px;
          border-radius: var(--radius-md);
          padding: 0.5rem;
          box-shadow: 0 10px 40px rgba(0,0,0,0.8);
          z-index: 1100;
        }

        .profile-dropdown { width: 220px; }
        
        .notification-container { position: relative; }
        
        .badge-count {
          position: absolute;
          top: -5px;
          right: -5px;
          background: var(--accent);
          color: white;
          font-size: 0.65rem;
          font-weight: 800;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid var(--bg-main);
        }

        .dropdown-header {
          padding: 1rem;
          border-bottom: 1px solid var(--border-light);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .notification-list {
          max-height: 350px;
          overflow-y: auto;
        }

        .notification-item {
          padding: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.03);
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .notification-item:hover {
          background: rgba(255,255,255,0.03);
        }

        .notification-item.unread {
          background: rgba(13, 202, 240, 0.03);
        }

        .notif-title { font-weight: 700; color: white; font-size: 0.9rem; margin-bottom: 0.2rem; }
        .notif-msg { font-size: 0.8rem; color: var(--text-dim); line-height: 1.4; }
        .notif-time { font-size: 0.7rem; color: var(--text-muted); margin-top: 0.4rem; }

        .unread-dot {
          width: 8px;
          height: 8px;
          background: var(--primary);
          border-radius: 50%;
          margin-top: 5px;
          flex-shrink: 0;
        }

        .dropdown-footer {
          padding: 1rem;
          text-align: center;
          border-top: 1px solid var(--border-light);
        }

        .dropdown-footer a {
          text-decoration: none;
          color: var(--primary);
          font-size: 0.85rem;
          font-weight: 600;
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
        
        .btn-text {
          color: white;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.95rem;
          transition: var(--transition-fast);
        }

        .btn-text:hover { color: var(--primary); }

        .btn-primary-sm {
          background: var(--primary);
          color: black;
          padding: 0.6rem 1.2rem;
          border-radius: var(--radius-sm);
          text-decoration: none;
          font-weight: 700;
          font-size: 0.9rem;
          transition: var(--transition-fast);
        }

        .btn-primary-sm:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px var(--primary-glow);
        }

        .auth-btns {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        @media (max-width: 900px) {
          .nav-links, .search-bar, .notification-container, .profile-menu-container {
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
