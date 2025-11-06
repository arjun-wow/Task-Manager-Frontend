import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import useModalStore from "../store/modalStore";

export default function AddTaskButton({ variant = "default" }) {
  const { openAddTaskModal } = useModalStore();

  if (variant === "floating") {
    return (
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={openAddTaskModal}
        className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 text-white rounded-full shadow-lg flex items-center justify-center z-[9999] transition-all duration-200"
      >
        <Plus size={24} />
      </motion.button>
    );
  }

  return (
    <button
      onClick={openAddTaskModal}
      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 text-white rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
    >
      <Plus size={18} />
      Add Task
    </button>
  );
}
