import { NavLink, useNavigate } from 'react-router-dom';
import { Home, ListChecks, Calendar, PieChart, Plus, Users, Settings, LogOut, Trash2, Shield } from 'lucide-react'; // <-- INJECTED Shield
import useAuthStore from '../../store/authStore';
import useProjectStore from '../../store/projectStore';
import { useEffect } from 'react';

// Navigation Links
const mainLinks = [
  { name: "Homescreen", to: "/", icon: Home },
  { name: "My Tasks", to: "/tasks", icon: ListChecks },
  { name: "Calendar", to: "/calendar", icon: Calendar },
  { name: "Report", to: "/reports", icon: PieChart },
];

const teamLinks = [
  { name: "Team", to: "/team", icon: Users },
  { name: "Settings", to: "/settings", icon: Settings },
];

// Simple confirmation (can replace with modal later)
const confirmDeleteProject = (projectName) => {
  return window.confirm(
    `Are you sure you want to delete "${projectName}"?\nThis will also delete all related tasks and comments.`
  );
};

export default function Sidebar() {
  const { user, logout } = useAuthStore(); // <-- INJECTED user
  const { projects, fetchProjects, toggleAddProjectModal, deleteProject, loading } = useProjectStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Project Delete Handler 
  const handleDelete = async (e, project) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirmDeleteProject(project.name)) {
      try {
        await deleteProject(project.id);
        navigate('/');
      } catch (err) {
        console.error("UI: Project deletion failed", err);
      }
    }
  };

  return (
    <aside className="hidden sm:flex flex-col w-60 bg-black/20 backdrop-blur-xl border-r border-white/10 h-screen fixed left-0 top-0 p-6 justify-between">
      <div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-8">
          WeManage
        </h2>

        {/*Main Navigation*/}
        <nav className="flex flex-col gap-2">
          {mainLinks.map((l) => {
            const Icon = l.icon;
            return (
              <NavLink
                key={l.to}
                to={l.to}
                end
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-500/30 shadow-lg shadow-purple-500/10'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white border border-transparent'
                  }`
                }
              >
                <Icon size={18} />
                {l.name}
              </NavLink>
            );
          })}
        </nav>

        {/* --- INJECTED ADMIN SECTION (Conditionally Rendered) --- */}
        {user?.role === 'ADMIN' && (
          <>
            <hr className="my-6 border-white/10" />
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Admin Panel
              </h3>
            </div>
            <nav className="flex flex-col gap-2">
              <NavLink
                to="/admin/users"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-500/30 shadow-lg shadow-purple-500/10' // Style matches mainLinks
                      : 'text-gray-300 hover:bg-white/5 hover:text-white border border-transparent' // Style matches mainLinks
                  }`
                }
              >
                <Shield size={18} />
                User Management
              </NavLink>
            </nav>
          </>
        )}
        {/* --- END INJECTION --- */}

        <hr className="my-6 border-white/10" />

        {/*Project Directory Header*/}
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Project directory
          </h3>
          <button
            onClick={() => toggleAddProjectModal(true)}
            className="text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-1 rounded-lg transition-all"
            title="Add New Project"
          >
            <Plus size={16} />
          </button>
        </div>

        {/* Project List*/}
        {loading && projects.length === 0 ? (
          <div className="px-3 py-2 text-sm text-gray-400 animate-pulse">
            Loading projects...
          </div>
        ) : !loading && projects.length === 0 ? (
          <div className="px-3 py-2 text-sm text-gray-500 italic">
            No projects yet. Click '+' to add one.
          </div>
        ) : (
          <nav className="flex flex-col gap-1 max-h-40 overflow-y-auto">
            {projects.map((p) => (
              <NavLink
                key={p.id}
                to={`/projects/${p.id}/overview`}
                className={({ isActive }) =>
                  `group flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                    isActive
                      ? 'bg-white/10 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-2 truncate">
                      <span
                        className={`w-2 h-2 ${
                          isActive ? 'bg-gradient-to-r from-purple-400 to-pink-400' : 'bg-gray-500'
                        } rounded-full flex-shrink-0 transition-colors`}
                      ></span>
                      <span className="truncate">{p.name}</span>
                    </div>

                    {/* Delete Button*/}
                    <button
                      onClick={(e) => handleDelete(e, p)}
                      className="p-1 rounded text-gray-400 hover:bg-red-100/10 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                      title={`Delete project "${p.name}"`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        )}
      </div>

      {/*Bottom Navigation */}
      <nav className="flex flex-col gap-2">
        {teamLinks.map((l) => {
          const Icon = l.icon;
          return (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  isActive
                    ? 'bg-white/10 text-white border border-white/10'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Icon size={18} />
              {l.name}
            </NavLink>
          );
        })}
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-300 hover:bg-red-500/10 hover:text-red-300 border border-transparent hover:border-red-500/20 transition-all"
        >
          <LogOut size={18} />
          Log Out
        </button>
      </nav>
    </aside>
  );
}