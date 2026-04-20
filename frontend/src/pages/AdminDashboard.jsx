import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Users, BarChart3, Mail, ShieldAlert, History, Ban, CheckCircle, Search, Send, PlayCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [activeTab, setActiveTab] = useState('stats');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchAdminData = async () => {
    try {
      const [statsRes, usersRes, logsRes] = await Promise.all([
        axios.get(`${API_URL}/admin/stats`),
        axios.get(`${API_URL}/admin/users`, { params: { search } }),
        axios.get(`${API_URL}/admin/logs`)
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data.users);
      setLogs(logsRes.data.logs);
    } catch (err) {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [search]);

  const handleBan = async (id, isActive) => {
    try {
      if (isActive) {
        await axios.put(`${API_URL}/admin/users/${id}/ban`, { reason: 'Policy violation' });
        toast.success('User banned');
      } else {
        await axios.put(`${API_URL}/admin/users/${id}/unban`);
        toast.success('User unbanned');
      }
      fetchAdminData();
    } catch (err) {
      toast.error('Action failed');
    }
  };

  if (loading) return <div className="loading-screen" style={{height:'100vh'}}></div>;

  return (
    <div className="admin-page container">
      <div className="admin-header">
         <h1 className="gradient-text">Admin Command Center</h1>
         <p>Manage users, monitor activity, and broadcast updates.</p>
      </div>

      <div className="admin-layout">
        <aside className="admin-sidebar glass">
           <button className={activeTab === 'stats' ? 'active' : ''} onClick={() => setActiveTab('stats')}><BarChart3 size={18} /> Statistics</button>
           <button className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}><Users size={18} /> User Management</button>
           <button className={activeTab === 'broadcast' ? 'active' : ''} onClick={() => setActiveTab('broadcast')}><Mail size={18} /> Broadcast</button>
           <button className={activeTab === 'logs' ? 'active' : ''} onClick={() => setActiveTab('logs')}><History size={18} /> Audit Logs</button>
        </aside>

        <main className="admin-main glass">
           {activeTab === 'stats' && (
             <section className="stats-section">
                <div className="stats-grid">
                   <div className="stat-card glass flex-center">
                      <Users color="var(--primary)" />
                      <div><h3>{stats.totalUsers}</h3><p>Total Users</p></div>
                   </div>
                   <div className="stat-card glass flex-center">
                      <Users color="var(--spotify-green)" />
                      <div><h3>{stats.activeUsers}</h3><p>Active Users</p></div>
                   </div>
                   <div className="stat-card glass flex-center">
                      <ShieldAlert color="var(--accent)" />
                      <div><h3>{stats.bannedUsers}</h3><p>Banned</p></div>
                   </div>
                   <div className="stat-card glass flex-center">
                      <PlayCircle color="var(--twitch-purple)" />
                      <div><h3>{stats.totalWatchProgress}</h3><p>Views tracked</p></div>
                   </div>
                </div>
             </section>
           )}

           {activeTab === 'users' && (
             <section>
                <div className="table-header flex-between">
                   <h3>User Management</h3>
                   <div className="search-box glass">
                      <Search size={16} />
                      <input type="text" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} />
                   </div>
                </div>
                <div className="table-wrapper">
                  <table>
                     <thead>
                        <tr>
                           <th>User</th>
                           <th>Email</th>
                           <th>Joined</th>
                           <th>Status</th>
                           <th>Action</th>
                        </tr>
                     </thead>
                     <tbody>
                        {users.map(u => (
                          <tr key={u._id}>
                             <td><div className="user-cell"><img src={u.avatar?.url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'} alt="" /> {u.username}</div></td>
                             <td>{u.email}</td>
                             <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                             <td>{u.isActive ? <span className="tag active">Active</span> : <span className="tag banned">Banned</span>}</td>
                             <td>
                                <button className="action-btn" onClick={() => handleBan(u._id, u.isActive)}>
                                   {u.isActive ? <Ban size={16} color="var(--accent)" /> : <CheckCircle size={16} color="var(--spotify-green)" />}
                                </button>
                             </td>
                          </tr>
                        ))}
                     </tbody>
                  </table>
                </div>
             </section>
           )}

           {activeTab === 'broadcast' && (
             <section className="broadcast-section">
                <h3>Broadcast Movie Updates</h3>
                <p>Send an automated email to all users about new content.</p>
                <div className="broadcast-form">
                   <div className="form-group">
                      <label>Announcement Title</label>
                      <input type="text" placeholder="e.g. New Blockbuster Added!" />
                   </div>
                   <div className="form-group">
                      <label>Details</label>
                      <textarea placeholder="Describe the new content..."></textarea>
                   </div>
                   <button className="btn-primary"><Send size={18} /> Send Broadcast Email</button>
                </div>
             </section>
           )}

           {activeTab === 'logs' && (
             <section>
                <h3>System Activity Logs</h3>
                <div className="logs-list">
                   {logs.map(log => (
                     <div key={log._id} className="log-item glass">
                        <div className="log-icon"><ShieldAlert size={14} /></div>
                        <div className="log-details">
                           <p><strong>{log.user?.username || 'System'}</strong>: {log.action}</p>
                           <span>{log.details} • {new Date(log.createdAt).toLocaleString()}</span>
                        </div>
                     </div>
                   ))}
                </div>
             </section>
           )}
        </main>
      </div>

      <style>{`
        .admin-page { padding-top: 120px; padding-bottom: 5rem; }
        .admin-header { margin-bottom: 3rem; }
        .admin-layout { display: grid; grid-template-columns: 250px 1fr; gap: 2rem; }
        
        .admin-sidebar { padding: 1rem; border-radius: var(--radius-lg); height: fit-content; display: flex; flex-direction: column; gap: 0.5rem; }
        .admin-sidebar button { background: none; border: none; color: var(--text-dim); padding: 1rem; text-align: left; display: flex; align-items: center; gap: 1rem; border-radius: 10px; cursor: pointer; transition: .3s; }
        .admin-sidebar button:hover, .admin-sidebar button.active { background: rgba(13, 202, 240, 0.1); color: var(--primary); }
        
        .admin-main { padding: 2rem; border-radius: var(--radius-lg); min-height: 600px; }
        
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; }
        .stat-card { padding: 2rem; border-radius: var(--radius-md); gap: 1.5rem; text-align: left; }
        .stat-card h3 { font-size: 2rem; line-height: 1; }
        .stat-card p { font-size: 0.8rem; color: var(--text-muted); }
        
        .table-wrapper { overflow-x: auto; margin-top: 1.5rem; }
        table { width: 100%; border-collapse: collapse; text-align: left; }
        th { padding: 1rem; border-bottom: 1px solid var(--border-light); color: var(--text-muted); font-size: 0.85rem; }
        td { padding: 1rem; border-bottom: 1px solid var(--border-light); font-size: 0.9rem; }
        
        .user-cell { display: flex; align-items: center; gap: 0.8rem; }
        .user-cell img { width: 32px; height: 32px; border-radius: 8px; }
        
        .tag { padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.75rem; font-weight: 700; }
        .tag.active { background: rgba(29, 185, 84, 0.1); color: var(--spotify-green); }
        .tag.banned { background: rgba(244, 63, 94, 0.1); color: var(--accent); }
        
        .action-btn { background: none; border: none; cursor: pointer; padding: 0.5rem; border-radius: 8px; transition: .2s; }
        .action-btn:hover { background: rgba(255,255,255,0.05); }
        
        .broadcast-form { max-width: 600px; margin-top: 2rem; display: flex; flex-direction: column; gap: 1.5rem; }
        .broadcast-form textarea { width: 100%; height: 150px; background: rgba(255,255,255,0.05); border: 1px solid var(--border-light); color: white; padding: 1rem; border-radius: 10px; resize: none; }
        
        .logs-list { display: flex; flex-direction: column; gap: 0.8rem; margin-top: 1.5rem; }
        .log-item { padding: 1rem; border-radius: 10px; display: flex; gap: 1rem; align-items: center; }
        .log-icon { width: 30px; height: 30px; border-radius: 50%; background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; }
        .log-details p { font-size: 0.85rem; }
        .log-details span { font-size: 0.75rem; color: var(--text-muted); }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
