import React from 'react';
import { Mail, MessageCircle, HelpCircle, Shield, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const HelpCenter = () => {
    const faqs = [
        { q: "How do I start streaming?", a: "Simply sign up for an account, verify your email with the OTP code, and click on any movie or TV show to start watching instantly." },
        { q: "Is VauraPlay free?", a: "Yes, VauraPlay provides a premium streaming experience powered by free-to-use metadata and streaming sources." },
        { q: "How do I add movies to My List?", a: "On any movie or TV show detail page, click the '+' icon to save it to your personal watchlist." },
        { q: "Can I watch on my mobile device?", a: "VauraPlay is fully responsive and works perfectly on smartphones, tablets, and desktops." }
    ];

    return (
        <div className="legal-page container">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="legal-content"
            >
                <header className="legal-header text-center">
                    <div className="icon-badge"><HelpCircle size={40} /></div>
                    <h1>Help Center</h1>
                    <p>Everything you need to know about navigating the VauraPlay ecosystem.</p>
                </header>

                <section className="faq-section">
                    <h2>Frequently Asked Questions</h2>
                    <div className="faq-grid">
                        {faqs.map((faq, i) => (
                            <div key={i} className="faq-item glass">
                                <h3>{faq.q}</h3>
                                <p>{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="contact-support text-center">
                    <div className="glass contact-card">
                        <h2>Still need help?</h2>
                        <p>Our support team is available 24/7 to assist you with any questions.</p>
                        <div className="contact-btns">
                            <a href="mailto:support@vauraplay.com" className="btn-primary"><Mail size={18} /> Email Us</a>
                            <button className="btn-outline"><MessageCircle size={18} /> Live Chat</button>
                        </div>
                    </div>
                </section>
            </motion.div>

            <style>{`
                .legal-page { padding-top: 150px; padding-bottom: 80px; }
                .legal-header { margin-bottom: 5rem; }
                .icon-badge { color: var(--primary); margin-bottom: 1.5rem; }
                .icon-badge svg { margin: 0 auto; }
                
                .faq-section h2 { margin-bottom: 2.5rem; text-align: center; }
                .faq-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 2rem; margin-bottom: 5rem; }
                .faq-item { padding: 2rem; border-radius: var(--radius-md); }
                .faq-item h3 { margin-bottom: 1rem; color: white; font-size: 1.2rem; }
                
                .contact-card { padding: 4rem; border-radius: var(--radius-lg); max-width: 800px; margin: 0 auto; }
                .contact-btns { display: flex; gap: 1.5rem; justify-content: center; margin-top: 2rem; }
                
                @media (max-width: 768px) {
                    .faq-grid { grid-template-columns: 1fr; }
                    .contact-btns { flex-direction: column; }
                }
            `}</style>
        </div>
    );
};

export default HelpCenter;
