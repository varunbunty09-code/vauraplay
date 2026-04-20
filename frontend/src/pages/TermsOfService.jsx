import React from 'react';
import { FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const TermsOfService = () => {
    return (
        <div className="legal-page container">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="legal-content"
            >
                <header className="legal-header text-center">
                    <div className="icon-badge"><FileText size={40} /></div>
                    <h1>Terms of Use</h1>
                    <p>Last updated: April 20, 2026</p>
                </header>

                <div className="text-content glass">
                    <section>
                        <h2>1. Acceptance of Terms</h2>
                        <p>By accessing and using VauraPlay, you agree to be bound by these Terms of Use and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.</p>
                    </section>
                    
                    <section>
                        <h2>2. Content Library</h2>
                        <p>VauraPlay acts as a content aggregator and metadata library. We do not host any copyrighted media files on our servers. All streaming playback is provided by third-party embeddable players such as Vidking.</p>
                    </section>

                    <section>
                        <h2>3. User Accounts</h2>
                        <p>You are responsible for maintaining the confidentiality of your account and password. VauraPlay reserves the right to terminate accounts that violate our community guidelines or security policies.</p>
                    </section>

                    <section>
                        <h2>4. Limitations</h2>
                        <p>In no event shall VauraPlay or its suppliers be liable for any damages arising out of the use or inability to use the materials on our platform.</p>
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

export default TermsOfService;
