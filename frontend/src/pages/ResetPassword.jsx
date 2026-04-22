import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, ArrowRight, Play, Loader2, ArrowLeft, Mail } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Logo from '../components/Logo';
import ReCAPTCHA from 'react-google-recaptcha';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [isVerifying, setIsVerifying] = useState(true);
    const [recaptchaToken, setRecaptchaToken] = useState('');
    const recaptchaRef = React.useRef();

    React.useEffect(() => {
        const verifyToken = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/auth/verify-reset-token/${token}`);
                setEmail(data.email);
            } catch (error) {
                toast.error('Invalid or expired reset link');
                navigate('/login');
            } finally {
                setIsVerifying(false);
            }
        };
        verifyToken();
    }, [token, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            return toast.error('Passwords do not match');
        }

        if (password.length < 6) {
            return toast.error('Password must be at least 6 characters');
        }

        if (!recaptchaToken) {
            return toast.error('Please complete the reCAPTCHA');
        }

        setIsLoading(true);
        try {
            await axios.post(`${API_URL}/auth/reset-password/${token}`, { password, recaptchaToken });
            toast.success('Password reset successful! Please login.');
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to reset password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <motion.div
                    className="auth-card glass"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <div className="auth-header">
                        <button className="back-btn" onClick={() => navigate(-1)} title="Go Back">
                            <ArrowLeft size={20} />
                        </button>
                        <Logo to="/" className="logo" />
                        <h2>Set New Password</h2>
                        {email && (
                            <div className="account-indicator">
                                <Mail size={14} />
                                <span>For: <strong>{email}</strong></span>
                            </div>
                        )}
                        <p>Your new password must be different from previous ones.</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label><Lock size={16} /> New Password</label>
                            <input
                                type="password"
                                placeholder="Enter New Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label><Lock size={16} /> Confirm Password</label>
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
 
                        <div className="recaptcha-container" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                            <ReCAPTCHA
                                ref={recaptchaRef}
                                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                                onChange={(token) => setRecaptchaToken(token)}
                                theme="dark"
                            />
                        </div>

                        <button type="submit" className="btn-primary auth-btn" disabled={isLoading}>
                            {isLoading ? <Loader2 className="spin" /> : <>Reset Password <ArrowRight size={18} /></>}
                        </button>
                    </form>
                </motion.div>
            </div>
            <style>{`
                .auth-page { display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #050507; }
                .auth-header { position: relative; }
                .back-btn { position: absolute; left: 0; top: 0; background: none; border: none; color: var(--text-dim); cursor: pointer; transition: 0.3s; }
                .back-btn:hover { color: var(--primary); transform: translateX(-5px); }
                .account-indicator { display: flex; align-items: center; justify-content: center; gap: 0.5rem; background: rgba(13, 202, 240, 0.1); padding: 0.5rem 1rem; border-radius: 30px; margin: 1rem 0; font-size: 0.85rem; color: var(--primary); border: 1px solid rgba(13, 202, 240, 0.2); width: fit-content; margin-left: auto; margin-right: auto; }
                .account-indicator strong { color: white; }
                form { margin-top: 1.5rem; }
            `}</style>
        </div>
    );
};

export default ResetPassword;
