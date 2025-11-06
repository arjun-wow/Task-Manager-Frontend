import { create } from "zustand";

const useModalStore = create((set) => ({
  // 🔹 Add Task Modal
  isAddTaskModalOpen: false,
  openAddTaskModal: () => set({ isAddTaskModalOpen: true }),
  closeAddTaskModal: () => set({ isAddTaskModalOpen: false }),

  // 🔹 Task Detail Modal (future use)
  isTaskDetailModalOpen: false,
  selectedTaskId: null,
  openTaskDetailModal: (taskId) =>
    set({ isTaskDetailModalOpen: true, selectedTaskId: taskId }),
  closeTaskDetailModal: () =>
    set({ isTaskDetailModalOpen: false, selectedTaskId: null }),
}));

export default useModalStore;
