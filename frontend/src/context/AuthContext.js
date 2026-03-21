import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getMe } from '../utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('taskflow_token');
    if (token) {
      getMe()
        .then((res) => setUser(res.data.user))
        .catch(() => {
          localStorage.removeItem('taskflow_token');
          localStorage.removeItem('taskflow_user');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await loginUser({ email, password });
    localStorage.setItem('taskflow_token', res.data.token);
    localStorage.setItem('taskflow_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    toast.success(`Welcome back, ${res.data.user.name}!`);
    return res.data;
  };

  const register = async (name, email, password) => {
    const res = await registerUser({ name, email, password });
    localStorage.setItem('taskflow_token', res.data.token);
    localStorage.setItem('taskflow_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    toast.success(`Account created! Welcome, ${res.data.user.name}!`);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('taskflow_token');
    localStorage.removeItem('taskflow_user');
    setUser(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
