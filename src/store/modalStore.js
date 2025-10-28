import { create } from 'zustand';

const useModalStore = create((set) => ({
  isTaskDetailModalOpen: false,
  selectedTaskId: null,
  
  openTaskDetailModal: (taskId) => set({ isTaskDetailModalOpen: true, selectedTaskId: taskId }),
  closeTaskDetailModal: () => set({ isTaskDetailModalOpen: false, selectedTaskId: null }),
}));

export default useModalStore;

