import { create } from 'zustand';

const useAddTaskModalStore = create((set) => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}));

export default useAddTaskModalStore;
