import React from 'react';
import { Globe, MessageCircle, Heart, Mail, Github, Instagram, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import toast from 'react-hot-toast';

const Footer = () => {
   const showSupportEmail = () => {
      toast.success('Support: auth.noreply.vauraplay@gmail.com', {
         icon: '📧',
         duration: 4000
      });
   };

   const socialAction = (platform) => {
      toast(`Follow us on ${platform}!`, {
         icon: '🚀'
      });
   };

   return (
      <footer className="main-footer">
         <div className="container">
            <div className="footer-top-cta">
               <p>Questions? Call <a href="tel:000-800-919-1743">000-800-919-1743</a></p>
            </div>

            <div className="footer-grid-premium">
               <div className="footer-col">
                  <Link to="/help" className="footer-link">FAQ</Link>
                  <Link to="/investors" className="footer-link">Investor Relations</Link>
                  <Link to="/privacy" className="footer-link">Privacy</Link>
                  <Link to="/speedtest" className="footer-link">Speed Test</Link>
               </div>
               <div className="footer-col">
                  <Link to="/help" className="footer-link">Help Centre</Link>
                  <Link to="/jobs" className="footer-link">Jobs</Link>
                  <Link to="/cookies" className="footer-link">Cookie Preferences</Link>
                  <Link to="/legal" className="footer-link">Legal Notices</Link>
               </div>
               <div className="footer-col">
                  <Link to="/profile" className="footer-link">Account</Link>
                  <Link to="/ways-to-watch" className="footer-link">Ways to Watch</Link>
                  <Link to="/corporate" className="footer-link">Corporate Information</Link>
                  <Link to="/originals" className="footer-link">Only on VauraPlay</Link>
               </div>
               <div className="footer-col">
                  <Link to="/media" className="footer-link">Media Centre</Link>
                  <Link to="/terms" className="footer-link">Terms of Use</Link>
                  <Link to="/contact" className="footer-link">Contact Us</Link>
               </div>
            </div>

            <div className="footer-bottom-v2">
               <div className="footer-brand-v2">
                  <Logo to="/" fontSize="1.5rem" />
                  <p>Netflix India - Powered by Vaura</p>
               </div>

               <div className="footer-social-premium">
                  <button onClick={() => socialAction('Instagram')} title="Instagram"><Instagram size={20} /></button>
                  <button onClick={() => socialAction('Twitter')} title="Twitter"><Twitter size={20} /></button>
                  <button onClick={() => socialAction('Github')} title="Github"><Github size={20} /></button>
                  <button onClick={showSupportEmail} title="Support Email"><Mail size={20} /></button>
               </div>
            </div>

            <div className="footer-copyright">
               <p>&copy; {new Date().getFullYear()} VauraPlay. All rights reserved. This site is protected by reCAPTCHA.</p>
            </div>
         </div>

         <style>{`
        .main-footer {
          background: #000;
          border-top: 1px solid #333;
          padding: 50px 0 30px;
          color: #757575;
          margin-top: auto;
        }
        
        .footer-top-cta { margin-bottom: 2rem; }
        .footer-top-cta p, .footer-top-cta a { color: #757575; text-decoration: none; font-size: 1rem; }
        .footer-top-cta a:hover { text-decoration: underline; }

        .footer-grid-premium {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          margin-bottom: 3rem;
        }
        
        .footer-col { display: flex; flex-direction: column; gap: 1rem; }
        .footer-link {
          color: #757575;
          text-decoration: none;
          font-size: 0.85rem;
          transition: 0.2s;
        }
        .footer-link:hover { text-decoration: underline; }

        .footer-bottom-v2 {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 2rem;
          border-top: 1px solid #333;
          margin-bottom: 1.5rem;
        }
        
        .footer-brand-v2 p { font-size: 0.8rem; margin-top: 0.5rem; color: #555; }
        
        .footer-social-premium { display: flex; gap: 1.5rem; }
        .footer-social-premium button {
          background: none; border: none; color: #757575; cursor: pointer; transition: 0.3s;
        }
        .footer-social-premium button:hover { color: white; transform: translateY(-3px); }
        
        .footer-copyright { border-top: 1px solid #111; padding-top: 1.5rem; text-align: center; }
        .footer-copyright p { font-size: 0.75rem; color: #444; }

        @media (max-width: 768px) {
          .footer-grid-premium { grid-template-columns: repeat(2, 1fr); gap: 2rem; }
          .footer-bottom-v2 { flex-direction: column; gap: 2rem; text-align: center; }
        }

        @media (max-width: 480px) {
           .footer-grid-premium { grid-template-columns: 1fr; }
        }
      `}</style>
      </footer>
   );
};

export default Footer;
