import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiFolder, FiCheckCircle, FiAward, FiRefreshCw,
  FiBarChart2, FiPieChart, FiTrendingUp, FiActivity,
  FiLayers, FiGrid, FiCode, FiDollarSign, FiTarget,
  FiStar
} from 'react-icons/fi';
import { FaRupeeSign } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area,
  RadialBarChart, RadialBar, ComposedChart, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis,
} from 'recharts';

import DashboardCard from '../components/DashboardCard';
import { useDashboard } from '../hooks/useDashboard';
import { CardSkeleton } from '../components/Loader';
import { formatCurrency } from '../utils/formatters';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#06b6d4'];
const RADIAL_COLORS = ['#10b981', '#f43f5e'];

const iconMap = {
  'Total Projects': FiFolder,
  'Active Projects': FiCheckCircle,
  'Completed Projects': FiAward,
  'Total Revenue': FaRupeeSign,
};

const formatValue = (label, value) => {
  if (label === 'Total Revenue') return formatCurrency(value);
  return value;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white/95 backdrop-blur-sm px-4 py-3 rounded-xl shadow-xl border border-gray-100 text-xs">
      <p className="font-semibold text-gray-900 mb-1.5">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color }} className="font-medium leading-relaxed">
          {entry.name}: {entry.name === 'revenue' || entry.name === 'total' || entry.name === 'avgCost' || entry.name === 'Revenue' ? formatCurrency(entry.value) : entry.value}
        </p>
      ))}
    </div>
  );
};

const tabSections = [
  { id: 'all', label: 'All Charts', icon: FiGrid },
  { id: 'overview', label: 'Overview', icon: FiBarChart2 },
  { id: 'distribution', label: 'Distribution', icon: FiPieChart },
  { id: 'trends', label: 'Trends', icon: FiTrendingUp },
  { id: 'insights', label: 'Insights', icon: FiStar },
];

const chartMeta = [
  { id: 'status', title: 'Projects by Status', section: 'overview', cols: 'lg:col-span-4', icon: FiBarChart2 },
  { id: 'category', title: 'Projects by Category', section: 'distribution', cols: 'lg:col-span-4', icon: FiPieChart },
  { id: 'revenue-category', title: 'Revenue by Category', section: 'distribution', cols: 'lg:col-span-4', icon: FiDollarSign },
  { id: 'monthly', title: 'Projects Created Over Time', section: 'trends', cols: 'lg:col-span-6', icon: FiTrendingUp },
  { id: 'revenue-trend', title: 'Monthly Revenue Trend', section: 'trends', cols: 'lg:col-span-6', icon: FiActivity },
  { id: 'scope', title: 'Top Scope of Work Items', section: 'insights', cols: 'lg:col-span-6', icon: FiLayers },
  { id: 'tech', title: 'Most Used Technologies', section: 'insights', cols: 'lg:col-span-6', icon: FiCode },
  { id: 'radar', title: 'Average Cost by Category', section: 'overview', cols: 'lg:col-span-4', icon: FiTarget },
  { id: 'composed', title: 'Revenue vs Projects', section: 'overview', cols: 'lg:col-span-4', icon: FiGrid },
  { id: 'cost-ranges', title: 'Cost Distribution', section: 'distribution', cols: 'lg:col-span-4', icon: FiPieChart },
  { id: 'proposal', title: 'Proposal Generation', section: 'insights', cols: 'lg:col-span-4', icon: FiStar },
  { id: 'category-bar', title: 'Category Breakdown', section: 'distribution', cols: 'lg:col-span-4', icon: FiBarChart2 },
];

const ChartCard = ({ title, icon: Icon, children, active }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden ${active}`}
  >
    <div className="flex items-center gap-3 px-6 pt-5 pb-3 border-b border-gray-50">
      <div className="p-2 rounded-lg bg-gray-50">
        <Icon className="text-gray-500" size={15} />
      </div>
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
    </div>
    <div className="p-5">
      {children}
    </div>
  </motion.div>
);

const SkeletonGrid = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {[...Array(4)].map((_, i) => <CardSkeleton key={i} />)}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="lg:col-span-4 bg-white rounded-2xl border border-gray-100 shadow-sm animate-pulse overflow-hidden">
          <div className="flex items-center gap-3 px-6 pt-5 pb-3 border-b border-gray-50">
            <div className="h-8 w-8 bg-gray-100 rounded-lg" />
            <div className="h-4 bg-gray-100 rounded w-1/2" />
          </div>
          <div className="p-5">
            <div className="h-52 bg-gray-50 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const Home = () => {
  const { data, loading } = useDashboard();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');

  if (loading) {
    return (
      <div className="min-h-screen p-6 bg-gray-50">
        <SkeletonGrid />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen p-6 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-base mb-4">Failed to load dashboard data</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { overview, statusDistribution, projectsByCategory, revenueByCategory, monthlyProjects, monthlyRevenue, topScopeItems, technologyUsage, costDistribution, avgCostByCategory, proposalStats } = data;

  const filteredCharts = activeTab === 'all'
    ? chartMeta
    : chartMeta.filter((c) => c.section === activeTab);

  const renderChart = (chart) => {
    switch (chart.id) {
      case 'status':
        return (
          <ResponsiveContainer width="100%" height={270}>
            <BarChart data={statusDistribution} barSize={52} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="_id" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
              <Bar dataKey="count" name="Projects" radius={[8, 8, 0, 0]}>
                {statusDistribution.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );

      case 'category':
        return (
          <ResponsiveContainer width="100%" height={270}>
            <PieChart>
              <Pie
                data={projectsByCategory}
                cx="50%" cy="50%"
                innerRadius={50} outerRadius={88}
                dataKey="count" nameKey="_id"
                paddingAngle={3}
              >
                {projectsByCategory.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                layout="vertical" align="right" verticalAlign="middle"
                iconType="circle" wrapperStyle={{ fontSize: 11, paddingLeft: 10 }}
                formatter={(value) => <span className="text-xs text-gray-600">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'revenue-category':
        return (
          <ResponsiveContainer width="100%" height={270}>
            <PieChart>
              <Pie
                data={revenueByCategory}
                cx="50%" cy="50%"
                outerRadius={88}
                dataKey="total" nameKey="_id"
                paddingAngle={2}
              >
                {revenueByCategory.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                layout="vertical" align="right" verticalAlign="middle"
                iconType="circle" wrapperStyle={{ fontSize: 11, paddingLeft: 10 }}
                formatter={(value) => <span className="text-xs text-gray-600">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'monthly':
        return (
          <ResponsiveContainer width="100%" height={270}>
            <AreaChart data={monthlyProjects} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="_id" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="count" name="Projects" stroke="#6366f1" strokeWidth={2.5} fill="url(#colorCount)" dot={false} activeDot={{ r: 5, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'revenue-trend':
        return (
          <ResponsiveContainer width="100%" height={270}>
            <LineChart data={monthlyRevenue} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="_id" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#10b981" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'scope':
        return (
          <ResponsiveContainer width="100%" height={270}>
            <BarChart data={topScopeItems} layout="vertical" barSize={18} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="_id" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} width={160} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
              <Bar dataKey="count" name="Projects" radius={[0, 6, 6, 0]}>
                {topScopeItems.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );

      case 'tech':
        return (
          <ResponsiveContainer width="100%" height={270}>
            <BarChart data={technologyUsage} layout="vertical" barSize={18} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="_id" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} width={120} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
              <Bar dataKey="count" name="Projects" radius={[0, 6, 6, 0]}>
                {technologyUsage.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );

      case 'radar':
        return (
          <ResponsiveContainer width="100%" height={270}>
            <RadarChart data={avgCostByCategory} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="_id" tick={{ fontSize: 9, fill: '#64748b' }} />
              <PolarRadiusAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 9, fill: '#64748b' }} />
              <Tooltip content={<CustomTooltip />} />
              <Radar name="Avg Cost" dataKey="avgCost" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.15} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        );

      case 'composed':
        return (
          <ResponsiveContainer width="100%" height={270}>
            <ComposedChart data={revenueByCategory} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="_id" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="rect" wrapperStyle={{ fontSize: 11 }} />
              <Bar yAxisId="right" dataKey="count" name="Projects" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={20} />
              <Line yAxisId="left" type="monotone" dataKey="total" name="Revenue" stroke="#10b981" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
            </ComposedChart>
          </ResponsiveContainer>
        );

      case 'cost-ranges':
        return (
          <ResponsiveContainer width="100%" height={270}>
            <PieChart>
              <Pie
                data={costDistribution.map((d) => ({
                  ...d,
                  label: d._id === Infinity ? '₹10L+' : d._id === 0 ? 'No Cost' : `₹${(d._id / 1000).toFixed(0)}k`
                }))}
                cx="50%" cy="50%"
                outerRadius={88}
                dataKey="count" nameKey="label"
                paddingAngle={2}
              >
                {costDistribution.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                layout="vertical" align="right" verticalAlign="middle"
                iconType="circle" wrapperStyle={{ fontSize: 11, paddingLeft: 10 }}
                formatter={(value) => <span className="text-xs text-gray-600">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'proposal':
        return (
          <ResponsiveContainer width="100%" height={270}>
            <RadialBarChart
              cx="50%" cy="50%"
              innerRadius="25%" outerRadius="85%"
              barSize={22}
              data={[
                { name: 'With Proposal', value: proposalStats.withProposal, fill: RADIAL_COLORS[0] },
                { name: 'Without Proposal', value: proposalStats.withoutProposal, fill: RADIAL_COLORS[1] },
              ]}
              startAngle={180} endAngle={0}
            >
              <RadialBar dataKey="value" cornerRadius={8} label={{ position: 'insideStart', fill: '#fff', fontSize: 11, fontWeight: 600 }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11, paddingTop: 10 }} formatter={(value) => <span className="text-xs text-gray-600">{value}</span>} />
              <Tooltip content={<CustomTooltip />} />
            </RadialBarChart>
          </ResponsiveContainer>
        );

      case 'category-bar':
        return (
          <ResponsiveContainer width="100%" height={270}>
            <BarChart data={projectsByCategory} barSize={28} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="_id" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
              <Bar dataKey="count" name="Projects" radius={[8, 8, 0, 0]}>
                {projectsByCategory.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
          <p className="mt-1 text-gray-500">Analytics overview of all projects</p>
        </div>
        <button
          onClick={() => navigate('/projects')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 text-white font-medium text-sm hover:bg-gray-800 transition-all shadow-sm"
        >
          <FiRefreshCw size={14} />
          Manage Projects
        </button>
      </motion.div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {overview.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ y: -3 }}
          >
            <DashboardCard
              title={stat.label}
              value={formatValue(stat.label, stat.value)}
              icon={iconMap[stat.label]}
              index={i}
            />
          </motion.div>
        ))}
      </div>

      {/* Section Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
        {tabSections.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gray-900 text-white shadow-sm'
                  : 'bg-white text-gray-500 border border-gray-100 shadow-sm hover:bg-gray-50'
              }`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Charts Grid */}
      <motion.div layout className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <AnimatePresence mode="popLayout">
          {filteredCharts.map((chart) => (
            <div key={chart.id} className={chart.cols}>
              <ChartCard title={chart.title} icon={chart.icon}>
                {renderChart(chart)}
              </ChartCard>
            </div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Home;

// 6a0bf875723254341b302796 AI Agent Project