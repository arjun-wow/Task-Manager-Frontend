import DashboardCard from './DashboardCard';
import { Bell, Check } from 'lucide-react';
import useNotificationStore from '../../store/notificationStore';
import { useEffect } from 'react';

export default function NewComments() {
  const { notifications, fetchNotifications, markAsRead } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000); // refresh every 15s
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const recent = notifications.slice(0, 4); // show last 4 activities

  return (
    <DashboardCard title="Recent Activity">
      <div className="space-y-4">
        {recent.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">No recent activity yet.</p>
        ) : (
          recent.map((item) => (
            <div
              key={item.id}
              onClick={() => markAsRead(item.id)}
              className={`flex items-start justify-between p-3 rounded-xl transition 
                ${
                  item.read
                    ? 'bg-gray-50/40 dark:bg-gray-800/40'
                    : 'bg-purple-100/60 dark:bg-purple-900/40 border border-purple-400/30'
                } hover:bg-purple-200/50 dark:hover:bg-purple-800/60 cursor-pointer`}
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 flex items-center justify-center bg-purple-500/20 rounded-full">
                  <Bell size={18} className="text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-800 dark:text-gray-200">{item.message}</p>
                  <span className="text-xs text-gray-400">{new Date(item.createdAt).toLocaleString()}</span>
                </div>
              </div>
              {!item.read && <Check size={16} className="text-blue-500 mt-1 flex-shrink-0" />}
            </div>
          ))
        )}
      </div>
    </DashboardCard>
  );
}
