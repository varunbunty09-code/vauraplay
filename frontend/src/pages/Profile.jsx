import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Camera, Lock, Bell, Palette, Settings, History, Trash2, LogOut, Loader2, Bookmark, ShieldCheck, Mail, X, Check, Dices, Sparkles, PlayCircle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import MovieCard from '../components/MovieCard';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Profile = () => {
  const { user, setUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState('general');
  const [watchlist, setWatchlist] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  
  // OTP States
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpPurpose, setOtpPurpose] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [deleteReason, setDeleteReason] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [avatarStyle, setAvatarStyle] = useState('avataaars');
  const [avatarSeed, setAvatarSeed] = useState(user?.username || 'random');
  const [avatarPreview, setAvatarPreview] = useState('');

  const dicebearStyles = [
    'avataaars', 'bottts', 'fun-emoji', 'lorelei', 'notionists',
    'open-peeps', 'pixel-art', 'thumbs', 'big-smile', 'adventurer'
  ];

  const presetSeeds = [
    'Luna', 'Max', 'Ruby', 'Felix', 'Zara', 'Atlas', 'Ember', 'Nova',
    'Storm', 'Pixel', 'Blaze', 'Sky', 'Echo', 'Jade', 'Onyx', 'Sage'
  ];

  const [formData, setFormData] = useState({
    username: user?.username || '',
    phone: user?.phone || '',
    autoPlay: user?.preferences?.autoPlay ?? true,
    playerColor: user?.preferences?.playerColor || '0dcaf0',
    emailNotifications: user?.preferences?.emailNotifications ?? true,
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab && ['general', 'watchlist', 'activity', 'preferences', 'security'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [location]);

  useEffect(() => {
    if (activeTab === 'watchlist') fetchWatchlist();
    if (activeTab === 'activity') fetchActivityLogs();
  }, [activeTab]);

  const fetchWatchlist = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/watchlist`);
      setWatchlist(data.watchlist || []);
    } catch (err) {
      toast.error('Failed to load watchlist');
    } finally {
      setLoading(false);
    }
  };

  const fetchActivityLogs = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/users/activity`);
      setActivityLogs(data.activity || []);
    } catch (err) {
      toast.error('Failed to load activity logs');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWatchlist = async (e, itemId) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await axios.delete(`${API_URL}/watchlist/${itemId}`);
      setWatchlist(prev => prev.filter(item => item._id !== itemId));
      toast.success('Removed from watchlist');
    } catch (err) {
      toast.error('Failed to remove item');
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
    setShowAvatarPicker(true);
    setAvatarSeed(Math.random().toString(36).substring(7));
  };

  const getAvatarUrl = (style, seed) => `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`;

  useEffect(() => {
    setAvatarPreview(getAvatarUrl(avatarStyle, avatarSeed));
  }, [avatarStyle, avatarSeed]);

  const handleSelectAvatar = async (url) => {
    setLoading(true);
    try {
      const { data } = await axios.put(`${API_URL}/users/profile`, {
        avatar: { url, publicId: 'dicebear' }
      });
      setUser(data.user);
      setShowAvatarPicker(false);
      toast.success('Avatar updated!');
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
        phone: formData.phone,
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

  const handleRequestDelete = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setShowDeleteConfirm(false);
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
                <button title="Choose Avatar" onClick={() => setShowAvatarPicker(true)}><Sparkles size={16} /></button>
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
            <button className={activeTab === 'activity' ? 'active' : ''} onClick={() => setActiveTab('activity')}>
              <History size={18} /> Activity
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
                      <label>Phone Number</label>
                      <div className="phone-change-wrapper">
                        <input 
                          type="tel" 
                          placeholder="e.g. +1 234 567 8900"
                          value={formData.phone} 
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                        <button type="button" className="btn-small" onClick={handleSaveProfile}>Update Phone</button>
                      </div>
                      <small>Current: {user?.phone || 'Not set'} • Use international format (e.g. +1...)</small>
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
                   <div className="browse-grid">
                      {watchlist.length > 0 ? watchlist.map(item => (
                        <MovieCard 
                          key={item._id}
                          item={{
                            id: item.tmdbId,
                            title: item.title,
                            name: item.title,
                            poster_path: item.posterPath,
                            backdrop_path: item.backdropPath,
                            overview: item.overview,
                            vote_average: item.voteAverage || 0,
                          }}
                          type={item.mediaType}
                          showBadge={true}
                        />
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

             {activeTab === 'activity' && (
               <motion.section key="activity" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                 <h2>Activity Log</h2>
                 {loading && activityLogs.length === 0 ? <Loader2 className="spin" /> : (
                   <div className="activity-list">
                     {activityLogs.length > 0 ? activityLogs.map((log, i) => (
                       <div key={i} className="activity-item glass">
                         <History size={18} />
                         <div className="activity-info">
                           <p className="activity-action">{log.action}</p>
                           <p className="activity-detail">{log.details || ''}</p>
                           <span className="activity-time">{new Date(log.createdAt).toLocaleString()}</span>
                         </div>
                       </div>
                     )) : (
                       <div className="empty-state">
                         <History size={48} />
                         <p>No activity yet.</p>
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
                    <h4><Lock size={18} /> Change Password</h4>
                    <p style={{marginBottom:'1.5rem', fontSize:'0.85rem'}}>Choose a strong password you haven't used before.</p>
                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      const form = e.target;
                      const currentPassword = form.currentPassword.value;
                      const newPassword = form.newPassword.value;
                      const confirmPassword = form.confirmPassword.value;
                      if (newPassword.length < 6) return toast.error('Password must be at least 6 characters');
                      if (newPassword !== confirmPassword) return toast.error('Passwords do not match');
                      setLoading(true);
                      try {
                        await axios.put(`${API_URL}/users/change-password`, { currentPassword, newPassword });
                        toast.success('Password changed successfully');
                        form.reset();
                      } catch (err) {
                        toast.error(err.response?.data?.message || 'Failed to change password');
                      } finally {
                        setLoading(false);
                      }
                    }}>
                      <div className="security-field">
                        <label>Current Password</label>
                        <input type="password" name="currentPassword" required placeholder="••••••••" />
                      </div>
                      <div className="security-field">
                        <label>New Password</label>
                        <input type="password" name="newPassword" required placeholder="Min. 6 characters" minLength={6} />
                      </div>
                      <div className="security-field">
                        <label>Confirm New Password</label>
                        <input type="password" name="confirmPassword" required placeholder="Re-enter new password" />
                      </div>
                      <button type="submit" className="btn-primary" disabled={loading} style={{marginTop:'1rem'}}>
                        {loading ? <Loader2 className="spin" size={18} /> : <><Lock size={16} /> Update Password</>}
                      </button>
                    </form>
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

      {/* Avatar Picker Modal */}
      <AnimatePresence>
        {showAvatarPicker && (
          <div className="otp-modal-overlay" onClick={() => setShowAvatarPicker(false)}>
            <motion.div
              className="avatar-picker-modal glass"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <button className="close-picker" onClick={() => setShowAvatarPicker(false)}><X size={20} /></button>
              <h3>Choose Your Avatar</h3>
              <p>Pick a preset or create a custom DiceBear avatar</p>

              {/* Preset Grid */}
              <div className="preset-grid">
                {presetSeeds.map(seed => {
                  const url = getAvatarUrl(avatarStyle, seed);
                  return (
                    <button
                      key={seed}
                      className={`preset-avatar ${avatarSeed === seed ? 'selected' : ''}`}
                      onClick={() => setAvatarSeed(seed)}
                    >
                      <img src={url} alt={seed} />
                    </button>
                  );
                })}
              </div>

              {/* Customizer */}
              <div className="avatar-customizer">
                <div className="customizer-row">
                  <div className="customizer-field">
                    <label>Style</label>
                    <select value={avatarStyle} onChange={e => setAvatarStyle(e.target.value)}>
                      {dicebearStyles.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="customizer-field">
                    <label>Seed</label>
                    <input type="text" value={avatarSeed} onChange={e => setAvatarSeed(e.target.value)} placeholder="Enter a name or keyword" />
                  </div>
                  <button className="randomize-btn" onClick={() => setAvatarSeed(Math.random().toString(36).substring(7))} title="Randomize">
                    <Dices size={18} />
                  </button>
                </div>
              </div>

              {/* Preview */}
              <div className="avatar-preview-area">
                <img src={avatarPreview} alt="Preview" className="avatar-preview-img" />
                <button className="btn-primary use-avatar-btn" onClick={() => handleSelectAvatar(avatarPreview)} disabled={loading}>
                  {loading ? 'Saving...' : 'Use this avatar'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
                <button className="modal-cancel-btn" onClick={() => { setShowOtpModal(false); setOtpCode(''); }}>Cancel</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="otp-modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
            <motion.div
              className="confirm-modal glass"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="confirm-icon-wrap">
                <Trash2 size={32} />
              </div>
              <h3>Delete Your Account?</h3>
              <p>This action is <strong>permanent and irreversible</strong>. All your data, watchlist, and preferences will be erased forever.</p>
              <div className="confirm-actions">
                <button className="confirm-delete-btn" onClick={handleConfirmDelete}>
                  <Trash2 size={16} /> Yes, Delete My Account
                </button>
                <button className="modal-cancel-btn" onClick={() => setShowDeleteConfirm(false)}>
                  Keep My Account
                </button>
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
        
        .email-change-wrapper, .phone-change-wrapper { display: flex; gap: 1rem; max-width: 550px; margin-bottom: 0.5rem; }
        .email-change-wrapper input, .phone-change-wrapper input { flex: 1; }
        .btn-small { padding: 0.5rem 1.2rem; border-radius: 8px; background: var(--primary); color: black; border: none; cursor: pointer; font-size: 0.85rem; font-weight: 700; white-space: nowrap; transition: 0.3s; }
        .btn-small:hover { transform: translateY(-2px); box-shadow: 0 5px 15px var(--primary-glow); }


        .empty-state { text-align: center; grid-column: 1/-1; padding: 4rem 0; color: var(--text-muted); }
        .empty-state p { margin: 1rem 0 2rem; }

        .pref-item { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 0; border-bottom: 1px solid var(--border-light); margin-bottom: 1rem; }
        .pref-text h4 { margin-bottom: 0.3rem; }
        .pref-text p { font-size: 0.85rem; }
        
        .color-grid { display: flex; gap: 0.8rem; }
        .color-box { width: 30px; height: 30px; border-radius: 50%; cursor: pointer; border: 2px solid transparent; transition: .2s; }
        .color-box.active { border-color: white; transform: scale(1.2); }
        
        .security-info { padding: 2rem; margin-bottom: 2rem; border: 1px solid var(--border-light); border-radius: var(--radius-md); }
        .security-info h4 { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; }
        .security-field { margin-bottom: 1.2rem; }
        .security-field label { display: block; font-size: 0.85rem; color: var(--text-dim); margin-bottom: 0.5rem; font-weight: 600; }
        .security-field input { width: 100%; background: rgba(0,0,0,0.3); border: 1px solid var(--border-light); padding: 0.9rem 1rem; border-radius: var(--radius-sm); color: white; font-size: 0.95rem; transition: var(--transition-fast); }
        .security-field input:focus { border-color: var(--primary); outline: none; box-shadow: 0 0 10px var(--primary-glow); }

        .danger-zone { padding: 2rem; border: 1px solid rgba(244, 63, 94, 0.3); border-radius: var(--radius-md); background: rgba(244, 63, 94, 0.05); }
        .delete-reason { width: 100%; height: 80px; margin: 1.5rem 0; background: rgba(0,0,0,0.2); border: 1px solid var(--border-light); border-radius: 8px; padding: 1rem; color: white; resize: none; }
        .delete-btn { margin-top: 1rem; color: var(--accent); border-color: var(--accent); width: 100%; justify-content: center; }
        .delete-btn:hover { background: var(--accent); color: white; }

        .otp-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(10px); z-index: 10000; display: flex; align-items: center; justify-content: center; }
        .otp-modal { width: 100%; max-width: 400px; padding: 2.5rem; text-align: center; border-radius: 20px; }
        .otp-input-field { width: 100%; padding: 1.5rem; background: rgba(255,255,255,0.05); border: 1px solid var(--primary); border-radius: 12px; margin: 1.5rem 0; text-align: center; letter-spacing: 0.5rem; font-size: 1.5rem; color: white; }
        .modal-actions { display: flex; flex-direction: column; gap: 1rem; }
        .modal-cancel-btn { background: rgba(255,255,255,0.06); border: 1px solid var(--border-light); color: var(--text-dim); padding: 0.9rem 1.5rem; border-radius: var(--radius-sm); font-weight: 600; cursor: pointer; transition: var(--transition-fast); font-size: 0.95rem; }
        .modal-cancel-btn:hover { background: rgba(255,255,255,0.12); color: white; border-color: rgba(255,255,255,0.2); }

        .confirm-modal { width: 100%; max-width: 440px; padding: 2.5rem; text-align: center; border-radius: 20px; }
        .confirm-icon-wrap { width: 64px; height: 64px; border-radius: 50%; background: rgba(244, 63, 94, 0.15); color: var(--accent); display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; }
        .confirm-modal h3 { margin-bottom: 0.8rem; font-size: 1.5rem; }
        .confirm-modal p { font-size: 0.9rem; color: var(--text-dim); line-height: 1.6; margin-bottom: 2rem; }
        .confirm-modal p strong { color: var(--accent); }
        .confirm-actions { display: flex; flex-direction: column; gap: 0.8rem; }
        .confirm-delete-btn { background: var(--accent); color: white; border: none; padding: 1rem 1.5rem; border-radius: var(--radius-sm); font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; font-size: 0.95rem; transition: var(--transition-fast); }
        .confirm-delete-btn:hover { background: #dc2626; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(244, 63, 94, 0.3); }

        /* Avatar Picker Modal */
        .avatar-picker-modal { width: 100%; max-width: 600px; padding: 2.5rem; border-radius: 20px; position: relative; max-height: 90vh; overflow-y: auto; scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.1) transparent; }
        .avatar-picker-modal h3 { text-align: center; margin-bottom: 0.5rem; font-size: 1.5rem; }
        .avatar-picker-modal > p { text-align: center; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.5rem; }
        .close-picker { position: absolute; top: 1rem; right: 1rem; background: none; border: none; color: var(--text-muted); cursor: pointer; z-index: 5; }
        .close-picker:hover { color: white; }
        .preset-grid { display: grid; grid-template-columns: repeat(8, 1fr); gap: 0.6rem; margin-bottom: 2rem; }
        .preset-avatar { width: 100%; aspect-ratio: 1; border-radius: 50%; overflow: hidden; border: 2px solid transparent; cursor: pointer; background: rgba(255,255,255,0.05); transition: all 0.2s ease; padding: 0; }
        .preset-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .preset-avatar:hover { border-color: rgba(13,202,240,0.5); transform: scale(1.1); }
        .preset-avatar.selected { border-color: var(--primary); box-shadow: 0 0 12px var(--primary-glow); transform: scale(1.1); }
        .avatar-customizer { margin-bottom: 1.5rem; }
        .customizer-row { display: flex; gap: 0.8rem; align-items: flex-end; }
        .customizer-field { flex: 1; }
        .customizer-field label { display: block; font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.4rem; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; }
        .customizer-field select, .customizer-field input { width: 100%; padding: 0.7rem 0.8rem; background: rgba(255,255,255,0.05); border: 1px solid var(--border-light); border-radius: 8px; color: white; font-size: 0.85rem; outline: none; transition: 0.2s; }
        .customizer-field select:focus, .customizer-field input:focus { border-color: var(--primary); }
        .customizer-field select option { background: #1a1a1e; color: white; }
        .randomize-btn { width: 42px; height: 42px; border-radius: 8px; background: rgba(255,255,255,0.05); border: 1px solid var(--border-light); color: var(--text-dim); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s; flex-shrink: 0; }
        .randomize-btn:hover { border-color: var(--primary); color: var(--primary); }
        .avatar-preview-area { display: flex; flex-direction: column; align-items: center; gap: 1rem; }
        .avatar-preview-img { width: 100px; height: 100px; border-radius: 50%; border: 3px solid var(--primary); background: rgba(255,255,255,0.05); }
        .use-avatar-btn { padding: 0.7rem 2rem; font-size: 0.9rem; }

        /* Watchlist hover overlay */
        .watch-card-thumb { position: relative; overflow: hidden; border-radius: var(--radius-md) var(--radius-md) 0 0; }
        .watch-card-thumb img { width: 100%; aspect-ratio: 2/3; object-fit: cover; display: block; }
        .watch-card-overlay {
          position: absolute; inset: 0;
          background: rgba(0,0,0,0.65);
          display: flex; align-items: center; justify-content: center; gap: 1rem;
          opacity: 0; transition: opacity 0.3s ease;
        }
        .watch-card:hover .watch-card-overlay { opacity: 1; }
        .wc-play { background: none; border: none; color: white; cursor: pointer; transition: 0.2s; }
        .wc-play:hover { color: var(--primary); transform: scale(1.15); }
        .wc-remove {
          background: rgba(255,255,255,0.1); border: none; color: white;
          width: 36px; height: 36px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: 0.2s;
        }
        .wc-remove:hover { background: var(--accent); }

        /* Activity tab */
        .activity-list { display: flex; flex-direction: column; gap: 1rem; }
        .activity-item {
          display: flex; align-items: flex-start; gap: 1rem;
          padding: 1rem 1.2rem; border-radius: var(--radius-md);
          border: 1px solid var(--border-light);
        }
        .activity-item svg { color: var(--primary); flex-shrink: 0; margin-top: 3px; }
        .activity-info { flex: 1; }
        .activity-action { font-weight: 600; color: white; margin-bottom: 0.2rem; }
        .activity-detail { font-size: 0.85rem; color: var(--text-dim); }
        .activity-time { font-size: 0.75rem; color: var(--text-muted); margin-top: 0.4rem; display: block; }

        @media (max-width: 900px) {
          .profile-layout { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default Profile;
