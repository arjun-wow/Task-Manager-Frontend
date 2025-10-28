import { create } from 'zustand';
import api from './api';

const useTaskStore = create((set, get) => ({
  tasks: [],
  loading: false,
  error: null,

  fetchTasks: async (projectId) => {
    if (!projectId) {
      set({ tasks: [], loading: false });
      return;
    }

    set({ loading: true, error: null });
    try {
      const res = await api.get(`/api/tasks?projectId=${projectId}`);
      set({ tasks: res.data, loading: false });
    } catch (err) {
      console.error("Fetch tasks error", err.message);
      set({ error: err.message, loading: false, tasks: [] });
    }
  },

  addTask: async (payload) => {
    try {
      const res = await api.post('/api/tasks', payload);
      set((s) => ({ tasks: [res.data, ...s.tasks] }));
      return res.data;
    } catch (err) {
      console.error("Add task error", err.message);
      throw err;
    }
  },

  updateTask: async (id, payload) => {
    try {
      const res = await api.put(`/api/tasks/${id}`, payload);
      set((s) => ({ tasks: s.tasks.map(t => t.id === id ? res.data : t) }));
      return res.data;
    } catch (err) {
      console.error("Update task error", err.message);
      throw err;
    }
  },

  updateTaskStatus: async (taskId, newStatus) => {
    const task = get().tasks.find(t => t.id === taskId);
    if (!task) return;

    // Optimistic update
    set((s) => ({
      tasks: s.tasks.map(t =>
        t.id === taskId ? { ...t, status: newStatus } : t
      ),
    }));

    try {
      const updatedTask = await get().updateTask(taskId, { status: newStatus });
      // Sync with server response
      set((s) => ({ 
        tasks: s.tasks.map(t => 
          t.id === taskId 
            ? { ...updatedTask, assignee: updatedTask.assignee || task.assignee }
            : t
        ) 
      }));
    } catch (err) {
      // Revert on error
      set((s) => ({
        tasks: s.tasks.map(t =>
          t.id === taskId ? task : t
        ),
      }));
      console.error("Update task status error", err);
      throw err;
    }
  },

  deleteTask: async (id) => {
    try {
      await api.delete(`/api/tasks/${id}`);
      set((s) => ({ tasks: s.tasks.filter(t => t.id !== id) }));
    } catch (err) {
      console.error("Delete task error", err.message);
      throw err;
    }
  },
}));

export default useTaskStore;