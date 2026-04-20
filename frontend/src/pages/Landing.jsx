import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Shield, Zap, Palette, ArrowRight, Star } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const Landing = () => {
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
              <Link to="/signup" className="btn-primary">Get Started Free <ArrowRight size={18} /></Link>
              <Link to="/login" className="btn-outline">Watch Demo</Link>
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

      {/* Features Grid */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="gradient-text">Why Choose VauraPlay?</h2>
            <p>Our infrastructure powers thousands of websites with reliable, fast video playback.</p>
          </div>

          <div className="features-grid">
            {[
              { icon: <Palette size={32} />, title: 'Customizable', desc: 'Colors, features, and UI elements - all configurable to match your brand.' },
              { icon: <Zap size={32} />, title: 'Lightning Fast', desc: 'Optimized for performance with modern HLS streaming technology.' },
              { icon: <Shield size={32} />, title: 'Secure & Reliable', desc: 'Enterprise-grade security with OTP verification and protected routes.' },
              { icon: <Star size={32} />, title: 'Premium UI', desc: 'Award-winning design centered around user engagement and retention.' }
            ].map((f, i) => (
              <motion.div 
                key={i} 
                className="feature-card glass glow-on-hover"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Promo Section */}
      <section className="promo-section">
        <div className="container">
          <div className="promo-card glass">
            <div className="promo-text">
              <h2>Ready to dive in?</h2>
              <p>Join thousands of users who have already upgraded their streaming experience.</p>
            </div>
            <Link to="/signup" className="btn-primary">Create Your Account <ArrowRight size={18} /></Link>
          </div>
        </div>
      </section>

      <style>{`
        .landing-page {
          padding-top: 0;
        }
        
        .hero {
          height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          position: relative;
          background: url('https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop') center/cover;
          overflow: hidden;
        }
        
        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to right, rgba(10,10,12, 1) 20%, rgba(10,10,12, 0.4) 60%, rgba(10,10,12, 0.8) 100%),
                      linear-gradient(to top, rgba(10,10,12, 1), transparent);
        }
        
        .hero-content {
          position: relative;
          z-index: 10;
          max-width: 800px;
          margin-left: 10%;
        }
        
        .badge {
          display: inline-block;
          padding: 0.5rem 1.2rem;
          border-radius: 30px;
          color: var(--primary);
          font-weight: 600;
          font-size: 0.85rem;
          margin-bottom: 2rem;
        }
        
        .hero-title {
          margin-bottom: 1.5rem;
        }
        
        .hero-title span {
          color: var(--primary);
        }
        
        .hero-subtitle {
          font-size: 1.2rem;
          margin-bottom: 2.5rem;
          color: var(--text-dim);
          max-width: 600px;
        }
        
        .hero-btns {
          display: flex;
          gap: 1rem;
          margin-bottom: 4rem;
        }
        
        .hero-stats {
          display: flex;
          gap: 4rem;
        }
        
        .stat-item h3 {
          font-size: 2rem;
          color: white;
          margin-bottom: 0.3rem;
        }
        
        .stat-item p {
          color: var(--text-muted);
          text-transform: uppercase;
          font-size: 0.8rem;
          letter-spacing: 1px;
        }
        
        .features-section {
          padding: 100px 0;
        }
        
        .section-header {
          text-align: center;
          margin-bottom: 60px;
        }
        
        .section-header h2 {
          margin-bottom: 1rem;
        }
        
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
        }
        
        .feature-card {
          padding: 3rem 2rem;
          border-radius: var(--radius-lg);
          text-align: center;
        }
        
        .feature-icon {
          color: var(--primary);
          margin-bottom: 1.5rem;
          display: flex;
          justify-content: center;
        }
        
        .promo-section {
          padding-bottom: 100px;
        }
        
        .promo-card {
          padding: 4rem;
          border-radius: var(--radius-lg);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 2rem;
          background: linear-gradient(135deg, rgba(13, 202, 240, 0.1), rgba(99, 102, 241, 0.1));
        }
        
        .promo-text h2 {
          font-size: 3rem;
          margin-bottom: 0.5rem;
        }

        @media (max-width: 768px) {
          .hero-content { margin-left: 0; padding: 0 1.5rem; }
          .hero-title { font-size: 2.5rem; }
          .hero-stats { gap: 2rem; }
          .hero-btns { flex-direction: column; }
          .promo-card { flex-direction: column; text-align: center; padding: 2rem; }
          .promo-text h2 { font-size: 2rem; }
        }
      `}</style>
    </div>
  );
};

export default Landing;
