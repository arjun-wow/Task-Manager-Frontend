import { Bell, Search } from 'lucide-react';
import useAuthStore from '../../store/authStore';

export default function Navbar(){
  const { user } = useAuthStore();

  return (
    <header className="fixed top-0 left-0 sm:left-60 right-0 bg-black/20 backdrop-blur-xl border-b border-white/10 h-16 flex items-center justify-between px-6 z-40">
      <div className="relative">
        <input 
          type="text" 
          placeholder="Search..." 
          className="w-72 bg-black/30 border border-white/10 rounded-2xl px-3 py-2 pl-10 text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none backdrop-blur-sm transition-all" 
        />
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Bell className="text-gray-300 hover:text-white cursor-pointer transition-colors"/>
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
        </div>
        <img 
          src={user?.avatarUrl || 'https://i.pravatar.cc/40'} 
          alt="avatar" 
          className="w-9 h-9 rounded-full border-2 border-purple-500/50 shadow-lg"
        />
      </div>
    </header>
  );
}