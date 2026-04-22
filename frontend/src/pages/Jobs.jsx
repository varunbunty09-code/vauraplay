import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Clock, ArrowUpRight } from 'lucide-react';

const Jobs = () => {
    const openings = [
        { title: "Senior Frontend Engineer", dept: "Engineering", loc: "Remote / Bengaluru", type: "Full-time" },
        { title: "Product Designer (UI/UX)", dept: "Design", loc: "Remote / Mumbai", type: "Full-time" },
        { title: "Cloud Infrastructure Lead", dept: "Operations", loc: "USA / Europe", type: "Full-time" },
        { title: "Content Strategy Manager", dept: "Marketing", loc: "London / Remote", type: "Full-time" }
    ];

    return (
        <div className="legal-page container">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="legal-content"
            >
                <header className="legal-header text-center">
                    <div className="icon-badge"><Briefcase size={40} /></div>
                    <h1>Join the Revolution</h1>
                    <p>Help us shape the future of global entertainment. Work with the best minds in streaming technology.</p>
                </header>

                <div className="jobs-list">
                    <h2 className="section-title">Open Positions</h2>
                    {openings.map((job, i) => (
                        <div key={i} className="job-card glass">
                            <div className="job-info">
                                <h3>{job.title}</h3>
                                <div className="job-meta">
                                    <span><Briefcase size={14} /> {job.dept}</span>
                                    <span><MapPin size={14} /> {job.loc}</span>
                                    <span><Clock size={14} /> {job.type}</span>
                                </div>
                            </div>
                            <button className="apply-btn">Apply Now <ArrowUpRight size={18} /></button>
                        </div>
                    ))}
                </div>

                <div className="culture-section glass">
                    <h2>Our Culture</h2>
                    <p>At VauraPlay, we believe in radical transparency, extreme ownership, and constant innovation. We're a remote-first company with members across 15+ timezones.</p>
                </div>
            </motion.div>

            <style>{`
                .legal-page { padding-top: 150px; padding-bottom: 80px; min-height: 100vh; }
                .legal-header { margin-bottom: 5rem; }
                .icon-badge { color: var(--primary); margin-bottom: 1.5rem; }
                .icon-badge svg { margin: 0 auto; }
                
                .section-title { margin-bottom: 2rem; }
                .jobs-list { max-width: 900px; margin: 0 auto 5rem; }
                .job-card { 
                    padding: 2rem; border-radius: var(--radius-md); margin-bottom: 1rem;
                    display: flex; justify-content: space-between; align-items: center;
                    transition: 0.3s;
                }
                .job-card:hover { border-color: var(--primary); transform: translateX(10px); }
                
                .job-info h3 { margin-bottom: 0.8rem; color: white; }
                .job-meta { display: flex; gap: 1.5rem; color: var(--text-dim); font-size: 0.9rem; }
                .job-meta span { display: flex; align-items: center; gap: 0.4rem; }
                
                .apply-btn { 
                    background: none; border: 1px solid var(--primary); color: var(--primary);
                    padding: 0.8rem 1.5rem; border-radius: 30px; display: flex; align-items: center;
                    gap: 0.5rem; cursor: pointer; transition: 0.3s; font-weight: 600;
                }
                .apply-btn:hover { background: var(--primary); color: black; }
                
                .culture-section { padding: 4rem; border-radius: var(--radius-lg); text-align: center; max-width: 900px; margin: 0 auto; }
                .culture-section h2 { margin-bottom: 1.5rem; }
                .culture-section p { color: var(--text-dim); font-size: 1.1rem; line-height: 1.6; }
                
                @media (max-width: 768px) {
                    .job-card { flex-direction: column; text-align: center; gap: 1.5rem; }
                    .job-meta { flex-direction: column; gap: 0.5rem; align-items: center; }
                    .culture-section { padding: 2rem; }
                }
            `}</style>
        </div>
    );
};

export default Jobs;
