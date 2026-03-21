import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

const TaskModal = ({ task, defaultStatus, columns, members, onSave, onClose }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: defaultStatus || columns?.[0] || 'Todo',
    priority: 'Medium',
    assigneeId: '',
    dueDate: '',
    tags: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        status: task.status || columns?.[0],
        priority: task.priority || 'Medium',
        assigneeId: task.assignee?._id || task.assignee || '',
        dueDate: task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : '',
        tags: task.tags?.join(', ') || '',
      });
    }
  }, [task]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setLoading(true);
    try {
      const payload = {
        ...form,
        tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
        assigneeId: form.assigneeId || null,
        dueDate: form.dueDate || null,
      };
      await onSave(payload);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 520 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{task ? 'Edit Task' : 'New Task'}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input className="form-input" placeholder="What needs to be done?"
              value={form.title} onChange={(e) => set('title', e.target.value)} autoFocus />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-input" rows={3} placeholder="Add more details..."
              value={form.description} onChange={(e) => set('description', e.target.value)} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-input" value={form.status} onChange={(e) => set('status', e.target.value)}>
                {columns.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Priority</label>
              <select className="form-input" value={form.priority} onChange={(e) => set('priority', e.target.value)}>
                {['Low', 'Medium', 'High', 'Critical'].map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Assignee</label>
              <select className="form-input" value={form.assigneeId} onChange={(e) => set('assigneeId', e.target.value)}>
                <option value="">Unassigned</option>
                {members?.map((m) => (
                  <option key={m.user._id || m.user} value={m.user._id || m.user}>
                    {m.user.name || 'Member'}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Due Date</label>
              <input className="form-input" type="date"
                value={form.dueDate} onChange={(e) => set('dueDate', e.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Tags (comma separated)</label>
            <input className="form-input" placeholder="e.g. frontend, bug, v2"
              value={form.tags} onChange={(e) => set('tags', e.target.value)} />
          </div>

          <div className="flex gap-1" style={{ justifyContent: 'flex-end', marginTop: 8 }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading || !form.title.trim()}>
              {loading ? 'Saving...' : task ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
