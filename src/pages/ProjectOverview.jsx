import { useEffect, useMemo } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import useProjectStore from '../store/projectStore';
import useTaskStore from '../store/taskStore';
import DashboardCard from '../components/dashboard/DashboardCard'; 
import { format } from 'date-fns';


const getStatusColor = (status) => {
  switch (status) {
    case 'TO_DO': return 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    case 'IN_PROGRESS': return 'bg-blue-200 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
    case 'DONE': return 'bg-green-200 text-green-800 dark:bg-green-900/50 dark:text-green-300';
    default: return 'bg-gray-200 text-gray-700';
  }
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'LOW': return 'bg-green-200 text-green-800 dark:bg-green-900/50 dark:text-green-300';
    case 'MEDIUM': return 'bg-yellow-200 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
    case 'HIGH': return 'bg-red-200 text-red-800 dark:bg-red-900/50 dark:text-red-300';
    default: return 'bg-gray-200 text-gray-700';
  }
};


export default function ProjectOverview() {
  const { projectId } = useParams();
  const location = useLocation(); 
  const { projects, setCurrentProject } = useProjectStore();
  const { tasks, fetchTasks } = useTaskStore();

  const project = projects.find(p => p.id === Number(projectId));

  useEffect(() => {
    if (project) {
      setCurrentProject(project);
    }
    fetchTasks(projectId);
  }, [projectId, project, setCurrentProject, fetchTasks]);

  const tasksByUser = useMemo(() => {
    if (!tasks || tasks.length === 0) return {};
    return tasks.reduce((acc, task) => {
      const assigneeId = task.assignee?.id || 'unassigned';
      if (!acc[assigneeId]) {
        acc[assigneeId] = {
          assignee: task.assignee || { id: 'unassigned', name: 'Unassigned', avatarUrl: 'https://placehold.co/40x40/cccccc/999999?text=?' },
          tasks: []
        };
      }
      acc[assigneeId].tasks.push(task);
      return acc;
    }, {});
  }, [tasks]);


  if (!project) return <div className="p-8 text-white">Loading project...</div>;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          {/* Changed header text to black (or white in dark mode) */}
          <h1 className="text-3xl font-bold tracking-tight text-white dark:text-white drop-shadow-lg">
            {project.name}
          </h1>
          {/* Changed subtitle color */}
          <p className="mt-1 text-base text-white-600 dark:text-gray-300">
            Project Overview
          </p>
        </div>
        
        {/* Navigation Tabs - Adjusted active/inactive text colors */}
        <nav className="flex items-center gap-1 p-1 bg-white/10 dark:bg-gray-800/50 rounded-lg border border-white/10 dark:border-gray-700 backdrop-blur-sm">
          <Link 
            to={`/projects/${projectId}/overview`} 
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${location.pathname.endsWith('/overview') 
              ? 'bg-white/80 dark:bg-gray-700/80 shadow text-gray-900 dark:text-white' // Active state
              : 'text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-700/30'}`} // Inactive state
          >
            Overview
          </Link>
          <Link 
            to={`/projects/${projectId}/kanban`} 
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${location.pathname.endsWith('/kanban') 
              ? 'bg-white/80 dark:bg-gray-700/80 shadow text-gray-900 dark:text-white' // Active state
              : 'text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-700/30'}`} // Inactive state
          >
            Kanban
          </Link>
          <Link 
            to={`/projects/${projectId}/gantt`} 
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${location.pathname.endsWith('/gantt') 
              ? 'bg-white/80 dark:bg-gray-700/80 shadow text-gray-900 dark:text-white' // Active state
              : 'text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-700/30'}`} // Inactive state
          >
            Gantt
          </Link>
        </nav>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Project Progress (Left Column) */}
        <DashboardCard title="Project progress" className="lg:col-span-2">
          <p className="text-sm text-gray-600 dark:text-gray-400 min-h-[100px] flex items-center justify-center">
            (Gantt chart placeholder - requires integration with a charting library)
          </p>
        </DashboardCard>
        
        {/* Team Directory (Right Column) */}
        <DashboardCard title="Team directory" className="lg:col-span-1">
          <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
            {project.team && project.team.length > 0 ? (
              project.team.map((/** @type {any} */ m) => (
                <div key={m.id} className="flex items-center gap-3">
                  <img src={m.avatarUrl || `https://i.pravatar.cc/40?u=${m.id}`} alt={m.name} className="w-10 h-10 rounded-full border-2 border-white/50 dark:border-gray-700" />
                  <div>
                    {/* Changed text colors */}
                    <p className="font-medium text-sm text-black dark:text-white">{m.name}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{m.role || 'Member'}</p> 
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-400">No team members assigned yet.</p>
            )}
          </div>
        </DashboardCard>
      </div>

      {/* Task by User Section (Full Width) */}
      <DashboardCard title="Tasks by user">
        <div className="space-y-6">
          {Object.values(tasksByUser).map(({ assignee, tasks: userTasks }) => (
            <div key={assignee.id}>
              <div className="flex items-center gap-2 mb-3">
                 <img src={assignee.avatarUrl || `https://i.pravatar.cc/40?u=${assignee.id}`} alt={assignee.name} className="w-6 h-6 rounded-full border border-white/50 dark:border-gray-700" />
                 {/* Changed text color */}
                 <h4 className="font-semibold text-sm text-black dark:text-white">{assignee.name}'s responsibilities</h4>
              </div>
              <div className="space-y-1">
                {userTasks.length > 0 ? (
                  userTasks.map(t => (
                    <div 
                      key={t.id} 
                      className="grid grid-cols-1 md:grid-cols-12 items-center gap-2 md:gap-4 p-2.5 rounded-lg hover:bg-white/5 dark:hover:bg-gray-800/50 border border-transparent hover:border-white/10 dark:hover:border-gray-700 transition"
                    >
                      {/* Changed text color */}
                      <p className="md:col-span-4 font-medium text-sm text-black dark:text-white truncate">{t.title}</p>
                      {/* Changed text color */}
                      <p className="md:col-span-2 text-xs text-gray-600 dark:text-gray-400">
                        {t.dueDate ? format(new Date(t.dueDate), 'MMM dd') : 'No date'}
                      </p>
                      <span className={`md:col-span-2 px-2 py-0.5 rounded-full text-xs font-semibold w-fit ${getStatusColor(t.status)}`}>
                        {t.status.replace('_', ' ')}
                      </span>
                      <span className={`md:col-span-2 px-2 py-0.5 rounded-full text-xs font-semibold w-fit ${getPriorityColor(t.priority)}`}>
                        {t.priority} priority
                      </span>
                      <div className="md:col-span-2"></div> 
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-600 dark:text-gray-400 pl-8">No tasks assigned.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </DashboardCard>
    </div>
  );
}

