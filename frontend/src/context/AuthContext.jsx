import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchMe();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchMe = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/auth/me`);
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
    } catch (error) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const { data } = await axios.post(`${API_URL}/auth/login`, { email, password });
      if (data.requiresOTP) {
        return { requiresOTP: true, userId: data.userId };
      }
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    }
  };

  const verifyLogin = async (userId, otp) => {
    try {
      const { data } = await axios.post(`${API_URL}/auth/verify-login`, { userId, otp });
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      toast.success('Welcome back!');
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed');
      throw error;
    }
  };

  const signup = async (username, email, password) => {
    try {
      const { data } = await axios.post(`${API_URL}/auth/signup`, { username, email, password });
      return data; // Should return userId for verification step
    } catch (error) {
      toast.error(error.response?.data?.message || 'Signup failed');
      throw error;
    }
  };

  const verifySignup = async (userId, otp) => {
    try {
      const { data } = await axios.post(`${API_URL}/auth/verify-signup`, { userId, otp });
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      toast.success('Account verified! Welcome to VauraPlay.');
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed');
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      verifyLogin,
      signup,
      verifySignup,
      logout,
      setUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
