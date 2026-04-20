import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { User, Camera, Lock, Bell, Palette, Settings, History, Trash2, LogOut, Loader2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Profile = () => {
  const { user, setUser, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState('general');

  const [formData, setFormData] = useState({
    username: user?.username || '',
    autoPlay: user?.preferences?.autoPlay ?? true,
    playerColor: user?.preferences?.playerColor || '0dcaf0',
    emailNotifications: user?.preferences?.emailNotifications ?? true,
  });

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
            <div className="avatar-wrapper" onClick={handleAvatarClick}>
              <img src={user?.avatar?.url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'} alt="Avatar" />
              <div className="avatar-overlay"><Camera size={20} /></div>
              {loading && <div className="loader"><Loader2 className="spin" /></div>}
            </div>
            <input type="file" ref={fileInputRef} onChange={handleAvatarChange} hidden accept="image/*" />
            <h3>{user?.username}</h3>
            <p>{user?.email}</p>
          </div>
          
          <nav className="profile-nav">
            <button className={activeTab === 'general' ? 'active' : ''} onClick={() => setActiveTab('general')}>
              <User size={18} /> General
            </button>
            <button className={activeTab === 'preferences' ? 'active' : ''} onClick={() => setActiveTab('preferences')}>
              <Palette size={18} /> Preferences
            </button>
            <button className={activeTab === 'security' ? 'active' : ''} onClick={() => setActiveTab('security')}>
              <Lock size={18} /> Security
            </button>
            <button className={activeTab === 'activity' ? 'active' : ''} onClick={() => setActiveTab('activity')}>
              <History size={18} /> Watch History
            </button>
            <li className="divider"></li>
            <button className="logout-btn" onClick={logout}><LogOut size={18} /> Sign Out</button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="profile-main glass">
           {activeTab === 'general' && (
             <section>
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
                    <label>Email Address (Read Only)</label>
                    <input type="email" value={user?.email} disabled />
                  </div>
                  <button className="btn-primary" disabled={loading}>Save Changes</button>
               </form>
             </section>
           )}

           {activeTab === 'preferences' && (
             <section>
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
             </section>
           )}

           {activeTab === 'security' && (
             <section>
                <h2>Security</h2>
                <div className="danger-zone">
                   <h3>Danger Zone</h3>
                   <p>Once you delete your account, there is no going back. Please be certain.</p>
                   <button className="btn-outline delete-btn"><Trash2 size={18} /> Delete Account</button>
                </div>
             </section>
           )}
        </main>
      </motion.div>

      <style>{`
        .profile-page {
          padding-top: 120px;
          padding-bottom: 5rem;
        }
        
        .profile-layout {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 2rem;
          align-items: start;
        }
        
        .profile-sidebar {
          padding: 2rem;
          border-radius: var(--radius-lg);
          text-align: center;
        }
        
        .avatar-wrapper {
          width: 120px;
          height: 120px;
          border-radius: 30px;
          margin: 0 auto 1.5rem;
          overflow: hidden;
          position: relative;
          cursor: pointer;
          border: 2px solid var(--border-light);
        }
        
        .avatar-wrapper img { width: 100%; height: 100%; object-fit: cover; }
        
        .avatar-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: var(--transition-fast);
        }
        
        .avatar-wrapper:hover .avatar-overlay { opacity: 1; }
        
        .user-intro h3 { margin-bottom: 0.3rem; }
        .user-intro p { font-size: 0.85rem; color: var(--text-muted); margin-bottom: 2rem; }
        
        .profile-nav {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .profile-nav button {
          background: none;
          border: none;
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          color: var(--text-dim);
          font-weight: 500;
          cursor: pointer;
          border-radius: 12px;
          transition: var(--transition-fast);
        }
        
        .profile-nav button:hover, .profile-nav button.active {
          background: rgba(13, 202, 240, 0.1);
          color: var(--primary);
        }
        
        .logout-btn:hover { color: var(--accent) !important; background: rgba(244, 63, 94, 0.1) !important; }
        
        .profile-main {
          padding: 3rem;
          border-radius: var(--radius-lg);
          min-height: 500px;
        }
        
        .profile-main h2 { margin-bottom: 2rem; }
        
        .form-group { margin-bottom: 1.5rem; }
        .form-group label { display: block; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem; }
        .form-group input { width: 100%; max-width: 400px; padding: 1rem; border-radius: 10px; background: rgba(255,255,255,0.05); border: 1px solid var(--border-light); color: white; }
        
        .pref-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 0;
          border-bottom: 1px solid var(--border-light);
          margin-bottom: 1rem;
        }
        
        .pref-text h4 { margin-bottom: 0.3rem; }
        .pref-text p { font-size: 0.85rem; }
        
        .color-grid { display: flex; gap: 0.8rem; }
        .color-box { width: 30px; height: 30px; border-radius: 50%; cursor: pointer; border: 2px solid transparent; }
        .color-box.active { border-color: white; transform: scale(1.2); }
        
        .danger-zone {
          margin-top: 3rem;
          padding: 2rem;
          border: 1px solid rgba(244, 63, 94, 0.3);
          border-radius: var(--radius-md);
          background: rgba(244, 63, 94, 0.05);
        }
        
        .delete-btn { margin-top: 1rem; color: var(--accent); border-color: var(--accent); }
        .delete-btn:hover { background: var(--accent); color: white; }

        /* Switch UI */
        .switch { position: relative; display: inline-block; width: 50px; height: 26px; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #333; transition: .4s; }
        .slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 4px; bottom: 4px; background-color: white; transition: .4s; }
        input:checked + .slider { background-color: var(--primary); }
        input:checked + .slider:before { transform: translateX(24px); }
        .slider.round { border-radius: 34px; }
        .slider.round:before { border-radius: 50%; }

        @media (max-width: 900px) {
          .profile-layout { grid-template-columns: 1fr; }
          .profile-sidebar { flex-direction: row; }
        }
      `}</style>
    </div>
  );
};

export default Profile;
