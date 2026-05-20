import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FiBarChart2, FiCalendar } from 'react-icons/fi';
import { PageHeader } from '../components/PageHeader';
import { AnalyticsCard } from '../components/AnalyticsCard';
import { ChartContainer } from '../components/ChartContainer';
import { useAnalytics } from '../hooks/useAnalytics';

const Analytics = () => {
  const { overview, revenue, activities, loading, period, changePeriod } = useAnalytics();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Analytics"
        description="Track your business metrics and performance"
        icon={FiBarChart2}
        actions={
          <div className="flex gap-2">
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
      {overview && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnalyticsCard
            title="Total Revenue"
            value={`$${overview.totalRevenue?.toLocaleString()}`}
            change={overview.monthlyGrowth}
            trend="up"
          />
          <AnalyticsCard
            title="Total Projects"
            value={overview.totalProjects}
            change={12}
            trend="up"
          />
          <AnalyticsCard
            title="Active Projects"
            value={overview.activeProjects}
            change={5}
            trend="up"
          />
          <AnalyticsCard
            title="Completed Projects"
            value={overview.completedProjects}
            change={8}
            trend="up"
          />
          <AnalyticsCard
            title="Average Project Value"
            value={`$${overview.averageProjectValue?.toLocaleString()}`}
            change={3}
            trend="up"
          />
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer title="Revenue Trend" loading={loading}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="target" stroke="#9ca3af" strokeWidth={2} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="Revenue Comparison" loading={loading}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#3b82f6" />
              <Bar dataKey="target" fill="#e5e7eb" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* Recent Activities */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
        <div className="space-y-3">
          {activities?.map((activity) => (
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
      </motion.div>
    </div>
  );
};

export default Analytics;
