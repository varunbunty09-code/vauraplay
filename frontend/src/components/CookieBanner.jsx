import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, X, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CookieBanner = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie-consent', 'accepted');
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem('cookie-consent', 'declined');
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div 
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="cookie-banner-wrapper"
                >
                    <div className="container">
                        <div className="cookie-banner glass">
                            <div className="cookie-content">
                                <div className="cookie-icon">
                                    <Shield size={24} />
                                </div>
                                <div className="cookie-text">
                                    <p>
                                        We use cookies to improve your experience and analyze our traffic. 
                                        By clicking "Accept", you consent to our use of cookies. 
                                        <Link to="/cookies">Learn more</Link>
                                    </p>
                                </div>
                            </div>
                            <div className="cookie-actions">
                                <button className="decline-btn" onClick={handleDecline}>Decline</button>
                                <button className="accept-btn" onClick={handleAccept}>Accept All</button>
                                <button className="close-banner" onClick={() => setIsVisible(false)}><X size={18} /></button>
                            </div>
                        </div>
                    </div>

                    <style>{`
                        .cookie-banner-wrapper {
                            position: fixed;
                            bottom: 2rem;
                            left: 0;
                            right: 0;
                            z-index: 10000;
                            pointer-events: none;
                        }
                        
                        .cookie-banner {
                            pointer-events: auto;
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            padding: 1.5rem 2rem;
                            border-radius: var(--radius-lg);
                            gap: 2rem;
                            box-shadow: 0 20px 50px rgba(0,0,0,0.5);
                        }
                        
                        .cookie-content { display: flex; align-items: center; gap: 1.5rem; }
                        .cookie-icon { 
                            background: var(--primary-glow); color: var(--primary);
                            width: 45px; height: 45px; border-radius: 12px;
                            display: flex; align-items: center; justify-content: center;
                            flex-shrink: 0;
                        }
                        
                        .cookie-text p { color: var(--text-dim); font-size: 0.95rem; line-height: 1.5; margin: 0; }
                        .cookie-text a { color: var(--primary); text-decoration: none; margin-left: 0.5rem; font-weight: 600; }
                        .cookie-text a:hover { text-decoration: underline; }
                        
                        .cookie-actions { display: flex; align-items: center; gap: 1rem; flex-shrink: 0; }
                        
                        .accept-btn { 
                            background: var(--primary); color: black; border: none;
                            padding: 0.8rem 1.5rem; border-radius: 8px; font-weight: 700;
                            cursor: pointer; transition: 0.3s;
                        }
                        .accept-btn:hover { filter: brightness(1.1); transform: translateY(-2px); }
                        
                        .decline-btn { 
                            background: none; border: 1px solid var(--border-light); color: var(--text-dim);
                            padding: 0.8rem 1.5rem; border-radius: 8px; font-weight: 600;
                            cursor: pointer; transition: 0.3s;
                        }
                        .decline-btn:hover { background: rgba(255,255,255,0.05); color: white; }
                        
                        .close-banner { 
                            background: none; border: none; color: var(--text-muted);
                            cursor: pointer; padding: 0.5rem; transition: 0.3s;
                        }
                        .close-banner:hover { color: white; }

                        @media (max-width: 992px) {
                            .cookie-banner { flex-direction: column; text-align: center; gap: 1.5rem; padding: 1.5rem; }
                            .cookie-content { flex-direction: column; gap: 1rem; }
                            .cookie-actions { width: 100%; justify-content: center; }
                            .accept-btn, .decline-btn { flex: 1; }
                        }

                        @media (max-width: 480px) {
                            .cookie-banner-wrapper { bottom: 1rem; }
                            .cookie-banner { margin: 0 1rem; border-radius: 16px; }
                        }
                    `}</style>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CookieBanner;
