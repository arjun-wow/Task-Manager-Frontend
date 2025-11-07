import { useEffect } from "react";
import useTeamStore from "../store/teamStore";
import useAuthStore from "../store/authStore";
import DashboardCard from "../components/dashboard/DashboardCard";
import { Loader2, ShieldCheck, Trash2 } from "lucide-react";

export default function Team() {
  const { team, fetchTeam, loading, updateUserRole, deleteUser } = useTeamStore();
  const { user } = useAuthStore();
  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  const handleRoleChange = async (id, newRole) => {
    if (!isAdmin) return;
    try {
      await updateUserRole(id, newRole);
      alert(`User role updated to ${newRole}`);
    } catch (err) {
      console.error("Role update failed:", err);
      alert("Failed to update role.");
    }
  };

  const handleDelete = async (id) => {
    if (!isAdmin) return;
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(id);
      alert("User deleted successfully.");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete user.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow">
          Team Directory
        </h1>
        <p className="mt-1 text-base text-gray-300">
          {isAdmin
            ? "Manage all registered users in the workspace"
            : "View all members in your workspace"}
        </p>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500">
          <Loader2 className="animate-spin" size={18} />
          <span>Loading team members...</span>
        </div>
      ) : team.length === 0 ? (
        <p className="text-gray-400 dark:text-gray-500">No team members found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {team.map((member) => (
            <div
              key={member.id}
              className="p-6 flex flex-col items-center text-center 
                         rounded-2xl shadow-md border border-gray-200/60
                         bg-gradient-to-br from-white/80 to-gray-100/60
                         backdrop-blur-xl hover:shadow-lg transition-all"
            >
              <img
                src={member.avatarUrl || `https://i.pravatar.cc/150?u=${member.id}`}
                alt={member.name || "User"}
                className="w-20 h-20 rounded-full border-4 border-white/70 shadow-md mb-4"
              />
              <h2 className="font-semibold text-lg text-gray-800">
                {member.name || "Unnamed User"}
              </h2>
              <p className="text-sm text-gray-500">{member.email || "No email"}</p>

              <span
                className={`mt-2 text-xs px-3 py-1 rounded-full ${
                  member.role === "ADMIN"
                    ? "bg-indigo-100 text-indigo-600 border border-indigo-200"
                    : "bg-gray-100 text-gray-600 border border-gray-200"
                }`}
              >
                {member.role}
              </span>

              {isAdmin && (
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() =>
                      handleRoleChange(
                        member.id,
                        member.role === "ADMIN" ? "USER" : "ADMIN"
                      )
                    }
                    className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-md 
                               bg-indigo-500 hover:bg-indigo-600 text-white transition"
                  >
                    <ShieldCheck size={14} />
                    {member.role === "ADMIN" ? "Make User" : "Make Admin"}
                  </button>

                  <button
                    onClick={() => handleDelete(member.id)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-md 
                               bg-rose-500 hover:bg-rose-600 text-white transition"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
