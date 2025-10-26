import { useEffect } from "react";
import useTaskStore from "../store/taskStore";

const members = [
  { id: 1, name: "Arjun", role: "Frontend Developer", avatar: "https://i.pravatar.cc/150?img=1" },
  { id: 2, name: "Diya", role: "Backend Developer", avatar: "https://i.pravatar.cc/150?img=2" },
  { id: 3, name: "Raj", role: "UI/UX Designer", avatar: "https://i.pravatar.cc/150?img=3" },
  { id: 4, name: "Karan", role: "DevOps Engineer", avatar: "https://i.pravatar.cc/150?img=4" },
];

export default function Team() {
  const { tasks, fetchTasks } = useTaskStore();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-primary mb-6">Team Members</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {members.map((m) => (
          <div
            key={m.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-6 flex flex-col items-center border border-gray-100"
          >
            <img
              src={m.avatar}
              alt={m.name}
              className="w-20 h-20 rounded-full border-4 border-blue-100 mb-3"
            />
            <h2 className="font-semibold text-lg text-gray-800">{m.name}</h2>
            <p className="text-sm text-gray-500">{m.role}</p>
            <div className="mt-4 w-full">
              <p className="text-xs text-gray-500 mb-1">Task Progress</p>
              <div className="w-full bg-gray-200 h-2 rounded-full">
                <div
                  className="h-2 bg-primary rounded-full"
                  style={{
                    width: `${Math.floor(Math.random() * 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
