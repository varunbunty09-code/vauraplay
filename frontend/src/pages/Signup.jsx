import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, ShieldCheck, Play, RefreshCw, Phone, Globe } from 'lucide-react';
import toast from 'react-hot-toast';
import Logo from '../components/Logo';
import { countryCodes } from '../constants/countries';
import ReCAPTCHA from 'react-google-recaptcha';

const Signup = () => {
  const { signup, verifySignup, resendOTP } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  const [step, setStep] = useState(1); // 1: Registration, 2: OTP
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [timer, setTimer] = useState(0);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    countryCode: '+91',
    phone: '',
    password: '',
    confirmPassword: '',
    otp: '',
    recaptchaToken: ''
  });
  const recaptchaRef = React.useRef();

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
    const { name, value } = e.target;
    // Restrict OTP and Phone to numbers only
    if (name === 'otp' || name === 'phone') {
      const numericValue = value.replace(/\D/g, '');
      setFormData({ ...formData, [name]: numericValue });
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    if (formData.password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }
    if (!formData.phone || !formData.phone.trim()) {
      return toast.error('Please enter your phone number');
    }
    if (!formData.recaptchaToken) {
      setLoading(false);
      return toast.error('Please complete the reCAPTCHA');
    }
    setLoading(true);
    try {
      const fullPhone = `${formData.countryCode}${formData.phone.trim()}`;
      const res = await signup(formData.username, formData.email, formData.password, fullPhone, formData.recaptchaToken);
      setUserId(res.userId);
      setStep(2);
      setTimer(60);
      toast.success('Verification code sent to your email');
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
      await verifySignup(userId, formData.otp);
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
          <h2>{step === 1 ? 'Join the Future' : 'Verify Account'}</h2>
          <p>{step === 1 ? 'Create your premium account today' : 'Check your inbox for the code'}</p>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.form
              key="signup"
              onSubmit={handleSignupSubmit}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="input-group">
                <label><User size={16} /> Username</label>
                <input
                  type="text"
                  name="username"
                  required
                  placeholder="Enter Username"
                  value={formData.username}
                  onChange={handleInputChange}
                />
              </div>

              <div className="input-group">
                <label><Mail size={16} /> Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Enter Email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              <div className="input-group">
                <label><Lock size={16} /> Password</label>
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="Min. 6 characters"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>

              <div className="input-group">
                <label><Lock size={16} /> Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
              </div>

              <div className="input-group">
                <label><Phone size={16} /> Phone Number</label>
                <div className="phone-input-container" style={{ display: 'flex', gap: '0.8rem' }}>
                  <div className="country-code-select">
                    {(() => {
                      const country = countryCodes.find(c => c.code === formData.countryCode);
                      return country ? (
                        <img
                          src={`https://flagcdn.com/w40/${country.country.toLowerCase()}.png`}
                          alt={country.name}
                          className="selected-flag"
                        />
                      ) : <Globe size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />;
                    })()}
                    <select
                      name="countryCode"
                      value={formData.countryCode}
                      onChange={handleInputChange}
                      className="country-select"
                      required
                    >
                      {countryCodes.map(c => (
                        <option key={c.code + c.country} value={c.code}>
                          {c.code} ({c.name})
                        </option>
                      ))}
                    </select>
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="Enter Phone Number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    inputMode="numeric"
                  />
                </div>
              </div>

              <div className="recaptcha-container">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                  onChange={(token) => setFormData({ ...formData, recaptchaToken: token })}
                  theme="dark"
                />
              </div>

              <button type="submit" className="btn-primary auth-btn" disabled={loading}>
                {loading ? <RefreshCw className="spin" size={18} /> : <>Create Account <ArrowRight size={18} /></>}
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
                  type="tel"
                  name="otp"
                  required
                  maxLength={6}
                  placeholder="123456"
                  className="otp-input"
                  value={formData.otp}
                  onChange={handleInputChange}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                />
              </div>

              <button type="submit" className="btn-primary auth-btn" disabled={loading}>
                {loading ? <RefreshCw className="spin" size={18} /> : <>Verify & Get Started <ArrowRight size={18} /></>}
              </button>

              <div className="resend-text" style={{ marginTop: '1.5rem', fontSize: '0.85rem', textAlign: 'center', color: 'var(--text-dim)' }}>
                Didn't receive it? <button type="button" className="text-btn" onClick={handleResend} disabled={timer > 0}>
                  {timer > 0 ? `Resend in ${timer}s` : 'Resend OTP'}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="auth-footer">
          Already have an account? <Link to="/login" state={{ from: location.state?.from }}>Sign In</Link>
        </div>
      </motion.div>

      {/* Reusing styles from Login.jsx (Global style or shared component would be better in a larger app) */}
      <style>{`
        /* Styles are identical to Login.jsx */
        .auth-page { min-height: 100vh; width: 100%; position: relative; background: #050507; overflow: hidden; }
        .auth-bg { position: absolute; inset: 0; z-index: 0; }
        .circle { position: absolute; border-radius: 50%; filter: blur(100px); }
        .circle-1 { width: 400px; height: 400px; top: -200px; left: -100px; background: rgba(13, 202, 240, 0.15); }
        .circle-2 { width: 500px; height: 500px; bottom: -200px; right: -100px; background: rgba(99, 102, 241, 0.15); }
        .auth-card { width: 100%; max-width: 450px; padding: 3rem; border-radius: var(--radius-lg); z-index: 10; position: relative; }
        .auth-header { text-align: center; margin-bottom: 2.5rem; }
        .auth-header .logo { justify-content: center; margin-bottom: 1.5rem; }
        .auth-header h2 { font-size: 2rem; margin-bottom: 0.5rem; }
        .auth-header p { font-size: 0.9rem; }
        .input-group { margin-bottom: 1.5rem; }
        .input-group label { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; color: var(--text-dim); margin-bottom: 0.8rem; }
        .input-group input { width: 100%; background: rgba(255, 255, 255, 0.05); border: 1px solid var(--border-light); padding: 1rem 1.2rem; border-radius: var(--radius-sm); color: white; font-size: 1rem; transition: var(--transition-fast); }
        .input-group input:focus { border-color: var(--primary); background: rgba(255, 255, 255, 0.08); outline: none; box-shadow: 0 0 15px var(--primary-glow); }
        .auth-btn { width: 100%; justify-content: center; margin-top: 1rem; padding: 1.1rem; }
        .auth-footer { margin-top: 2rem; text-align: center; font-size: 0.9rem; color: var(--text-muted); }
        .auth-footer a { color: var(--primary); font-weight: 600; text-decoration: none; }
        .otp-input { text-align: center; letter-spacing: 12px; font-size: 1.5rem !important; font-weight: 700; }
        .country-select { background: transparent; border: none; padding: 0; color: white; cursor: pointer; font-weight: 600; flex: 1; }
        .country-select option { background: #121214; color: white; }
        .country-code-select { 
          display: flex; align-items: center; gap: 0.6rem; background: rgba(255, 255, 255, 0.05); 
          border: 1px solid var(--border-light); padding: 0 1rem; border-radius: var(--radius-sm);
          min-width: 140px;
        }
        .selected-flag {
          width: 22px;
          height: auto;
          border-radius: 2px;
          object-fit: cover;
          margin-right: -4px;
        }
        .globe-icon { color: var(--text-muted); }
        .text-btn { background: none; border: none; color: var(--primary); cursor: pointer; font-weight: 600; transition: var(--transition-fast); }
        .text-btn:disabled { color: var(--text-muted); cursor: not-allowed; opacity: 0.8; }
        .recaptcha-container {
          margin-bottom: 1.5rem;
          display: flex;
          justify-content: center;
        }

        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Signup;
