import DashboardCard from './DashboardCard';
import useTeamStore from '../../store/teamStore';
import { useEffect } from 'react';

export default function TeamDirectory() {
  const { team, fetchTeam } = useTeamStore();

  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  return (
    <DashboardCard title="Team directory">
      <div className="grid grid-cols-2 gap-x-4 gap-y-6">
        {team.slice(0, 4).map((/** @type {any} */ user) => (
          <div key={user.id} className="text-center">
            <img src={user.avatarUrl} alt={user.name} className="w-16 h-16 rounded-full mx-auto mb-2 shadow-md" />
            <h5 className="font-semibold text-sm text-gray-900 dark:text-gray-100">{user.name}</h5>
            <p className="text-xs text-gray-500 dark:text-gray-400">{user.role || 'Member'}</p>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}