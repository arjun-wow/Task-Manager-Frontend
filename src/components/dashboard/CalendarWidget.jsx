import DashboardCard from './DashboardCard';
import { format, getDaysInMonth, startOfMonth, getDay, isToday, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function CalendarWidget() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const today = new Date();
  const monthStart = startOfMonth(currentDate);
  const daysInMonth = getDaysInMonth(currentDate);
  const startDayOfWeek = getDay(monthStart); 

  const days = [];
  for (let i = 0; i < startDayOfWeek; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
  }

  const goToPreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const isCurrentMonth = currentDate.getMonth() === today.getMonth() && 
                         currentDate.getFullYear() === today.getFullYear();

  return (
    <DashboardCard>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <CalendarIcon size={20} className="text-primary" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
              {format(currentDate, 'MMMM yyyy')}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {format(today, 'EEEE, MMMM do')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={goToPreviousMonth}
            className="p-2 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-lg transition-colors duration-200 group"
          >
            <ChevronLeft size={16} className="text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={goToToday}
            className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 rounded-lg transition-colors duration-200"
          >
            Today
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={goToNextMonth}
            className="p-2 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-lg transition-colors duration-200 group"
          >
            <ChevronRight size={16} className="text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
          </motion.button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="space-y-3">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
            <div 
              key={day} 
              className="text-xs font-semibold text-gray-500 dark:text-gray-400 py-2"
            >
              {day}
            </div>
          ))}
        </div>
        
        {}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            const isTodayFlag = day && isToday(day);
            const isWeekend = day && (getDay(day) === 0 || getDay(day) === 6);
            const isCurrentMonthDay = day && day.getMonth() === currentDate.getMonth();
            
            return (
              <motion.div 
                key={index}
                whileHover={{ scale: day && isCurrentMonthDay ? 1.1 : 1 }}
                whileTap={{ scale: day && isCurrentMonthDay ? 0.9 : 1 }}
                className={`
                  aspect-square flex items-center justify-center text-sm font-medium
                  rounded-lg transition-all duration-200 cursor-pointer
                  ${!day 
                    ? 'text-transparent cursor-default' 
                    : isTodayFlag
                    ? 'bg-primary text-white shadow-md'
                    : isWeekend && isCurrentMonthDay
                    ? 'text-gray-400 dark:text-gray-500 hover:bg-gray-100/50 dark:hover:bg-gray-700/50'
                    : !isCurrentMonthDay
                    ? 'text-gray-300 dark:text-gray-600 hover:bg-gray-50/50 dark:hover:bg-gray-800/50'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-gray-700/60'
                  }
                `}
                title={day ? format(day, 'MMMM do, yyyy') : ''}
              >
                {day ? format(day, 'd') : ''}
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {isCurrentMonth ? "Today's Tasks" : "Upcoming Tasks"}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
            {isCurrentMonth ? 3 : 0}
          </span>
        </div>
        <div className="space-y-2">
          {isCurrentMonth ? (
            <>
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-xs text-gray-600 dark:text-gray-400 flex-1">
                  Team meeting
                </span>
                <span className="text-xs text-gray-500">10:00 AM</span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-600 dark:text-gray-400 flex-1">
                  Project review
                </span>
                <span className="text-xs text-gray-500">2:00 PM</span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-xs text-gray-600 dark:text-gray-400 flex-1">
                  Design sprint
                </span>
                <span className="text-xs text-gray-500">4:30 PM</span>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No tasks for {format(currentDate, 'MMMM')}
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardCard>
  );
}