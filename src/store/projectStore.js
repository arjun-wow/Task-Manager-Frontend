import { create } from 'zustand';
import api from './api';

const useProjectStore = create((set, get) => ({
  projects: [],
  currentProject: null,
  isAddingProject: false,
  loading: false,

  toggleAddProjectModal: (isOpen) => set({ isAddingProject: isOpen }),

  fetchProjects: async () => {
    set({ loading: true });
    try {
      const res = await api.get('/api/projects');
      const sortedProjects = (res?.data || []).sort((a, b) => a.name.localeCompare(b.name));
      set({ projects: sortedProjects, loading: false });

      if (sortedProjects.length > 0 && !get().currentProject) {
        set({ currentProject: sortedProjects[0] });
      } else if (sortedProjects.length === 0) {
        set({ currentProject: null });
      }
      return sortedProjects;
    } catch (err) {
      console.error('Fetch projects error:', err);
      set({ loading: false, projects: [] });
      throw err;
    }
  },

  setCurrentProject: (project) => set({ currentProject: project }),

  createProject: async (name, description) => {
    if (!name || name.trim() === '') {
      console.error("Project name cannot be empty");
      throw new Error("Project name cannot be empty");
    }
    try {
      const res = await api.post('/api/projects', { name: name.trim(), description });
      const newProject = res.data;

      set((state) => ({
        projects: [...state.projects, newProject].sort((a, b) => a.name.localeCompare(b.name)),
      }));

      set({ isAddingProject: false, currentProject: newProject });
      return newProject;
    } catch (err) {
      console.error('Create project error:', err);
      throw err;
    }
  },

  deleteProject: async (projectId) => {
    if (!projectId) {
      console.error("Delete project called with invalid ID");
      throw new Error("Invalid Project ID");
    }
    try {
      const response = await api.delete(`/api/projects/${projectId}`);
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== projectId),
      }));

      if (get().currentProject?.id === projectId) {
        const remainingProjects = get().projects;
        set({ currentProject: remainingProjects.length > 0 ? remainingProjects[0] : null });
      }

      console.log(response.data?.message || "Project deleted");
    } catch (err) {
      console.error('Delete project error:', err);
      const errorMessage = err?.response?.data?.message || 'Failed to delete project. Please try again.';
      alert(errorMessage);
      throw err;
    }
  },
}));

export default useProjectStore;
