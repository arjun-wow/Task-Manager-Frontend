import useTaskStore from '../store/taskStore';
import useProjectStore from '../store/projectStore';
import { useEffect, useMemo, useState } from 'react';
import { isToday, isTomorrow, isThisWeek } from 'date-fns';
import { Calendar, Clock, Flag, User, CheckCircle, PlayCircle, Circle, Loader } from 'lucide-react';
import AddTaskButton from '../components/AddTaskButton';
import { motion, AnimatePresence } from 'framer-motion';

// Priority colors
const priorityColors = {
  HIGH: 'bg-red-500/10 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800',
  MEDIUM: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800',
  LOW: 'bg-green-500/10 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'
};

// Status colors and icons
const statusColors = {
  TO_DO: 'bg-gray-500/10 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700',
  IN_PROGRESS: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800',
  DONE: 'bg-green-500/10 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'
};

const statusIcons = {
  TO_DO: <Circle size={14} className="inline mr-1" />,
  IN_PROGRESS: <PlayCircle size={14} className="inline mr-1" />,
  DONE: <CheckCircle size={14} className="inline mr-1" />
};

export default function MyTasks() {
  const { tasks, fetchTasks, loading } = useTaskStore();
  const { currentProject } = useProjectStore();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => { 
    const loadTasks = async () => {
      if (currentProject) {
        await fetchTasks(currentProject.id);
        setIsInitialLoad(false);
      }
    };
    
    loadTasks();
  }, [currentProject, fetchTasks]);

  const groupedTasks = useMemo(() => {
    if (loading || isInitialLoad) {
      return { today: [], tomorrow: [], thisWeek: [], upcoming: [] };
    }

    const today = [];
    const tomorrow = [];
    const thisWeek = [];
    const upcoming = [];

    tasks.forEach(task => {
      if (!task.dueDate) {
        upcoming.push(task);
        return;
      }
      
      const date = new Date(task.dueDate);
      if (isToday(date)) today.push(task);
      else if (isTomorrow(date)) tomorrow.push(task);
      else if (isThisWeek(date)) thisWeek.push(task);
      else upcoming.push(task);
    });

    // Sort each group by priority and due date
    const sortTasks = (taskList) => 
      taskList.sort((a, b) => {
        const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
        if (priorityOrder[b.priority] !== priorityOrder[a.priority]) {
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        if (a.dueDate && b.dueDate) {
          return new Date(a.dueDate) - new Date(b.dueDate);
        }
        return 0;
      });

    return {
      today: sortTasks(today),
      tomorrow: sortTasks(tomorrow),
      thisWeek: sortTasks(thisWeek),
      upcoming: sortTasks(upcoming)
    };
  }, [tasks, loading, isInitialLoad]);

  const TaskCard = ({ task }) => (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="group p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2 group-hover:text-primary transition-colors">
            {task.title}
          </h3>
          {task.description && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
              {task.description}
            </p>
          )}
        </div>
        
        {task.assignee && (
          <img 
            src={task.assignee.avatarUrl} 
            alt={task.assignee.name}
            className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 shadow-sm ml-3 flex-shrink-0"
            title={`Assigned to ${task.assignee.name}`}
          />
        )}
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[task.status]}`}>
            {statusIcons[task.status]}
            {task.status.replace('_', ' ')}
          </span>
          
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
            <Flag size={12} className="inline mr-1" />
            {task.priority}
          </span>
        </div>

        {task.dueDate && (
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 ml-2 whitespace-nowrap">
            <Calendar size={14} className="mr-1 flex-shrink-0" />
            {new Date(task.dueDate).toLocaleDateString()}
          </div>
        )}
      </div>

      {currentProject && (
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <User size={14} className="mr-2 flex-shrink-0" />
            {currentProject.name}
          </div>
          
          <div className="text-xs text-gray-400 dark:text-gray-500">
            {new Date(task.createdAt).toLocaleDateString()}
          </div>
        </div>
      )}
    </motion.div>
  );

  const TaskSection = ({ title, tasks, icon, emptyMessage, color = 'gray' }) => {
    const colorClasses = {
      gray: 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700',
      blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
      green: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
      purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
      orange: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
    };

    const iconColors = {
      gray: 'text-gray-600',
      blue: 'text-blue-600',
      green: 'text-green-600',
      purple: 'text-purple-600',
      orange: 'text-orange-600'
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
                    key={task.id}
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
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-8"
              >
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

  // Loading state
  if (isInitialLoad || loading) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
          <h1
  className="text-3xl font-bold tracking-tight text-white drop-shadow-lg" 
>
  My Tasks
</h1>
<p className="mt-2 text-base text-gray-200 bg-gradient-to-r from-purple-900/50 to-purple-700/50 py-2 px-4 rounded-xl shadow-sm">
  {}
  <span className="text-white"> {}
    Overview of all your assigned tasks across projects
  </span>
</p>

          </div>
          <AddTaskButton variant="default" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-4">
              <div className="animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
                  <div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24 mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  {[1, 2, 3].map((task) => (
                    <div key={task} className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with Add Task button */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1
  className="text-3xl font-bold tracking-tight text-white drop-shadow-lg" 
>
  My Tasks
</h1>
<p className="mt-2 text-base text-gray-200 bg-gradient-to-r from-purple-900/50 to-purple-700/50 py-2 px-4 rounded-xl shadow-sm">
  {}
  <span className="text-white"> {}
    Overview of all your assigned tasks across projects
  </span>
</p>

        </div>
        <AddTaskButton variant="default" />
      </div>

      {/* Task Sections Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <TaskSection
          title="Today"
          tasks={groupedTasks.today}
          icon={<Calendar size={20} />}
          emptyMessage="No tasks due today. Enjoy your day!"
          color="blue"
        />

        <TaskSection
          title="Tomorrow"
          tasks={groupedTasks.tomorrow}
          icon={<Clock size={20} />}
          emptyMessage="No tasks scheduled for tomorrow."
          color="green"
        />

        <TaskSection
          title="This Week"
          tasks={groupedTasks.thisWeek}
          icon={<Flag size={20} />}
          emptyMessage="No tasks scheduled for this week."
          color="purple"
        />

        <TaskSection
          title="Upcoming / No Date"
          tasks={groupedTasks.upcoming}
          icon={<User size={20} />}
          emptyMessage="No upcoming tasks without dates."
          color="orange"
        />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-1">
            {tasks.filter(t => t.status === 'TO_DO').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">To Do</div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {tasks.filter(t => t.status === 'IN_PROGRESS').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">In Progress</div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {tasks.filter(t => t.status === 'DONE').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-1">
            {tasks.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Tasks</div>
        </div>
      </div>

      {/* Floating Add Task Button */}
      <AddTaskButton variant="floating" />
    </div>
  );
}