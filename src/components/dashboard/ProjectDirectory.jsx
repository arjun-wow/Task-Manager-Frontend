import DashboardCard from './DashboardCard';
import useProjectStore from '../../store/projectStore';
import { Link } from 'react-router-dom';
import { Briefcase, Plus, ChevronRight } from 'lucide-react';
import { useEffect } from 'react';

export default function ProjectDirectory() {
  const { projects, fetchProjects, toggleAddProjectModal } = useProjectStore();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);
  
  return (
    <DashboardCard title="Project directory">
      <div className="space-y-1">
        {projects.slice(0, 5).map(project => (
          <Link 
            to={`/projects/${project.id}/overview`} 
            key={project.id} 
            className="flex items-center justify-between p-3 -mx-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition group"
          >
            <div className="flex items-center gap-3">
              <Briefcase className="text-gray-400 group-hover:text-primary" size={20} />
              <span className="font-medium text-gray-800 dark:text-gray-200">{project.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {project.team?.slice(0, 3).map((/** @type {any} */ user) => (
                  <img key={user.id} src={user.avatarUrl} alt={user.name} className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-900" />
                ))}
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </div>
          </Link>
        ))}
      </div>
      <button 
        onClick={() => toggleAddProjectModal(true)}
        className="mt-4 flex items-center gap-2 text-sm font-medium text-primary hover:underline"
      >
        <Plus size={16} /> Add more
      </button>
    </DashboardCard>
  );
}
