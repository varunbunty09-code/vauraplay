import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home as HomeIcon, Ghost } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="not-found-page flex-center" style={{ height: '80vh', flexDirection: 'column', textAlign: 'center' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Ghost size={80} color="var(--primary)" style={{ marginBottom: '2rem' }} />
        <h1 style={{ fontSize: '6rem', lineHeight: '1' }}>404</h1>
        <h2 style={{ marginBottom: '1rem' }}>Lost in Space?</h2>
        <p style={{ color: 'var(--text-dim)', marginBottom: '2.5rem' }}>
          The movie or page you're looking for doesn't exist or has been moved to another dimension.
        </p>
        <Link to="/" className="btn-primary">
          <HomeIcon size={18} /> Return Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
