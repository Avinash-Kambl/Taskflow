import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../../context/ProjectContext';
import Navbar from '../Layout/Navbar';
import './Dashboard.css';

const PROJECT_COLORS = ['#7c6af7','#34d399','#60a5fa','#fbbf24','#f87171','#a78bfa','#fb923c'];

const CreateProjectModal = ({ onClose, onCreate }) => {
  const [form, setForm] = useState({ name: '', description: '', color: PROJECT_COLORS[0] });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setLoading(true);
    try { await onCreate(form); onClose(); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">New Project</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Project Name</label>
            <input className="form-input" placeholder="e.g. Website Redesign"
              value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-input" rows={3} placeholder="What is this project about?"
              value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Color</label>
            <div className="color-picker">
              {PROJECT_COLORS.map((c) => (
                <button type="button" key={c}
                  className={`color-dot ${form.color === c ? 'selected' : ''}`}
                  style={{ background: c }}
                  onClick={() => setForm({ ...form, color: c })}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-1" style={{ justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading || !form.name.trim()}>
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { projects, loading, loadProjects, addProject, removeProject } = useProjects();
  const [showCreate, setShowCreate] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { loadProjects(); }, [loadProjects]);

  return (
    <div className="dashboard">
      <Navbar />
      <div className="dashboard-body">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-heading">My Projects</h1>
            <p className="dashboard-sub">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
            + New Project
          </button>
        </div>

        {loading ? (
          <div className="flex-center" style={{ height: 200 }}><div className="spinner" /></div>
        ) : projects.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No projects yet</h3>
            <p>Create your first project to get started</p>
            <button className="btn btn-primary mt-2" onClick={() => setShowCreate(true)}>
              + Create Project
            </button>
          </div>
        ) : (
          <div className="projects-grid">
            {projects.map((p) => (
              <div key={p._id} className="project-card" onClick={() => navigate(`/project/${p._id}`)}>
                <div className="project-card-accent" style={{ background: p.color || '#7c6af7' }} />
                <div className="project-card-body">
                  <div className="project-card-header">
                    <h3 className="project-name">{p.name}</h3>
                    <button className="project-delete" onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('Delete this project?')) removeProject(p._id);
                    }}>✕</button>
                  </div>
                  {p.description && <p className="project-desc">{p.description}</p>}
                  <div className="project-meta">
                    <span className="project-members">
                      👥 {p.members.length} member{p.members.length !== 1 ? 's' : ''}
                    </span>
                    <span className="project-owner">by {p.owner.name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showCreate && (
        <CreateProjectModal onClose={() => setShowCreate(false)} onCreate={addProject} />
      )}
    </div>
  );
};

export default Dashboard;
