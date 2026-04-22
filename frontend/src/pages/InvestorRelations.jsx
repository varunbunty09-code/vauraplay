import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Award, BarChart3, Globe } from 'lucide-react';

const InvestorRelations = () => {
    return (
        <div className="legal-page container">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="legal-content"
            >
                <header className="legal-header text-center">
                    <div className="icon-badge"><TrendingUp size={40} /></div>
                    <h1>Investor Relations</h1>
                    <p>Building the future of entertainment technology.</p>
                </header>

                <div className="info-grid">
                    <div className="info-card glass">
                        <TrendingUp className="info-icon" />
                        <h3>Growth Strategy</h3>
                        <p>VauraPlay is expanding its global footprint with a focus on high-growth markets and proprietary streaming technology.</p>
                    </div>
                    <div className="info-card glass">
                        <BarChart3 className="info-icon" />
                        <h3>Financial Reports</h3>
                        <p>Our quarterly earnings and annual reports provide transparency into our sustainable business model.</p>
                    </div>
                    <div className="info-card glass">
                        <Award className="info-icon" />
                        <h3>Governance</h3>
                        <p>We maintain the highest standards of corporate governance and ethical business practices.</p>
                    </div>
                    <div className="info-card glass">
                        <Globe className="info-icon" />
                        <h3>Global Impact</h3>
                        <p>Investing in diverse content that resonates with audiences across 190+ countries.</p>
                    </div>
                </div>

                <div className="contact-footer glass text-center">
                    <h3>Investor Contact</h3>
                    <p>For inquiries, please reach out to: <strong>investors@vauraplay.com</strong></p>
                </div>
            </motion.div>

            <style>{`
                .legal-page { padding-top: 150px; padding-bottom: 80px; min-height: 100vh; }
                .legal-header { margin-bottom: 4rem; }
                .icon-badge { color: var(--primary); margin-bottom: 1.5rem; }
                .icon-badge svg { margin: 0 auto; }
                
                .info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-bottom: 4rem; }
                .info-card { padding: 2.5rem; border-radius: var(--radius-md); transition: 0.3s; }
                .info-card:hover { transform: translateY(-5px); border-color: var(--primary); }
                .info-icon { color: var(--primary); margin-bottom: 1.5rem; }
                .info-card h3 { margin-bottom: 1rem; color: white; }
                
                .contact-footer { padding: 3rem; border-radius: var(--radius-lg); max-width: 700px; margin: 0 auto; }
                
                @media (max-width: 768px) {
                    .info-grid { grid-template-columns: 1fr; }
                    .legal-page { padding-top: 100px; }
                }
            `}</style>
        </div>
    );
};

export default InvestorRelations;
