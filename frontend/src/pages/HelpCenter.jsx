import React, { useState } from 'react';
import { Mail, MessageCircle, HelpCircle, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HelpCenter = () => {
    const [activeFaq, setActiveFaq] = useState(null);

    const faqs = [
        { q: "What is VauraPlay?", a: "VauraPlay is the ultimate streaming companion that brings together over 75,000+ movies and TV shows from around the globe into one seamless, high-performance interface." },
        { q: "How much does VauraPlay cost?", a: "VauraPlay offers various flexible plans tailored to your needs. You can start with our basic tier for free or upgrade to premium for 4K streaming and offline downloads." },
        { q: "Where can I watch?", a: "Watch anywhere, anytime. VauraPlay is available on your smartphone, tablet, laptop, and smart TV. Stream unlimited content on as many devices as you want." },
        { q: "How do I cancel?", a: "VauraPlay is flexible. There are no pesky contracts and no commitments. You can easily cancel your account online in two clicks. There are no cancellation fees – start or stop your account anytime." },
        { q: "What can I watch on VauraPlay?", a: "VauraPlay has an extensive library of feature films, documentaries, TV shows, anime, award-winning originals, and more. Watch as much as you want, anytime you want." },
        { q: "Is VauraPlay good for kids?", a: "The VauraPlay Kids experience is included in your membership to give parents control while kids enjoy family-friendly TV shows and movies in their own space." },
        { q: "How do I start streaming?", a: "Simply sign up for an account, verify your email with the OTP code, and click on any movie or TV show to start watching instantly." },
        { q: "How do I add movies to My List?", a: "On any movie or TV show detail page, click the '+' icon to save it to your personal watchlist." }
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
                    <div className="faq-list">
                        {faqs.map((faq, i) => (
                            <div key={i} className={`faq-item glass ${activeFaq === i ? 'active' : ''}`} onClick={() => setActiveFaq(activeFaq === i ? null : i)}>
                                <div className="faq-question">
                                    <h3>{faq.q}</h3>
                                    <div className="faq-toggle">
                                        <Plus size={24} className={activeFaq === i ? 'rotate' : ''} />
                                    </div>
                                </div>
                                <AnimatePresence>
                                    {activeFaq === i && (
                                        <motion.div
                                            className="faq-answer"
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                        >
                                            <p>{faq.a}</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
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
                .legal-page { padding-top: 150px; padding-bottom: 80px; min-height: 100vh; }
                .legal-header { margin-bottom: 5rem; }
                .icon-badge { color: var(--primary); margin-bottom: 1.5rem; }
                .icon-badge svg { margin: 0 auto; }
                
                .faq-section h2 { margin-bottom: 2.5rem; text-align: center; font-size: 2rem; }
                .faq-list { max-width: 900px; margin: 0 auto 5rem; display: flex; flex-direction: column; gap: 1rem; }
                .faq-item { border-radius: var(--radius-md); transition: 0.3s; cursor: pointer; border: 1px solid rgba(255,255,255,0.05); }
                .faq-item:hover { background: rgba(255,255,255,0.05); }
                .faq-item.active { border-color: var(--primary); }
                
                .faq-question { padding: 1.5rem 2rem; display: flex; justify-content: space-between; align-items: center; }
                .faq-question h3 { font-size: 1.3rem; font-weight: 500; color: white; }
                .faq-toggle { transition: 0.3s; color: var(--text-dim); }
                .faq-toggle .rotate { transform: rotate(45deg); color: var(--primary); }
                
                .faq-answer { overflow: hidden; padding: 0 2rem 2rem; }
                .faq-answer p { color: var(--text-dim); line-height: 1.6; font-size: 1.1rem; }
                
                .contact-card { padding: 4rem; border-radius: var(--radius-lg); max-width: 900px; margin: 0 auto; }
                .contact-btns { display: flex; gap: 1.5rem; justify-content: center; margin-top: 2rem; }
                
                @media (max-width: 768px) {
                    .faq-list { padding: 0 1rem; }
                    .faq-question h3 { font-size: 1.1rem; }
                    .contact-btns { flex-direction: column; }
                    .contact-card { padding: 2rem; }
                }
            `}</style>
        </div>
    );
};

export default HelpCenter;
