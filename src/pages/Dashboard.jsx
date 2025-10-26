import useAuthStore from '../store/authStore';
import CalendarWidget from '../components/dashboard/CalendarWidget';
import UrgentTasks from '../components/dashboard/UrgentTasks';
import ProjectDirectory from '../components/dashboard/ProjectDirectory';
import NewComments from '../components/dashboard/NewComments';
import TeamDirectory from '../components/dashboard/TeamDirectory';

export default function Dashboard() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          Welcome, {user?.name || 'User'}!
        </h1>
        <p className="text-gray-400 font-light">Here is your agenda for today</p>
      </div>
      
      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* === Left Column (Span 2) === */}
        <div className="lg:col-span-2 space-y-6">
          {/* Top row: Calendar + Urgent Tasks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CalendarWidget />
            <UrgentTasks />
          </div>
          {/* Bottom row: Project Directory */}
          <ProjectDirectory />
        </div>

        {/* === Right Column (Span 1) === */}
        <div className="lg:col-span-1 space-y-6">
          <NewComments />
          <TeamDirectory />
        </div>
      </div>
    </div>
  );
}