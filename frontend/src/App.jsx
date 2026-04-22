import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';

// Context
import { AuthProvider } from './context/AuthContext';
import { WatchlistProvider } from './context/WatchlistContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Landing from './pages/Landing';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Watch from './pages/Watch';
import MovieDetail from './pages/MovieDetail';
import TVDetail from './pages/TVDetail';
import Profile from './pages/Profile';
import Watchlist from './pages/Watchlist';
import Browse from './pages/Browse';
import AdminDashboard from './pages/AdminDashboard';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import HelpCenter from './pages/HelpCenter';
import TermsOfUse from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import NotFound from './pages/NotFound';

// ─── Route Guards ──────────────────────────────────────────────

// Prevents logged-IN users from accessing auth pages (login, signup, landing, etc.)
// Redirects them to Home.
const GuestRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (token) return <Navigate to="/" replace />;
  return children;
};

// Prevents logged-OUT users from accessing private pages (home, browse, profile, etc.)
// Redirects them to Landing.
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const location = useLocation();

  if (!token) return <Navigate to="/landing" state={{ from: location }} replace />;
  if (adminOnly && user?.role !== 'admin') return <Navigate to="/" replace />;
  
  return children;
};

// ─── Footer Visibility Logic ───────────────────────────────────
const ConditionalFooter = () => {
  const location = useLocation();
  // Hide footer on watch, login, signup, and forgot-password pages
  const hideOn = ['/login', '/signup', '/forgot-password'];
  const shouldHide = hideOn.includes(location.pathname) || location.pathname.startsWith('/watch/') || location.pathname.startsWith('/reset-password');
  if (shouldHide) return null;
  return <Footer />;
};

// ─── App ───────────────────────────────────────────────────────

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
      <WatchlistProvider>
        <Router>
          <div className="app-container">
            <Navbar />
            <main className="content-area">
              <Routes>
                {/* ── Guest-Only Routes (redirects to Home if logged in) ── */}
                <Route path="/landing" element={<GuestRoute><Landing /></GuestRoute>} />
                <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
                <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />
                <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />

                {/* ── Public Routes (accessible by everyone) ── */}
                <Route path="/help" element={<HelpCenter />} />
                <Route path="/terms" element={<TermsOfUse />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                
                {/* ── Private Routes (redirects to Landing if logged out) ── */}
                <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                <Route path="/movie/:id" element={<ProtectedRoute><MovieDetail /></ProtectedRoute>} />
                <Route path="/tv/:id" element={<ProtectedRoute><TVDetail /></ProtectedRoute>} />
                <Route path="/watch/:type/:id" element={<ProtectedRoute><Watch /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/watchlist" element={<ProtectedRoute><Watchlist /></ProtectedRoute>} />
                <Route path="/browse" element={<ProtectedRoute><Browse /></ProtectedRoute>} />
                
                {/* ── Admin Routes ── */}
                <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
                
                {/* ── Catch-All ── */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <ConditionalFooter />
            <Toaster position="bottom-right" toastOptions={{
              style: {
                background: '#151518',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.1)',
              }
            }} />
          </div>
        </Router>
      </WatchlistProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
