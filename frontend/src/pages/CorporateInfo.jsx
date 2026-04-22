import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Users, Landmark, Globe2 } from 'lucide-react';

const CorporateInfo = () => {
    return (
        <div className="legal-page container">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="legal-content"
            >
                <header className="legal-header text-center">
                    <div className="icon-badge"><Building2 size={40} /></div>
                    <h1>Corporate Information</h1>
                    <p>Transparent overview of VauraPlay's corporate structure and identity.</p>
                </header>

                <div className="corp-grid">
                    <section className="glass corp-card">
                        <h2>Company Details</h2>
                        <ul className="details-list">
                            <li><span>Entity Name:</span> Vaura Entertainment Inc.</li>
                            <li><span>Registration:</span> Delaware, USA #12345678</li>
                            <li><span>VAT ID:</span> US987654321</li>
                            <li><span>Founded:</span> June 2024</li>
                        </ul>
                    </section>

                    <section className="glass corp-card">
                        <h2>Leadership</h2>
                        <div className="leaders">
                            <div className="leader">
                                <strong>Varun B.</strong>
                                <span>Chief Executive Officer</span>
                            </div>
                            <div className="leader">
                                <strong>Sarah Chen</strong>
                                <span>Chief Technology Officer</span>
                            </div>
                            <div className="leader">
                                <strong>Michael Ross</strong>
                                <span>Head of Content</span>
                            </div>
                        </div>
                    </section>
                </div>

                <div className="values-section glass text-center">
                    <h2>Our Mission</h2>
                    <p>To democratize access to high-quality entertainment through cutting-edge technology and a user-first approach. We are committed to building the world's most accessible streaming ecosystem.</p>
                    <div className="value-icons">
                        <div className="v-icon"><Users /> <span>Community</span></div>
                        <div className="v-icon"><Landmark /> <span>Integrity</span></div>
                        <div className="v-icon"><Globe2 /> <span>Global Access</span></div>
                    </div>
                </div>
            </motion.div>

            <style>{`
                .legal-page { padding-top: 150px; padding-bottom: 80px; min-height: 100vh; }
                .legal-header { margin-bottom: 5rem; }
                .icon-badge { color: var(--primary); margin-bottom: 1.5rem; }
                .icon-badge svg { margin: 0 auto; }
                
                .corp-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 4rem; }
                .corp-card { padding: 3rem; border-radius: var(--radius-lg); }
                .corp-card h2 { margin-bottom: 2rem; font-size: 1.5rem; color: white; border-bottom: 1px solid var(--border-light); padding-bottom: 1rem; }
                
                .details-list { list-style: none; display: flex; flex-direction: column; gap: 1.2rem; }
                .details-list li { display: flex; justify-content: space-between; color: var(--text-dim); }
                .details-list span { color: white; font-weight: 600; }
                
                .leaders { display: flex; flex-direction: column; gap: 1.5rem; }
                .leader { display: flex; flex-direction: column; }
                .leader strong { color: white; font-size: 1.1rem; }
                .leader span { color: var(--text-dim); font-size: 0.9rem; }
                
                .values-section { padding: 4rem; border-radius: var(--radius-lg); max-width: 900px; margin: 0 auto; }
                .values-section p { color: var(--text-dim); line-height: 1.8; margin: 1.5rem 0 3rem; font-size: 1.1rem; }
                
                .value-icons { display: flex; justify-content: center; gap: 4rem; }
                .v-icon { display: flex; flex-direction: column; align-items: center; gap: 0.8rem; color: var(--primary); }
                .v-icon span { color: var(--text-dim); font-size: 0.85rem; font-weight: 600; text-transform: uppercase; }
                
                @media (max-width: 992px) {
                    .corp-grid { grid-template-columns: 1fr; }
                    .value-icons { gap: 2rem; flex-wrap: wrap; }
                }
                
                @media (max-width: 768px) {
                    .corp-card, .values-section { padding: 2rem; }
                    .legal-page { padding-top: 100px; }
                }
            `}</style>
        </div>
    );
};

export default CorporateInfo;
