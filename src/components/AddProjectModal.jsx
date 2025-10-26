import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useProjectStore from '../store/projectStore';

export default function AddProjectModal() {
  const { isAddingProject, toggleAddProjectModal, createProject } = useProjectStore();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    createProject(name, description);
    // Modal will close via state change in the store
  };

  return (
    <AnimatePresence>
      {isAddingProject && (
        <motion.div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-xl font-semibold text-primary mb-6">Create New Project</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                className="w-full px-4 py-2 border dark:border-gray-700 dark:bg-gray-700 rounded-lg"
                placeholder="Project Name (e.g., Market research 2024)"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <textarea
                className="w-full px-4 py-2 border dark:border-gray-700 dark:bg-gray-700 rounded-lg"
                placeholder="Project Description (optional)"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => toggleAddProjectModal(false)}
                  className="px-5 py-2 rounded-lg border dark:border-gray-700 font-medium hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-primary text-white font-medium hover:bg-accent"
                >
                  Create Project
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}