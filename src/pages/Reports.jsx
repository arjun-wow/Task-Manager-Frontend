import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import useProjectStore from "../store/projectStore";
import { motion } from "framer-motion";
import { Loader } from "lucide-react";

const COLORS = ["#6b7280", "#3b82f6", "#22c55e"]; // To Do (gray), In Progress (blue), Done (green)

const Reports = () => {
  const { currentProject } = useProjectStore();
  const [reportData, setReportData] = useState([]);
  const [stats, setStats] = useState({ total: 0, completionRate: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setLoading(true);
        const url = currentProject
          ? `http://localhost:5000/api/reports?projectId=${currentProject.id}`
          : "http://localhost:5000/api/reports";

        const res = await fetch(url);
        const data = await res.json();

        setReportData([
          { name: "To Do", value: data.toDo },
          { name: "In Progress", value: data.inProgress },
          { name: "Done", value: data.done },
        ]);
        setStats({ total: data.total, completionRate: data.completionRate });
      } catch (error) {
        console.error("Error fetching report data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [currentProject]);

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Reports & Insights
          </h1>
          <p className="mt-2 text-base text-gray-600 dark:text-gray-300">
            {currentProject
              ? `Project: ${currentProject.name}`
              : "Overall performance across all projects"}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-80">
          <Loader className="animate-spin text-gray-500 dark:text-gray-400 mb-4" size={32} />
          <p className="text-gray-600 dark:text-gray-400">Fetching report data...</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Chart Card */}
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6 flex flex-col justify-center items-center border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
              Task Distribution
            </h2>
            {reportData && reportData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={reportData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    dataKey="value"
                  >
                    {reportData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [`${value} tasks`, name]}
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      color: "white",
                      borderRadius: "8px",
                      border: "none",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No data available</p>
            )}
          </div>

          {/* Insights Card */}
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6 border border-gray-200 dark:border-gray-700 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
                Insights Summary
              </h2>
              {reportData.length > 0 && (
                <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                  {reportData.map((item, index) => (
                    <li key={index} className="flex justify-between">
                      <span>{item.name}</span>
                      <span className="font-semibold">{item.value}</span>
                    </li>
                  ))}
                  <li className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-3">
                    <span className="font-semibold">Total Tasks</span>
                    <span className="font-bold">{stats.total}</span>
                  </li>
                </ul>
              )}
            </div>

            <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300">
              <p className="text-lg font-semibold">
                ✅ Completion Rate:{" "}
                <span className="text-green-600 dark:text-green-400">
                  {stats.completionRate}%
                </span>
              </p>
              <p className="text-sm mt-1">
                {stats.completionRate >= 75
                  ? "Great progress! Keep up the momentum."
                  : stats.completionRate >= 40
                  ? "You're halfway there — stay focused."
                  : "Lots to do. Time to ramp up!"}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Reports;
