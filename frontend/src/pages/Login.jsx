import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, ShieldCheck, Play, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import Logo from '../components/Logo';

const Login = () => {
  const { login, verifyLogin, resendOTP } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  const [step, setStep] = useState(1); // 1: Credentials, 2: OTP
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [timer, setTimer] = useState(0);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    otp: ''
  });

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(formData.email, formData.password);
      if (res.requiresOTP) {
        setUserId(res.userId);
        setStep(2);
        setTimer(60);
        toast.success('Security code sent to your email');
      } else {
        // Direct login if policy allows
        navigate(from, { replace: true });
      }
    } catch (err) {
      // Error handled in context
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await verifyLogin(userId, formData.otp);
      navigate(from, { replace: true });
    } catch (err) {
      // Error handled in context
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    try {
      await resendOTP(userId);
      setTimer(60);
    } catch (err) {
      // Error handled in context
    }
  };

  return (
    <div className="auth-page flex-center">
      <div className="auth-bg">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
      </div>

      <motion.div
        className="auth-card glass"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="auth-header">
          <Logo to="/landing" className="logo" />
          <h2>{step === 1 ? 'Welcome Back' : 'Verify Identity'}</h2>
          <p>{step === 1 ? 'Please enter your login details' : 'Enter the 6-digit code sent to your mailbox'}</p>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.form
              key="login"
              onSubmit={handleLoginSubmit}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="input-group">
                <label><Mail size={16} /> Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              <div className="input-group">
                <div className="flex-between">
                  <label><Lock size={16} /> Password</label>
                  <Link to="/forgot-password">Forgot?</Link>
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>

              <button type="submit" className="btn-primary auth-btn" disabled={loading}>
                {loading ? <RefreshCw className="spin" size={18} /> : <>Sign In <ArrowRight size={18} /></>}
              </button>
            </motion.form>
          ) : (
            <motion.form
              key="otp"
              onSubmit={handleOTPSubmit}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="input-group">
                <label><ShieldCheck size={16} /> Verification Code</label>
                <input
                  type="text"
                  name="otp"
                  required
                  maxLength={6}
                  placeholder="123456"
                  className="otp-input"
                  value={formData.otp}
                  onChange={handleInputChange}
                />
              </div>

              <button type="submit" className="btn-primary auth-btn" disabled={loading}>
                {loading ? <RefreshCw className="spin" size={18} /> : <>Verify & Enter <ArrowRight size={18} /></>}
              </button>

              <div className="resend-text">
                Didn't receive it? <button type="button" className="text-btn" onClick={handleResend} disabled={timer > 0}>
                  {timer > 0 ? `Resend in ${timer}s` : 'Resend OTP'}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="auth-footer">
          Don't have an account? <Link to="/signup" state={{ from: location.state?.from }}>Join VauraPlay</Link>
        </div>
      </motion.div>

      <style>{`
        .auth-page {
          min-height: 100vh;
          width: 100%;
          position: relative;
          background: #050507;
          overflow: hidden;
        }
        
        .auth-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }
        
        .circle {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
        }
        
        .circle-1 {
          width: 400px;
          height: 400px;
          top: -200px;
          left: -100px;
          background: rgba(13, 202, 240, 0.15);
        }
        
        .circle-2 {
          width: 500px;
          height: 500px;
          bottom: -200px;
          right: -100px;
          background: rgba(99, 102, 241, 0.15);
        }
        
        .auth-card {
          width: 100%;
          max-width: 450px;
          padding: 3rem;
          border-radius: var(--radius-lg);
          z-index: 10;
          position: relative;
        }
        
        .auth-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }
        
        .auth-header .logo {
          justify-content: center;
          margin-bottom: 1.5rem;
        }
        
        .auth-header h2 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }
        
        .auth-header p {
          font-size: 0.9rem;
        }
        
        .input-group {
          margin-bottom: 1.5rem;
        }
        
        .input-group label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: var(--text-dim);
          margin-bottom: 0.8rem;
        }
        
        .input-group input {
          width: 100%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-light);
          padding: 1rem 1.2rem;
          border-radius: var(--radius-sm);
          color: white;
          font-size: 1rem;
          transition: var(--transition-fast);
        }
        
        .input-group input:focus {
          border-color: var(--primary);
          background: rgba(255, 255, 255, 0.08);
          outline: none;
          box-shadow: 0 0 15px var(--primary-glow);
        }
        
        .flex-between {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .flex-between a {
          font-size: 0.8rem;
          color: var(--primary);
          text-decoration: none;
        }
        
        .auth-btn {
          width: 100%;
          justify-content: center;
          margin-top: 1rem;
          padding: 1.1rem;
        }
        
        .auth-footer {
          margin-top: 2rem;
          text-align: center;
          font-size: 0.9rem;
          color: var(--text-muted);
        }
        
        .auth-footer a {
          color: var(--primary);
          font-weight: 600;
          text-decoration: none;
        }
        
        .otp-input {
          text-align: center;
          letter-spacing: 12px;
          font-size: 1.5rem !important;
          font-weight: 700;
        }
        
        .resend-text {
          margin-top: 1.5rem;
          font-size: 0.85rem;
          text-align: center;
          color: var(--text-dim);
        }
        
        .text-btn {
          background: none;
          border: none;
          color: var(--primary);
          cursor: pointer;
          font-weight: 600;
          transition: var(--transition-fast);
        }
        
        .text-btn:disabled {
          color: var(--text-muted);
          cursor: not-allowed;
          opacity: 0.8;
        }
        
        .spin {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Login;
