import DashboardCard from './DashboardCard';
import useTaskStore from '../../store/taskStore';
import useProjectStore from '../../store/projectStore';
import { useEffect, useMemo } from 'react';
import { format, isToday, isTomorrow, isThisWeek } from 'date-fns';
import { Clock, AlertCircle, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export default function UrgentTasks() {
  const { tasks, fetchTasks } = useTaskStore();
  const { currentProject } = useProjectStore();

  useEffect(() => {
    if (currentProject) {
      fetchTasks(currentProject.id);
    }
  }, [currentProject, fetchTasks]);

  // Filter and sort urgent tasks
  const urgentTasks = useMemo(() => {
    if (!tasks.length) return [];

    const now = new Date();
    const twoDaysFromNow = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);

    return tasks
      .filter(task => {
        if (!task.dueDate) return false;
        
        const dueDate = new Date(task.dueDate);
        const isUrgent = dueDate <= twoDaysFromNow || task.priority === 'HIGH';
        const isNotCompleted = task.status !== 'DONE';
        
        return isUrgent && isNotCompleted;
      })
      .sort((a, b) => {
        // Sort by due date (closest first)
        if (a.dueDate && b.dueDate) {
          return new Date(a.dueDate) - new Date(b.dueDate);
        }
        // Tasks with due dates come first
        if (a.dueDate && !b.dueDate) return -1;
        if (!a.dueDate && b.dueDate) return 1;
        
        // Then sort by priority
        const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      })
      .slice(0, 5); // Show only top 5 urgent tasks
  }, [tasks]);

  const getTaskUrgency = (task) => {
    if (!task.dueDate) return { label: 'No deadline', color: 'text-gray-500', bgColor: 'bg-gray-100 dark:bg-gray-800' };

    const dueDate = new Date(task.dueDate);
    const now = new Date();
    const timeDiff = dueDate.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);

    if (hoursDiff < 0) {
      return { label: 'Overdue', color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-900/30' };
    } else if (hoursDiff < 24) {
      return { label: 'Due today', color: 'text-red-500', bgColor: 'bg-red-100 dark:bg-red-900/30' };
    } else if (hoursDiff < 48) {
      return { label: 'Due tomorrow', color: 'text-orange-500', bgColor: 'bg-orange-100 dark:bg-orange-900/30' };
    } else if (isThisWeek(dueDate)) {
      return { label: 'This week', color: 'text-yellow-600', bgColor: 'bg-yellow-100 dark:bg-yellow-900/30' };
    } else {
      return { label: format(dueDate, 'MMM dd'), color: 'text-blue-500', bgColor: 'bg-blue-100 dark:bg-blue-900/30' };
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'HIGH':
        return <AlertCircle size={12} className="text-red-500" />;
      case 'MEDIUM':
        return <Clock size={12} className="text-yellow-500" />;
      case 'LOW':
        return <Calendar size={12} className="text-blue-500" />;
      default:
        return <Clock size={12} className="text-gray-500" />;
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return format(date, 'h:mm a');
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    
    if (isToday(date)) {
      return `Today, ${formatTime(dateString)}`;
    } else if (isTomorrow(date)) {
      return `Tomorrow, ${formatTime(dateString)}`;
    } else {
      return format(date, 'MMM dd, h:mm a');
    }
  };

  if (!urgentTasks.length) {
    return (
      <DashboardCard title="Urgent Tasks">
        <div className="text-center py-8">
          <Clock size={32} className="mx-auto text-gray-400 dark:text-gray-600 mb-3" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">No urgent tasks</p>
          <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">You're all caught up!</p>
        </div>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard title="Urgent Tasks">
      <div className="space-y-3">
        {urgentTasks.map((task, index) => {
          const urgency = getTaskUrgency(task);
          const isOverdue = urgency.label === 'Overdue';
          
          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-white/40 dark:border-gray-700/50 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="flex-shrink-0 mt-0.5">
                    {getPriorityIcon(task.priority)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-sm font-medium truncate ${
                      isOverdue 
                        ? 'text-red-700 dark:text-red-300' 
                        : 'text-gray-900 dark:text-gray-100'
                    }`}>
                      {task.title}
                    </h4>
                    {task.description && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                        {task.description}
                      </p>
                    )}
                    {task.dueDate && (
                      <div className="flex items-center gap-1 mt-2">
                        <Clock size={10} className="text-gray-400 flex-shrink-0" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(task.dueDate)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <span className={`text-xs font-medium px-2 py-1 rounded-full flex-shrink-0 ${urgency.bgColor} ${urgency.color}`}>
                  {urgency.label}
                </span>
              </div>
              
              {/* Task metadata */}
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                    task.status === 'TO_DO' 
                      ? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                      : task.status === 'IN_PROGRESS'
                      ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300'
                  }`}>
                    {task.status.replace('_', ' ')}
                  </span>
                </div>
                
                {task.assignee && (
                  <img 
                    src={task.assignee.avatarUrl} 
                    alt={task.assignee.name}
                    className="w-5 h-5 rounded-full border border-white dark:border-gray-800"
                    title={`Assigned to ${task.assignee.name}`}
                  />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Total urgent tasks</span>
          <span className="font-semibold text-gray-700 dark:text-gray-300">
            {urgentTasks.length}
          </span>
        </div>
        {urgentTasks.some(task => getTaskUrgency(task).label === 'Overdue') && (
          <div className="flex items-center gap-1 mt-2 text-xs text-red-500">
            <AlertCircle size={12} />
            <span>Some tasks are overdue</span>
          </div>
        )}
      </div>
    </DashboardCard>
  );
}