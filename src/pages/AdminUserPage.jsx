import { useEffect } from 'react';
import useTeamStore from '../store/teamStore'; // We can reuse teamStore to get all users
import DashboardCard from '../components/dashboard/DashboardCard';
import { Loader, Trash2, Shield } from 'lucide-react';

export default function AdminUserPage() {
  const { team, fetchTeam, loading, updateUserRole, deleteUser } = useTeamStore();
  const authUser = useAuthStore((state) => state.user); // Get logged-in user to prevent self-delete

  useEffect(() => {
    fetchTeam(); // Calls GET /api/users
  }, [fetchTeam]);

  const handleRoleChange = async (userId, newRole) => {
    if (userId === authUser?.id) {
        alert("You cannot change your own role.");
        return;
    }
    if (!window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      return;
    }
    try {
      await updateUserRole(userId, newRole);
    } catch (error) {
      console.error("Failed to update role:", error);
    }
  };

  const handleDelete = async (userId, userName) => {
     if (userId === authUser?.id) {
        alert("You cannot delete your own account from the admin panel.");
        return;
    }
    if (!window.confirm(`Are you sure you want to PERMANENTLY DELETE the user "${userName}"? This cannot be undone.`)) {
      return;
    }
    try {
      await deleteUser(userId);
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white drop-shadow-lg">
          User Management
        </h1>
        <p className="mt-1 text-base text-gray-600 dark:text-gray-300">
          Manage all users in the system
        </p>
      </div>

      <DashboardCard>
        {loading ? (
          <div className="flex justify-center items-center p-10"><Loader className="animate-spin text-white"/></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10 dark:divide-gray-700/50">
              <thead className="bg-black/5 dark:bg-white/5">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-black dark:text-white sm:pl-6">Name</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-black dark:text-white">Email</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-black dark:text-white">Role</th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 dark:divide-gray-800/50">
                {team.map((user) => (
                  <tr key={user.id} className="hover:bg-black/5 dark:hover:bg-white/5">
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img className="h-10 w-10 rounded-full object-cover" src={user.avatarUrl || `https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${user.id}`} alt="" />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-black dark:text-white">{user.name || 'Unnamed User'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-600 dark:text-gray-400">{user.email}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <select 
                        value={user.role} 
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        disabled={user.id === authUser?.id} // Disable changing own role
                        className="px-3 py-1 border border-black/10 dark:border-white/10 bg-white/50 dark:bg-gray-800/50 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 text-black dark:text-white text-sm disabled:opacity-50"
                      >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <button 
                         onClick={() => handleDelete(user.id, user.name)}
                         disabled={user.id === authUser?.id} // Disable deleting self
                         className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 disabled:opacity-30 disabled:cursor-not-allowed"
                         title="Delete User"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DashboardCard>
    </div>
  );
}

// Need to import useAuthStore here as well
import useAuthStore from '../store/authStore';