import { useState, useEffect } from "react";
import useTaskStore from "../store/taskStore";
import useProjectStore from "../store/projectStore";
import useTeamStore from "../store/teamStore";
import { motion } from 'framer-motion';
import { X, Calendar, User, Flag, Tag } from 'lucide-react';

export default function AddTaskModal({ onClose, projectId: initialProjectId }){
  const { addTask } = useTaskStore();
  const { projects, currentProject, fetchProjects } = useProjectStore();
  const { team, fetchTeam } = useTeamStore();

  const [form, setForm] = useState({ 
    title: '', 
    description: '', 
    priority: 'MEDIUM', 
    status: 'TO_DO',
    dueDate: '',
    assigneeId: '',
    projectId: initialProjectId || '' 
  });

  useEffect(() => {
    fetchProjects();
    fetchTeam();
  }, [fetchProjects, fetchTeam]);

  useEffect(() => {
    // If no projectId provided, use current project or first project
    if (!form.projectId && currentProject) {
      setForm(prev => ({ ...prev, projectId: currentProject.id }));
    } else if (!form.projectId && projects.length > 0) {
      setForm(prev => ({ ...prev, projectId: projects[0].id }));
    }
  }, [currentProject, projects, form.projectId]);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      alert('Task title is required');
      return;
    }
    if (!form.projectId) {
      alert('Please select a project');
      return;
    }
    
    try {
      await addTask({ 
        ...form, 
        dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
        assigneeId: form.assigneeId ? Number(form.assigneeId) : null,
        projectId: Number(form.projectId)
      });
      
      onClose();
    } catch (error) {
      console.error('Error adding task:', error);
      alert('Failed to add task. Please try again.');
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const getProjectTeam = () => {
    if (!form.projectId) return team;
    const project = projects.find(p => p.id === Number(form.projectId));
    return project?.team || team;
  };

  return (
    <motion.div 
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg shadow-lg max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Add New Task</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {/* Project Selection */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Tag size={16} />
              Project
            </label>
            <select 
              name="projectId"
              value={form.projectId} 
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            >
              <option value="">Select a project</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          {/* Task Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Task Title *
            </label>
            <input 
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" 
              placeholder="What needs to be done?" 
              name="title"
              value={form.title} 
              onChange={handleChange}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea 
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" 
              placeholder="Add details about this task..." 
              rows={3} 
              name="description"
              value={form.description} 
              onChange={handleChange} 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Assignee */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <User size={16} />
                Assign To
              </label>
              <select 
                name="assigneeId" 
                value={form.assigneeId} 
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Unassigned</option>
                {getProjectTeam().map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select 
                name="status" 
                value={form.status} 
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="TO_DO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Flag size={16} />
                Priority
              </label>
              <select 
                name="priority" 
                value={form.priority} 
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Calendar size={16} />
                Due Date
              </label>
              <input 
                type="datetime-local" 
                name="dueDate"
                value={form.dueDate} 
                onChange={handleChange} 
                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" 
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button 
              type="button" 
              onClick={onClose}
              className="px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-5 py-2 rounded-lg bg-primary text-white font-medium hover:bg-accent transition-colors"
            >
              Add Task
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}