import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Gauge, Zap, Wifi, Signal } from 'lucide-react';

const SpeedTest = () => {
    const [testing, setTesting] = useState(false);
    const [speed, setSpeed] = useState(0);

    const startTest = () => {
        setTesting(true);
        setSpeed(0);
        let current = 0;
        const interval = setInterval(() => {
            current += Math.random() * 20;
            if (current >= 120) {
                setSpeed(124.5);
                setTesting(false);
                clearInterval(interval);
            } else {
                setSpeed(Math.floor(current));
            }
        }, 100);
    };

    return (
        <div className="legal-page container">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="legal-content text-center"
            >
                <header className="legal-header">
                    <div className="icon-badge"><Gauge size={40} /></div>
                    <h1>Speed Test</h1>
                    <p>Ensure your connection is ready for 4K Ultra HD streaming.</p>
                </header>

                <div className="speed-meter-container glass">
                    <div className="meter-ring">
                        <div className="speed-value">
                            <h2>{speed}</h2>
                            <span>Mbps</span>
                        </div>
                    </div>
                    <button 
                        className={`test-btn ${testing ? 'testing' : ''}`}
                        onClick={startTest}
                        disabled={testing}
                    >
                        {testing ? 'Checking Connection...' : 'Start Test'}
                    </button>
                </div>

                <div className="connection-tips grid">
                    <div className="tip-card glass">
                        <Zap size={24} className="tip-icon" />
                        <h4>Low Latency</h4>
                        <p>Our global CDN ensures minimal buffering regardless of your location.</p>
                    </div>
                    <div className="tip-card glass">
                        <Wifi size={24} className="tip-icon" />
                        <h4>Optimized Wi-Fi</h4>
                        <p>For best results, use 5GHz Wi-Fi or an Ethernet cable.</p>
                    </div>
                    <div className="tip-card glass">
                        <Signal size={24} className="tip-icon" />
                        <h4>Adaptive Bitrate</h4>
                        <p>VauraPlay automatically adjusts quality based on your current speed.</p>
                    </div>
                </div>
            </motion.div>

            <style>{`
                .legal-page { padding-top: 150px; padding-bottom: 80px; min-height: 100vh; }
                .legal-header { margin-bottom: 4rem; }
                .icon-badge { color: var(--primary); margin-bottom: 1.5rem; }
                .icon-badge svg { margin: 0 auto; }
                
                .speed-meter-container { 
                    padding: 4rem; border-radius: var(--radius-lg); max-width: 600px; margin: 0 auto 4rem;
                    display: flex; flex-direction: column; align-items: center; gap: 2rem;
                }
                
                .meter-ring {
                    width: 250px; height: 250px; border-radius: 50%; border: 8px solid #222;
                    display: flex; align-items: center; justify-content: center;
                    position: relative;
                }
                
                .meter-ring::after {
                    content: '';
                    position: absolute;
                    inset: -8px;
                    border-radius: 50%;
                    border: 8px solid transparent;
                    border-top-color: var(--primary);
                    animation: ${testing ? 'spin 2s linear infinite' : 'none'};
                }
                
                @keyframes spin { 100% { transform: rotate(360deg); } }
                
                .speed-value { text-align: center; }
                .speed-value h2 { font-size: 4rem; color: white; line-height: 1; }
                .speed-value span { color: var(--text-dim); text-transform: uppercase; letter-spacing: 2px; }
                
                .test-btn {
                    padding: 1rem 3rem; border-radius: 50px; background: var(--primary); border: none;
                    color: black; font-weight: 700; font-size: 1.1rem; cursor: pointer; transition: 0.3s;
                }
                .test-btn:hover:not(:disabled) { transform: scale(1.05); filter: brightness(1.1); }
                .test-btn:disabled { opacity: 0.7; cursor: not-allowed; }
                
                .connection-tips { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
                .tip-card { padding: 2rem; border-radius: var(--radius-md); text-align: left; }
                .tip-icon { color: var(--primary); margin-bottom: 1rem; }
                
                @media (max-width: 768px) {
                    .connection-tips { grid-template-columns: 1fr; }
                    .speed-meter-container { padding: 2rem; }
                    .meter-ring { width: 180px; height: 180px; }
                    .speed-value h2 { font-size: 3rem; }
                }
            `}</style>
        </div>
    );
};

export default SpeedTest;
