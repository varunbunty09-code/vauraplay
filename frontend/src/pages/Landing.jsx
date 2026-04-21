import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Plus, X, Globe, Tv, Download, Monitor, Smile, Phone } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import Logo from '../components/Logo';

const Landing = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [activeFaq, setActiveFaq] = useState(null);

  const handleStart = (e) => {
    e.preventDefault();
    navigate('/signup', { state: { email } });
  };

  const trendingMovies = [
    { id: 1, img: 'https://image.tmdb.org/t/p/w500/8cdWjvZQUmOZabaB9L7OD71MW3u.jpg', title: 'The Chosen' },
    { id: 2, img: 'https://image.tmdb.org/t/p/w500/6v9idp89E0m9p6qr9j8p9E0m9p.jpg', title: 'Stranger Things' },
    { id: 3, img: 'https://image.tmdb.org/t/p/w500/1X7vHST0R3vdAnm0pndmOcPt1v.jpg', title: 'Squid Game' },
    { id: 4, img: 'https://image.tmdb.org/t/p/w500/2L9vHST0R3vdAnm0pndmOcPt2v.jpg', title: 'The Crown' },
    { id: 5, img: 'https://image.tmdb.org/t/p/w500/3M9vHST0R3vdAnm0pndmOcPt3v.jpg', title: 'Money Heist' },
    { id: 6, img: 'https://image.tmdb.org/t/p/w500/4N9vHST0R3vdAnm0pndmOcPt4v.jpg', title: 'Dark' },
  ];

  const faqs = [
    { q: "What is VauraPlay?", a: "VauraPlay is a streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries and more – on thousands of internet-connected devices. You can watch as much as you want, whenever you want, without a single ad – all for one low monthly price." },
    { q: "How much does VauraPlay cost?", a: "Watch VauraPlay on your smartphone, tablet, Smart TV, laptop, or streaming device, all for one fixed monthly fee. Plans range from ₹149 to ₹649 a month. No extra costs, no contracts." },
    { q: "Where can I watch?", a: "Watch anywhere, anytime. Sign in with your VauraPlay account to watch instantly on the web at vauraplay.com from your personal computer or on any internet-connected device that offers the VauraPlay app." },
    { q: "How do I cancel?", a: "VauraPlay is flexible. There are no annoying contracts and no commitments. You can easily cancel your account online in two clicks. There are no cancellation fees – start or stop your account anytime." },
    { q: "What can I watch on VauraPlay?", a: "VauraPlay has an extensive library of feature films, documentaries, TV shows, anime, award-winning originals, and more. Watch as much as you want, anytime you want." },
    { q: "Is VauraPlay good for kids?", a: "The VauraPlay Kids experience is included in your membership to give parents control while kids enjoy family-friendly TV shows and films in their own space. Kids profiles come with PIN-protected parental controls." }
  ];

  return (
    <div className="landing-page">
      <Helmet>
        <title>VauraPlay | Watch TV Shows Online, Watch Movies Online</title>
      </Helmet>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-backdrop">
          <img src="https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop" alt="Backdrop" />
          <div className="hero-vignette"></div>
        </div>

        <nav className="landing-nav container">
          <Logo to="/" />
          <div className="nav-actions">
            <div className="lang-select">
              <Globe size={16} />
              <select><option>English</option><option>Hindi</option></select>
            </div>
            <Link to="/login" className="btn-signin">Sign In</Link>
          </div>
        </nav>

        <div className="hero-content container">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            Unlimited movies, TV shows and more
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            Watch anywhere. Cancel anytime.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="cta-form">
            <h3>Ready to watch? Enter your email to create or restart your membership.</h3>
            <form onSubmit={handleStart}>
              <div className="input-group">
                <input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} required />
                <button type="submit">Get Started <ChevronRight size={24} /></button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Trending Now */}
      <section className="trending-section container">
        <h2>Trending Now</h2>
        <div className="trending-grid">
          {trendingMovies.map((m, i) => (
            <div key={m.id} className="trending-card">
              <span className="rank-number">{i + 1}</span>
              <img src={m.img} alt={m.title} />
            </div>
          ))}
        </div>
      </section>

      {/* More reasons to join */}
      <section className="reasons-section container">
        <h2>More reasons to join</h2>
        <div className="reasons-grid">
          {[
            { icon: <Tv size={32} />, title: 'Enjoy on your TV', desc: 'Watch on smart TVs, PlayStation, Xbox, Chromecast, Apple TV, Blu-ray players and more.' },
            { icon: <Download size={32} />, title: 'Download your shows to watch offline', desc: 'Save your favourites easily and always have something to watch.' },
            { icon: <Monitor size={32} />, title: 'Watch everywhere', desc: 'Stream unlimited movies and TV shows on your phone, tablet, laptop, and TV.' },
            { icon: <Smile size={32} />, title: 'Create profiles for kids', desc: 'Send kids on adventures with their favourite characters in a space made just for them.' }
          ].map((r, i) => (
            <div key={i} className="reason-card">
              <h3>{r.title}</h3>
              <p>{r.desc}</p>
              <div className="reason-icon-wrap">{r.icon}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="faq-section container">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-list">
          {faqs.map((faq, i) => (
            <div key={i} className="faq-item">
              <button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>
                {faq.q}
                {activeFaq === i ? <X size={32} /> : <Plus size={32} />}
              </button>
              <AnimatePresence>
                {activeFaq === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="faq-answer">
                    <p>{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="cta-form bottom-cta">
          <h3>Ready to watch? Enter your email to create or restart your membership.</h3>
          <form onSubmit={handleStart}>
            <div className="input-group">
              <input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} required />
              <button type="submit">Get Started <ChevronRight size={24} /></button>
            </div>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer container">
        <p className="footer-top">Questions? Call <a href="tel:000-800-919-1743">000-800-919-1743</a></p>
        <div className="footer-links">
          <ul>
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Investor Relations</a></li>
            <li><a href="#">Privacy</a></li>
            <li><a href="#">Speed Test</a></li>
          </ul>
          <ul>
            <li><a href="#">Help Centre</a></li>
            <li><a href="#">Jobs</a></li>
            <li><a href="#">Cookie Preferences</a></li>
            <li><a href="#">Legal Notices</a></li>
          </ul>
          <ul>
            <li><a href="#">Account</a></li>
            <li><a href="#">Ways to Watch</a></li>
            <li><a href="#">Corporate Information</a></li>
            <li><a href="#">Only on VauraPlay</a></li>
          </ul>
          <ul>
            <li><a href="#">Media Centre</a></li>
            <li><a href="#">Terms of Use</a></li>
            <li><a href="#">Contact Us</a></li>
          </ul>
        </div>
        <div className="lang-select footer-lang">
          <Globe size={16} />
          <select><option>English</option><option>Hindi</option></select>
        </div>
        <p className="footer-brand">VauraPlay India</p>
      </footer>

      <style>{`
        .landing-page { background: #000; color: #fff; min-height: 100vh; font-family: 'Inter', sans-serif; }
        .hero { height: 75vh; position: relative; display: flex; flex-direction: column; border-bottom: 8px solid #232323; }
        .hero-backdrop { position: absolute; inset: 0; z-index: 0; }
        .hero-backdrop img { width: 100%; height: 100%; object-fit: cover; opacity: 0.6; }
        .hero-vignette { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.8) 0, rgba(0,0,0,0) 60%, rgba(0,0,0,0.8) 100%), radial-gradient(circle at center, rgba(0,0,0,0) 0, rgba(0,0,0,0.5) 100%); }
        
        .landing-nav { display: flex; justify-content: space-between; align-items: center; padding-top: 1.5rem; position: relative; z-index: 10; }
        .nav-actions { display: flex; gap: 1rem; align-items: center; }
        .lang-select { display: flex; align-items: center; gap: 0.5rem; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.3); padding: 0.3rem 0.8rem; border-radius: 4px; }
        .lang-select select { background: transparent; border: none; color: #fff; font-size: 0.9rem; font-weight: 500; }
        .btn-signin { background: #e50914; color: #fff; padding: 0.3rem 1rem; border-radius: 4px; font-weight: 600; text-decoration: none; font-size: 0.9rem; }

        .hero-content { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; position: relative; z-index: 10; }
        .hero-content h1 { font-size: 3.5rem; font-weight: 900; margin-bottom: 1rem; max-width: 800px; }
        .hero-content p { font-size: 1.5rem; font-weight: 500; margin-bottom: 2rem; }
        
        .cta-form { width: 100%; max-width: 1000px; }
        .cta-form h3 { font-size: 1.25rem; font-weight: 400; margin-bottom: 1rem; }
        .input-group { display: flex; gap: 0.5rem; height: 3.5rem; }
        .input-group input { flex: 1; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.3); padding: 0 1rem; color: #fff; font-size: 1rem; border-radius: 4px; backdrop-filter: blur(5px); }
        .input-group button { background: #e50914; color: #fff; border: none; padding: 0 2rem; border-radius: 4px; font-size: 1.5rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; transition: 0.2s; }
        .input-group button:hover { background: #f40612; }

        .trending-section { padding: 4rem 0; }
        .trending-section h2 { margin-bottom: 1.5rem; font-size: 1.5rem; }
        .trending-grid { display: flex; gap: 2rem; overflow-x: auto; padding-bottom: 1rem; scrollbar-width: none; }
        .trending-grid::-webkit-scrollbar { display: none; }
        .trending-card { position: relative; min-width: 180px; height: 250px; }
        .trending-card img { width: 100%; height: 100%; object-fit: cover; border-radius: 8px; }
        .rank-number { position: absolute; left: -20px; bottom: -20px; font-size: 8rem; font-weight: 900; color: #000; -webkit-text-stroke: 1.5px rgba(255,255,255,0.6); z-index: 1; }

        .reasons-section { padding: 4rem 0; }
        .reasons-section h2 { margin-bottom: 1.5rem; font-size: 1.5rem; }
        .reasons-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; }
        .reason-card { background: linear-gradient(135deg, #131313 0%, #1a1a1a 100%); padding: 2rem; border-radius: 12px; position: relative; min-height: 250px; display: flex; flex-direction: column; }
        .reason-card h3 { font-size: 1.5rem; margin-bottom: 1rem; }
        .reason-card p { color: rgba(255,255,255,0.7); font-size: 1rem; line-height: 1.5; }
        .reason-icon-wrap { position: absolute; right: 1.5rem; bottom: 1.5rem; color: #e50914; opacity: 0.8; }

        .faq-section { padding: 4rem 0; border-top: 8px solid #232323; }
        .faq-section h2 { text-align: center; margin-bottom: 2rem; font-size: 2.5rem; font-weight: 900; }
        .faq-list { max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; gap: 0.5rem; }
        .faq-item { background: #2d2d2d; transition: 0.2s; }
        .faq-item:hover { background: #414141; }
        .faq-question { width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 1.5rem; background: none; border: none; color: #fff; font-size: 1.5rem; font-weight: 500; cursor: pointer; text-align: left; }
        .faq-answer { padding: 0 1.5rem 1.5rem; border-top: 1px solid #000; font-size: 1.5rem; line-height: 1.4; color: #fff; }
        
        .bottom-cta { margin: 4rem auto 0; text-align: center; }

        .landing-footer { padding: 4rem 0; color: rgba(255,255,255,0.7); }
        .footer-top { margin-bottom: 2rem; font-size: 1rem; }
        .footer-top a { color: inherit; text-decoration: underline; }
        .footer-links { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2rem; margin-bottom: 2.5rem; }
        .footer-links ul { list-style: none; }
        .footer-links li { margin-bottom: 1rem; }
        .footer-links a { color: inherit; font-size: 0.9rem; text-decoration: underline; }
        .footer-lang { width: fit-content; margin-bottom: 1.5rem; }
        .footer-brand { font-size: 0.85rem; }

        @media (max-width: 768px) {
          .hero-content h1 { font-size: 2rem; }
          .hero-content p { font-size: 1.1rem; }
          .input-group { flex-direction: column; height: auto; gap: 1rem; }
          .input-group button { padding: 0.8rem; font-size: 1.1rem; justify-content: center; }
          .footer-links { grid-template-columns: repeat(2, 1fr); }
          .rank-number { font-size: 5rem; left: -10px; bottom: -10px; }
          .faq-question, .faq-answer { font-size: 1.1rem; }
        }
      `}</style>
    </div>
  );
};

export default Landing;
