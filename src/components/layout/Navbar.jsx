import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import useAuthStore from "../../store/authStore";
import useTaskStore from "../../store/taskStore";
import useTeamStore from "../../store/teamStore";
import NotificationBell from "../NotificationBell";

export default function Navbar() {
  const { user } = useAuthStore();
  const { tasks, fetchTasks } = useTaskStore();
  const { team, fetchTeam } = useTeamStore();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    fetchTasks();
    fetchTeam();
  }, [fetchTasks, fetchTeam]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const q = query.toLowerCase();

    const matchedTasks = tasks
      .filter((t) => t.title.toLowerCase().includes(q))
      .map((t) => ({ type: "Task", label: t.title }));

    const matchedUsers = team
      .filter((u) => u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q))
      .map((u) => ({ type: "User", label: u.name || u.email }));

    const merged = [...matchedTasks, ...matchedUsers].slice(0, 8); // limit results
    setResults(merged);
  }, [query, tasks, team]);

  return (
    <header className="fixed top-0 left-0 sm:left-60 right-0 bg-black/20 backdrop-blur-xl border-b border-white/10 h-16 flex items-center justify-between px-6 z-40">
      <div className="relative w-72">
        <input
          type="text"
          placeholder="Search tasks or users..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowDropdown(true);
          }}
          onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
          className="w-full bg-black/30 border border-white/10 rounded-2xl px-3 py-2 pl-10 text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none backdrop-blur-sm transition-all"
        />
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

        {showDropdown && results.length > 0 && (
          <div className="absolute mt-1 w-full bg-gray-900/90 backdrop-blur-md rounded-lg border border-gray-700 shadow-lg overflow-hidden z-50">
            {results.map((r, i) => (
              <div
                key={i}
                className="px-3 py-2 text-sm text-gray-200 hover:bg-purple-500/30 cursor-pointer transition"
              >
                <span className="font-medium text-purple-400 mr-1">[{r.type}]</span>
                {r.label}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <NotificationBell />
        <img
          src={user?.avatarUrl || "https://i.pravatar.cc/40"}
          alt="avatar"
          className="w-9 h-9 rounded-full border-2 border-purple-500/50 shadow-lg"
        />
      </div>
    </header>
  );
}
