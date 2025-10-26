import { ListChecks, Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import useTaskStore from "../../store/taskStore";

export default function StatsCards() {
  const { tasks } = useTaskStore();

  const pending = tasks.filter((t) => t.status === "PENDING").length;
  const inProgress = tasks.filter((t) => t.status === "IN_PROGRESS").length;
  const completed = tasks.filter((t) => t.status === "COMPLETED").length;
  const overdue = tasks.filter(
    (t) => new Date(t.dueDate) < new Date() && t.status !== "COMPLETED"
  ).length;

  const cards = [
    {
      title: "Pending",
      count: pending,
      icon: Clock,
      color: "bg-yellow-100 text-yellow-700 border-yellow-300",
    },
    {
      title: "In Progress",
      count: inProgress,
      icon: ListChecks,
      color: "bg-blue-100 text-blue-700 border-blue-300",
    },
    {
      title: "Completed",
      count: completed,
      icon: CheckCircle2,
      color: "bg-green-100 text-green-700 border-green-300",
    },
    {
      title: "Overdue",
      count: overdue,
      icon: AlertTriangle,
      color: "bg-red-100 text-red-700 border-red-300",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map(({ title, count, icon: Icon, color }) => (
        <div
          key={title}
          className={`border ${color} rounded-2xl p-5 shadow-soft flex justify-between items-center transition-transform hover:-translate-y-1`}
        >
          <div>
            <h3 className="text-sm font-semibold text-gray-500">{title}</h3>
            <p className="text-2xl font-bold mt-1">{count}</p>
          </div>
          <div
            className={`p-3 rounded-full border ${color} bg-white shadow-inner`}
          >
            <Icon size={22} className={`text-current`} />
          </div>
        </div>
      ))}
    </div>
  );
}
