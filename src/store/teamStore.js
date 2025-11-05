import { create } from 'zustand';
import api from './api';

const useTeamStore = create((set, get) => ({ // <-- INJECTED 'get'
  team: [],
  loading: false,

  fetchTeam: async () => {
    set({ loading: true });
    try {
      const res = await api.get('/api/users'); // This is already the correct admin route
      set({ team: res.data, loading: false });
    } catch (err) {
      console.error("Fetch team error", err.message);
      set({ loading: false, team: [] }); // <-- MODIFIED: Set to empty array on error
    }
  },

  // --- INJECTED NEW FUNCTIONS ---

  /**
   * [ADMIN ONLY] Updates a user's role.
   */
  updateUserRole: async (userId, role) => {
      try {
          const res = await api.put(`/api/users/${userId}/role`, { role });
          const updatedUser = res.data;
          
          // Update the user in the local 'team' state
          set((state) => ({
              team: state.team.map(user => 
                  user.id === userId ? { ...user, ...updatedUser } : user // Ensure full user object is updated
              )
          }));
          // Optionally show success toast here
      } catch (err) {
          console.error("Update user role error:", err);
          // Throw error so the component can catch it
          throw err; 
      }
  },

  /**
   * [ADMIN ONLY] Deletes a user.
   */
  deleteUser: async (userId) => {
      try {
          await api.delete(`/api/users/${userId}`);
          
          // Remove the user from the local 'team' state
          set((state) => ({
              team: state.team.filter(user => user.id !== userId)
          }));
          // Optionally show success toast here
      } catch (err) {
          console.error("Delete user error:", err);
          // Throw error so the component can catch it
          throw err; 
      }
  }
  // --- END INJECTION ---

}));

export default useTeamStore;

