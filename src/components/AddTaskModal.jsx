import { useState, useEffect } from "react";
import useTaskStore from "../store/taskStore";
import useProjectStore from "../store/projectStore";
import { motion } from 'framer-motion'; // <-- 1. IMPORTED

export default function AddTaskModal({ onClose, projectId }){
  const { addTask } = useTaskStore();
  const { currentProject } = useProjectStore();
  const [team, setTeam] = useState([]);

  const [form, setForm] = useState({ 
    title: '', 
    description: '', 
    priority: 'MEDIUM', 
    status: 'TO_DO',
    dueDate: '',
    assigneeId: '',
    projectId: projectId 
  });

  // Load project team into modal for assignment
  useEffect(() => {
    if (currentProject) {
      setTeam(currentProject.team);
    }
  }, [currentProject]);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return alert('Title required');
    
    await addTask({ 
      ...form, 
      dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
      assigneeId: form.assigneeId ? Number(form.assigneeId) : null
    });
    
    if (onClose) onClose();
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    // 2. ADD MOTION PROPS TO BACKDROP
    <motion.div 
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* 3. ADD MOTION PROPS TO MODAL PANEL */}
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg shadow-lg"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.2 }}
      >
        <h3 className="text-xl font-semibold text-primary mb-6">Add New Task</h3>
        <form onSubmit={submit} className="space-y-4">
          <input 
            className="w-full px-4 py-2 border dark:border-gray-700 dark:bg-gray-700 rounded-lg" 
            placeholder="Task Title" 
            name="title"
            value={form.title} 
            onChange={handleChange} 
          />
          <textarea 
            className="w-full px-4 py-2 border dark:border-gray-700 dark:bg-gray-700 rounded-lg" 
            placeholder="Description" 
            rows={3} 
            name="description"
            value={form.description} 
            onChange={handleChange} 
          />
          <div className="grid grid-cols-2 gap-4">
            <select name="assigneeId" value={form.assigneeId} onChange={handleChange} className="px-4 py-2 border dark:border-gray-700 dark:bg-gray-700 rounded-lg">
              <option value="">Assign to...</option>
              {team.map((/** @type {any} */ user) => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>
            <select name="status" value={form.status} onChange={handleChange} className="px-4 py-2 border dark:border-gray-700 dark:bg-gray-700 rounded-lg">
              <option value="TO_DO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
            <select name="priority" value={form.priority} onChange={handleChange} className="px-4 py-2 border dark:border-gray-700 dark:bg-gray-700 rounded-lg">
              <option value="HIGH">High Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="LOW">Low Priority</option>
            </select>
            <input 
              type="date" 
              name="dueDate"
              value={form.dueDate} 
              onChange={handleChange} 
              className="px-4 py-2 border dark:border-gray-700 dark:bg-gray-700 rounded-lg" 
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-5 py-2 rounded-lg border dark:border-gray-700 font-medium hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
            <button type="submit" className="px-5 py-2 rounded-lg bg-primary text-white font-medium hover:bg-accent">Add Task</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}