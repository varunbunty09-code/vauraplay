import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Shield, Zap, Palette, ArrowRight, Star, X, Plus, ChevronRight, Monitor, Download, Users, Tv } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import tmdbService from '../services/tmdbService';

const Landing = () => {
  const [showDemo, setShowDemo] = useState(false);
  const [trending, setTrending] = useState([]);
  const [activeFaq, setActiveFaq] = useState(null);
  const location = useLocation();
  const trendingRef = useRef(null);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const data = await tmdbService.getTrending('movie', 'week');
        setTrending(Array.isArray(data) ? data.slice(0, 10) : []);
      } catch (err) {
        console.error('Failed to fetch trending for landing');
      }
    };
    fetchTrending();
  }, []);

  const scrollTrending = (dir) => {
    if (trendingRef.current) {
      const { scrollLeft, clientWidth } = trendingRef.current;
      const scrollTo = dir === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      trendingRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const faqs = [
    { q: "What is VauraPlay?", a: "VauraPlay is the ultimate streaming companion that brings together over 75,000+ movies and TV shows from around the globe into one seamless, high-performance interface." },
    { q: "How much does VauraPlay cost?", a: "VauraPlay offers various flexible plans tailored to your needs. You can start with our basic tier for free or upgrade to premium for 4K streaming and offline downloads." },
    { q: "Where can I watch?", a: "Watch anywhere, anytime. VauraPlay is available on your smartphone, tablet, laptop, and smart TV. Stream unlimited content on as many devices as you want." },
    { q: "How do I cancel?", a: "VauraPlay is flexible. There are no pesky contracts and no commitments. You can easily cancel your account online in two clicks. There are no cancellation fees – start or stop your account anytime." },
    { q: "What can I watch on VauraPlay?", a: "VauraPlay has an extensive library of feature films, documentaries, TV shows, anime, award-winning originals, and more. Watch as much as you want, anytime you want." },
    { q: "Is VauraPlay good for kids?", a: "The VauraPlay Kids experience is included in your membership to give parents control while kids enjoy family-friendly TV shows and movies in their own space." }
  ];

  return (
    <div className="landing-page">
      <Helmet>
        <title>VauraPlay | The Ultimate Movie Streaming Experience</title>
        <meta name="description" content="Start your own movie site with VauraPlay's endless content and premium video player." />
      </Helmet>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="badge glass">✨ Now powered by Vidking Player</span>
            <h1 className="hero-title">Experience <span>Cinematics</span> Like Never Before</h1>
            <p className="hero-subtitle">
              The world's most advanced streaming platform. Over 75,000+ movies and TV shows
              integrated with our proprietary AI-powered recommendation engine.
            </p>
            <div className="hero-btns">
              <Link to="/signup" state={{ from: location.state?.from }} className="btn-primary">Get Started Free <ArrowRight size={18} /></Link>
              <button onClick={() => setShowDemo(true)} className="btn-outline">Watch Demo</button>
              <Link to="/login" className="btn-outline">Sign In</Link>
            </div>

            <div className="hero-stats">
              <div className="stat-item">
                <h3>50K+</h3>
                <p>Movies</p>
              </div>
              <div className="stat-item">
                <h3>25K+</h3>
                <p>TV Shows</p>
              </div>
              <div className="stat-item">
                <h3>99.9%</h3>
                <p>Uptime</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trending Now Carousel */}
      <section className="trending-section">
        <div className="container">
          <div className="section-header-v2">
            <h2>Trending Now</h2>
          </div>
          <div className="trending-wrapper">
            <button className="trending-arrow left" onClick={() => scrollTrending('left')}><ChevronRight style={{ transform: 'rotate(180deg)' }} /></button>
            <div className="trending-scroll" ref={trendingRef}>
              {trending.map((item, index) => (
                <div key={item.id} className="trending-item">
                  <div className="rank-number">{index + 1}</div>
                  <div className="trending-card">
                    <img src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} alt={item.title} />
                  </div>
                </div>
              ))}
            </div>
            <button className="trending-arrow right" onClick={() => scrollTrending('right')}><ChevronRight /></button>
          </div>
        </div>
      </section>

      {/* More Reasons to Join */}
      <section className="reasons-section">
        <div className="container">
          <div className="section-header-v2">
            <h2>More reasons to join</h2>
          </div>
          <div className="reasons-grid">
            {[
              { icon: <Tv size={40} />, title: "Enjoy on your TV", desc: "Watch on smart TVs, PlayStation, Xbox, Chromecast, Apple TV, Blu-ray players and more." },
              { icon: <Download size={40} />, title: "Download to watch offline", desc: "Save your favourites easily and always have something to watch." },
              { icon: <Monitor size={40} />, title: "Watch everywhere", desc: "Stream unlimited movies and TV shows on your phone, tablet, laptop, and TV." },
              { icon: <Users size={40} />, title: "Create profiles for kids", desc: "Send kids on adventures with their favourite characters in a space made just for them." }
            ].map((reason, i) => (
              <div key={i} className="reason-card glass">
                <h3>{reason.title}</h3>
                <p>{reason.desc}</p>
                <div className="reason-icon">{reason.icon}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <div className="section-header-v2">
            <h2>Frequently Asked Questions</h2>
          </div>
          <div className="faq-list">
            {faqs.map((faq, i) => (
              <div key={i} className={`faq-item ${activeFaq === i ? 'active' : ''}`} onClick={() => setActiveFaq(activeFaq === i ? null : i)}>
                <div className="faq-question">
                  <h3>{faq.q}</h3>
                  <div className="faq-toggle">
                    <Plus size={32} className={activeFaq === i ? 'rotate' : ''} />
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

          <div className="faq-cta">
            <p>Ready to experience cinematics? Enter your email to join VauraPlay today.</p>
            <div className="cta-form">
              <input type="email" placeholder="Email address" />
              <Link to="/signup" className="btn-primary-large">Get Started Free <ChevronRight /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Modal */}
      <AnimatePresence>
        {showDemo && (
          <motion.div
            className="demo-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDemo(false)}
          >
            <motion.div
              className="demo-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <button className="close-demo" onClick={() => setShowDemo(false)}><X size={24} /></button>
              <div className="video-container">
                <iframe
                  src="https://www.youtube.com/embed/PjGkVCAo8Fw?autoplay=1"
                  title="VauraPlay Demo"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="demo-info">
                <div className="demo-text-v2">
                  <h3>VauraPlay Platform Showcase</h3>
                  <p>Discover how VauraPlay empowers creators to build the next generation of streaming websites.</p>
                </div>
                <Link to="/signup" state={{ from: location.state?.from }} className="btn-primary" onClick={() => setShowDemo(false)}>Join Now</Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`
        .landing-page { padding-top: 0; position: relative; background: #000; color: #fff; overflow-x: hidden; }
        
        .hero {
          height: 100vh; width: 100%; display: flex; align-items: center; position: relative;
          background: url('https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop') center/cover;
          overflow: hidden;
        }
        
        .hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to right, rgba(0,0,0, 0.9) 10%, rgba(0,0,0, 0.3) 50%, rgba(0,0,0, 0.8) 100%),
                      linear-gradient(to top, rgba(0,0,0, 1), transparent);
        }
        
        .hero-content { position: relative; z-index: 10; max-width: 850px; margin-left: 8%; }
        .badge { display: inline-block; padding: 0.6rem 1.4rem; border-radius: 30px; color: var(--primary); font-weight: 700; font-size: 0.9rem; margin-bottom: 2rem; border: 1px solid rgba(13, 202, 240, 0.3); }
        .hero-title { font-size: 4.5rem; line-height: 1.1; margin-bottom: 2rem; font-weight: 900; letter-spacing: -2px; }
        .hero-title span { background: linear-gradient(to right, #0dcaf0, #6366f1); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .hero-subtitle { font-size: 1.4rem; margin-bottom: 3rem; color: #ccc; max-width: 650px; line-height: 1.5; }
        .hero-btns { display: flex; gap: 1.5rem; }
        .hero-stats { display: flex; gap: 5rem; margin-top: 5rem; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 3rem; }
        .stat-item h3 { font-size: 2.5rem; font-weight: 800; margin-bottom: 0.5rem; }
        .stat-item p { color: #888; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 2px; }

        .section-header-v2 { margin-bottom: 2rem; }
        .section-header-v2 h2 { font-size: 2.5rem; font-weight: 800; }

        .trending-section { padding: 4rem 0; overflow: hidden; }
        .trending-wrapper { position: relative; margin-top: 1rem; }
        .trending-scroll {
          display: flex; gap: 2.5rem; overflow-x: auto; scroll-behavior: smooth;
          padding: 2rem 0; scrollbar-width: none;
        }
        .trending-scroll::-webkit-scrollbar { display: none; }
        .trending-item { 
          flex: 0 0 auto; display: flex; align-items: center; position: relative;
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .trending-item:hover { transform: scale(1.08) translateX(20px); z-index: 10; }
        .rank-number {
          font-size: 14rem; font-weight: 900; line-height: 1; margin-right: -4rem;
          -webkit-text-stroke: 4px #555; color: #000; z-index: 0;
          font-family: 'Outfit', sans-serif; opacity: 0.8;
        }
        .trending-card {
          width: 180px; height: 260px; border-radius: 12px; overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5); z-index: 1; border: 1px solid rgba(255,255,255,0.1);
        }
        .trending-card img { width: 100%; height: 100%; object-fit: cover; }
        .trending-arrow {
          position: absolute; top: 50%; transform: translateY(-50%); z-index: 20;
          background: rgba(0,0,0,0.6); border: none; color: white; width: 50px; height: 50px;
          border-radius: 50%; display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: 0.3s; backdrop-filter: blur(5px);
        }
        .trending-arrow:hover { background: var(--primary); color: black; }
        .left { left: -25px; } .right { right: -25px; }

        .reasons-section { padding: 6rem 0; }
        .reasons-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem; }
        .reason-card {
          padding: 2.5rem; border-radius: 16px; position: relative; height: 320px;
          display: flex; flex-direction: column; background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%);
          border: 1px solid rgba(255,255,255,0.08); overflow: hidden;
        }
        .reason-card h3 { font-size: 1.8rem; margin-bottom: 1rem; z-index: 1; }
        .reason-card p { color: #aaa; line-height: 1.6; z-index: 1; }
        .reason-icon { position: absolute; bottom: 1.5rem; right: 1.5rem; color: var(--primary); opacity: 0.8; }

        .faq-section { padding: 6rem 0 10rem; }
        .faq-list { max-width: 1000px; margin: 2rem auto; display: flex; flex-direction: column; gap: 0.6rem; }
        .faq-item { background: #2d2d2d; transition: 0.3s; cursor: pointer; }
        .faq-item:hover { background: #414141; }
        .faq-question { padding: 1.5rem 2rem; display: flex; justify-content: space-between; align-items: center; }
        .faq-question h3 { font-size: 1.6rem; font-weight: 500; }
        .faq-toggle { transition: 0.3s; }
        .faq-toggle .rotate { transform: rotate(45deg); }
        .faq-answer { overflow: hidden; padding: 0 2rem 2rem; font-size: 1.4rem; line-height: 1.5; color: white; border-top: 1px solid #000; padding-top: 2rem; }

        .faq-cta { text-align: center; margin-top: 5rem; }
        .faq-cta p { font-size: 1.1rem; margin-bottom: 1.5rem; color: var(--text-dim); }
        .cta-form { display: flex; gap: 0.5rem; justify-content: center; max-width: 600px; margin: 0 auto; }
        .cta-form input { flex: 1; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.2); padding: 1.2rem; border-radius: 4px; color: white; font-size: 1rem; outline: none; }
        .btn-primary-large { background: var(--primary); color: black; padding: 0 1.8rem; border-radius: 4px; display: flex; align-items: center; gap: 0.5rem; font-size: 1.2rem; font-weight: 700; text-decoration: none; transition: 0.2s; }
        .btn-primary-large:hover { background: #0bb5d8; transform: translateY(-2px); }

        .demo-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.9); backdrop-filter: blur(15px); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 2rem; }
        .demo-modal { background: #141414; width: 100%; max-width: 1000px; border-radius: 12px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); }
        .demo-info { padding: 3rem; display: flex; justify-content: space-between; align-items: center; gap: 3rem; }
        .demo-text-v2 h3 { font-size: 2rem; margin-bottom: 0.8rem; }
        .demo-text-v2 p { color: #aaa; }

        @media (max-width: 1100px) {
          .hero-title { font-size: 3.5rem; }
          .rank-number { font-size: 10rem; margin-right: -3rem; }
          .trending-card { width: 140px; height: 210px; }
        }

        @media (max-width: 768px) {
          .hero-content { margin-left: 0; padding: 0 1.5rem; text-align: center; }
          .hero-title { font-size: 2.8rem; }
          .hero-btns { justify-content: center; }
          .hero-stats { gap: 2rem; justify-content: center; }
          .rank-number { font-size: 8rem; margin-right: -2rem; }
          .trending-card { width: 110px; height: 165px; }
          .cta-form { flex-direction: column; padding: 0 1.5rem; }
          .btn-primary-large { padding: 1.2rem; justify-content: center; font-size: 1.2rem; }
          .faq-question h3 { font-size: 1.2rem; }
          .faq-answer { font-size: 1.1rem; }
          .demo-info { flex-direction: column; text-align: center; padding: 2rem; }
        }
      `}</style>
    </div>
  );
};

export default Landing;