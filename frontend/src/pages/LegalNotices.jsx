import React from 'react';
import { motion } from 'framer-motion';
import { Gavel, ShieldCheck, Scale, Info } from 'lucide-react';

const LegalNotices = () => {
    return (
        <div className="legal-page container">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="legal-content"
            >
                <header className="legal-header text-center">
                    <div className="icon-badge"><Gavel size={40} /></div>
                    <h1>Legal Notices</h1>
                    <p>Important legal information regarding the VauraPlay platform and its services.</p>
                </header>

                <div className="legal-sections">
                    <section className="glass legal-card">
                        <div className="card-header">
                            <ShieldCheck className="card-icon" />
                            <h2>Intellectual Property</h2>
                        </div>
                        <p>The software, workflow, and visual design of VauraPlay are protected by international copyright laws. Unauthorized reproduction or redistribution is strictly prohibited.</p>
                    </section>

                    <section className="glass legal-card">
                        <div className="card-header">
                            <Scale className="card-icon" />
                            <h2>Compliance</h2>
                        </div>
                        <p>VauraPlay complies with the Digital Millennium Copyright Act (DMCA). We provide an automated metadata platform that aggregates publicly available information.</p>
                    </section>

                    <section className="glass legal-card">
                        <div className="card-header">
                            <Info className="card-icon" />
                            <h2>Service Disclaimer</h2>
                        </div>
                        <p>Our service is provided "as is" without any warranties. VauraPlay does not host video files on its servers and acts solely as a metadata aggregator.</p>
                    </section>
                </div>
            </motion.div>

            <style>{`
                .legal-page { padding-top: 150px; padding-bottom: 80px; min-height: 100vh; }
                .legal-header { margin-bottom: 5rem; }
                .icon-badge { color: var(--primary); margin-bottom: 1.5rem; }
                .icon-badge svg { margin: 0 auto; }
                
                .legal-sections { max-width: 1000px; margin: 0 auto; display: flex; flex-direction: column; gap: 2rem; }
                .legal-card { padding: 3rem; border-radius: var(--radius-md); }
                .card-header { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 1.5rem; }
                .card-icon { color: var(--primary); }
                .legal-card h2 { font-size: 1.8rem; color: white; }
                .legal-card p { color: var(--text-dim); line-height: 1.8; font-size: 1.1rem; }
                
                @media (max-width: 768px) {
                    .legal-card { padding: 2rem; }
                    .card-header { flex-direction: column; text-align: center; }
                    .legal-page { padding-top: 100px; }
                }
            `}</style>
        </div>
    );
};

export default LegalNotices;
