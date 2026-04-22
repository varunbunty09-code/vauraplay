import React from 'react';
import { motion } from 'framer-motion';
import { Radio, Newspaper, Download, Share2 } from 'lucide-react';

const MediaCentre = () => {
    const pressReleases = [
        { date: "April 15, 2026", title: "VauraPlay Reaches 1 Million Active Users Worldwide", category: "Milestone" },
        { date: "March 22, 2026", title: "New Partnerships with Top-Tier Film Studios Announced", category: "Business" },
        { date: "February 10, 2026", title: "VauraPlay's New AI Recommendation Engine Goes Live", category: "Technology" }
    ];

    return (
        <div className="legal-page container">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="legal-content"
            >
                <header className="legal-header text-center">
                    <div className="icon-badge"><Radio size={40} /></div>
                    <h1>Media Centre</h1>
                    <p>The latest news, press releases, and brand assets from VauraPlay.</p>
                </header>

                <div className="media-grid">
                    <section className="press-releases">
                        <h2 className="section-title"><Newspaper size={20} /> Latest Press Releases</h2>
                        <div className="news-list">
                            {pressReleases.map((news, i) => (
                                <div key={i} className="news-card glass">
                                    <div className="news-meta">
                                        <span className="news-date">{news.date}</span>
                                        <span className="news-cat">{news.category}</span>
                                    </div>
                                    <h3>{news.title}</h3>
                                    <button className="read-more">Read More <Share2 size={16} /></button>
                                </div>
                            ))}
                        </div>
                    </section>

                    <aside className="brand-assets">
                        <div className="assets-card glass">
                            <h2>Brand Assets</h2>
                            <p>Download our official logos and brand guidelines for media use.</p>
                            <div className="asset-btns">
                                <button className="asset-btn"><Download size={18} /> Logos (.zip)</button>
                                <button className="asset-btn"><Download size={18} /> Guidelines (.pdf)</button>
                            </div>
                        </div>
                        <div className="media-contact glass">
                            <h3>Media Contact</h3>
                            <p>For press inquiries, please contact our PR team:</p>
                            <strong>press@vauraplay.com</strong>
                        </div>
                    </aside>
                </div>
            </motion.div>

            <style>{`
                .legal-page { padding-top: 150px; padding-bottom: 80px; min-height: 100vh; }
                .legal-header { margin-bottom: 5rem; }
                .icon-badge { color: var(--primary); margin-bottom: 1.5rem; }
                .icon-badge svg { margin: 0 auto; }
                
                .media-grid { display: grid; grid-template-columns: 1fr 350px; gap: 3rem; }
                .section-title { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; }
                
                .news-list { display: flex; flex-direction: column; gap: 1.5rem; }
                .news-card { padding: 2rem; border-radius: var(--radius-md); transition: 0.3s; }
                .news-card:hover { border-color: var(--primary); transform: translateX(10px); }
                
                .news-meta { display: flex; gap: 1rem; margin-bottom: 1rem; font-size: 0.85rem; }
                .news-date { color: var(--text-dim); }
                .news-cat { color: var(--primary); font-weight: 700; text-transform: uppercase; }
                .news-card h3 { color: white; margin-bottom: 1.5rem; line-height: 1.4; }
                
                .read-more { background: none; border: none; color: var(--primary); display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-weight: 600; padding: 0; }
                
                .brand-assets { display: flex; flex-direction: column; gap: 2rem; }
                .assets-card, .media-contact { padding: 2rem; border-radius: var(--radius-lg); }
                .assets-card h2 { margin-bottom: 1rem; font-size: 1.4rem; color: white; }
                .assets-card p { color: var(--text-dim); font-size: 0.9rem; margin-bottom: 1.5rem; }
                
                .asset-btns { display: flex; flex-direction: column; gap: 1rem; }
                .asset-btn { 
                    width: 100%; padding: 1rem; border-radius: 8px; border: 1px solid var(--border-light);
                    background: rgba(255,255,255,0.05); color: white; display: flex; align-items: center;
                    justify-content: center; gap: 0.8rem; cursor: pointer; transition: 0.3s;
                }
                .asset-btn:hover { background: var(--primary); color: black; border-color: var(--primary); }
                
                .media-contact h3 { color: white; margin-bottom: 1rem; }
                .media-contact p { font-size: 0.9rem; color: var(--text-dim); margin-bottom: 0.5rem; }
                .media-contact strong { color: var(--primary); }
                
                @media (max-width: 992px) {
                    .media-grid { grid-template-columns: 1fr; }
                    .brand-assets { flex-direction: row; flex-wrap: wrap; }
                    .assets-card, .media-contact { flex: 1; min-width: 300px; }
                }
                
                @media (max-width: 768px) {
                    .brand-assets { flex-direction: column; }
                    .legal-page { padding-top: 100px; }
                }
            `}</style>
        </div>
    );
};

export default MediaCentre;
