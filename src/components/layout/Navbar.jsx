import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import useAuthStore from "../../store/authStore";
import useTaskStore from "../../store/taskStore";
import useTeamStore from "../../store/teamStore";
import NotificationBell from "../NotificationBell";
import api from "../../store/api";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { tasks, fetchTasks } = useTaskStore();
  const { team, fetchTeam } = useTeamStore();

  // 🔍 Search-related states
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // 👤 Profile modal and edit states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [saving, setSaving] = useState(false);

  // Fetch necessary data
  useEffect(() => {
    fetchTasks();
    fetchTeam();
  }, [fetchTasks, fetchTeam]);

  // Search logic
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const q = query.toLowerCase();

    const matchedTasks = tasks
      .filter((t) => t.title.toLowerCase().includes(q))
      .map((t) => ({ type: "Task", label: t.title }));

    const matchedUsers = team
      .filter((u) => u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q))
      .map((u) => ({ type: "User", label: u.name || u.email }));

    setResults([...matchedTasks, ...matchedUsers].slice(0, 8));
  }, [query, tasks, team]);

  // Handle profile save
  const handleSave = async () => {
    if (!formData.name.trim() || !formData.email.trim())
      return alert("All fields required");

    try {
      setSaving(true);
      const res = await api.put("/api/users/me", formData);
      const updated = res.data;

      localStorage.setItem("user", JSON.stringify(updated));
      useAuthStore.setState({ user: updated });
      setShowEditModal(false);
    } catch (err) {
      console.error("Profile update failed", err);
      alert("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 sm:left-60 right-0 bg-black/20 backdrop-blur-xl border-b border-white/10 h-16 flex items-center justify-between px-6 z-40">
        {/* Search bar */}
        <div className="relative w-72">
          <input
            type="text"
            placeholder="Search tasks or users..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowDropdown(true);
            }}
            onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
            className="w-full bg-black/30 border border-white/10 rounded-2xl px-3 py-2 pl-10 text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none backdrop-blur-sm transition-all"
          />
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

          {showDropdown && results.length > 0 && (
            <div className="absolute mt-1 w-full bg-gray-900/90 backdrop-blur-md rounded-lg border border-gray-700 shadow-lg overflow-hidden z-50">
              {results.map((r, i) => (
                <div
                  key={i}
                  className="px-3 py-2 text-sm text-gray-200 hover:bg-purple-500/30 cursor-pointer transition"
                >
                  <span className="font-medium text-purple-400 mr-1">[{r.type}]</span>
                  {r.label}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profile section */}
        <div className="flex items-center gap-4 relative">
          <NotificationBell />

          <img
            src={user?.avatarUrl || "https://i.pravatar.cc/40"}
            alt="avatar"
            className="w-9 h-9 rounded-full border-2 border-purple-500/50 shadow-lg cursor-pointer"
            onClick={() => setShowProfileMenu((prev) => !prev)}
          />

          {showProfileMenu && (
            <div
              className="absolute right-0 top-12 w-48 bg-white/80 dark:bg-gray-900/90 border border-gray-200 dark:border-gray-700 
                         rounded-lg shadow-lg backdrop-blur-md z-50 py-2 text-sm text-gray-800 dark:text-gray-200"
            >
              <button
                onClick={() => {
                  setShowEditModal(true);
                  setShowProfileMenu(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-purple-100 dark:hover:bg-gray-800 transition"
              >
                Edit Profile
              </button>
              <button
                onClick={() => logout()}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 dark:hover:bg-gray-800 transition"
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-[9999]"
          onClick={() => setShowEditModal(false)}
        >
          <div
            className="bg-white/90 dark:bg-gray-900/90 rounded-2xl p-6 w-[90%] max-w-md shadow-2xl border border-gray-300 dark:border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Edit Profile
            </h2>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Name"
              className="w-full mb-3 px-4 py-2 border rounded-lg dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 text-gray-900"
            />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="Email"
              className="w-full mb-4 px-4 py-2 border rounded-lg dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 text-gray-900"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
