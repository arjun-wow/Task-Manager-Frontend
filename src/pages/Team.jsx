import { useEffect } from "react";
import useTeamStore from "../store/teamStore"; 
import DashboardCard from '../components/dashboard/DashboardCard';

export default function Team() {
  const { team, fetchTeam, loading } = useTeamStore(); 

  useEffect(() => {
    fetchTeam(); 
  }, [fetchTeam]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white dark:text-white drop-shadow-lg">
          Team Directory
        </h1>
        <p className="mt-1 text-base text-white-600 dark:text-gray-300">
          All registered users in the workspace
        </p>
      </div>
      
      {/* Grid for Team Members */}
      {loading ? (
        <p className="text-gray-400 dark:text-gray-500">Loading team members...</p>
      ) : team.length === 0 ? (
         <p className="text-gray-400 dark:text-gray-500">No team members found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Map over the fetched team members */}
          {team.map((/** @type {any} */ member) => ( 
            <DashboardCard key={member.id} className="p-6 flex flex-col items-center text-center">
              <img
                src={member.avatarUrl || `https://i.pravatar.cc/150?u=${member.id}`} 
                alt={member.name || 'User'}
                className="w-20 h-20 rounded-full border-4 border-white/20 dark:border-gray-700 mb-4 shadow-md" 
              />
              <h2 className="font-semibold text-lg text-black dark:text-white">{member.name || 'Unnamed User'}</h2>
              {/* Optional: Add Role later to User model and display here */}
              <p className="text-sm text-gray-600 dark:text-gray-400">{member.role || 'Member'}</p> 
              {/* Removed the Task Progress bar */}
            </DashboardCard>
          ))}
        </div>
      )}
    </div>
  );
}

