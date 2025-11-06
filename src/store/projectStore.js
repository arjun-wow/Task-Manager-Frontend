import { create } from 'zustand';
import api from './api';
import useAuthStore from './authStore';

const useProjectStore = create((set, get) => ({
  projects: [],
  currentProject: null,
  isAddingProject: false,
  loading: false,
  creating: false,

  toggleAddProjectModal: (isOpen) => set({ isAddingProject: isOpen }),

  fetchProjects: async () => {
    set({ loading: true });
    try {
      const res = await api.get('/api/projects');
      const sortedProjects = (res?.data || []).sort((a, b) => a.name.localeCompare(b.name));
      set({ projects: sortedProjects, loading: false });
      if (sortedProjects.length > 0 && !get().currentProject)
        set({ currentProject: sortedProjects[0] });
      else if (sortedProjects.length === 0) set({ currentProject: null });
      return sortedProjects;
    } catch (err) {
      console.error('Fetch projects error:', err);
      set({ loading: false, projects: [] });
      throw err;
    }
  },

  setCurrentProject: (project) => set({ currentProject: project }),

  createProject: async (name, description, pmoId = null) => {
    if (!name || name.trim() === '') throw new Error("Project name cannot be empty");
    if (get().creating) return;

    set({ creating: true });
    try {
      const res = await api.post('/api/projects', { name: name.trim(), description, pmoId });
      const newProject = res.data;
      set((state) => ({
        projects: [...state.projects, newProject].sort((a, b) => a.name.localeCompare(b.name)),
        currentProject: newProject,
      }));
      set({ isAddingProject: false });
      return newProject;
    } catch (err) {
      if (err.response?.status === 409)
        alert('A project with this name already exists.');
      else console.error('Create project error:', err);
      throw err;
    } finally {
      set({ creating: false });
    }
  },

  deleteProject: async (projectId) => {
    if (!projectId) throw new Error("Invalid Project ID");
    try {
      await api.delete(`/api/projects/${projectId}`);
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== projectId),
      }));
      if (get().currentProject?.id === projectId) {
        const remaining = get().projects;
        set({ currentProject: remaining.length > 0 ? remaining[0] : null });
      }
    } catch (err) {
      console.error('Delete project error:', err);
      const msg = err?.response?.data?.message || 'Failed to delete project.';
      alert(msg);
      throw err;
    }
  },
}));

export default useProjectStore;
