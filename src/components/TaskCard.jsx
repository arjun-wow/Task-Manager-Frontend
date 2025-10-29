import { motion } from "framer-motion";
import { memo } from 'react';
import useModalStore from '../store/modalStore'; 
import useTaskStore from "../store/taskStore";   
import { Trash2 } from 'lucide-react';           

// Helper function to get Tailwind classes based on priority
const getPriorityColor = (priority) => {
  switch (priority) {
    case 'LOW': return 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300';
    case 'MEDIUM': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300';
    case 'HIGH': return 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300';
    default: return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'; 
  }
};

const TaskCard = memo(function TaskCard({ task }) {
  const { openTaskDetailModal } = useModalStore();
  const { deleteTask } = useTaskStore();

  const handleClick = () => {
    openTaskDetailModal(task.id); 
  };

  const handleDelete = async (e) => {
    e.stopPropagation(); 

  

    try {
      await deleteTask(task.id);
     
    } catch (error) {
      console.error("Failed to delete task:", error);
      alert("Failed to delete task. Please try again."); 
    }
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className="relative p-4 bg-white/10 dark:bg-gray-800/50 rounded-lg shadow-soft border border-white/10 dark:border-gray-700/50 hover:shadow-md transition cursor-pointer backdrop-blur-sm hover:border-white/20 dark:hover:border-gray-600 group" // Added 'group' for hover effects on children
      onClick={handleClick} 
    >
      {/* Delete Button*/}
      <button
        onClick={handleDelete} 
        className="absolute top-2 right-2 p-1 rounded text-gray-400 dark:text-gray-500 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/50 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100" // Show on hover/focus
        aria-label="Delete task"
        title="Delete task" 
      >
        <Trash2 size={14} />
      </button>

      {/* Task Title*/}
      <h3 className="text-md font-semibold text-black dark:text-gray-100 pr-6 truncate">{task.title}</h3>
      
      {/* Task Description*/}
      <p className="text-sm text-gray-700 dark:text-gray-400 mt-1 line-clamp-2 pr-6">{task.description || ""}</p>

      {/* Footer section with Assignee and Priority */}
      <div className="flex items-center justify-between mt-4">
        {/* Assignee Avatar */}
        {task.assignee ? (
          <img
            src={task.assignee.avatarUrl || `https://i.pravatar.cc/40?u=${task.assignee.id}`} 
            alt={task.assignee.name || 'Assignee'}
            title={task.assignee.name || 'Assignee'} 
            className="w-7 h-7 rounded-full border-2 border-white dark:border-gray-800 object-cover" 
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs text-gray-500" title="Unassigned">?</div>
        )}

        {/* Priority Badge */}
         <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getPriorityColor(task.priority)}`}>
            {task.priority ? task.priority.toLowerCase() : 'medium'} priority
         </span>
      </div>
    </motion.div>
  );
});

export default TaskCard;

