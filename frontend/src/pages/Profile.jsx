import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Camera, Lock, Bell, Palette, Settings, History, Trash2, LogOut, Loader2, Bookmark, ShieldCheck, Mail, X, Check, Dices } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Profile = () => {
  const { user, setUser, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState('general');
  const [watchlist, setWatchlist] = useState([]);
  
  // OTP States
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpPurpose, setOtpPurpose] = useState(''); // 'email' or 'delete'
  const [otpCode, setOtpCode] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [deleteReason, setDeleteReason] = useState('');

  const [formData, setFormData] = useState({
    username: user?.username || '',
    autoPlay: user?.preferences?.autoPlay ?? true,
    playerColor: user?.preferences?.playerColor || '0dcaf0',
    emailNotifications: user?.preferences?.emailNotifications ?? true,
  });

  useEffect(() => {
    if (activeTab === 'watchlist') fetchWatchlist();
  }, [activeTab]);

  const fetchWatchlist = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/watchlist`);
      setWatchlist(data);
    } catch (err) {
      toast.error('Failed to load watchlist');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const fd = new FormData();
    fd.append('avatar', file);

    try {
      const { data } = await axios.post(`${API_URL}/users/avatar`, fd);
      setUser({ ...user, avatar: data.avatar });
      toast.success('Avatar updated successfully!');
    } catch (err) {
      toast.error('Failed to upload avatar');
    } finally {
      setLoading(false);
    }
  };

  const handleDiceBearChange = async () => {
    setLoading(true);
    const seed = Math.random().toString(36).substring(7);
    const url = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
    try {
      const { data } = await axios.put(`${API_URL}/users/profile`, {
        avatar: { url, publicId: 'dicebear' }
      });
      setUser(data.user);
      toast.success('Generated new random avatar!');
    } catch (err) {
      toast.error('Failed to change avatar');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.put(`${API_URL}/users/profile`, {
        username: formData.username,
        preferences: {
          autoPlay: formData.autoPlay,
          playerColor: formData.playerColor,
          emailNotifications: formData.emailNotifications
        }
      });
      setUser(data.user);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestEmailChange = async (e) => {
    e.preventDefault();
    if (newEmail === user.email) return toast.error('Enter a different email');
    setLoading(true);
    try {
      await axios.post(`${API_URL}/auth/request-email-change`, { newEmail });
      setOtpPurpose('email');
      setShowOtpModal(true);
      toast.success('Verification code sent to current email');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestDelete = async () => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/auth/request-delete-account`, { reason: deleteReason });
      setOtpPurpose('delete');
      setShowOtpModal(true);
      toast.success('Confirmation code sent to your email');
    } catch (err) {
      toast.error('Failed to request deletion');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = async () => {
    setLoading(true);
    try {
      if (otpPurpose === 'email') {
        const { data } = await axios.post(`${API_URL}/auth/verify-email-change`, { otp: otpCode });
        setUser(data.user);
        toast.success('Email updated successfully!');
        setShowOtpModal(false);
        setOtpCode('');
      } else {
        await axios.post(`${API_URL}/auth/confirm-delete-account`, { otp: otpCode });
        toast.success('Account deleted. Goodbye!');
        logout();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const colors = [
    { name: 'Blue', hex: '0dcaf0' },
    { name: 'Red', hex: 'e50914' },
    { name: 'Purple', hex: '9146ff' },
    { name: 'Green', hex: '1db954' },
    { name: 'Orange', hex: 'f4b400' },
    { name: 'Pink', hex: 'ff4081' }
  ];

  return (
    <div className="profile-page container">
      <motion.div 
        className="profile-layout"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Sidebar */}
        <aside className="profile-sidebar glass">
          <div className="user-intro">
            <div className="avatar-wrapper">
              <img src={user?.avatar?.url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`} alt="Avatar" />
              <div className="avatar-controls">
                <button title="Upload Image" onClick={handleAvatarClick}><Camera size={16} /></button>
                <button title="Random Avatar" onClick={handleDiceBearChange}><Dices size={16} /></button>
              </div>
              {loading && <div className="loader"><Loader2 className="spin" /></div>}
            </div>
            <input type="file" ref={fileInputRef} onChange={handleAvatarChange} hidden accept="image/*" />
            <h3 className="text-glow">{user?.username}</h3>
            <p>{user?.email}</p>
          </div>
          
          <nav className="profile-nav">
            <button className={activeTab === 'general' ? 'active' : ''} onClick={() => setActiveTab('general')}>
              <User size={18} /> General
            </button>
            <button className={activeTab === 'watchlist' ? 'active' : ''} onClick={() => setActiveTab('watchlist')}>
              <Bookmark size={18} /> Watchlist
            </button>
            <button className={activeTab === 'preferences' ? 'active' : ''} onClick={() => setActiveTab('preferences')}>
              <Palette size={18} /> Preferences
            </button>
            <button className={activeTab === 'security' ? 'active' : ''} onClick={() => setActiveTab('security')}>
              <Lock size={18} /> Security
            </button>
            <li className="divider"></li>
            <button className="logout-btn" onClick={logout}><LogOut size={18} /> Sign Out</button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="profile-main glass">
           <AnimatePresence mode="wait">
             {activeTab === 'general' && (
               <motion.section key="general" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                 <h2>Account Settings</h2>
                 <form onSubmit={handleSaveProfile}>
                    <div className="form-group">
                      <label>Username</label>
                      <input 
                        type="text" 
                        value={formData.username} 
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Email Address</label>
                      <div className="email-change-wrapper">
                        <input type="email" placeholder="New Email" value={newEmail} onChange={e => setNewEmail(e.target.value)} />
                        <button type="button" className="btn-small" onClick={handleRequestEmailChange}>Update Email</button>
                      </div>
                      <small>Current: {user?.email}</small>
                    </div>
                    <button className="btn-primary" disabled={loading}>Save Changes</button>
                 </form>
               </motion.section>
             )}

             {activeTab === 'watchlist' && (
               <motion.section key="watchlist" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                 <h2>My Watchlist</h2>
                 {loading && watchlist.length === 0 ? <Loader2 className="spin" /> : (
                   <div className="watchlist-grid">
                      {watchlist.length > 0 ? watchlist.map(item => (
                        <Link to={`/${item.mediaType}/${item.tmdbId}`} key={item._id} className="watch-card glass">
                           <img src={`https://image.tmdb.org/t/p/w300${item.posterPath}`} alt={item.title} />
                           <div className="watch-card-info">
                             <h4>{item.title}</h4>
                             <span className="media-type">{item.mediaType}</span>
                           </div>
                        </Link>
                      )) : (
                        <div className="empty-state">
                          <Bookmark size={48} />
                          <p>Your watchlist is empty.</p>
                          <Link to="/browse" className="btn-primary">Browse Content</Link>
                        </div>
                      )}
                   </div>
                 )}
               </motion.section>
             )}

             {activeTab === 'preferences' && (
               <motion.section key="pref" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                  <h2>Player Preferences</h2>
                  <div className="pref-item">
                     <div className="pref-text">
                        <h4>Auto-Play</h4>
                        <p>Start next episode or movie automatically</p>
                     </div>
                     <label className="switch">
                        <input 
                          type="checkbox" 
                          checked={formData.autoPlay}
                          onChange={(e) => setFormData({...formData, autoPlay: e.target.checked})}
                        />
                        <span className="slider round"></span>
                     </label>
                  </div>

                  <div className="pref-item">
                     <div className="pref-text">
                        <h4>Player Color Theme</h4>
                        <p>Customize the UI color of your video player</p>
                     </div>
                     <div className="color-grid">
                        {colors.map(c => (
                          <div 
                             key={c.hex} 
                             className={`color-box ${formData.playerColor === c.hex ? 'active' : ''}`}
                             style={{ backgroundColor: `#${c.hex}` }}
                             onClick={() => setFormData({...formData, playerColor: c.hex})}
                          ></div>
                        ))}
                     </div>
                  </div>

                  <button className="btn-primary" onClick={handleSaveProfile}>Save Preferences</button>
               </motion.section>
             )}

             {activeTab === 'security' && (
               <motion.section key="security" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                  <h2>Security & Danger Zone</h2>
                  <div className="security-info glass">
                    <h4>Account Security</h4>
                    <p>Password management coming soon. For now, use the forgot password flow if needed.</p>
                  </div>
                  <div className="danger-zone">
                     <h3>Delete Account</h3>
                     <p>Once you delete your account, there is no going back. All your data will be permanently removed.</p>
                     <textarea 
                        placeholder="Reason for leaving (Optional)" 
                        value={deleteReason}
                        onChange={e => setDeleteReason(e.target.value)}
                        className="delete-reason"
                     />
                     <button className="btn-outline delete-btn" onClick={handleRequestDelete}><Trash2 size={18} /> Request Deletion</button>
                  </div>
               </motion.section>
             )}
           </AnimatePresence>
        </main>
      </motion.div>

      {/* OTP Verification Modal */}
      <AnimatePresence>
        {showOtpModal && (
          <div className="otp-modal-overlay">
            <motion.div 
              className="otp-modal glass"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3>Verification Required</h3>
              <p>Enter the code sent to your email to confirm this action.</p>
              <input 
                type="text" 
                maxLength={6} 
                className="otp-input-field" 
                placeholder="123456" 
                value={otpCode}
                onChange={e => setOtpCode(e.target.value)}
              />
              <div className="modal-actions">
                <button className="btn-primary" onClick={handleOtpVerify} disabled={loading}>{loading ? 'Verifying...' : 'Verify & Confirm'}</button>
                <button className="btn-text" onClick={() => setShowOtpModal(false)}>Cancel</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .profile-page { padding-top: 120px; padding-bottom: 5rem; }
        .profile-layout { display: grid; grid-template-columns: 300px 1fr; gap: 2rem; align-items: start; }
        .profile-sidebar { padding: 2rem; border-radius: var(--radius-lg); text-align: center; }
        
        .avatar-wrapper {
          width: 120px; height: 120px; border-radius: 30px; margin: 0 auto 1.5rem;
          overflow: hidden; position: relative; border: 2px solid var(--border-light);
        }
        .avatar-wrapper img { width: 100%; height: 100%; object-fit: cover; }
        .avatar-controls {
          position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.7);
          display: flex; justify-content: space-around; padding: 5px; opacity: 0; transition: .3s;
        }
        .avatar-wrapper:hover .avatar-controls { opacity: 1; }
        .avatar-controls button { background: none; border: none; color: white; cursor: pointer; }
        .avatar-controls button:hover { color: var(--primary); }

        .user-intro h3 { margin-bottom: 0.3rem; font-size: 1.5rem; }
        .user-intro p { font-size: 0.85rem; color: var(--text-muted); margin-bottom: 2rem; overflow: hidden; text-overflow: ellipsis; }
        
        .profile-nav { display: flex; flex-direction: column; gap: 0.5rem; }
        .profile-nav button {
          background: none; border: none; display: flex; align-items: center; gap: 1rem;
          padding: 1rem; color: var(--text-dim); font-weight: 500; cursor: pointer;
          border-radius: 12px; transition: var(--transition-fast);
        }
        .profile-nav button:hover, .profile-nav button.active { background: rgba(13, 202, 240, 0.1); color: var(--primary); }
        .logout-btn:hover { color: var(--accent) !important; background: rgba(244, 63, 94, 0.1) !important; }
        
        .profile-main { padding: 3rem; border-radius: var(--radius-lg); min-height: 500px; }
        .profile-main h2 { margin-bottom: 2rem; }
        
        .form-group { margin-bottom: 2rem; }
        .form-group label { display: block; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem; }
        .form-group input { 
          width: 100%; max-width: 400px; padding: 1rem; border-radius: 10px; 
          background: rgba(255,255,255,0.05); border: 1px solid var(--border-light); color: white; 
        }
        
        .email-change-wrapper { display: flex; gap: 1rem; max-width: 500px; margin-bottom: 0.5rem; }
        .email-change-wrapper input { flex: 1; }
        .btn-small { padding: 0.5rem 1rem; border-radius: 8px; background: var(--primary); color: black; border: none; cursor: pointer; font-size: 0.8rem; font-weight: 600; }

        .watchlist-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 1.5rem; }
        .watch-card { border-radius: 12px; overflow: hidden; text-decoration: none; transition: .3s; border: 1px solid var(--border-light); }
        .watch-card:hover { transform: translateY(-5px); border-color: var(--primary); }
        .watch-card img { width: 100%; aspect-ratio: 2/3; object-fit: cover; }
        .watch-card-info { padding: 1rem; }
        .watch-card-info h4 { font-size: 0.9rem; margin-bottom: 0.3rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .media-type { font-size: 0.7rem; text-transform: uppercase; color: var(--primary); font-weight: 700; opacity: 0.8; }
        
        .empty-state { text-align: center; grid-column: 1/-1; padding: 4rem 0; color: var(--text-muted); }
        .empty-state p { margin: 1rem 0 2rem; }

        .pref-item { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 0; border-bottom: 1px solid var(--border-light); margin-bottom: 1rem; }
        .pref-text h4 { margin-bottom: 0.3rem; }
        .pref-text p { font-size: 0.85rem; }
        
        .color-grid { display: flex; gap: 0.8rem; }
        .color-box { width: 30px; height: 30px; border-radius: 50%; cursor: pointer; border: 2px solid transparent; transition: .2s; }
        .color-box.active { border-color: white; transform: scale(1.2); }
        
        .security-info { padding: 1.5rem; margin-bottom: 2rem; border: 1px solid var(--border-light); }

        .danger-zone { padding: 2rem; border: 1px solid rgba(244, 63, 94, 0.3); border-radius: var(--radius-md); background: rgba(244, 63, 94, 0.05); }
        .delete-reason { width: 100%; height: 80px; margin: 1.5rem 0; background: rgba(0,0,0,0.2); border: 1px solid var(--border-light); border-radius: 8px; padding: 1rem; color: white; resize: none; }
        .delete-btn { margin-top: 1rem; color: var(--accent); border-color: var(--accent); width: 100%; justify-content: center; }
        .delete-btn:hover { background: var(--accent); color: white; }

        .otp-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(10px); z-index: 10000; display: flex; align-items: center; justify-content: center; }
        .otp-modal { width: 100%; max-width: 400px; padding: 2.5rem; text-align: center; border-radius: 20px; }
        .otp-input-field { width: 100%; padding: 1.5rem; background: rgba(255,255,255,0.05); border: 1px solid var(--primary); border-radius: 12px; margin: 1.5rem 0; text-align: center; letter-spacing: 0.5rem; font-size: 1.5rem; color: white; }
        .modal-actions { display: flex; flex-direction: column; gap: 1rem; }

        @media (max-width: 900px) {
          .profile-layout { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default Profile;
