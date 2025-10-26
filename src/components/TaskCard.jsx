import { motion } from "framer-motion";
import { Edit2, Trash2 } from 'lucide-react';
import useTaskStore from "../store/taskStore";
import { memo } from 'react'; // <-- 1. Import memo

// ... (priorityColors const is the same) ...

// 2. Wrap your entire component in memo()
const TaskCard = memo(function TaskCard({ task }){
  const { deleteTask } = useTaskStore();

  // ... (rest of your component code is the same) ...
  
  return (
    <motion.div 
      // ... (rest of your JSX is the same) ...
    >
      {/* ... (rest of your JSX is the same) ... */}
    </motion.div>
  );
});

export default TaskCard;