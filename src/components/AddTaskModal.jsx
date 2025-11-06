import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, FolderPlus, User } from "lucide-react";
import useProjectStore from "../store/projectStore";
import useTaskStore from "../store/taskStore";
import useModalStore from "../store/modalStore";
import AddProjectModal from "./AddProjectModal";
import api from "../store/api";
import useAuthStore from "../store/authStore";

const AddTaskModal = () => {
  const { projects, fetchProjects, loading: projectsLoading } = useProjectStore();
  const { addTask, loading } = useTaskStore();
  const { user } = useAuthStore();
  const { closeAddTaskModal } = useModalStore();

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

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    if (user?.role === "ADMIN" || projects.length > 0) {
      const loadUsers = async () => {
        setLoadingUsers(true);
        try {
          const res = await api.get("/api/users/team");
          setTeamMembers(res.data || []);
        } catch {
          setTeamMembers([]);
        } finally {
          setLoadingUsers(false);
        }
      };
      loadUsers();
    }
  }, [user, projects]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.projectId) return alert("Select a project first");
    try {
      await addTask({
        ...formData,
        projectId: Number(formData.projectId),
        assigneeId: formData.assigneeId ? Number(formData.assigneeId) : null,
      });
      closeAddTaskModal();
    } catch (err) {
      console.error("Create task failed", err);
    }
  };

  return ReactDOM.createPortal(
    <AnimatePresence>
      <motion.div
        id="task-backdrop"
        className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-[10000]"
        onClick={(e) => e.target.id === "task-backdrop" && closeAddTaskModal()}
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
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">No Projects Found</h3>
              <p className="text-sm mb-6">You must create a project first.</p>
              <button
                onClick={() => setShowProjectModal(true)}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Add Task
              </h2>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Task title"
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-900"
                required
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Description"
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-900"
              />
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
              <select
                name="assigneeId"
                value={formData.assigneeId}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-900"
              >
                <option value="">Unassigned</option>
                {teamMembers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.role})
                  </option>
                ))}
              </select>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold"
              >
                {loading ? <Loader2 className="animate-spin mx-auto" /> : "Add Task"}
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
