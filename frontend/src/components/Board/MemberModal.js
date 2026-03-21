import React, { useState } from 'react';
import { useProjects } from '../../context/ProjectContext';

const MemberModal = ({ project, onClose }) => {
  const { inviteMember } = useProjects();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Member');
  const [loading, setLoading] = useState(false);

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      await inviteMember(project._id, email.trim(), role);
      setEmail('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Team Members</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>
            Current members
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {project.members.map((m) => (
              <div key={m.user._id || m.user} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="avatar">{(m.user.name || 'M').slice(0, 2).toUpperCase()}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{m.user.name || 'Member'}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{m.user.email}</div>
                </div>
                <span style={{
                  fontSize: 11, fontWeight: 700, padding: '2px 8px',
                  borderRadius: 20, textTransform: 'uppercase',
                  background: m.role === 'Admin' ? 'rgba(124,106,247,0.2)' : 'rgba(136,136,170,0.15)',
                  color: m.role === 'Admin' ? 'var(--accent)' : 'var(--text-secondary)',
                }}>
                  {m.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border)', marginBottom: 20 }} />

        <form onSubmit={handleInvite}>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>
            Invite by email
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8, marginBottom: 10 }}>
            <input className="form-input" type="email" placeholder="team@example.com"
              value={email} onChange={(e) => setEmail(e.target.value)} />
            <select className="form-input" style={{ width: 110 }} value={role} onChange={(e) => setRole(e.target.value)}>
              <option>Member</option>
              <option>Admin</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading || !email.trim()}>
            {loading ? 'Inviting...' : 'Send Invite'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MemberModal;
