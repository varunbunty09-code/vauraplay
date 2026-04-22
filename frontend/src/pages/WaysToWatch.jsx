import React from 'react';
import { motion } from 'framer-motion';
import { Monitor, Smartphone, Tablet, Tv, CheckCircle2 } from 'lucide-react';

const WaysToWatch = () => {
    const devices = [
        { icon: <Tv size={48} />, title: "Smart TVs", desc: "Samsung, LG, Sony, Vizio and more." },
        { icon: <Monitor size={48} />, title: "Streaming Devices", desc: "Apple TV, Chromecast, Roku, Fire TV." },
        { icon: <Smartphone size={48} />, title: "Mobile & Tablet", desc: "iPhone, iPad, Android phones & tablets." },
        { icon: <Tv size={48} />, title: "Game Consoles", desc: "PlayStation 5, Xbox Series X|S." }
    ];

    return (
        <div className="legal-page container">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="legal-content"
            >
                <header className="legal-header text-center">
                    <div className="icon-badge"><Monitor size={40} /></div>
                    <h1>Ways to Watch</h1>
                    <p>Watch VauraPlay anytime, anywhere on all your favorite devices.</p>
                </header>

                <div className="devices-grid">
                    {devices.map((device, i) => (
                        <div key={i} className="device-card glass text-center">
                            <div className="device-icon">{device.icon}</div>
                            <h3>{device.title}</h3>
                            <p>{device.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="features-highlight glass">
                    <div className="highlight-text">
                        <h2>Premium Streaming Experience</h2>
                        <ul>
                            <li><CheckCircle2 size={18} /> 4K Ultra HD & HDR Support</li>
                            <li><CheckCircle2 size={18} /> Dolby Atmos Audio</li>
                            <li><CheckCircle2 size={18} /> Offline Viewing on Mobile</li>
                            <li><CheckCircle2 size={18} /> Multiple Profiles & Parental Controls</li>
                        </ul>
                    </div>
                    <div className="highlight-image">
                        <img src="https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=1957&auto=format&fit=crop" alt="Streaming experience" />
                    </div>
                </div>
            </motion.div>

            <style>{`
                .legal-page { padding-top: 150px; padding-bottom: 80px; min-height: 100vh; }
                .legal-header { margin-bottom: 5rem; }
                .icon-badge { color: var(--primary); margin-bottom: 1.5rem; }
                .icon-badge svg { margin: 0 auto; }
                
                .devices-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; margin-bottom: 5rem; }
                .device-card { padding: 3rem; border-radius: var(--radius-md); transition: 0.3s; }
                .device-card:hover { transform: scale(1.05); border-color: var(--primary); }
                .device-icon { color: var(--primary); margin-bottom: 1.5rem; }
                .device-card h3 { color: white; margin-bottom: 0.8rem; }
                .device-card p { color: var(--text-dim); font-size: 0.9rem; }
                
                .features-highlight { 
                    display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; padding: 4rem;
                    border-radius: var(--radius-lg); align-items: center;
                }
                .highlight-text h2 { font-size: 2.5rem; margin-bottom: 2rem; }
                .highlight-text ul { list-style: none; display: flex; flex-direction: column; gap: 1rem; }
                .highlight-text li { display: flex; align-items: center; gap: 1rem; font-size: 1.1rem; color: var(--text-dim); }
                .highlight-text li svg { color: var(--primary); }
                
                .highlight-image img { width: 100%; border-radius: var(--radius-md); box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
                
                @media (max-width: 992px) {
                    .features-highlight { grid-template-columns: 1fr; gap: 3rem; padding: 2rem; }
                    .highlight-text h2 { font-size: 1.8rem; }
                }
                
                @media (max-width: 768px) {
                    .devices-grid { grid-template-columns: 1fr; }
                    .legal-page { padding-top: 100px; }
                }
            `}</style>
        </div>
    );
};

export default WaysToWatch;
