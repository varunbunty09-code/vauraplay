import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Play, Award, Zap } from 'lucide-react';

const OriginalsInfo = () => {
    return (
        <div className="legal-page container">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="legal-content"
            >
                <header className="legal-header text-center">
                    <div className="icon-badge"><Sparkles size={40} /></div>
                    <h1>VauraPlay Originals</h1>
                    <p>Exclusive stories you won't find anywhere else.</p>
                </header>

                <div className="originals-hero glass">
                    <div className="hero-text">
                        <span className="premium-tag">Coming Soon</span>
                        <h2>The Next Generation of Original Content</h2>
                        <p>We're collaborating with award-winning creators to bring you a unique slate of originals designed for the modern audience.</p>
                        <button className="notify-btn">Notify Me <Zap size={18} /></button>
                    </div>
                    <div className="hero-img">
                        <img src="https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop" alt="Production set" />
                    </div>
                </div>

                <div className="features-row">
                    <div className="feat-card glass">
                        <Award className="feat-icon" />
                        <h3>Award Winning</h3>
                        <p>Focusing on stories that push boundaries and capture imaginations.</p>
                    </div>
                    <div className="feat-card glass">
                        <Play className="feat-icon" />
                        <h3>4K Cinema</h3>
                        <p>All originals are shot and mastered in native 4K with Dolby Vision.</p>
                    </div>
                    <div className="feat-card glass">
                        <Sparkles className="feat-icon" />
                        <h3>Unique Perspectives</h3>
                        <p>Diverse voices from across the globe telling stories that matter.</p>
                    </div>
                </div>
            </motion.div>

            <style>{`
                .legal-page { padding-top: 150px; padding-bottom: 80px; min-height: 100vh; }
                .legal-header { margin-bottom: 5rem; }
                .icon-badge { color: var(--primary); margin-bottom: 1.5rem; }
                .icon-badge svg { margin: 0 auto; }
                
                .originals-hero { 
                    display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; padding: 4rem;
                    border-radius: var(--radius-lg); align-items: center; margin-bottom: 4rem;
                    background: linear-gradient(135deg, rgba(13, 202, 240, 0.1), rgba(0,0,0,0.4));
                }
                .premium-tag { display: inline-block; padding: 0.5rem 1rem; background: var(--primary); color: black; border-radius: 30px; font-weight: 700; font-size: 0.8rem; text-transform: uppercase; margin-bottom: 1.5rem; }
                .hero-text h2 { font-size: 2.8rem; margin-bottom: 1.5rem; line-height: 1.2; }
                .hero-text p { color: var(--text-dim); font-size: 1.1rem; line-height: 1.6; margin-bottom: 2rem; }
                
                .notify-btn { padding: 1rem 2.5rem; border-radius: 50px; background: white; color: black; border: none; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 0.8rem; transition: 0.3s; }
                .notify-btn:hover { background: var(--primary); transform: translateY(-3px); }
                
                .hero-img img { width: 100%; border-radius: var(--radius-md); filter: grayscale(0.5); transition: 0.5s; }
                .originals-hero:hover .hero-img img { filter: grayscale(0); transform: scale(1.02); }
                
                .features-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
                .feat-card { padding: 3rem; border-radius: var(--radius-lg); text-align: center; }
                .feat-icon { color: var(--primary); margin-bottom: 1.5rem; }
                .feat-card h3 { margin-bottom: 1rem; color: white; }
                .feat-card p { color: var(--text-dim); font-size: 0.95rem; }
                
                @media (max-width: 992px) {
                    .originals-hero { grid-template-columns: 1fr; gap: 3rem; padding: 2rem; text-align: center; }
                    .hero-text h2 { font-size: 2rem; }
                    .notify-btn { margin: 0 auto; }
                    .features-row { grid-template-columns: 1fr; }
                }
                
                @media (max-width: 768px) {
                    .legal-page { padding-top: 100px; }
                }
            `}</style>
        </div>
    );
};

export default OriginalsInfo;
