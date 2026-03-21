import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import './Auth.css';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error('Please fill all fields');
    if (form.password !== form.confirm) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">
          <span className="auth-logo">⚡</span>
          <span className="auth-logo-text">TaskFlow</span>
        </div>
        <h1 className="auth-tagline">Your team.<br />One board.</h1>
        <p className="auth-sub">Create your workspace in seconds and start shipping.</p>
        <div className="auth-features">
          <div className="auth-feature">✦ Free to get started</div>
          <div className="auth-feature">✦ Invite unlimited team members</div>
          <div className="auth-feature">✦ Admin & Member roles</div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <h2 className="auth-title">Create account</h2>
          <p className="auth-desc">Join TaskFlow and start managing your projects</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" type="text" name="name"
                placeholder="Avinash Kamble" value={form.name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" name="email"
                placeholder="you@example.com" value={form.email} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" name="password"
                placeholder="Min. 6 characters" value={form.password} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input className="form-input" type="password" name="confirm"
                placeholder="Re-enter password" value={form.confirm} onChange={handleChange} />
            </div>
            <button className="btn btn-primary btn-lg auth-btn" type="submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
