import useAuthStore from '../store/authStore';
import CalendarWidget from '../components/dashboard/CalendarWidget';
import UrgentTasks from '../components/dashboard/UrgentTasks';
import ProjectDirectory from '../components/dashboard/ProjectDirectory';
import NewComments from '../components/dashboard/NewComments';
import TeamDirectory from '../components/dashboard/TeamDirectory';
import AddTaskButton from '../components/AddTaskButton';

export default function Dashboard() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      {/* Header with Add Task button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white-900 dark:text-white">
            Welcome, {user?.name || 'User'}!
          </h1>
          <p className="text-white-600 dark:text-white-300 mt-1 text-sm">
            Here is your agenda for today
          </p>
        </div>
        <AddTaskButton variant="default" />
      </div>
      
      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Top row: Calendar + Urgent Tasks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CalendarWidget />
            <UrgentTasks />
          </div>
          {/* Bottom row: Project Directory */}
          <ProjectDirectory />
        </div>

        <div className="lg:col-span-1 space-y-6">
          <NewComments />
          <TeamDirectory />
        </div>
      </div>

      <AddTaskButton variant="floating" />
    </div>
  );
}