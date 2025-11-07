import useTaskStore from '../store/taskStore';
import useProjectStore from '../store/projectStore';
import { useEffect, useMemo, useState } from 'react';
import { isToday, isTomorrow, isThisWeek } from 'date-fns';
import { Calendar, Clock, Flag, User, CheckCircle, PlayCircle, Circle } from 'lucide-react';
import AddTaskButton from '../components/AddTaskButton';
import { motion, AnimatePresence } from 'framer-motion';

// Priority colors
const priorityColors = {
  HIGH: 'bg-red-500/10 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800',
  MEDIUM: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800',
  LOW: 'bg-green-500/10 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800',
};

// Status colors and icons
const statusColors = {
  TO_DO: 'bg-gray-500/10 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700',
  IN_PROGRESS: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800',
  DONE: 'bg-green-500/10 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800',
};

const statusIcons = {
  TO_DO: <Circle size={14} className="inline mr-1" />,
  IN_PROGRESS: <PlayCircle size={14} className="inline mr-1" />,
  DONE: <CheckCircle size={14} className="inline mr-1" />,
};

export default function MyTasks() {
  const { tasks, fetchTasks, loading } = useTaskStore();
  const { currentProject } = useProjectStore();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const loadTasks = async (projectId) => {
      try {
        await fetchTasks(projectId);
      } catch (err) {
        console.error('Error loading tasks:', err);
      } finally {
        setIsInitialLoad(false);
      }
    };

    if (currentProject?.id) {
      loadTasks(currentProject.id);
    } else {
      const unsub = useProjectStore.subscribe(
        (state) => state.currentProject,
        (project) => {
          if (project?.id) {
            loadTasks(project.id);
            unsub();
          }
        }
      );
      return unsub;
    }
  }, [currentProject, fetchTasks]);

  const groupedTasks = useMemo(() => {
    if (loading || isInitialLoad || !Array.isArray(tasks)) {
      return { today: [], tomorrow: [], thisWeek: [], upcoming: [] };
    }

    const today = [];
    const tomorrow = [];
    const thisWeek = [];
    const upcoming = [];

    for (const task of tasks) {
      if (!task?.dueDate) {
        upcoming.push(task);
        continue;
      }

      const date = new Date(task.dueDate);
      if (isNaN(date)) {
        upcoming.push(task);
        continue;
      }

      if (isToday(date)) today.push(task);
      else if (isTomorrow(date)) tomorrow.push(task);
      else if (isThisWeek(date)) thisWeek.push(task);
      else upcoming.push(task);
    }

    const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
    const sortTasks = (list) =>
      list.sort((a, b) => {
        const p1 = priorityOrder[a.priority] || 0;
        const p2 = priorityOrder[b.priority] || 0;
        if (p1 !== p2) return p2 - p1;
        if (a.dueDate && b.dueDate) return new Date(a.dueDate) - new Date(b.dueDate);
        return 0;
      });

    return {
      today: sortTasks(today),
      tomorrow: sortTasks(tomorrow),
      thisWeek: sortTasks(thisWeek),
      upcoming: sortTasks(upcoming),
    };
  }, [tasks, loading, isInitialLoad]);

  // 🌈 Enhanced shimmer loader (no logic changes)
  if (isInitialLoad || loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="h-8 w-48 rounded-md bg-gradient-to-r from-purple-700/40 via-purple-500/60 to-purple-700/40 bg-[length:200%_100%] animate-[pulse_1.8s_ease-in-out_infinite]"></div>
            <div className="h-5 w-72 mt-3 rounded-md bg-gradient-to-r from-gray-700/40 via-gray-600/60 to-gray-700/40 bg-[length:200%_100%] animate-[pulse_2s_ease-in-out_infinite]"></div>
          </div>
          <div className="h-10 w-36 rounded-lg bg-gradient-to-r from-purple-800/40 via-purple-600/60 to-purple-800/40 bg-[length:200%_100%] animate-[pulse_1.6s_ease-in-out_infinite]"></div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border border-gray-700/60 bg-gray-800/40 p-5 shadow-md backdrop-blur-md"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-purple-700/40 via-purple-500/60 to-purple-700/40 bg-[length:200%_100%] animate-[pulse_2s_ease-in-out_infinite]"></div>
                <div className="flex-1">
                  <div className="h-4 w-32 mb-2 rounded bg-gradient-to-r from-gray-700/40 via-gray-600/60 to-gray-700/40 bg-[length:200%_100%] animate-[pulse_2s_ease-in-out_infinite]"></div>
                  <div className="h-3 w-24 rounded bg-gradient-to-r from-gray-700/40 via-gray-600/60 to-gray-700/40 bg-[length:200%_100%] animate-[pulse_2s_ease-in-out_infinite]"></div>
                </div>
              </div>
              <div className="space-y-3">
                {[1, 2, 3].map((j) => (
                  <div
                    key={j}
                    className="h-16 rounded-lg bg-gradient-to-r from-gray-700/40 via-gray-600/60 to-gray-700/40 bg-[length:200%_100%] animate-[pulse_1.6s_ease-in-out_infinite]"
                  ></div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // --- everything else unchanged below this line
  const TaskCard = ({ task }) => (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2 group-hover:text-primary transition-colors">
            {task.title || 'Untitled Task'}
          </h3>
          {task.description && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
              {task.description}
            </p>
          )}
        </div>

        {task.assignee && (
          <img
            src={task.assignee.avatarUrl || 'https://i.pravatar.cc/40'}
            alt={task.assignee.name || 'User'}
            className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 shadow-sm ml-3 flex-shrink-0"
            title={`Assigned to ${task.assignee.name || 'User'}`}
          />
        )}
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[task.status] || statusColors.TO_DO}`}>
            {statusIcons[task.status] || statusIcons.TO_DO}
            {task.status?.replace('_', ' ') || 'TO DO'}
          </span>

          <span className={`px-3 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority] || priorityColors.LOW}`}>
            <Flag size={12} className="inline mr-1" />
            {task.priority || 'LOW'}
          </span>
        </div>

        {task.dueDate && (
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 ml-2 whitespace-nowrap">
            <Calendar size={14} className="mr-1 flex-shrink-0" />
            {new Date(task.dueDate).toLocaleDateString()}
          </div>
        )}
      </div>
    </motion.div>
  );

  const TaskSection = ({ title, tasks, icon, emptyMessage, color = 'gray' }) => {
    const colorClasses = {
      gray: 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700',
      blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
      green: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
      purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
      orange: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800',
    };

    const iconColors = {
      gray: 'text-gray-600',
      blue: 'text-blue-600',
      green: 'text-green-600',
      purple: 'text-purple-600',
      orange: 'text-orange-600',
    };

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`rounded-xl border-2 ${colorClasses[color]} transition-colors duration-200`}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm ${iconColors[color]}`}>
              {icon}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {tasks.length} task{tasks.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        <div className="p-4">
          <AnimatePresence mode="popLayout">
            {tasks.length > 0 ? (
              <div className="space-y-3">
                {tasks.map((task, index) => (
                  <motion.div
                    key={task.id || index}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <TaskCard task={task} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-8">
                <div className="text-gray-400 dark:text-gray-500 mb-3">
                  <Clock size={32} className="mx-auto mb-2 opacity-50" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{emptyMessage}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-lg">My Tasks</h1>
          <p className="mt-2 text-base text-gray-200 bg-gradient-to-r from-purple-900/50 to-purple-700/50 py-2 px-4 rounded-xl shadow-sm">
            <span className="text-white">Overview of all your assigned tasks across projects</span>
          </p>
        </div>
        <AddTaskButton variant="default" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <TaskSection title="Today" tasks={groupedTasks.today} icon={<Calendar size={20} />} emptyMessage="No tasks due today." color="blue" />
        <TaskSection title="Tomorrow" tasks={groupedTasks.tomorrow} icon={<Clock size={20} />} emptyMessage="No tasks for tomorrow." color="green" />
        <TaskSection title="This Week" tasks={groupedTasks.thisWeek} icon={<Flag size={20} />} emptyMessage="No tasks this week." color="purple" />
        <TaskSection title="Upcoming / No Date" tasks={groupedTasks.upcoming} icon={<User size={20} />} emptyMessage="No unscheduled tasks." color="orange" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-1">{tasks.filter(t => t.status === 'TO_DO').length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">To Do</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="text-2xl font-bold text-blue-600 mb-1">{tasks.filter(t => t.status === 'IN_PROGRESS').length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">In Progress</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="text-2xl font-bold text-green-600 mb-1">{tasks.filter(t => t.status === 'DONE').length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-1">{tasks.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Tasks</div>
        </div>
      </div>

      <AddTaskButton variant="floating" />
    </div>
  );
}
