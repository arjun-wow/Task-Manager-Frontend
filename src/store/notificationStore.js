import { create } from "zustand";
import api from "./api";

const useNotificationStore = create((set, get) => ({
  notifications: [],
  loading: false,

  fetchNotifications: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/api/notifications");
      set({ notifications: res.data, loading: false });
    } catch (err) {
      console.error("Fetch notifications error:", err);
      set({ notifications: [], loading: false });
    }
  },

  markAsRead: async (id) => {
    try {
      await api.put(`/api/notifications/${id}/read`);
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        ),
      }));
    } catch (err) {
      console.error("Mark as read error:", err);
    }
  },
}));

export default useNotificationStore;
