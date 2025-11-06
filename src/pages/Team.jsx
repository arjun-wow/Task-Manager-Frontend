import { useEffect } from "react";
import useTeamStore from "../store/teamStore";
import useAuthStore from "../store/authStore";
import DashboardCard from "../components/dashboard/DashboardCard";
import { Loader2, ShieldCheck, Trash2 } from "lucide-react";

export default function Team() {
  const { team, fetchTeam, loading, updateUserRole, deleteUser } = useTeamStore();
  const { user } = useAuthStore(); // ✅ Get current logged-in user

  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  const isAdmin = user?.role === "ADMIN";

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
        <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-lg">
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
            <DashboardCard
              key={member.id}
              className="p-6 flex flex-col items-center text-center bg-gradient-to-b from-gray-900/80 to-gray-800/60 border border-gray-700 shadow-lg rounded-2xl"
            >
              <img
                src={member.avatarUrl || `https://i.pravatar.cc/150?u=${member.id}`}
                alt={member.name || "User"}
                className="w-20 h-20 rounded-full border-4 border-white/10 mb-4 shadow-md"
              />
              <h2 className="font-semibold text-lg text-white">{member.name || "Unnamed User"}</h2>
              <p className="text-sm text-gray-400">{member.email || "No email"}</p>

              <div className="mt-2 flex items-center justify-center gap-2">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    member.role === "ADMIN"
                      ? "bg-purple-600/30 text-purple-300 border border-purple-500/30"
                      : "bg-gray-700/40 text-gray-300 border border-gray-600/50"
                  }`}
                >
                  {member.role}
                </span>
              </div>

              {/* --- ADMIN CONTROLS --- */}
              {isAdmin && (
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() =>
                      handleRoleChange(
                        member.id,
                        member.role === "ADMIN" ? "USER" : "ADMIN"
                      )
                    }
                    className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-md bg-blue-600 hover:bg-blue-700 text-white transition"
                  >
                    <ShieldCheck size={14} />
                    {member.role === "ADMIN" ? "Make User" : "Make Admin"}
                  </button>

                  <button
                    onClick={() => handleDelete(member.id)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-md bg-red-600 hover:bg-red-700 text-white transition"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              )}
            </DashboardCard>
          ))}
        </div>
      )}
    </div>
  );
}
