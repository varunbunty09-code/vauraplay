import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, ShieldCheck, Play, Loader2, ChevronLeft } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Logo from '../components/Logo';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return toast.error('Please enter your email');

        setIsLoading(true);
        try {
            await axios.post(`${API_URL}/auth/forgot-password`, { email });
            setIsSent(true);
            toast.success('Reset link sent to your email');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send reset link');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page flex-center">
            <div className="auth-bg">
                <div className="circle circle-1"></div>
                <div className="circle circle-2"></div>
            </div>

            <div className="auth-container">
                <style>{`
                .auth-page { min-height: 100vh; width: 100%; position: relative; background: #050507; overflow: hidden; }
                .auth-bg { position: absolute; inset: 0; z-index: 0; }
                .circle { position: absolute; border-radius: 50%; filter: blur(100px); }
                .circle-1 { width: 400px; height: 400px; top: -200px; left: -100px; background: rgba(13, 202, 240, 0.15); }
                .circle-2 { width: 500px; height: 500px; bottom: -200px; right: -100px; background: rgba(99, 102, 241, 0.15); }
                .auth-container { z-index: 10; position: relative; }
                .success-icon { margin-bottom: 1.5rem; display: flex; justify-content: center; }
                .success-state h3 { margin-bottom: 0.5rem; }
                .success-state p { margin-bottom: 2rem; font-size: 0.9rem; }
            `}</style>
                <motion.div
                    className="auth-card glass"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="auth-header">
                        <Logo to="/" className="logo" />
                        <h2>Reset Password</h2>
                        <p>No worries, we'll send you reset instructions.</p>
                    </div>

                    <AnimatePresence mode="wait">
                        {!isSent ? (
                            <motion.form
                                key="form"
                                onSubmit={handleSubmit}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <div className="form-group">
                                    <label><Mail size={16} /> Email Address</label>
                                    <input
                                        type="email"
                                        placeholder="Enter Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                <button type="submit" className="btn-primary auth-btn" disabled={isLoading}>
                                    {isLoading ? <Loader2 className="spin" /> : <>Send Reset Link <ArrowRight size={18} /></>}
                                </button>
                            </motion.form>
                        ) : (
                            <motion.div
                                key="success"
                                className="success-state text-center"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                            >
                                <div className="success-icon">
                                    <ShieldCheck size={64} color="var(--primary)" />
                                </div>
                                <h3>Email Sent!</h3>
                                <p>Please check your inbox for the password reset link.</p>
                                <button className="btn-secondary auth-btn" onClick={() => setIsSent(false)}>
                                    Didn't get it? Try again
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="auth-footer">
                        <Link to="/login" className="back-link">
                            <ChevronLeft size={16} /> Back to login
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ForgotPassword;
