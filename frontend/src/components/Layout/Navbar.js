import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = ({ title }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/dashboard" className="navbar-brand">
          <span className="navbar-logo">⚡</span>
          <span className="navbar-logo-text">TaskFlow</span>
        </Link>
        {title && (
          <>
            <span className="navbar-sep">/</span>
            <span className="navbar-title">{title}</span>
          </>
        )}
      </div>

      <div className="navbar-right">
        <div className="navbar-user" onClick={() => setMenuOpen(!menuOpen)}>
          <div className="avatar">{initials}</div>
          <span className="navbar-username">{user?.name}</span>
          <span className="navbar-chevron">▾</span>
        </div>

        {menuOpen && (
          <div className="navbar-dropdown">
            <div className="dropdown-info">
              <div className="dropdown-name">{user?.name}</div>
              <div className="dropdown-email">{user?.email}</div>
            </div>
            <hr className="dropdown-divider" />
            <button className="dropdown-item danger" onClick={handleLogout}>
              Sign Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
