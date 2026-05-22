// src/pages/Analytics.js
import React from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ComposedChart, RadialBarChart, RadialBar,
} from 'recharts';
import { FiBarChart2, FiRefreshCw, FiFolder, FiCheckCircle, FiAward, FiClock, FiXCircle, FiDollarSign, FiTrendingUp, FiActivity, FiTarget } from 'react-icons/fi';
import { FaRupeeSign } from 'react-icons/fa';
import { PageHeader } from '../components/PageHeader';
import { AnalyticsCard } from '../components/AnalyticsCard';
import { ChartContainer } from '../components/ChartContainer';
import { useAnalytics } from '../hooks/useAnalytics';
import { formatCurrency } from '../utils/formatters';

const COLORS = ['#2563eb', '#ec4899', '#fbbf24', '#dc2626', '#8b5cf6', '#14b8a6', '#f97316', '#06b6d4', '#10b981'];
const RADIAL_COLORS = ['#10b981', '#f43f5e'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="backdrop-blur-xl bg-white/95 dark:bg-slate-900/95 px-4 py-3 rounded-xl shadow-2xl border border-white/20 dark:border-slate-700/50 text-xs">
      <p className="font-semibold text-gray-900 dark:text-white mb-1.5">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color }} className="font-medium leading-relaxed">
          {entry.name}: {['revenue', 'total', 'avgCost', 'Revenue'].includes(entry.name) ? formatCurrency(entry.value) : entry.value}
        </p>
      ))}
    </div>
  );
};

const Analytics = () => {
  const {
    overview, revenue, revenueData, activities, categoryDistribution, statusDistribution,
    monthlyGrowth, loading, error, period, changePeriod, refetch, data,
  } = useAnalytics();

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 px-8 py-8">
        <div className="relative z-10 space-y-8">
          <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 rounded-3xl border border-white/20 dark:border-slate-700/50 shadow-xl p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/10 to-pink-500/10">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-pink-500 rounded-lg animate-pulse" />
              </div>
              <div>
                <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded-lg w-32 mb-2 animate-pulse" />
                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-48 animate-pulse" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 rounded-2xl border border-white/20 dark:border-slate-700/50 p-6 animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/3 mb-3" />
                <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-1/2" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 rounded-2xl border border-white/20 dark:border-slate-700/50 p-6 animate-pulse">
                <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-1/4 mb-4" />
                <div className="h-64 bg-gray-100 dark:bg-slate-800 rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 px-8 py-8">
        <div className="relative z-10 flex items-center justify-center h-screen -mt-20">
          <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 rounded-3xl border border-red-200 dark:border-red-800/30 p-8 text-center max-w-md">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-red-500/10 to-orange-500/10 flex items-center justify-center">
              <FiBarChart2 size={32} className="text-red-600 dark:text-red-400" />
            </div>
            <p className="text-red-600 dark:text-red-400 text-lg font-bold mb-2">Failed to load analytics</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">{error}</p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={refetch}
              className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
            >
              Try Again
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 px-8 py-8">
        <div className="relative z-10 flex items-center justify-center h-screen -mt-20">
          <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 rounded-3xl border border-white/20 dark:border-slate-700/50 p-8 text-center max-w-md">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-pink-500/10 flex items-center justify-center">
              <FiBarChart2 size={32} className="text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-lg font-bold mb-2">No Analytics Data</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Create some projects to see analytics insights</p>
          </div>
        </div>
      </div>
    );
  }

  const totalProjects = overview?.totalProjects || 0;
  const activeProjects = overview?.activeProjects || 0;
  const completedProjects = overview?.completedProjects || 0;
  const pendingProjects = overview?.pendingProjects || 0;
  const cancelledProjects = overview?.cancelledProjects || 0;
  const onHoldProjects = overview?.onHoldProjects || 0;
  const totalRevenue = overview?.totalRevenue || 0;
  const avgProjectValue = overview?.averageProjectValue || 0;
  const proposalGenerated = data?.proposalStats?.withProposal || 0;
  const proposalNotGenerated = data?.proposalStats?.withoutProposal || 0;

  const monthlyRevenueChartData = revenueData.length > 0
    ? revenueData.map((item) => ({
        month: item.month,
        revenue: item.revenue,
        target: item.revenue * 1.1,
      }))
    : [];

  const proposalData = [
    { name: 'With Proposal', value: proposalGenerated, fill: RADIAL_COLORS[0] },
    { name: 'Without Proposal', value: proposalNotGenerated, fill: RADIAL_COLORS[1] },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 px-8 py-8">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
          className="absolute top-20 -left-48 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 dark:opacity-20"
        />
        <motion.div
          animate={{ x: [0, -100, 0], y: [0, 80, 0] }}
          transition={{ duration: 25, repeat: Infinity, repeatType: "reverse" }}
          className="absolute top-40 -right-48 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 dark:opacity-20"
        />
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, -50, 0] }}
          transition={{ duration: 22, repeat: Infinity, repeatType: "reverse" }}
          className="absolute -bottom-48 left-1/3 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 dark:opacity-20"
        />
      </div>

      <div className="relative z-10 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 rounded-3xl border border-white/20 dark:border-slate-700/50 shadow-xl p-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/10 to-pink-500/10">
                <FiBarChart2 size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
                  Analytics
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Track your business metrics and performance
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={refetch}
                className="px-4 py-2 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:shadow-md transition-all flex items-center gap-2"
              >
                <FiRefreshCw size={14} />
                Refresh
              </motion.button>
              
              <div className="flex gap-2 p-1 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-gray-200 dark:border-slate-700">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => changePeriod('monthly')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    period === 'monthly'
                      ? 'bg-gradient-to-r from-blue-600 to-pink-500 text-white shadow-md'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Monthly
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => changePeriod('yearly')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    period === 'yearly'
                      ? 'bg-gradient-to-r from-blue-600 to-pink-500 text-white shadow-md'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Yearly
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Overview Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <AnalyticsCard
            title="Total Projects"
            value={totalProjects}
            change={monthlyGrowth}
            trend={monthlyGrowth >= 0 ? 'up' : 'down'}
            icon={FiFolder}
          />
          <AnalyticsCard
            title="Total Revenue"
            value={formatCurrency(totalRevenue)}
            change={monthlyGrowth}
            trend={monthlyGrowth >= 0 ? 'up' : 'down'}
            icon={FaRupeeSign}
          />
          <AnalyticsCard
            title="Active Projects"
            value={activeProjects}
            icon={FiCheckCircle}
          />
          <AnalyticsCard
            title="Completed Projects"
            value={completedProjects}
            icon={FiAward}
          />
          <AnalyticsCard
            title="Pending Projects"
            value={pendingProjects}
            icon={FiClock}
          />
          <AnalyticsCard
            title="Cancelled Projects"
            value={cancelledProjects}
            icon={FiXCircle}
          />
          <AnalyticsCard
            title="Avg Project Value"
            value={formatCurrency(avgProjectValue)}
            icon={FiDollarSign}
          />
          <AnalyticsCard
            title="On Hold"
            value={onHoldProjects}
            icon={FiActivity}
          />
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartContainer title="Revenue Trend" icon={FiTrendingUp} loading={loading}>
            {monthlyRevenueChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={monthlyRevenueChartData}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#2563eb" strokeWidth={2.5} fill="url(#revenueGradient)" />
                  <Line type="monotone" dataKey="target" name="Target" stroke="#ec4899" strokeWidth={2} strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-80 text-gray-400">No revenue data available</div>
            )}
          </ChartContainer>

          <ChartContainer title="Revenue Comparison" icon={FiBarChart2} loading={loading}>
            {monthlyRevenueChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={monthlyRevenueChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="revenue" name="Revenue" fill="url(#barGradient)" radius={[8, 8, 0, 0]}>
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2563eb" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                    </defs>
                  </Bar>
                  <Bar dataKey="target" name="Target" fill="#cbd5e1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-80 text-gray-400">No revenue data available</div>
            )}
          </ChartContainer>

          <ChartContainer title="Projects by Category" icon={FiTarget} loading={loading}>
            {categoryDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={categoryDistribution}
                    cx="50%" cy="50%"
                    innerRadius={60} outerRadius={100}
                    dataKey="count" nameKey="_id"
                    paddingAngle={3}
                  >
                    {categoryDistribution.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-80 text-gray-400">No category data available</div>
            )}
          </ChartContainer>

          <ChartContainer title="Projects by Status" icon={FiActivity} loading={loading}>
            {statusDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={statusDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="_id" tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Projects" radius={[8, 8, 0, 0]}>
                    {statusDistribution.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-80 text-gray-400">No status data available</div>
            )}
          </ChartContainer>

          <ChartContainer title="Proposal Generation" icon={FiTarget} loading={loading}>
            <ResponsiveContainer width="100%" height={320}>
              <RadialBarChart
                cx="50%" cy="50%"
                innerRadius="25%" outerRadius="85%"
                barSize={24}
                data={proposalData}
                startAngle={180} endAngle={0}
              >
                <RadialBar dataKey="value" cornerRadius={10} label={{ position: 'insideStart', fill: '#fff', fontSize: 12, fontWeight: 600 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
              </RadialBarChart>
            </ResponsiveContainer>
          </ChartContainer>

          <ChartContainer title="Revenue by Category" icon={FiDollarSign} loading={loading}>
            {data?.revenueByCategory?.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <ComposedChart data={data.revenueByCategory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="_id" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="left" tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar yAxisId="right" dataKey="count" name="Projects" fill="#2563eb" radius={[8, 8, 0, 0]} barSize={24} />
                  <Line yAxisId="left" type="monotone" dataKey="total" name="Revenue" stroke="#ec4899" strokeWidth={2.5} dot={{ r: 4, fill: "#ec4899" }} />
                </ComposedChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-80 text-gray-400">No revenue by category data</div>
            )}
          </ChartContainer>
        </div>

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl overflow-hidden"
        >
          <div className="p-6 border-b border-white/20 dark:border-slate-700/50">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/10 to-pink-500/10">
                <FiActivity size={16} className="text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">Recent Activities</h3>
            </div>
          </div>
          <div className="p-6">
            {activities.length > 0 ? (
              <div className="space-y-4">
                {activities.map((activity, idx) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-start gap-4 pb-4 border-b border-white/10 dark:border-slate-700/30 last:border-0 last:pb-0"
                  >
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-600 to-pink-500 mt-2 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.description}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-gray-500/10 to-slate-500/10 flex items-center justify-center">
                  <FiActivity size={28} className="text-gray-400 dark:text-gray-500" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-medium">No recent activities</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;