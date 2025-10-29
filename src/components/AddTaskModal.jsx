import { useState, useEffect } from "react";
import useTaskStore from "../store/taskStore";
import useProjectStore from "../store/projectStore";
import useTeamStore from "../store/teamStore";
import { motion } from 'framer-motion';
import { X, Calendar, User, Flag, Tag } from 'lucide-react';

export default function AddTaskModal({ onClose, projectId: initialProjectId }) {
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
    if (!form.projectId && currentProject) {
      setForm(prev => ({ ...prev, projectId: currentProject.id }));
    } else if (!form.projectId && projects.length > 0) {
      setForm(prev => ({ ...prev, projectId: projects[0].id }));
    }
  }, [currentProject, projects, form.projectId]);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return alert('Task title is required');
    if (!form.projectId) return alert('Please select a project');

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
      className="fixed inset-0 bg-black/60 backdrop-blur-xl flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-gradient-to-br from-gray-900/80 via-gray-800/70 to-purple-900/60 dark:from-gray-900/90 dark:to-purple-800/70 rounded-2xl p-8 w-full max-w-lg shadow-2xl border border-white/10 relative overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
      >
        {}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-400/5 to-transparent pointer-events-none rounded-2xl" />

        {/*Header*/} 
        <div className="flex items-center justify-between mb-6 relative z-10">
          <h3 className="text-2xl font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Add New Task
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        {/*Form*/}
        <form onSubmit={submit} className="space-y-5 relative z-10">
          {/* Project */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <Tag size={16} />
              Project
            </label>
            <select
              name="projectId"
              value={form.projectId}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-white/5 text-gray-100 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
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

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Task Title *
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="What needs to be done?"
              className="w-full px-4 py-2.5 bg-white/5 text-gray-100 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-500 transition-all"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Add details about this task..."
              rows={3}
              className="w-full px-4 py-2.5 bg-white/5 text-gray-100 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-500 transition-all"
            />
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Assignee */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <User size={16} /> Assign To
              </label>
              <select
                name="assigneeId"
                value={form.assigneeId}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white/5 text-gray-100 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
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
              <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white/5 text-gray-100 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                <option value="TO_DO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <Flag size={16} /> Priority
              </label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white/5 text-gray-100 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <Calendar size={16} /> Due Date
              </label>
              <input
                type="datetime-local"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white/5 text-gray-100 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg border border-white/10 text-gray-300 hover:bg-white/10 transition-all font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Add Task
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
