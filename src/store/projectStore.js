import { create } from 'zustand';
import api from './api';

const useProjectStore = create((set, get) => ({ // <-- Add get
  projects: [],
  currentProject: null,
  isAddingProject: false, // <-- 1. ADD THIS
  
  // 2. ADD THIS FUNCTION
  toggleAddProjectModal: (isOpen) => set({ isAddingProject: isOpen }),

  fetchProjects: async () => {
    try {
      const res = await api.get('/api/projects');
      set({ projects: res.data });
      // Optionally set the first project as current
      if (res.data.length > 0 && !get().currentProject) {
        set({ currentProject: res.data[0] });
      }
    } catch (err) {
      console.error('Fetch projects error', err.message);
    }
  },

  setCurrentProject: (project) => set({ currentProject: project }),

  createProject: async (name, description) => {
    try {
      const res = await api.post('/api/projects', { name, description });
      set((state) => ({ projects: [res.data, ...state.projects] }));
      set({ isAddingProject: false }); // <-- 3. ADD THIS (to close modal on success)
    } catch (err) {
      console.error('Create project error', err.message);
    }
  }
}));

export default useProjectStore;