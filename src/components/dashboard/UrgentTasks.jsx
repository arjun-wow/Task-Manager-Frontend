import DashboardCard from './DashboardCard';

const dummyTasks = [
  { id: 1, title: 'Finish monthly reporting', tag: 'Today' },
  { id: 2, title: 'Report signing', tag: 'Today' },
  { id: 3, title: 'Market overview keynote', tag: 'Today' },
];

export default function UrgentTasks() {
  return (
    <DashboardCard title="Urgent tasks">
      <div className="space-y-4">
        {dummyTasks.map(task => (
          <div key={task.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Using a div for styling, not a real checkbox */}
              <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0"></div>
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{task.title}</span>
            </div>
            <span className="text-xs font-medium text-red-500 flex-shrink-0">• {task.tag}</span>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}