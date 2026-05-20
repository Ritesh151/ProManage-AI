import React from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ComposedChart, RadialBarChart, RadialBar,
} from 'recharts';
import { FiBarChart2, FiRefreshCw, FiFolder, FiCheckCircle, FiAward, FiClock, FiXCircle, FiDollarSign, FiTrendingUp, FiActivity } from 'react-icons/fi';
import { FaRupeeSign } from 'react-icons/fa';
import { PageHeader } from '../components/PageHeader';
import { AnalyticsCard } from '../components/AnalyticsCard';
import { ChartContainer } from '../components/ChartContainer';
import { useAnalytics } from '../hooks/useAnalytics';
import { formatCurrency } from '../utils/formatters';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#06b6d4'];
const RADIAL_COLORS = ['#10b981', '#f43f5e'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white/95 backdrop-blur-sm px-4 py-3 rounded-xl shadow-xl border border-gray-100 text-xs">
      <p className="font-semibold text-gray-900 mb-1.5">{label}</p>
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
      <div className="space-y-8">
        <PageHeader
          title="Analytics"
          description="Track your business metrics and performance"
          icon={FiBarChart2}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
              <div className="h-8 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4" />
              <div className="h-64 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Analytics"
          description="Track your business metrics and performance"
          icon={FiBarChart2}
        />
        <div className="bg-white rounded-lg border border-red-200 p-8 text-center">
          <p className="text-red-600 text-lg font-medium mb-4">Failed to load analytics data</p>
          <p className="text-gray-500 text-sm mb-4">{error}</p>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Analytics"
          description="Track your business metrics and performance"
          icon={FiBarChart2}
        />
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-500 text-lg font-medium mb-4">No analytics data available</p>
          <p className="text-gray-400 text-sm mb-4">Create some projects to see analytics</p>
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

  return (
    <div className="space-y-8">
      <PageHeader
        title="Analytics"
        description="Track your business metrics and performance"
        icon={FiBarChart2}
        actions={
          <div className="flex gap-2">
            <button
              onClick={refetch}
              className="px-3 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <FiRefreshCw size={14} />
              Refresh
            </button>
            <button
              onClick={() => changePeriod('monthly')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                period === 'monthly'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => changePeriod('yearly')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                period === 'yearly'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Yearly
            </button>
          </div>
        }
      />

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer title="Revenue Trend" loading={loading}>
          {monthlyRevenueChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyRevenueChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="target" name="Target" stroke="#9ca3af" strokeWidth={2} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">No revenue data available</div>
          )}
        </ChartContainer>

        <ChartContainer title="Revenue Comparison" loading={loading}>
          {monthlyRevenueChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyRevenueChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="revenue" name="Revenue" fill="#3b82f6" />
                <Bar dataKey="target" name="Target" fill="#e5e7eb" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">No revenue data available</div>
          )}
        </ChartContainer>

        <ChartContainer title="Projects by Category" loading={loading}>
          {categoryDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%" cy="50%"
                  innerRadius={50} outerRadius={90}
                  dataKey="count" nameKey="_id"
                  paddingAngle={3}
                >
                  {categoryDistribution.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">No category data available</div>
          )}
        </ChartContainer>

        <ChartContainer title="Projects by Status" loading={loading}>
          {statusDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statusDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Projects" radius={[8, 8, 0, 0]}>
                  {statusDistribution.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">No status data available</div>
          )}
        </ChartContainer>

        <ChartContainer title="Proposal Generation" loading={loading}>
          <ResponsiveContainer width="100%" height={300}>
            <RadialBarChart
              cx="50%" cy="50%"
              innerRadius="25%" outerRadius="85%"
              barSize={22}
              data={proposalData}
              startAngle={180} endAngle={0}
            >
              <RadialBar dataKey="value" cornerRadius={8} label={{ position: 'insideStart', fill: '#fff', fontSize: 11, fontWeight: 600 }} />
              <Legend />
              <Tooltip />
            </RadialBarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="Revenue by Category" loading={loading}>
          {data?.revenueByCategory?.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={data.revenueByCategory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis yAxisId="left" tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip formatter={(value, name) => name === 'Revenue' ? formatCurrency(value) : value} />
                <Legend />
                <Bar yAxisId="right" dataKey="count" name="Projects" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={20} />
                <Line yAxisId="left" type="monotone" dataKey="total" name="Revenue" stroke="#10b981" strokeWidth={2.5} />
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">No revenue by category data</div>
          )}
        </ChartContainer>
      </div>

      {/* Recent Activities */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
        {activities.length > 0 ? (
          <div className="space-y-3">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">No recent activities</div>
        )}
      </motion.div>
    </div>
  );
};

export default Analytics;
