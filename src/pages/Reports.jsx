import { useEffect, useState } from 'react';
import api from '../store/api'; // Use authenticated api instance
import DashboardCard from '../components/dashboard/DashboardCard';
import { 
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, 
    LineChart, Line, CartesianGrid, PieChart, Pie, Cell 
} from 'recharts'; // Import chart components including PieChart
import { Briefcase, Users, CheckCircle2, ListChecks, Loader } from 'lucide-react'; // Icons

// --- Colors for the Pie Chart ---
const PIE_COLORS = {
    TO_DO: '#eab308',       // Tailwind yellow-500
    IN_PROGRESS: '#3b82f6', // Tailwind blue-500
    DONE: '#22c55e',        // Tailwind green-500
};

// Custom Tooltip for Charts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md p-3 rounded-lg shadow-lg border border-white/20 dark:border-gray-700/50 text-sm">
        <p className="label text-black dark:text-white font-semibold">{`${label}`}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} style={{ color: entry.color || entry.fill }}>
            {`${entry.name}: ${entry.value.toLocaleString()}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Custom Legend Text
const renderLegendText = (value, entry) => {
  const { color } = entry;
  // Use Tailwind classes for text color, fallback to inline style if needed
  return <span className="text-gray-700 dark:text-gray-300 ml-1">{value}</span>;
};


export default function ReportPage() {
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReportData = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await api.get('/api/reports/summary');
                setReportData(res.data);
            } catch (err) {
                console.error("Fetch report error:", err);
                const errorResponse = err; 
                setError(errorResponse.response?.data?.message || 'Failed to load report data.');
            } finally {
                setLoading(false);
            }
        };
        fetchReportData();
    }, []);

    // --- Format REAL task data for Pie Chart ---
    // --- THIS IS THE FIX: Added ": []" at the end ---
    const taskStatusChartData = reportData?.tasksByStatus ? [
        { name: 'To Do', value: reportData.tasksByStatus.TO_DO, fill: PIE_COLORS.TO_DO },
        { name: 'In Progress', value: reportData.tasksByStatus.IN_PROGRESS, fill: PIE_COLORS.IN_PROGRESS },
        { name: 'Done', value: reportData.tasksByStatus.DONE, fill: PIE_COLORS.DONE },
    ].filter(entry => entry.value > 0) : []; // <-- Added the "else" empty array


    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                 <h1 className="text-3xl font-bold tracking-tight white-black dark:text-white drop-shadow-lg">
                   Reports
                 </h1>
                 <p className="mt-1 text-base text-white-600 dark:text-gray-300">
                   Overview of workspace activity and performance
                 </p>
            </div>

            {loading ? (
                <div className="flex justify-center items-center p-10"><Loader className="animate-spin text-black dark:text-white"/></div>
            ) : error ? (
                <DashboardCard>
                    <p className="text-center text-red-500">{error}</p>
                </DashboardCard>
            ) : !reportData ? (
                 <DashboardCard>
                    <p className="text-center text-gray-500 dark:text-gray-400">No report data available.</p>
                </DashboardCard>
            ) : (
                <>
                    {/* --- Summary Cards (Using Real Data) --- */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                         <DashboardCard className="flex items-center gap-4 p-4">
                             <div className="p-3 bg-blue-500/10 rounded-lg"><Briefcase className="text-blue-500" size={24}/></div>
                             <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Total Projects</p>
                                <p className="text-2xl font-bold text-black dark:text-white">{reportData.totalProjects ?? 'N/A'}</p>
                             </div>
                         </DashboardCard>
                         <DashboardCard className="flex items-center gap-4 p-4">
                             <div className="p-3 bg-purple-500/10 rounded-lg"><Users className="text-purple-500" size={24}/></div>
                              <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Team Size</p>
                                <p className="text-2xl font-bold text-black dark:text-white">{reportData.teamSize ?? 'N/A'}</p>
                             </div>
                         </DashboardCard>
                          <DashboardCard className="flex items-center gap-4 p-4">
                             <div className="p-3 bg-green-500/10 rounded-lg"><CheckCircle2 className="text-green-500" size={24}/></div>
                              <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Tasks Done</p>
                                <p className="text-2xl font-bold text-black dark:text-white">{reportData.tasksByStatus?.DONE ?? '0'}</p>
                             </div>
                         </DashboardCard>
                         <DashboardCard className="flex items-center gap-4 p-4">
                              <div className="p-3 bg-yellow-500/10 rounded-lg"><ListChecks className="text-yellow-500" size={24}/></div>
                              <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Tasks Pending</p>
                                <p className="text-2xl font-bold text-black dark:text-white">{(reportData.tasksByStatus?.TO_DO ?? 0) + (reportData.tasksByStatus?.IN_PROGRESS ?? 0)}</p>
                             </div>
                         </DashboardCard>
                    </div>

                    {/* Chart Row 1 */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* --- Task Status Pie Chart (Real Data) --- */}
                        <DashboardCard title="Task Status Breakdown" className="lg:col-span-1">
                            {taskStatusChartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={taskStatusChartData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60} // Donut chart
                                            outerRadius={100}
                                            fill="#8884d8"
                                            paddingAngle={5}
                                            dataKey="value"
                                            labelLine={false}
                                            label={({ percent }) => `${(percent * 100).toFixed(0)}%`} // Show percentage
                                        >
                                            {taskStatusChartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend iconType="circle" formatter={renderLegendText} />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <p className="text-center text-sm text-gray-500 dark:text-gray-400 h-[300px] flex items-center justify-center">
                                    No task data available to display chart.
                                </p>
                            )}
                        </DashboardCard>
                        
                        {/* Weekly Hours Bar Chart (Mock Data) */}
                        <DashboardCard title="Total working hours (Mock)" className="lg:col-span-2">
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={reportData.weeklyHoursData} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.1} />
                                    <XAxis dataKey="day" fontSize={12} stroke="currentColor" className="text-gray-500 dark:text-gray-400" />
                                    <YAxis fontSize={12} stroke="currentColor" className="text-gray-500 dark:text-gray-400" />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar dataKey="hours" fill={PIE_COLORS.IN_PROGRESS} radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </DashboardCard>
                    </div>

                    {/* Chart Row 2 */}
                    <DashboardCard title="Project revenue (Mock Data)">
                         <div className="mb-2">
                            <p className="text-2xl font-bold text-black dark:text-white">+${(reportData.projectRevenue?.current || 0).toLocaleString()}</p>
                            <p className="text-sm text-green-500">Avg. ${(reportData.projectRevenue?.average || 0).toLocaleString()}/month</p>
                         </div>
                         <ResponsiveContainer width="100%" height={260}>
                            <LineChart data={reportData.monthlyRevenueData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                                 <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.1} />
                                 <XAxis dataKey="month" fontSize={12} stroke="currentColor" className="text-gray-500 dark:text-gray-400" />
                                 <YAxis fontSize={12} stroke="currentColor" className="text-gray-500 dark:text-gray-400" tickFormatter={(value) => `$${value/1000}k`}/>
                                 <Tooltip 
                                    content={<CustomTooltip />}
                                    formatter={(value) => `$${value.toLocaleString()}`}
                                 />
                                 <Line type="monotone" dataKey="revenue" stroke={PIE_COLORS.DONE} strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                            </LineChart>
                         </ResponsiveContainer>
                    </DashboardCard>
                </>
            )}
        </div>
    );
}