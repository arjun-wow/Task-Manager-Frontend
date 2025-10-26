import { useState } from "react";
import { Sun, Moon } from 'lucide-react';

export default function Settings(){
  // Check localStorage or system preference
  const [dark, setDark] = useState(document.documentElement.classList.contains('dark'));

  const toggle = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    setDark(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light'); // Persist preference
  };
  
  // On page load, check preference
  useState(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      setDark(false);
    }
  }, []);


  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-6">Settings</h1>
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-soft border dark:border-gray-800 max-w-md">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Dark Mode</h3>
            <p className="text-sm text-gray-500">Toggle between light and dark theme</p>
          </div>
          <button 
            onClick={toggle} 
            className="p-2 rounded-full border dark:border-gray-700 bg-gray-100 dark:bg-gray-800"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
}