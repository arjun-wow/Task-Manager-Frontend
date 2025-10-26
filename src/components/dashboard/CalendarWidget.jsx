import DashboardCard from './DashboardCard';
import { format, getDaysInMonth, startOfMonth, getDay, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CalendarWidget() {
  const today = new Date();
  const monthStart = startOfMonth(today);
  const daysInMonth = getDaysInMonth(today);
  const startDayOfWeek = getDay(monthStart); // 0 = Sunday

  const days = [];
  // Fill in blank days before the 1st
  for (let i = 0; i < startDayOfWeek; i++) {
    days.push(null);
  }
  // Fill in the days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(today.getFullYear(), today.getMonth(), i));
  }

  return (
    <DashboardCard>
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-semibold text-lg">{format(today, 'MMMM yyyy')}</h4>
        <div className="flex gap-2">
          <ChevronLeft size={20} className="text-gray-400 cursor-pointer" />
          <ChevronRight size={20} className="text-gray-400 cursor-pointer" />
        </div>
      </div>
      <div className="grid grid-cols-7 gap-y-2 text-center text-sm">
        {/* Day Headers */}
        {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
          <div key={day} className="font-medium text-gray-400 text-xs">{day}</div>
        ))}
        
        {/* Dates */}
        {days.map((day, index) => {
          const isTodayFlag = day && isToday(day);
          return (
            <div 
              key={index} 
              className={`py-1 rounded-full flex items-center justify-center
                ${isTodayFlag ? 'bg-primary text-white font-bold' : day ? 'text-gray-700 dark:text-gray-300' : ''}
              `}
            >
              {day ? format(day, 'd') : ''}
            </div>
          );
        })}
      </div>
    </DashboardCard>
  );
}