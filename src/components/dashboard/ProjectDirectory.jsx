import DashboardCard from './DashboardCard';
import useProjectStore from '../../store/projectStore';
import { Link, useNavigate } from 'react-router-dom'; 
import { Briefcase, Plus, ChevronRight, Trash2 } from 'lucide-react'; 
import { useEffect } from 'react';

const confirmDeleteProject = (projectName) => {
    return window.confirm(`Are you sure you want to delete the project "${projectName}"? This will also delete all associated tasks, subtasks, and comments. This action cannot be undone.`);
}

export default function ProjectDirectory() {
  const { projects, fetchProjects, toggleAddProjectModal, deleteProject, loading } = useProjectStore();
  const navigate = useNavigate(); 

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

   const handleDelete = async (e, project) => {
      e.preventDefault(); 
      e.stopPropagation(); 

      if (confirmDeleteProject(project.name)) {
          try {
              await deleteProject(project.id);
              
          } catch (error) {
              console.error("UI: Delete failed from dashboard")
          }
      }
  };

  return (
    <DashboardCard title="Project directory">
      {loading && projects.length === 0 ? (
          <div className="p-4 text-sm text-gray-500 dark:text-gray-400 animate-pulse">Loading projects...</div>
      ) : !loading && projects.length === 0 ? (
          <div className="p-4 text-sm text-gray-500 dark:text-gray-400 italic">No projects created yet. Click '+ Add project' below.</div>
      ) : (
          <div className="space-y-1">
            {projects.slice(0, 5).map(project => (
              <div
                key={project.id}
                className="group flex items-center justify-between p-3 -mx-3 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition duration-200"
              >
                <Link
                    to={`/projects/${project.id}/overview`}
                    className="flex flex-grow items-center gap-3 truncate mr-2" 
                    title={`Go to project "${project.name}"`}
                >
                    <Briefcase className="text-gray-500 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors flex-shrink-0" size={20} />
                    <span className="font-medium text-black dark:text-white truncate">{project.name}</span>
                 </Link>

                 <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="flex -space-x-2 hidden sm:flex">
                       {project.team?.slice(0, 3).map((/** @type {any} */ user) => (
                           <img
                             key={user.id}
                             src={user.avatarUrl || `https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${user.id}`}
                             alt={user.name}
                             title={user.name}
                             className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-900 object-cover"
                           />
                       ))}
                   </div>
{/*delete*/}
                   <button
                       onClick={(e) => handleDelete(e, project)}
                       className="p-1 rounded text-gray-400 dark:text-gray-500 hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-red-600 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                       title={`Delete project "${project.name}"`} 
                   >
                       <Trash2 size={14} />
                   </button>

                    <Link
                        to={`/projects/${project.id}/overview`}
                        className="p-1 text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white transition-colors"
                        title={`Go to project "${project.name}"`}
                    >
                         <ChevronRight size={16} />
                    </Link>
                 </div>
              </div>
            ))}
          </div>
      )}
      {/*Add Project Button*/}
      <button
        onClick={() => toggleAddProjectModal(true)}
        className="mt-4 flex items-center gap-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
      >
        <Plus size={16} /> Add project
      </button>
    </DashboardCard>
  );
}

