import { create } from 'zustand';
import api from './api'; // Use our authenticated api instance

const useTaskStore = create((set, get) => ({
  tasks: [],
  loading: false,

  fetchTasks: async (projectId) => {
    if (!projectId) return set({ tasks: [] });
    set({ loading: true });
    try {
      const res = await api.get(`/api/tasks?projectId=${projectId}`);
      set({ tasks: res.data, loading: false });
    } catch (err) {
      console.error("Fetch tasks error", err.message);
      set({ loading: false });
    }
  },

  addTask: async (payload) => {
    try {
      const res = await api.post('/api/tasks', payload);
      set((s) => ({ tasks: [res.data, ...s.tasks] }));
    } catch (err) {
      console.error("Add task error", err.message);
    }
  },

  updateTask: async (id, payload) => {
    try {
      const res = await api.put(`/api/tasks/${id}`, payload);
      set((s) => ({ tasks: s.tasks.map(t => t.id === id ? res.data : t) }));
      return res.data; // Return updated task
    } catch (err) {
      console.error("Update task error", err.message);
    }
  },

  deleteTask: async (id) => {
    try {
      await api.delete(`/api/tasks/${id}`);
      set((s) => ({ tasks: s.tasks.filter(t => t.id !== id) }));
    } catch (err) {
      console.error("Delete task error", err.message);
    }
  },

  // Helper to update status (for Kanban)
  updateTaskStatus: async (taskId, newStatus) => {
    const task = get().tasks.find(t => t.id === taskId);
    if (!task) return;

    const updatedTask = await get().updateTask(taskId, { status: newStatus });
    
    // Manually update state to reflect nested assignee data
    set((s) => ({ 
      tasks: s.tasks.map(t => 
        t.id === taskId 
          ? { ...updatedTask, assignee: task.assignee } // Preserve assignee details from frontend state
          : t
      ) 
    }));
  }
}));

export default useTaskStore;