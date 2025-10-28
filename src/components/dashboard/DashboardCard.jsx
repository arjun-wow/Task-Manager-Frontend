import { motion } from 'framer-motion';

export default function DashboardCard({ title, children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl border border-white/40 dark:border-gray-700/50 shadow-soft overflow-hidden ${className}`}
    >
      {title && (
        <div className="px-6 py-4 border-b border-white/30 dark:border-gray-700/30">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </motion.div>
  );
}