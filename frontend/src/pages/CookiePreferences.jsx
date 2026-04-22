import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Check, X, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const CookiePreferences = () => {
    const [settings, setSettings] = useState({
        essential: true,
        analytics: true,
        marketing: false,
        personalization: true
    });

    const toggle = (key) => {
        if (key === 'essential') return;
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSave = () => {
        toast.success("Preferences saved successfully!");
    };

    return (
        <div className="legal-page container">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="legal-content"
            >
                <header className="legal-header text-center">
                    <div className="icon-badge"><Shield size={40} /></div>
                    <h1>Cookie Preferences</h1>
                    <p>Manage how we use cookies to improve your streaming experience.</p>
                </header>

                <div className="cookie-settings-card glass">
                    <div className="cookie-item">
                        <div className="cookie-info">
                            <h3>Essential Cookies</h3>
                            <p>Required for basic site functionality. These cannot be disabled.</p>
                        </div>
                        <div className="cookie-toggle locked"><Check size={18} /> Always On</div>
                    </div>

                    <div className="cookie-item" onClick={() => toggle('analytics')}>
                        <div className="cookie-info">
                            <h3>Analytics Cookies</h3>
                            <p>Help us understand how visitors interact with the platform.</p>
                        </div>
                        <div className={`cookie-toggle ${settings.analytics ? 'active' : ''}`}>
                            {settings.analytics ? <Check size={18} /> : <X size={18} />}
                        </div>
                    </div>

                    <div className="cookie-item" onClick={() => toggle('personalization')}>
                        <div className="cookie-info">
                            <h3>Personalization Cookies</h3>
                            <p>Used to remember your preferences and provide personalized recommendations.</p>
                        </div>
                        <div className={`cookie-toggle ${settings.personalization ? 'active' : ''}`}>
                            {settings.personalization ? <Check size={18} /> : <X size={18} />}
                        </div>
                    </div>

                    <div className="cookie-item" onClick={() => toggle('marketing')}>
                        <div className="cookie-info">
                            <h3>Marketing Cookies</h3>
                            <p>Used to deliver relevant advertisements and track campaign performance.</p>
                        </div>
                        <div className={`cookie-toggle ${settings.marketing ? 'active' : ''}`}>
                            {settings.marketing ? <Check size={18} /> : <X size={18} />}
                        </div>
                    </div>

                    <button className="save-preferences-btn" onClick={handleSave}>
                        Save My Preferences <Save size={18} />
                    </button>
                </div>
            </motion.div>

            <style>{`
                .legal-page { padding-top: 150px; padding-bottom: 80px; min-height: 100vh; }
                .legal-header { margin-bottom: 4rem; }
                .icon-badge { color: var(--primary); margin-bottom: 1.5rem; }
                .icon-badge svg { margin: 0 auto; }
                
                .cookie-settings-card { padding: 3rem; border-radius: var(--radius-lg); max-width: 800px; margin: 0 auto; }
                .cookie-item { 
                    display: flex; justify-content: space-between; align-items: center;
                    padding: 2rem 0; border-bottom: 1px solid var(--border-light);
                    cursor: pointer; transition: 0.2s;
                }
                .cookie-item:last-of-type { border-bottom: none; }
                .cookie-item:hover:not(:first-child) { background: rgba(255,255,255,0.02); }
                
                .cookie-info h3 { color: white; margin-bottom: 0.5rem; }
                .cookie-info p { color: var(--text-dim); font-size: 0.9rem; }
                
                .cookie-toggle { 
                    width: 120px; padding: 0.6rem; border-radius: 30px; border: 1px solid #444;
                    display: flex; align-items: center; justify-content: center; gap: 0.5rem;
                    font-weight: 600; font-size: 0.85rem; transition: 0.3s;
                }
                .cookie-toggle.active { background: var(--primary); color: black; border-color: var(--primary); }
                .cookie-toggle.locked { background: #222; border-color: #333; color: #666; cursor: not-allowed; }
                
                .save-preferences-btn { 
                    width: 100%; margin-top: 2rem; padding: 1.2rem; border-radius: 8px;
                    background: white; color: black; border: none; font-weight: 700;
                    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.8rem;
                    transition: 0.3s;
                }
                .save-preferences-btn:hover { background: var(--primary); }
                
                @media (max-width: 768px) {
                    .cookie-item { flex-direction: column; gap: 1.5rem; text-align: center; }
                    .cookie-settings-card { padding: 1.5rem; }
                    .legal-page { padding-top: 100px; }
                }
            `}</style>
        </div>
    );
};

export default CookiePreferences;
