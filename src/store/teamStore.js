import { create } from 'zustand';
import api from './api';

const useTeamStore = create((set) => ({
  team: [],
  loading: false,

  // ✅ Fetch all users (everyone can see everyone)
  fetchTeam: async () => {
    set({ loading: true });
    try {
      const res = await api.get('/api/users'); // single, consistent route
      set({ team: res.data, loading: false });
    } catch (err) {
      console.error("Fetch team error:", err.message);
      set({ loading: false, team: [] });
    }
  },

  // ✅ Admin: update user role
  updateUserRole: async (userId, role) => {
    try {
      const res = await api.put(`/api/users/${userId}/role`, { role });
      const updatedUser = res.data;

      // Update the local team array
      set((state) => ({
        team: state.team.map((user) =>
          user.id === userId ? { ...user, ...updatedUser } : user
        ),
      }));
    } catch (err) {
      console.error("Update user role error:", err);
      throw err;
    }
  },

  // ✅ Admin: delete user
  deleteUser: async (userId) => {
    try {
      await api.delete(`/api/users/${userId}`);
      set((state) => ({
        team: state.team.filter((user) => user.id !== userId),
      }));
    } catch (err) {
      console.error("Delete user error:", err);
      throw err;
    }
  },
}));

export default useTeamStore;
