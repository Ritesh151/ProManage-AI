// src/pages/Home.js
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiFolder, FiCheckCircle, FiAward, FiRefreshCw,
  FiBarChart2, FiPieChart, FiTrendingUp, FiActivity,
  FiLayers, FiGrid, FiCode, FiDollarSign, FiTarget,
  FiStar, FiPlus, FiFileText, FiCpu, FiMoreHorizontal
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

const COLORS = ['#2563eb', '#ec4899', '#fbbf24', '#dc2626', '#8b5cf6', '#14b8a6', '#f97316', '#06b6d4', '#10b981'];
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
    <div className="bg-white/95 backdrop-blur-sm px-4 py-3 rounded-xl shadow-xl border border-white/20 text-xs">
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
    className="group relative backdrop-blur-lg bg-white/70 dark:bg-slate-900/70 rounded-[28px] border border-white/20 dark:border-slate-700/50 shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="flex items-center justify-between px-6 pt-5 pb-3">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/10 to-pink-500/10">
          <Icon className="text-blue-600 dark:text-blue-400" size={16} />
        </div>
        <h3 className="text-sm font-bold text-gray-900 dark:text-white tracking-tight">{title}</h3>
      </div>
      <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
        <FiMoreHorizontal size={14} className="text-gray-400 dark:text-slate-500" />
      </button>
    </div>
    <div className="p-5 pt-2">
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
        <div key={i} className="lg:col-span-4 backdrop-blur-lg bg-white/70 dark:bg-slate-900/70 rounded-[28px] border border-white/20 dark:border-slate-700/50 shadow-xl animate-pulse overflow-hidden">
          <div className="flex items-center gap-3 px-6 pt-5 pb-3">
            <div className="h-8 w-8 bg-gray-200 dark:bg-slate-700 rounded-xl" />
            <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/2" />
          </div>
          <div className="p-5">
            <div className="h-52 bg-gray-100 dark:bg-slate-800 rounded-xl" />
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
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 px-8 py-8">
        <div className="absolute top-0 -left-48 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 animate-pulse" />
        <div className="absolute top-0 -right-48 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 animate-pulse delay-1000" />
        <div className="absolute -bottom-48 left-1/2 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 animate-pulse delay-2000" />
        <SkeletonGrid />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center px-8 py-8">
        <div className="absolute top-0 -left-48 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10" />
        <div className="absolute top-0 -right-48 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10" />
        <div className="text-center backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 rounded-3xl p-8 border border-white/20 dark:border-slate-700/50">
          <p className="text-gray-600 dark:text-gray-300 text-base mb-4">Failed to load dashboard data</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-pink-500 text-white rounded-xl text-sm font-medium hover:scale-105 transition-transform shadow-xl"
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
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
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
                formatter={(value) => <span className="text-xs text-gray-600 dark:text-gray-400">{value}</span>}
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
                formatter={(value) => <span className="text-xs text-gray-600 dark:text-gray-400">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'monthly':
        return (
          <ResponsiveContainer width="100%" height={270}>
            <AreaChart data={monthlyProjects} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="_id" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="count" name="Projects" stroke="#2563eb" strokeWidth={2.5} fill="url(#colorCount)" dot={false} activeDot={{ r: 5, fill: '#2563eb', stroke: '#fff', strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'revenue-trend':
        return (
          <ResponsiveContainer width="100%" height={270}>
            <LineChart data={monthlyRevenue} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="_id" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#ec4899" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: '#ec4899', stroke: '#fff', strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'scope':
        return (
          <ResponsiveContainer width="100%" height={270}>
            <BarChart data={topScopeItems} layout="vertical" barSize={18} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
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
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
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
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="_id" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="rect" wrapperStyle={{ fontSize: 11 }} />
              <Bar yAxisId="right" dataKey="count" name="Projects" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={20} />
              <Line yAxisId="left" type="monotone" dataKey="total" name="Revenue" stroke="#ec4899" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
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
                formatter={(value) => <span className="text-xs text-gray-600 dark:text-gray-400">{value}</span>}
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
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11, paddingTop: 10 }} formatter={(value) => <span className="text-xs text-gray-600 dark:text-gray-400">{value}</span>} />
              <Tooltip content={<CustomTooltip />} />
            </RadialBarChart>
          </ResponsiveContainer>
        );

      case 'category-bar':
        return (
          <ResponsiveContainer width="100%" height={270}>
            <BarChart data={projectsByCategory} barSize={28} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 px-8 py-8">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="absolute top-20 -left-48 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 dark:opacity-20"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 80, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="absolute top-40 -right-48 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 dark:opacity-20"
        />
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="absolute -bottom-48 left-1/3 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 dark:opacity-20"
        />
      </div>

      <div className="relative z-10">
        {/* Premium Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 rounded-3xl border border-white/20 dark:border-slate-700/50 shadow-xl p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
                  Dashboard
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
                  Welcome back, <span className="font-semibold text-gray-900 dark:text-white">Ritesh</span>
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Track projects, revenue and AI analytics
                </p>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/projects/new')}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-pink-500 text-white rounded-xl font-medium text-sm shadow-lg hover:shadow-xl transition-all"
                >
                  <FiPlus size={16} />
                  Create Project
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/proposals')}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-200 rounded-xl font-medium text-sm border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-all"
                >
                  <FiFileText size={16} />
                  Generate Proposal
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/ai-assistant')}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-200 rounded-xl font-medium text-sm border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-all"
                >
                  <FiCpu size={16} />
                  AI Assistant
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
        >
          {overview.map((stat, i) => (
            <motion.div key={stat.label} variants={itemVariants}>
              <DashboardCard
                title={stat.label}
                value={formatValue(stat.label, stat.value)}
                icon={iconMap[stat.label]}
                index={i}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Premium Pill Navigation */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
          {tabSections.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  isActive
                    ? 'text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-blue-600 to-pink-500 rounded-full"
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <Icon size={14} />
                  {tab.label}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Charts Grid */}
        <motion.div layout className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredCharts.map((chart, index) => (
              <motion.div
                key={chart.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={chart.cols}
              >
                <ChartCard title={chart.title} icon={chart.icon}>
                  {renderChart(chart)}
                </ChartCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
