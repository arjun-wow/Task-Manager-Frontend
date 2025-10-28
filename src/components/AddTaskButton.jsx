import { useState } from 'react';
import { Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AddTaskModal from './AddTaskModal';

export default function AddTaskButton({ projectId, variant = "default" }) {
  const [showModal, setShowModal] = useState(false);

  if (variant === "floating") {
    return (
      <>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowModal(true)}
          className="fixed bottom-8 right-8 w-14 h-14 bg-primary hover:bg-accent text-white rounded-full shadow-lg flex items-center justify-center z-40 transition-colors duration-200"
        >
          <Plus size={24} />
        </motion.button>

        <AnimatePresence>
          {showModal && (
            <AddTaskModal 
              onClose={() => setShowModal(false)} 
              projectId={projectId} 
            />
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-accent text-white rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
      >
        <Plus size={18} />
        Add Task
      </button>

      <AnimatePresence>
        {showModal && (
          <AddTaskModal 
            onClose={() => setShowModal(false)} 
            projectId={projectId} 
          />
        )}
      </AnimatePresence>
    </>
  );
}