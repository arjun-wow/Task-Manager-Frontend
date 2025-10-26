// This file is renamed to `CalendarPage.jsx`
import { useEffect } from "react";
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameDay, isToday } from "date-fns";
import useTaskStore from "../store/taskStore";
import useProjectStore from '../store/projectStore';

export default function CalendarPage(){
  const { tasks, fetchTasks } = useTaskStore();
  const { currentProject } = useProjectStore();

  useEffect(()=>{ 
    // In a real app, you'd fetch tasks across ALL projects for the calendar
    // For now, we'll just show tasks from the current project
    if (currentProject) {
      fetchTasks(currentProject.id); 
    }
  }, [currentProject, fetchTasks]);

  const today = new Date();
  const start = startOfMonth(today);
  const end = endOfMonth(today);
  const days = eachDayOfInterval({ start, end });

  const tasksFor = (d) => tasks.filter(t => t.dueDate && isSameDay(new Date(t.dueDate), d));

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-6">Calendar</h1>
      <p className="mb-4 text-gray-600">Showing tasks for project: {currentProject?.name || 'No project selected'}</p>
      
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-soft border dark:border-gray-800 p-4">
        <div className="grid grid-cols-7 gap-1">
          {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
            <div key={day} className="text-center text-xs font-bold text-gray-400 p-2">{day}</div>
          ))}
          {days.map(day => {
            const dayTasks = tasksFor(day);
            return (
              <div key={day.toString()} className={`rounded-xl p-3 border h-32 ${isToday(day) ? 'bg-blue-50 dark:bg-blue-900/50 border-blue-200' : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800'}`}>
                <div className="text-sm font-medium">{format(day, 'd')}</div>
                <div className="mt-2 space-y-1 overflow-y-auto max-h-20">
                  {dayTasks.map(t=> <div key={t.id} className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-700 truncate">{t.title}</div>)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}