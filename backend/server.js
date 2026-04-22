require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const tmdbRoutes = require('./routes/tmdbRoutes');
const watchlistRoutes = require('./routes/watchlistRoutes');
const progressRoutes = require('./routes/progressRoutes');
const adminRoutes = require('./routes/adminRoutes');
const reactionRoutes = require('./routes/reactionRoutes');

const app = express();

// Trust proxy - required for Render/Vercel/cloud deployments behind reverse proxies
// This ensures express-rate-limit correctly identifies users via X-Forwarded-For
app.set('trust proxy', 1);

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.FRONTEND_URL,
  ].filter(Boolean),
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  message: { message: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// Auth-specific stricter rate limit
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Too many auth attempts, please try again later.' },
});
app.use('/api/auth/', authLimiter);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tmdb', tmdbRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reactions', reactionRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'VauraPlay API' });
});

// API root - show API information
app.get('/api', (req, res) => {
  res.json({
    name: 'VauraPlay API',
    version: '1.0.0',
    status: 'running',
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      users: '/api/users',
      watchlist: '/api/watchlist',
      progress: '/api/progress',
      tmdb: '/api/tmdb',
      admin: '/api/admin',
      reactions: '/api/reactions',
    },
    documentation: 'All endpoints require authentication via Bearer token unless specified otherwise.',
  });
});

// Root route - branded landing
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>VauraPlay API</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          min-height: 100vh; display: flex; align-items: center; justify-content: center;
          background: #0a0a0c; color: #fff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .container { text-align: center; max-width: 500px; padding: 2rem; }
        .logo { font-size: 2.5rem; font-weight: 900; letter-spacing: 3px; margin-bottom: 0.5rem; }
        .logo span { color: #0dcaf0; }
        .badge { display: inline-block; background: rgba(13,202,240,0.15); color: #0dcaf0; padding: 0.3rem 1rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600; margin-bottom: 2rem; border: 1px solid rgba(13,202,240,0.3); }
        .status { display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-bottom: 2rem; }
        .dot { width: 10px; height: 10px; background: #22c55e; border-radius: 50%; animation: pulse 2s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        .status-text { color: #a1a1aa; font-size: 0.9rem; }
        .links { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
        .links a { color: #0dcaf0; text-decoration: none; padding: 0.6rem 1.2rem; border: 1px solid rgba(13,202,240,0.3); border-radius: 8px; font-size: 0.85rem; font-weight: 600; transition: 0.2s; }
        .links a:hover { background: rgba(13,202,240,0.1); }
        .footer { margin-top: 3rem; color: #52525b; font-size: 0.75rem; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo"><span>▶</span> VAURA<span>PLAY</span></div>
        <div class="badge">API Server v1.0.0</div>
        <div class="status">
          <div class="dot"></div>
          <span class="status-text">All systems operational</span>
        </div>
        <div class="links">
          <a href="/api">API Info</a>
          <a href="/api/health">Health Check</a>
          <a href="${process.env.FRONTEND_URL || '#'}">Open App →</a>
        </div>
        <p class="footer">© ${new Date().getFullYear()} VauraPlay. Streaming Platform API.</p>
      </div>
    </body>
    </html>
  `);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found', path: req.originalUrl });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 VauraPlay API running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
