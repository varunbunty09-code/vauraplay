import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, ShieldCheck, Play, Loader2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

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
        <div className="auth-page">
            <div className="auth-container">
                <motion.div 
                    className="auth-card glass"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="auth-header">
                        <Link to="/" className="logo">
                            <Play fill="var(--primary)" size={32} />
                            <span>VAURA<span>PLAY</span></span>
                        </Link>
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
                                        placeholder="name@example.com"
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
                        <Link to="/login" className="back-link">Back to login</Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ForgotPassword;
