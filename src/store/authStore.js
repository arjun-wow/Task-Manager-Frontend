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
    try {
        const res = await axios.post(`${API_BASE}/api/auth/login`, { email, password });
        const { token, ...user } = res.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        set({ user, token });
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`; 
    } catch (error) {
        console.error("Login failed:", error.response?.data?.message || error.message);
        
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ user: null, token: null });
        throw error; 
    }
  },

  register: async (name, email, password) => {
     try {
        const res = await axios.post(`${API_BASE}/api/auth/register`, { name, email, password });
        const { token, ...user } = res.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        set({ user, token });
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`; 
     } catch(error) {
         console.error("Registration failed:", error.response?.data?.message || error.message);
         
         localStorage.removeItem('token');
         localStorage.removeItem('user');
         set({ user: null, token: null });
         throw error; 
     }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization']; 
    set({ user: null, token: null });
    
  },
  
  setTokenAndUserFromUrl: async (token) => {
      if (!token) {
          throw new Error("No token provided");
      }
      try {
          localStorage.setItem('token', token);
          set({ token });
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          const res = await api.get('/api/auth/me'); 
          const user = res.data;

          localStorage.setItem('user', JSON.stringify(user));
          set({ user });

      } catch (error) {
          console.error("OAuth callback failed:", error.response?.data?.message || error.message);
          get().logout(); 
          throw error; 
      }
  }

}));

const initialToken = localStorage.getItem('token');
if (initialToken) {
  api.defaults.headers.common['Authorization'] = `Bearer ${initialToken}`;
}

export default useAuthStore;

