import React from 'react';
import { Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
    return (
        <div className="legal-page container">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="legal-content"
            >
                <header className="legal-header text-center">
                    <div className="icon-badge"><Shield size={40} /></div>
                    <h1>Privacy Policy</h1>
                    <p>Your privacy is our top priority at VauraPlay.</p>
                </header>

                <div className="text-content glass">
                    <section>
                        <h2>1. Data Collection</h2>
                        <p>We collect minimal personal information required for a personalized experience, such as your email address and username. We also store your watch progress locally and on our secure servers to enable "Continue Watching" features.</p>
                    </section>
                    
                    <section>
                        <h2>2. Security</h2>
                        <p>We implement industry-standard security measures including JWT-based session management and OTP (One-Time Password) verification to protect your account from unauthorized access.</p>
                    </section>

                    <section>
                        <h2>3. Cookies</h2>
                        <p>We use essential cookies to remember your login session and preferences. These cookies do not track your behavior on external websites.</p>
                    </section>

                    <section>
                        <h2>4. Third-Party Services</h2>
                        <p>Our platform interacts with TMDB for metadata and Vidking for video playback. Please refer to their respective privacy policies for data handling on their side.</p>
                    </section>
                </div>
            </motion.div>

            <style>{`
                .legal-page { padding-top: 150px; padding-bottom: 80px; }
                .legal-header { margin-bottom: 4rem; }
                .icon-badge { color: var(--primary); margin-bottom: 1.5rem; }
                .icon-badge svg { margin: 0 auto; }
                
                .text-content { padding: 3rem; border-radius: var(--radius-md); max-width: 900px; margin: 0 auto; line-height: 1.8; }
                section { margin-bottom: 2.5rem; }
                section h2 { color: white; margin-bottom: 1rem; font-size: 1.5rem; }
                section p { color: var(--text-dim); }
            `}</style>
        </div>
    );
};

export default PrivacyPolicy;
