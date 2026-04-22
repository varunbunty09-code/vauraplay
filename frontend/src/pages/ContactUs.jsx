import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, MessageSquare, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const ContactUs = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        toast.success("Message sent! We'll get back to you soon.", {
            icon: '🚀'
        });
        e.target.reset();
    };

    return (
        <div className="legal-page container">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="legal-content"
            >
                <header className="legal-header text-center">
                    <div className="icon-badge"><MessageSquare size={40} /></div>
                    <h1>Get in Touch</h1>
                    <p>Have questions or feedback? We'd love to hear from you.</p>
                </header>

                <div className="contact-grid">
                    <div className="contact-form-section glass">
                        <h2>Send us a Message</h2>
                        <form onSubmit={handleSubmit} className="premium-form">
                            <div className="form-row">
                                <div className="input-group">
                                    <label>Full Name</label>
                                    <input type="text" placeholder="John Doe" required />
                                </div>
                                <div className="input-group">
                                    <label>Email Address</label>
                                    <input type="email" placeholder="john@example.com" required />
                                </div>
                            </div>
                            <div className="input-group">
                                <label>Subject</label>
                                <input type="text" placeholder="How can we help?" required />
                            </div>
                            <div className="input-group">
                                <label>Message</label>
                                <textarea rows="5" placeholder="Your message here..." required></textarea>
                            </div>
                            <button type="submit" className="submit-btn">Send Message <Send size={18} /></button>
                        </form>
                    </div>

                    <div className="contact-info-section">
                        <div className="info-card-small glass">
                            <Mail className="info-icon" />
                            <div>
                                <h4>Support Email</h4>
                                <p>auth.noreply.vauraplay@gmail.com</p>
                            </div>
                        </div>
                        <div className="info-card-small glass">
                            <Phone className="info-icon" />
                            <div>
                                <h4>Phone Support</h4>
                                <p>000-800-919-1743</p>
                            </div>
                        </div>
                        <div className="info-card-small glass">
                            <MapPin className="info-icon" />
                            <div>
                                <h4>Global HQ</h4>
                                <p>Silicon Valley, California, USA</p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            <style>{`
                .legal-page { padding-top: 150px; padding-bottom: 80px; min-height: 100vh; }
                .legal-header { margin-bottom: 5rem; }
                .icon-badge { color: var(--primary); margin-bottom: 1.5rem; }
                .icon-badge svg { margin: 0 auto; }
                
                .contact-grid { display: grid; grid-template-columns: 1fr 350px; gap: 3rem; }
                .contact-form-section { padding: 3rem; border-radius: var(--radius-lg); }
                .contact-form-section h2 { margin-bottom: 2rem; }
                
                .premium-form { display: flex; flex-direction: column; gap: 1.5rem; }
                .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
                .input-group { display: flex; flex-direction: column; gap: 0.6rem; }
                .input-group label { font-size: 0.9rem; color: var(--text-dim); }
                .input-group input, .input-group textarea { 
                    background: rgba(0,0,0,0.3); border: 1px solid var(--border-light);
                    padding: 1rem; border-radius: 8px; color: white; font-size: 1rem;
                    transition: 0.3s;
                }
                .input-group input:focus, .input-group textarea:focus { border-color: var(--primary); outline: none; }
                
                .submit-btn { 
                    background: var(--primary); color: black; border: none; padding: 1.2rem;
                    border-radius: 8px; font-weight: 700; font-size: 1.1rem; cursor: pointer;
                    display: flex; align-items: center; justify-content: center; gap: 0.8rem;
                    transition: 0.3s; margin-top: 1rem;
                }
                .submit-btn:hover { transform: translateY(-2px); filter: brightness(1.1); }
                
                .contact-info-section { display: flex; flex-direction: column; gap: 1.5rem; }
                .info-card-small { padding: 1.5rem; border-radius: var(--radius-md); display: flex; align-items: center; gap: 1.5rem; }
                .info-icon { color: var(--primary); }
                .info-card-small h4 { color: white; margin-bottom: 0.2rem; }
                .info-card-small p { color: var(--text-dim); font-size: 0.9rem; }
                
                @media (max-width: 992px) {
                    .contact-grid { grid-template-columns: 1fr; }
                    .contact-info-section { flex-direction: row; flex-wrap: wrap; }
                    .info-card-small { flex: 1; min-width: 250px; }
                }
                
                @media (max-width: 768px) {
                    .form-row { grid-template-columns: 1fr; }
                    .contact-form-section { padding: 2rem; }
                    .contact-info-section { flex-direction: column; }
                }
            `}</style>
        </div>
    );
};

export default ContactUs;
