# 🎬 VauraPlay — Premium Full-Stack Streaming Ecosystem


🌐 **Live**: [vauraplay.vercel.app](https://vauraplay.vercel.app)  
🔗 **API**: [vauraplay.onrender.com](https://vauraplay.onrender.com/api/health)
VauraPlay is a high-performance, production-ready streaming platform designed for a cinematic user experience. Built with the **MERN stack**, it features a stunning glassmorphic UI, enterprise-grade security with OTP authentication, and industry-standard media integration.

---

## 🚀 Experience the Future of Streaming
VauraPlay isn't just a movie site; it's a complete ecosystem featuring real-time metadata syncing with TMDB, advanced "Continue Watching" logic, and a robust administration backend.


## ✨ Features

- 🎨 **Premium UI** — Modern glassmorphic design with Framer Motion animations
- 🔐 **Secure Auth** — Two-step OTP authentication via Brevo SMTP
- 📺 **Vidking Player** — Integrated streaming player for movies & TV series
- 📂 **My Library** — Watchlist & "Continue Watching" progress tracking
- 🛡️ **Admin Dashboard** — User management, ban/unban, audit logs, broadcasts
- 🖼️ **Cloudinary** — Profile avatar upload & cloud storage
- 🎬 **TMDB API** — Live movie metadata, trending content, and search

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React.js, Vite, Framer Motion, Lucide Icons |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas (Mongoose) |
| **Streaming** | Vidking Embed Player |
| **Content** | TMDB API |
| **Email** | Brevo SMTP (OTP & Notifications) |
| **Storage** | Cloudinary |
| **Hosting** | Vercel (Frontend) + Render (Backend) |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- TMDB API key
- Brevo account (for emails)

### 1. Clone
```bash
git clone https://github.com/varunbunty09-code/vauraplay.git
cd vauraplay
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env    # Fill in your credentials
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 📡 API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/verify-signup` | Verify OTP |
| POST | `/api/auth/login` | Login (sends OTP) |
| POST | `/api/auth/verify-login` | Verify login OTP |
| GET | `/api/tmdb/trending/:type/:time` | Trending content |
| GET | `/api/tmdb/movie/:id` | Movie details |
| GET | `/api/tmdb/tv/:id` | TV show details |
| GET | `/api/tmdb/search?query=` | Search |
| GET | `/api/watchlist` | User's watchlist |
| POST | `/api/progress` | Save watch progress |
| GET | `/api/admin/stats` | Platform stats (admin) |

## 🎥 Vidking Player Integration

Movies and TV shows stream via the Vidking embed player:
```
Movies:  https://www.vidking.net/embed/movie/{tmdbId}
TV:      https://www.vidking.net/embed/tv/{tmdbId}/{season}/{episode}
```

Supports: custom colors, autoplay, episode selector, next episode, and progress tracking via PostMessage API.

---

Built with ❤️ by [Varun](https://github.com/varunbunty09-code)
