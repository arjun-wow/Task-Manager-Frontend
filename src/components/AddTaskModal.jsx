import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, FolderPlus, User } from "lucide-react";
import useProjectStore from "../store/projectStore";
import useTaskStore from "../store/taskStore";
import useModalStore from "../store/modalStore";
import AddProjectModal from "./AddProjectModal";

const AddTaskModal = () => {
  const { projects, fetchProjects, loading: projectsLoading } = useProjectStore();
  const { createTask, loading: creatingTask } = useTaskStore();
  const { closeAddTaskModal } = useModalStore();

  const [showProjectModal, setShowProjectModal] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    projectId: "",
    priority: "MEDIUM",
    dueDate: "",
    assigneeId: "",
  });

  const dateRef = useRef(null);

  // Fetch projects
  useEffect(() => {
    fetchProjects().catch(() => {});
  }, [fetchProjects]);

  // Preselect first project
  useEffect(() => {
    if (!formData.projectId && projects?.length > 0) {
      setFormData((prev) => ({ ...prev, projectId: String(projects[0].id) }));
    }
  }, [projects]);

  // Mock team member fetch — replace later with real API
  useEffect(() => {
    const loadUsers = async () => {
      setLoadingUsers(true);
      try {
        // Simulate API call (replace this with your user API)
        const users = [
          { id: 1, name: "John Doe" },
          { id: 2, name: "Sarah Lee" },
          { id: 3, name: "Mark Patel" },
        ];
        setTeamMembers(users);
      } catch {
        setTeamMembers([]);
      } finally {
        setLoadingUsers(false);
      }
    };
    loadUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClose = () => closeAddTaskModal();

  const handleBackdropClick = (e) => {
    if (e.target.id === "task-backdrop") handleClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.projectId) return alert("Select a project first");

    try {
      await createTask({
        ...formData,
        projectId: Number(formData.projectId),
        assigneeId: formData.assigneeId ? Number(formData.assigneeId) : null,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
      });
      handleClose();
    } catch (err) {
      console.error("Task creation error:", err);
      alert("Failed to create task. Try again.");
    }
  };

  const modalContent = (
    <AnimatePresence>
      <motion.div
        id="task-backdrop"
        onClick={handleBackdropClick}
        className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-[10000]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl w-[90%] max-w-lg"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
              Add New Task
            </h2>
            <button
              onClick={handleClose}
              className="p-2 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
            >
              <X size={22} />
            </button>
          </div>

          {/* If no projects exist */}
          {projects && projects.length === 0 ? (
            <div className="text-center py-10">
              <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-2">
                You don’t have any projects yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Tasks must belong to a project. Create one to start adding tasks.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setShowProjectModal(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow hover:scale-[1.03] transition"
                >
                  <FolderPlus size={16} /> Create Project
                </button>
                <button
                  onClick={handleClose}
                  className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  Close
                </button>
              </div>
              {showProjectModal && (
                <AddProjectModal
                  isOpen={showProjectModal}
                  onClose={() => {
                    setShowProjectModal(false);
                    fetchProjects();
                  }}
                />
              )}
            </div>
          ) : projectsLoading ? (
            <div className="text-center py-12">
              <Loader2 className="animate-spin mx-auto mb-3 text-gray-500" />
              <p className="text-gray-600 dark:text-gray-300">Loading projects...</p>
            </div>
          ) : (
            // ✅ Form content
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Title */}
              <div>
                <label className="block text-sm mb-1 text-gray-600 dark:text-gray-400">
                  Title
                </label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Enter task title"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm mb-1 text-gray-600 dark:text-gray-400">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Enter task details"
                />
              </div>

              {/* Project */}
              <div>
                <label className="block text-sm mb-1 text-gray-600 dark:text-gray-400">
                  Project
                </label>
                <select
                  name="projectId"
                  value={formData.projectId}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Select Project</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Assignee */}
              <div>
                <label className="block text-sm mb-1 text-gray-600 dark:text-gray-400 flex items-center gap-1">
                  <User size={14} /> Assign To
                </label>
                {loadingUsers ? (
                  <div className="text-gray-500 text-sm py-1">Loading team...</div>
                ) : (
                  <select
                    name="assigneeId"
                    value={formData.assigneeId}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Unassigned</option>
                    {teamMembers.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Priority & Due Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1 text-gray-600 dark:text-gray-400">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-1 text-gray-600 dark:text-gray-400">
                    Due Date
                  </label>
                  <input
                    ref={dateRef}
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, dueDate: e.target.value }))
                    }
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={creatingTask}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:brightness-95 transition"
              >
                {creatingTask ? <Loader2 className="animate-spin" /> : "Add Task"}
              </button>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default AddTaskModal;
