export default function DashboardCard({ title, children, className = '' }) {
  return (
    <div className={`bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-soft border dark:border-gray-800 ${className}`}>
      {title && <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{title}</h3>}
      {children}
    </div>
  );
}