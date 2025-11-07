import { useEffect, useState } from "react";
import { Users, Briefcase, ClipboardList, Trash2, ShieldCheck, ShieldOff, Loader2 } from "lucide-react";
import api from "../store/api";
import useAuthStore from "../store/authStore";

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalUsers: 0, totalProjects: 0, totalTasks: 0 });

  // 🔸 Fetch users + stats
  
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [userRes, statsRes] = await Promise.all([
          api.get("/api/users"),
          api.get("/api/admin/stats").catch(() => ({ data: { totalUsers: 0, totalProjects: 0, totalTasks: 0 } }))
        ]);
        setUsers(userRes.data);
        setStats(statsRes.data);
      } catch (err) {
        console.error("Admin fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  // 🔸 Update role
  const toggleRole = async (id, currentRole) => {
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
    if (!window.confirm(`Change this user's role to ${newRole}?`)) return;

    try {
      await api.put(`/api/users/${id}/role`, { role: newRole });
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      console.error("Failed to update role:", err);
      alert("Failed to change user role.");
    }
  };

  // 🔸 Delete user
  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/api/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete user.");
    }
  };

  // 🔸 Access check
  if (user?.role !== "ADMIN") {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <p className="text-gray-500 dark:text-gray-300 text-lg">
          Access denied — Admins only.
        </p>
      </div>
    );
  }

  // 🔸 Loading shimmer
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader2 className="animate-spin text-purple-500" size={36} />
      </div>
    );
  }

  // 🔸 Admin dashboard layout
  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-500 dark:text-white-400">Manage users, roles, and overview system data</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-gradient-to-br from-purple-800/60 to-purple-500/40 border border-purple-600/30 shadow-md">
          <div className="flex items-center gap-3">
            <Users size={28} className="text-purple-300" />
            <div>
              <h4 className="text-sm text-gray-300">Total Users</h4>
              <p className="text-2xl font-semibold text-white">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-br from-blue-800/60 to-blue-500/40 border border-blue-600/30 shadow-md">
          <div className="flex items-center gap-3">
            <Briefcase size={28} className="text-blue-300" />
            <div>
              <h4 className="text-sm text-gray-300">Projects</h4>
              <p className="text-2xl font-semibold text-white">{stats.totalProjects}</p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-br from-green-800/60 to-green-500/40 border border-green-600/30 shadow-md">
          <div className="flex items-center gap-3">
            <ClipboardList size={28} className="text-green-300" />
            <div>
              <h4 className="text-sm text-gray-300">Tasks</h4>
              <p className="text-2xl font-semibold text-white">{stats.totalTasks}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white/80 dark:bg-gray-900/80 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md overflow-hidden backdrop-blur-md">
        <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">User Management</h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">{users.length} users</span>
        </div>

        <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
          <thead className="bg-gray-100/70 dark:bg-gray-800/70">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr
                key={u.id}
                className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition"
              >
                <td className="px-4 py-2">{u.id}</td>
                <td className="px-4 py-2 flex items-center gap-2">
                  <img
                    src={u.avatarUrl || "https://i.pravatar.cc/40"}
                    alt={u.name}
                    className="w-8 h-8 rounded-full border border-gray-500/20"
                  />
                  {u.name}
                </td>
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      u.role === "ADMIN"
                        ? "bg-purple-500/20 text-purple-400 border border-purple-400/30"
                        : "bg-gray-500/20 text-gray-400 border border-gray-400/30"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-2 text-right flex justify-end gap-2">
                  <button
                    onClick={() => toggleRole(u.id, u.role)}
                    className="p-2 rounded-lg hover:bg-purple-600/30 transition"
                    title="Toggle Role"
                  >
                    {u.role === "ADMIN" ? (
                      <ShieldOff size={16} className="text-gray-400" />
                    ) : (
                      <ShieldCheck size={16} className="text-purple-400" />
                    )}
                  </button>
                  <button
                    onClick={() => deleteUser(u.id)}
                    className="p-2 rounded-lg hover:bg-red-600/30 transition"
                    title="Delete User"
                  >
                    <Trash2 size={16} className="text-red-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
