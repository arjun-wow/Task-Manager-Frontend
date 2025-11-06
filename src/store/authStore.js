import { create } from 'zustand';
import axios from 'axios';
import api from './api';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const getUserFromStorage = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Failed to parse user from localStorage", error);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    return null;
  }
};

const useAuthStore = create((set, get) => ({
  user: getUserFromStorage(),
  token: localStorage.getItem('token'),

  login: async (email, password) => {
    const res = await axios.post(`${API_BASE}/api/auth/login`, { email, password });
    const { token, ...user } = res.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, token });
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },

  register: async (name, email, password) => {
    const res = await axios.post(`${API_BASE}/api/auth/register`, { name, email, password });
    const { token, ...user } = res.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, token });
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    set({ user: null, token: null });
  },

  setTokenAndUserFromUrl: async (token) => {
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const res = await api.get('/api/auth/me');
    const user = res.data;
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, token });
  },
}));

const initialToken = localStorage.getItem('token');
if (initialToken) {
  api.defaults.headers.common['Authorization'] = `Bearer ${initialToken}`;
}

export default useAuthStore;
