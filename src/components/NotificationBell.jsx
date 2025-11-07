import React, { useState, useEffect, useRef } from "react";
import { Bell, Check } from "lucide-react";
import useNotificationStore from "../store/notificationStore";

export default function NotificationBell() {
  const { notifications, fetchNotifications, markAsRead } = useNotificationStore();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative flex items-center justify-center p-2 rounded-full 
                   bg-white/60 backdrop-blur-md border border-gray-300/60 
                   hover:bg-white/80 shadow-md transition-all duration-300"
      >
        <Bell
          size={22}
          className="text-gray-700 hover:text-indigo-600 transition-transform duration-300 hover:scale-110"
        />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse shadow-sm" />
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 mt-3 w-80 bg-gradient-to-br from-white/90 to-gray-100/80 
                     border border-gray-200/80 rounded-2xl shadow-lg backdrop-blur-xl z-50"
        >
          <div className="p-3 border-b border-gray-200/70 flex justify-between items-center">
            <h4 className="font-semibold text-gray-800">Notifications</h4>
            <span className="text-xs text-gray-500">{unreadCount} unread</span>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-4 text-sm text-gray-500 text-center">
                No notifications yet.
              </p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markAsRead(n.id)}
                  className={`p-3 text-sm flex justify-between items-center 
                              border-b border-gray-200/60 cursor-pointer transition
                              ${
                                n.read
                                  ? "bg-white/70 text-gray-500"
                                  : "bg-indigo-50 text-gray-800 font-medium"
                              }
                              hover:bg-indigo-100/80`}
                >
                  <span>{n.message}</span>
                  {!n.read && <Check size={14} className="text-indigo-500" />}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
