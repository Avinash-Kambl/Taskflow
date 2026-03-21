import React from 'react';
import { format } from 'date-fns';
import './TaskCard.css';

const PRIORITY_COLORS = {
  Low: '#34d399', Medium: '#fbbf24', High: '#f87171', Critical: '#ff4444',
};

const TaskCard = ({ task, onEdit, onDelete }) => {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Done';

  const initials = task.assignee?.name
    ? task.assignee.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : null;

  return (
    <div className="task-card" onClick={onEdit}>
      <div className="task-card-top">
        <div className="task-priority-dot" style={{ background: PRIORITY_COLORS[task.priority] || '#8888aa' }} />
        <div className="task-actions" onClick={(e) => e.stopPropagation()}>
          <button className="task-action-btn" onClick={onEdit} title="Edit">✎</button>
          <button className="task-action-btn danger" onClick={() => { if(window.confirm('Delete task?')) onDelete(); }} title="Delete">✕</button>
        </div>
      </div>

      <h4 className="task-title">{task.title}</h4>

      {task.description && (
        <p className="task-desc">{task.description}</p>
      )}

      {task.tags?.length > 0 && (
        <div className="task-tags">
          {task.tags.map((tag, i) => (
            <span key={i} className="task-tag">{tag}</span>
          ))}
        </div>
      )}

      <div className="task-card-footer">
        <div className="task-footer-left">
          {task.dueDate && (
            <span className={`task-due ${isOverdue ? 'overdue' : ''}`}>
              📅 {format(new Date(task.dueDate), 'MMM d')}
            </span>
          )}
          <span className={`badge badge-${task.priority?.toLowerCase()}`}>{task.priority}</span>
        </div>
        {initials && (
          <div className="avatar avatar-sm" title={task.assignee?.name}>{initials}</div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
