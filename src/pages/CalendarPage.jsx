import { useEffect, useState } from "react";
import { 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  format, 
  isSameDay, 
  isToday, 
  addMonths, 
  subMonths, 
  getDay,
  startOfWeek,
  endOfWeek
} from "date-fns";
import useTaskStore from "../store/taskStore";
import useProjectStore from '../store/projectStore';
import DashboardCard from '../components/dashboard/DashboardCard'; 
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CalendarPage() {
  const { tasks, fetchTasks } = useTaskStore();
  const { currentProject } = useProjectStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
   
    if (currentProject) {
      fetchTasks(currentProject.id); 
    }
  }, [currentProject, fetchTasks, currentMonth]); 

  const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 0 });
  const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 0 }); 
  const days = eachDayOfInterval({ start, end });

  const tasksFor = (d) => tasks.filter(t => t.dueDate && isSameDay(new Date(t.dueDate), d));

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const firstDayOfMonthIndex = getDay(startOfMonth(currentMonth)); 

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white dark:text-white drop-shadow-lg">
            Calendar
          </h1>
          <p className="mt-1 text-base text-white-600 dark:text-gray-300">
            {currentProject ? `Showing tasks for project: ${currentProject.name}` : 'Select a project to see tasks'}
          </p>
        </div>
        {/* Month Navigation */}
        <div className="flex items-center gap-4">
           <h2 className="text-xl font-semibold text-white dark:text-white">
             {format(currentMonth, 'MMMM yyyy')}
           </h2>
           <div className="flex items-center gap-1 p-1 bg-white/10 dark:bg-gray-800/50 rounded-lg border border-white/10 dark:border-gray-700 backdrop-blur-sm">
             <button onClick={prevMonth} className="p-1.5 rounded-md text-white-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-700/30 transition">
               <ChevronLeft size={18} />
             </button>
             <button onClick={nextMonth} className="p-1.5 rounded-md text-white-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-700/30 transition">
               <ChevronRight size={18} />
             </button>
           </div>
        </div>
      </div>
      
      <DashboardCard className="p-4 sm:p-6"> 
        <div className="grid grid-cols-7 gap-1">
          {/* Day Headers */}
          {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
            <div key={day} className="text-center text-xs font-bold text-gray-500 dark:text-gray-400 p-2 border-b border-white/10 dark:border-gray-700/50 mb-1">{day}</div>
          ))}
          
          {/* Calendar Days */}
          {days.map((day, index) => {
            const dayTasks = tasksFor(day);
            const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
            const isTodayFlag = isToday(day);

            return (
              <div 
                key={day.toString()} 
                className={`rounded-lg p-2 border border-transparent min-h-[120px] flex flex-col
                  ${isCurrentMonth ? 'bg-white/5 dark:bg-gray-800/30' : 'bg-transparent'} 
                  ${isTodayFlag ? 'border border-blue-500/50 dark:border-blue-400/60 bg-blue-500/5 dark:bg-blue-900/20' : ''}
                  transition duration-150 ease-in-out group relative`} 
              >
                {/* Day number styling */}
                <div className={`text-xs sm:text-sm font-medium mb-1 self-end 
                  ${isCurrentMonth ? 'text-black dark:text-white' : 'text-gray-400 dark:text-gray-600'} 
                  ${isTodayFlag ? 'text-blue-600 dark:text-blue-300 font-bold' : ''}`}
                >
                  {format(day, 'd')}
                </div>
                
                {/* Task Chips Area */}
                <div className="flex-grow space-y-1 overflow-y-auto max-h-[80px] scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
                  {dayTasks.map(t=> (
                    <div 
                      key={t.id} 
                      className="text-[10px] sm:text-xs px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-200 truncate font-medium cursor-pointer hover:opacity-80"
                      title={t.title} 
                    >
                      {t.title}
                    </div>
                  ))}
                </div>
                
              </div>
            );
          })}
        </div>
      </DashboardCard>
    </div>
  );
}

