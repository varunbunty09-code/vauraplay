import React from 'react';
import { Play, Globe, MessageCircle, Heart, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
   return (
      <footer className="main-footer">
         <div className="container footer-content">
            <div className="footer-brand">
               <Link to="/" className="logo">
                  <Play fill="var(--primary)" size={24} />
                  <span className="logo-text">VAURA<span>PLAY</span></span>
               </Link>
               <p>The ultimate streaming companion powered by Vidking & TMDB.</p>
               <div className="social-links">
                  <a href="#"><Globe size={20} /></a>
                  <a href="#"><MessageCircle size={20} /></a>
                  <a href="#"><Heart size={20} /></a>
                  <a href="#"><Mail size={20} /></a>
               </div>
            </div>

            <div className="footer-links">
               <div className="link-group">
                  <h4>Platform</h4>
                  <ul>
                     <li><Link to="/">Home</Link></li>
                     <li><Link to="/browse">Browse</Link></li>
                     <li><Link to="/watchlist">My List</Link></li>
                  </ul>
               </div>
                <div className="link-group">
                   <h4>Support</h4>
                   <ul>
                      <li><Link to="/help">Help Center</Link></li>
                      <li><Link to="/terms">Terms of Use</Link></li>
                      <li><Link to="/privacy">Privacy Policy</Link></li>
                   </ul>
                </div>
            </div>
         </div>

         <div className="footer-bottom text-center">
            <p>&copy; {new Date().getFullYear()} VauraPlay. Built by Vaura.</p>
         </div>

         <style>{`
        .main-footer {
          background: #050507;
          border-top: 1px solid var(--border-light);
          padding: 80px 0 40px;
          margin-top: auto;
        }
        
        .footer-content {
          display: flex;
          justify-content: space-between;
          gap: 4rem;
          margin-bottom: 60px;
        }
        
        .footer-brand { flex: 1; max-width: 400px; }
        
        .logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          margin-bottom: 1rem;
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

        .footer-brand p { margin: 1.5rem 0 2rem; }
        
        .social-links { display: flex; gap: 1.5rem; }
        .social-links a { color: var(--text-dim); transition: .3s; }
        .social-links a:hover { color: var(--primary); transform: translateY(-3px); }
        
        .footer-links { display: flex; gap: 6rem; }
        .link-group h4 { color: white; margin-bottom: 1.5rem; }
        .link-group ul { list-style: none; display: flex; flex-direction: column; gap: 0.8rem; }
        .link-group a { text-decoration: none; color: var(--text-dim); font-size: 0.95rem; transition: .2s; }
        .link-group a:hover { color: var(--primary); }
        
        .footer-bottom { padding: 30px 0; border-top: 1px solid rgba(255,255,255,0.05); }
        .footer-bottom p { font-size: 0.85rem; color: var(--text-muted); }

        @media (max-width: 768px) {
          .footer-content { flex-direction: column; gap: 3rem; text-align: center; }
          .footer-brand { margin: 0 auto; }
          .social-links { justify-content: center; }
          .footer-links { justify-content: center; gap: 4rem; }
        }
      `}</style>
      </footer>
   );
};

export default Footer;
