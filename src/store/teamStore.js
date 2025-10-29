import { create } from 'zustand';
import api from './api';

const useTeamStore = create((set) => ({
  team: [],
  loading: false,

  fetchTeam: async () => {
    set({ loading: true });
    try {
      const res = await api.get('/api/users');
      set({ team: res.data, loading: false });
    } catch (err) {
      console.error("Fetch team error", err.message);
      set({ loading: false });
      set({ team: [
        { id: 1, name: 'Dana R.', role: 'Project Manager', avatarUrl: 'https://i.pravatar.cc/150?img=1' },
        { id: 2, name: 'Elon S.', role: 'Key Account Plann.', avatarUrl: 'https://i.pravatar.cc/150?img=2' },
        { id: 3, name: 'Nancy W.', role: 'Account Manager', avatarUrl: 'https://i.pravatar.cc/150?img=3' },
        { id: 4, name: 'James M.', role: 'Digital Manager', avatarUrl: 'https://i.pravatar.cc/150?img=4' },
      ]});
    }
  },
}));

export default useTeamStore;