// src/components/AddTaskModal.jsx
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, FolderPlus } from "lucide-react";
import useProjectStore from "../store/projectStore";
import useTaskStore from "../store/taskStore";
import useModalStore from "../store/modalStore";
import AddProjectModal from "./AddProjectModal";
import api from "../store/api";
import useAuthStore from "../store/authStore";

const AddTaskModal = () => {
  const { projects, fetchProjects, loading: projectsLoading } = useProjectStore();
  const { addTask, loading: creatingTask } = useTaskStore();
  const { closeAddTaskModal } = useModalStore();
  const { user } = useAuthStore();

  const [showProjectModal, setShowProjectModal] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    projectId: "",
    priority: "MEDIUM",
    dueDate: "",
    assigneeId: "",
  });

  // Fetch projects on mount
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Fetch all users for assignee list (everyone can assign everyone)
  useEffect(() => {
    const loadUsers = async () => {
      setLoadingUsers(true);
      try {
        const res = await api.get("/api/users"); // expects admin/public endpoint returning all users
        setTeamMembers(res.data || []);
      } catch (error) {
        console.error("Failed to fetch users:", error);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.projectId) return alert("Please select a project first");

    try {
      await addTask({
        ...formData,
        projectId: Number(formData.projectId),
        assigneeId: formData.assigneeId ? Number(formData.assigneeId) : null,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
      });

      closeAddTaskModal();
      // reset form if you want (optional)
      setFormData({
        title: "",
        description: "",
        projectId: "",
        priority: "MEDIUM",
        dueDate: "",
        assigneeId: "",
      });
    } catch (err) {
      console.error("Task creation failed:", err);
      alert("Failed to create task.");
    }
  };

  return ReactDOM.createPortal(
    <AnimatePresence>
      <motion.div
        id="task-backdrop"
        onClick={(e) => e.target.id === "task-backdrop" && closeAddTaskModal()}
        className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-[10000]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl w-[90%] max-w-lg"
        >
          <button
            onClick={closeAddTaskModal}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X size={20} />
          </button>

          {projectsLoading ? (
            <div className="text-center py-8">
              <Loader2 className="animate-spin mx-auto mb-3" />
              <p>Loading projects...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-10">
              <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
                No Projects Found
              </h3>
              <p className="text-sm mb-6 text-gray-500 dark:text-gray-400">
                You must create a project before adding tasks.
              </p>
              <button
                onClick={() => setShowProjectModal(true)}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-md hover:scale-[1.03] transition"
              >
                <FolderPlus size={16} className="inline mr-2" />
                Create Project
              </button>

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
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                Add New Task
              </h2>

              {/* Title */}
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Task title"
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-900"
                required
              />

              {/* Description */}
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Description"
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-900"
              />

              {/* Project */}
              <select
                name="projectId"
                value={formData.projectId}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-900"
              >
                <option value="">Select Project</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>

              {/* Assignee */}
              <select
                name="assigneeId"
                value={formData.assigneeId}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-900"
              >
                <option value="">Unassigned</option>
                {loadingUsers ? (
                  <option disabled>Loading users...</option>
                ) : (
                  teamMembers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.role})
                    </option>
                  ))
                )}
              </select>

              {/* Priority & Due Date (added) */}
              <div className="grid grid-cols-2 gap-3">
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-900"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>

                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-900"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={creatingTask}
                className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold"
              >
                {creatingTask ? <Loader2 className="animate-spin mx-auto" /> : "Add Task"}
              </button>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

export default AddTaskModal;
