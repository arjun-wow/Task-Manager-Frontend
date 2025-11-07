import { useEffect, useMemo } from "react";
import { Loader2 } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts";
import useTaskStore from "../store/taskStore";
import useProjectStore from "../store/projectStore";
import useTeamStore from "../store/teamStore";
import DashboardCard from "../components/dashboard/DashboardCard";

const COLORS = ["#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#3b82f6"];

export default function Reports() {
  const { tasks, fetchTasks, loading: taskLoading } = useTaskStore();
  const { projects, fetchProjects } = useProjectStore();
  const { team, fetchTeam } = useTeamStore();

  useEffect(() => {
    fetchTasks();
    fetchProjects();
    fetchTeam();
  }, [fetchTasks, fetchProjects, fetchTeam]);

  const statusData = useMemo(() => {
    const counts = { TO_DO: 0, IN_PROGRESS: 0, DONE: 0 };
    tasks.forEach((t) => (counts[t.status] = (counts[t.status] || 0) + 1));
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [tasks]);

  const priorityData = useMemo(() => {
    const counts = { LOW: 0, MEDIUM: 0, HIGH: 0 };
    tasks.forEach((t) => (counts[t.priority] = (counts[t.priority] || 0) + 1));
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [tasks]);

  const projectData = useMemo(() => {
    const map = {};
    tasks.forEach((t) => {
      const proj = t.project?.name || "Unassigned";
      map[proj] = (map[proj] || 0) + 1;
    });
    return Object.entries(map).map(([name, count]) => ({ name, count }));
  }, [tasks]);

  const userActivity = useMemo(() => {
    const map = {};
    team.forEach((u) => {
      map[u.name || "Unknown"] = { assigned: 0, completed: 0 };
    });
    tasks.forEach((t) => {
      if (t.assignee?.name) {
        map[t.assignee.name].assigned++;
        if (t.status === "DONE") map[t.assignee.name].completed++;
      }
    });
    return Object.entries(map).map(([name, stats]) => ({
      name,
      assigned: stats.assigned,
      completed: stats.completed,
    }));
  }, [tasks, team]);

  if (taskLoading)
    return (
      <div className="flex justify-center items-center h-64 text-gray-400">
        <Loader2 className="animate-spin mr-2" /> Loading Reports...
      </div>
    );

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white mb-4">Reports Dashboard</h1>

      {/* Status Pie Chart */}
      <DashboardCard title="Task Distribution by Status">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={statusData} dataKey="value" nameKey="name" outerRadius={100}>
              {statusData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </DashboardCard>

      {/* Priority Pie Chart */}
      <DashboardCard title="Task Priority Breakdown">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={priorityData} dataKey="value" nameKey="name" outerRadius={100}>
              {priorityData.map((_, i) => (
                <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </DashboardCard>

      {/* Tasks per Project */}
      <DashboardCard title="Tasks per Project">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={projectData}>
            <XAxis dataKey="name" stroke="#aaa" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8b5cf6" />
          </BarChart>
        </ResponsiveContainer>
      </DashboardCard>

      {/* User Activity */}
      <DashboardCard title="User Task Activity">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={userActivity}>
            <XAxis dataKey="name" stroke="#aaa" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="assigned" fill="#3b82f6" name="Assigned Tasks" />
            <Bar dataKey="completed" fill="#10b981" name="Completed Tasks" />
          </BarChart>
        </ResponsiveContainer>
      </DashboardCard>
    </div>
  );
}
