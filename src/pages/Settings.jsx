import { useState, useEffect } from "react";
import { Sun, Moon, Bell, Globe, Key, Monitor, RefreshCw } from 'lucide-react';

export default function Settings() {
  const [dark, setDark] = useState(document.documentElement.classList.contains('dark'));
  const [notifications, setNotifications] = useState(localStorage.getItem('notifications') === 'true');
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');
  const [autoLogout, setAutoLogout] = useState(localStorage.getItem('autoLogout') || '30');
  const [fontSize, setFontSize] = useState(localStorage.getItem('fontSize') || '16');

  // --- Theme toggle ---
  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    setDark(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };

  // --- Initial preference load ---
  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      setDark(false);
    }
  }, []);

  const toggleNotifications = () => {
    const newValue = !notifications;
    setNotifications(newValue);
    localStorage.setItem('notifications', newValue);
  };

  const changeLanguage = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const changeAutoLogout = (e) => {
    const time = e.target.value;
    setAutoLogout(time);
    localStorage.setItem('autoLogout', time);
  };

  const changeFontSize = (e) => {
    const size = e.target.value;
    setFontSize(size);
    document.documentElement.style.fontSize = `${size}px`;
    localStorage.setItem('fontSize', size);
  };

  return (
    <div className="transition-all duration-300 ease-in-out">
      <h1 className="text-3xl font-bold text-black dark:text-white mb-6 transition-all duration-300">
        Settings
      </h1>

      {[
        {
          icon: <Monitor size={16} />,
          title: "Dark Mode",
          desc: "Toggle between light and dark theme",
          control: (
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full border dark:border-gray-700 bg-gray-100 dark:bg-gray-800 hover:scale-110 transition-all duration-300"
            >
              {dark ? <Sun size={18} className="text-black dark:text-white" /> : <Moon size={18} className="text-black dark:text-white" />}
            </button>
          ),
        },
        {
          icon: <Bell size={16} />,
          title: "Notifications",
          desc: "Enable or disable in-app alerts",
          control: (
            <button
              onClick={toggleNotifications}
              className={`px-4 py-1 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 ${
                notifications
                  ? 'bg-green-500 text-white shadow-md hover:bg-green-600'
                  : 'bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {notifications ? 'On' : 'Off'}
            </button>
          ),
        },
        {
          icon: <Globe size={16} />,
          title: "Language",
          desc: "Choose your preferred display language",
          control: (
            <select
              value={language}
              onChange={changeLanguage}
              className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-1 text-sm text-black dark:text-white transition-all duration-300 hover:scale-105"
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="es">Spanish</option>
            </select>
          ),
        },
        {
          icon: <Key size={16} />,
          title: "Auto Logout",
          desc: "Set inactivity timeout duration",
          control: (
            <select
              value={autoLogout}
              onChange={changeAutoLogout}
              className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-1 text-sm text-black dark:text-white transition-all duration-300 hover:scale-105"
            >
              <option value="15">15 mins</option>
              <option value="30">30 mins</option>
              <option value="60">1 hour</option>
            </select>
          ),
        },
        {
          icon: <RefreshCw size={16} />,
          title: "Font Size",
          desc: "Adjust global text size",
          control: (
            <input
              type="range"
              min="14"
              max="20"
              value={fontSize}
              onChange={changeFontSize}
              className="w-24 accent-primary transition-all duration-300 hover:scale-105"
            />
          ),
        },
      ].map(({ icon, title, desc, control }, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-soft border dark:border-gray-800 max-w-md mb-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium flex items-center gap-2 text-black dark:text-white transition-all duration-300">
                {icon} {title}
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 transition-all duration-300">
                {desc}
              </p>
            </div>
            {control}
          </div>
        </div>
      ))}
    </div>
  );
}
