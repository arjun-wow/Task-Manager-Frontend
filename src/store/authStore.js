import { create } from 'zustand';
import axios from 'axios'; // Use standard axios for login/register
import api from './api'; // Use the authenticated instance for fetching user data

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Helper function to safely parse user from localStorage
const getUserFromStorage = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Failed to parse user from localStorage", error);
    localStorage.removeItem('user'); // Clear corrupted data
    localStorage.removeItem('token');
    return null;
  }
};


const useAuthStore = create((set, get) => ({ // Add get here
  user: getUserFromStorage(),
  token: localStorage.getItem('token'),
  
  login: async (email, password) => {
    try {
        const res = await axios.post(`${API_BASE}/api/auth/login`, { email, password });
        const { token, ...user } = res.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        set({ user, token });
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Update header for authenticated instance
    } catch (error) {
        console.error("Login failed:", error.response?.data?.message || error.message);
        // Clear potential stale data on login failure
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ user: null, token: null });
        throw error; // Re-throw error so component can catch it
    }
  },

  register: async (name, email, password) => {
     try {
        const res = await axios.post(`${API_BASE}/api/auth/register`, { name, email, password });
        const { token, ...user } = res.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        set({ user, token });
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Update header
     } catch(error) {
         console.error("Registration failed:", error.response?.data?.message || error.message);
         // Clear potential stale data on registration failure
         localStorage.removeItem('token');
         localStorage.removeItem('user');
         set({ user: null, token: null });
         throw error; // Re-throw error
     }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization']; // Clear header
    set({ user: null, token: null });
    // Optionally redirect to login page here or let the router handle it
    // window.location.href = '/login';
  },
  
  // --- NEW FUNCTION FOR GOOGLE OAUTH CALLBACK ---
  setTokenAndUserFromUrl: async (token) => {
      if (!token) {
          throw new Error("No token provided");
      }
      try {
          // 1. Set the token immediately
          localStorage.setItem('token', token);
          set({ token });
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Update header for next request

          // 2. Fetch the user details using the new token
          const res = await api.get('/api/auth/me'); // Use authenticated instance
          const user = res.data;

          // 3. Save the fetched user details
          localStorage.setItem('user', JSON.stringify(user));
          set({ user });

      } catch (error) {
          console.error("OAuth callback failed:", error.response?.data?.message || error.message);
          // Clear potentially invalid token/user data if fetching user fails
          get().logout(); // Use the logout function to clear everything
          throw error; // Re-throw so the callback page knows it failed
      }
  }

}));

// Initialize Authorization header on load if token exists
const initialToken = localStorage.getItem('token');
if (initialToken) {
  api.defaults.headers.common['Authorization'] = `Bearer ${initialToken}`;
}

export default useAuthStore;

