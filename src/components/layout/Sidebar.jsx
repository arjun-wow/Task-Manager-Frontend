import { NavLink } from 'react-router-dom';
import { Home, ListChecks, Calendar, PieChart, Plus, Users, Settings, LogOut } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useProjectStore from '../../store/projectStore';
import { useEffect } from 'react';

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

export default function Sidebar() {
  const { logout } = useAuthStore();
  const { projects, fetchProjects, toggleAddProjectModal } = useProjectStore();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <aside className="hidden sm:flex flex-col w-60 bg-black/20 backdrop-blur-xl border-r border-white/10 h-screen fixed left-0 top-0 p-6 justify-between">
      <div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-8">
          WeManage
        </h2>
        
        <nav className="flex flex-col gap-2">
          {mainLinks.map(l => {
            const Icon = l.icon;
            return (
              <NavLink 
                key={l.to} 
                to={l.to} 
                end 
                className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-500/30 shadow-lg shadow-purple-500/10' 
                    : 'text-gray-300 hover:bg-white/5 hover:text-white border border-transparent'
                }`}
              >
                <Icon size={18}/>
                {l.name}
              </NavLink>
            );
          })}
        </nav>

        <hr className="my-6 border-white/10" />

        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Project directory</h3>
          <button 
            onClick={() => toggleAddProjectModal(true)} 
            className="text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-1 rounded-lg transition-all"
          >
            <Plus size={16} />
          </button>
        </div>
        
        <nav className="flex flex-col gap-1 max-h-40 overflow-y-auto">
          {projects.map(p => (
            <NavLink 
              key={p.id} 
              to={`/projects/${p.id}/overview`} 
              className={({isActive}) => `text-sm font-medium flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                isActive 
                  ? 'bg-white/10 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></span>
              {p.name}
            </NavLink>
          ))}
        </nav>
      </div>

      <nav className="flex flex-col gap-2">
        {teamLinks.map(l => {
          const Icon = l.icon;
          return (
            <NavLink 
              key={l.to} 
              to={l.to} 
              className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                isActive 
                  ? 'bg-white/10 text-white border border-white/10' 
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon size={18}/>
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