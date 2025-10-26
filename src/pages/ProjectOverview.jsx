import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import useProjectStore from '../store/projectStore';
import useTaskStore from '../store/taskStore';
import { List, LayoutGrid, BarChart2 } from 'lucide-react';

export default function ProjectOverview() {
  const { projectId } = useParams();
  const { projects, setCurrentProject } = useProjectStore();
  const { tasks, fetchTasks } = useTaskStore();

  const project = projects.find(p => p.id === Number(projectId));

  useEffect(() => {
    if (project) {
      setCurrentProject(project);
    }
    fetchTasks(projectId);
  }, [projectId, project, setCurrentProject, fetchTasks]);

  if (!project) return <div>Loading project...</div>;

  // Stubs for "Task by user" from design
  const danaTasks = tasks.filter(t => t.assignee?.name === 'Dana R.');
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{project.name}</h1>
          <p className="text-gray-600 dark:text-gray-400">Project overview</p>
        </div>
        <nav className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <Link to={`/projects/${projectId}/overview`} className="px-3 py-1 rounded-md bg-white dark:bg-gray-700 shadow text-sm font-medium">Overview</Link>
          <Link to={`/projects/${projectId}/kanban`} className="px-3 py-1 rounded-md text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-700/50 text-sm font-medium">Kanban</Link>
          <Link to={`/projects/${projectId}/gantt`} className="px-3 py-1 rounded-md text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-700/50 text-sm font-medium">Gantt</Link>
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-soft border dark:border-gray-800">
          <h3 className="font-semibold mb-4">Project progress</h3>
          <p className="text-sm text-gray-500">(Gantt chart placeholder)</p>
          {/* This is where a Gantt chart component would go */}
        </div>
        
        <div className="lg:col-span-1 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-soft border dark:border-gray-800">
          <h3 className="font-semibold mb-4">Team directory</h3>
          <div className="space-y-3">
            {project.team.map(m => (
              <div key={m.id} className="flex items-center gap-3">
                <img src={m.avatarUrl} alt={m.name} className="w-10 h-10 rounded-full" />
                <div>
                  <p className="font-medium text-sm">{m.name}</p>
                  <p className="text-xs text-gray-500">{m.role || 'Member'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-soft border dark:border-gray-800">
        <h3 className="font-semibold mb-4">Task by user</h3>
        <div>
          <h4 className="font-medium text-sm mb-2">Dana R.'s responsibilities</h4>
          <div className="space-y-2">
            {danaTasks.map(t => (
              <div key={t.id} className="flex justify-between items-center p-2 border-b dark:border-gray-800">
                <p>{t.title}</p>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${t.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                  {t.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}