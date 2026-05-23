// src/pages/TrainingHistory.js
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiClock, FiDownload, FiFilter, FiSearch, FiCalendar, FiTrendingUp, FiBarChart2, FiCheckCircle, FiXCircle, FiLoader } from 'react-icons/fi';
import { PageHeader } from '../components/PageHeader';
import { EmptyState } from '../components/EmptyState';
import { useTraining } from '../hooks/useTraining';

const TrainingHistory = () => {
  const { history, loading } = useTraining();
  const [sortBy, setSortBy] = useState('date');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const sorted = [...history].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.startTime) - new Date(a.startTime);
    }
    if (sortBy === 'duration') {
      const durA = new Date(a.endTime) - new Date(a.startTime);
      const durB = new Date(b.endTime) - new Date(b.startTime);
      return durB - durA;
    }
    if (sortBy === 'files') {
      return b.filesProcessed - a.filesProcessed;
    }
    return 0;
  });

  const filtered = sorted.filter(session => {
    if (filterStatus !== 'all' && session.status !== filterStatus) return false;
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return session.id?.toLowerCase().includes(searchLower) ||
             session.sessionId?.toLowerCase().includes(searchLower) ||
             session.projectName?.toLowerCase().includes(searchLower) ||
             session.type?.toLowerCase().includes(searchLower) ||
             session.status?.toLowerCase().includes(searchLower);
    }
    return true;
  });

  const getStatusConfig = (status) => {
    switch (status) {
      case 'completed':
        return { 
          color: 'text-emerald-600 dark:text-emerald-400', 
          bg: 'bg-emerald-100 dark:bg-emerald-900/30',
          icon: FiCheckCircle,
          label: 'Completed'
        };
      case 'failed':
        return { 
          color: 'text-red-600 dark:text-red-400', 
          bg: 'bg-red-100 dark:bg-red-900/30',
          icon: FiXCircle,
          label: 'Failed'
        };
      case 'in_progress':
        return { 
          color: 'text-yellow-600 dark:text-yellow-400', 
          bg: 'bg-yellow-100 dark:bg-yellow-900/30',
          icon: FiLoader,
          label: 'In Progress'
        };
      default:
        return { 
          color: 'text-gray-600 dark:text-gray-400', 
          bg: 'bg-gray-100 dark:bg-gray-800',
          icon: FiClock,
          label: status
        };
    }
  };

  const stats = {
    total: history.length,
    completed: history.filter(h => h.status === 'completed').length,
    failed: history.filter(h => h.status === 'failed').length,
    totalFiles: history.reduce((sum, h) => sum + (h.filesProcessed || 0), 0),
    totalChunks: history.reduce((sum, h) => sum + (h.chunksCreated || 0), 0),
  };

  const handleExport = () => {
    const exportData = filtered.map(session => ({
      id: session.id,
      startTime: new Date(session.startTime).toLocaleString(),
      endTime: new Date(session.endTime).toLocaleString(),
      status: session.status,
      filesProcessed: session.filesProcessed,
      chunksCreated: session.chunksCreated,
      duration: `${Math.floor((new Date(session.endTime) - new Date(session.startTime)) / 60000)}m ${Math.floor(((new Date(session.endTime) - new Date(session.startTime)) % 60000) / 1000)}s`
    }));
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `training_history_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
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
        <PageHeader
          title="Training History"
          description="View past training sessions and their results"
          icon={FiClock}
          badge={`${stats.total} sessions`}
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 rounded-xl border border-white/20 dark:border-slate-700/50 p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Total Sessions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              </div>
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/10 to-pink-500/10">
                <FiClock size={20} className="text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 rounded-xl border border-white/20 dark:border-slate-700/50 p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Successful</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.completed}</p>
              </div>
              <div className="p-2 rounded-lg bg-green-500/10">
                <FiCheckCircle size={20} className="text-green-600 dark:text-green-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 rounded-xl border border-white/20 dark:border-slate-700/50 p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Files Processed</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalFiles}</p>
              </div>
              <div className="p-2 rounded-lg bg-purple-500/10">
                <FiBarChart2 size={20} className="text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 rounded-xl border border-white/20 dark:border-slate-700/50 p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Chunks Created</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalChunks}</p>
              </div>
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <FiTrendingUp size={20} className="text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 rounded-xl border border-white/20 dark:border-slate-700/50 shadow-lg p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search sessions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="in_progress">In Progress</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              <option value="date">Sort by Date</option>
              <option value="duration">Sort by Duration</option>
              <option value="files">Sort by Files</option>
            </select>
          </div>
        </div>

        {/* History Table */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-pink-500 rounded-full blur-xl opacity-20 animate-pulse" />
              <div className="relative w-10 h-10 border-3 border-gray-200 dark:border-slate-700 border-t-blue-600 rounded-full animate-spin" />
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={FiClock}
            title="No training history"
            description={searchTerm || filterStatus !== 'all' ? "No matching sessions found" : "Start training to see history"}
            variant="primary"
          />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-500/5 to-pink-500/5 border-b border-white/20 dark:border-slate-700/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Project</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Start Time</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Files</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Chunks</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 dark:divide-slate-700/30">
                  <AnimatePresence>
                    {filtered.map((session, index) => {
                      const duration = new Date(session.endTime) - new Date(session.startTime);
                      const minutes = Math.floor(duration / 60000);
                      const seconds = Math.floor((duration % 60000) / 1000);
                      const statusConfig = getStatusConfig(session.status);
                      const StatusIcon = statusConfig.icon;

                      return (
                        <motion.tr
                          key={session.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.03 }}
                          className="hover:bg-blue-500/5 transition-colors cursor-pointer"
                        >
                          <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                            {session.projectName || 'ProposalForge AI'}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold ${
                              session.type === 'full'
                                ? 'bg-blue-500/10 text-blue-700 dark:text-blue-400'
                                : 'bg-purple-500/10 text-purple-700 dark:text-purple-400'
                            }`}>
                              {session.type === 'full' ? 'Full' : session.type === 'incremental' ? 'Incremental' : session.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                            <div className="flex items-center gap-2">
                              <FiCalendar size={12} className="text-gray-400" />
                              {session.startTime ? new Date(session.startTime).toLocaleString() : '—'}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${statusConfig.bg} ${statusConfig.color}`}>
                              <StatusIcon size={10} />
                              {statusConfig.label}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                            {session.filesProcessed || 0}
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                            {session.chunksCreated || 0}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                            {minutes > 0 ? `${minutes}m ` : ''}{seconds}s
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Export Button */}
        {filtered.length > 0 && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-pink-500 text-white font-semibold hover:shadow-lg transition-all"
          >
            <FiDownload size={16} />
            Export History ({filtered.length} sessions)
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default TrainingHistory;
