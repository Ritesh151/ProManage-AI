// src/pages/TrainingCenter.js
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiCpu, FiRefreshCw, FiStopCircle, FiClock, FiBarChart2, FiAlertCircle, 
  FiCheckCircle, FiXCircle, FiLoader, FiFileText, FiDatabase, FiLayers, 
  FiHardDrive, FiChevronDown, FiChevronUp, FiTrendingUp, FiActivity,
  FiBookOpen, FiZap, FiServer, FiDownload
} from 'react-icons/fi';
import { PageHeader } from '../components/PageHeader';
import { TrainingStatusCard } from '../components/TrainingStatusCard';
import { useTraining } from '../hooks/useTraining';

const TrainingCenter = () => {
  const {
    status,
    history,
    stats,
    logs,
    loading,
    training,
    error,
    startTraining,
    retrain,
    stopTraining,
    refetchLogs,
  } = useTraining();

  const [activeTab, setActiveTab] = useState('status');
  const [logsExpanded, setLogsExpanded] = useState(true);
  const logsEndRef = useRef(null);

  useEffect(() => {
    if (training && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, training]);

  const getLogColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'error':
        return 'text-red-600';
      case 'warning':
        return 'text-yellow-600';
      case 'info':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusBadge = (s) => {
    switch (s) {
      case 'completed':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-700 dark:text-emerald-400 rounded-lg text-xs font-bold border border-emerald-200 dark:border-emerald-800/30"><FiCheckCircle size={12} /> Completed</span>;
      case 'failed':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-red-500/10 to-orange-500/10 text-red-700 dark:text-red-400 rounded-lg text-xs font-bold border border-red-200 dark:border-red-800/30"><FiXCircle size={12} /> Failed</span>;
      case 'in_progress':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-700 dark:text-blue-400 rounded-lg text-xs font-bold border border-blue-200 dark:border-blue-800/30"><FiLoader size={12} className="animate-spin" /> In Progress</span>;
      case 'paused':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 text-yellow-700 dark:text-yellow-400 rounded-lg text-xs font-bold border border-yellow-200 dark:border-yellow-800/30"><FiStopCircle size={12} /> Paused</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-gray-500/10 to-slate-500/10 text-gray-700 dark:text-gray-400 rounded-lg text-xs font-bold border border-gray-200 dark:border-slate-700"><FiActivity size={12} /> Idle</span>;
    }
  };

  const tabs = [
    { id: 'status', label: 'Status', icon: FiCpu },
    { id: 'logs', label: 'Logs', icon: FiFileText },
    { id: 'history', label: 'History', icon: FiClock },
    { id: 'stats', label: 'Statistics', icon: FiBarChart2 },
  ];

  const hasTrainingData = stats?.totalDocuments > 0 || history?.length > 0;

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

      <div className="relative z-10 space-y-6">
        <PageHeader
          title="Training Center"
          description="Train and manage your AI knowledge base"
          icon={FiCpu}
          badge="v2.0"
          actions={
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => startTraining()}
                disabled={training}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-pink-500 text-white font-semibold hover:shadow-lg disabled:opacity-50 transition-all flex items-center gap-2"
              >
                <FiRefreshCw size={16} className={training ? 'animate-spin' : ''} />
                {training ? 'Training...' : 'Start Training'}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => retrain()}
                disabled={training}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:shadow-lg disabled:opacity-50 transition-all flex items-center gap-2"
              >
                <FiRefreshCw size={16} />
                Retrain
              </motion.button>
              
              {training && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => stopTraining()}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-white font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <FiStopCircle size={16} />
                  Stop
                </motion.button>
              )}
            </div>
          }
        />

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="backdrop-blur-xl bg-red-500/10 dark:bg-red-500/5 border border-red-200 dark:border-red-800/30 rounded-xl p-4 flex items-center gap-3"
            >
              <div className="p-1.5 rounded-lg bg-red-100 dark:bg-red-900/30">
                <FiAlertCircle className="text-red-600 dark:text-red-400" size={16} />
              </div>
              <p className="text-red-800 dark:text-red-300 text-sm flex-1">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Training Status Card */}
        <TrainingStatusCard status={status} stats={stats} loading={loading} />

        {/* Tabs Section */}
        <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl overflow-hidden">
          <div className="border-b border-white/20 dark:border-slate-700/50 px-6">
            <nav className="flex gap-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all relative ${
                      isActive
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <Icon size={16} />
                    {tab.label}
                    {isActive && (
                      <motion.div
                        layoutId="trainingTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-pink-500"
                      />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            <AnimatePresence mode="wait">
              {/* Status Tab */}
              {activeTab === 'status' && (
                <motion.div
                  key="status"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  {!hasTrainingData ? (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-gray-500/10 to-slate-500/10 flex items-center justify-center">
                        <FiHardDrive size={32} className="text-gray-400 dark:text-gray-500" />
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No training data available</h4>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 max-w-md mx-auto">
                        Start training to index your project files and build the AI knowledge base.
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => startTraining()}
                        disabled={training}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-pink-500 text-white font-semibold hover:shadow-lg transition-all inline-flex items-center gap-2"
                      >
                        <FiRefreshCw size={16} className={training ? 'animate-spin' : ''} />
                        {training ? 'Training...' : 'Start Training'}
                      </motion.button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-200 dark:border-blue-800/30">
                        <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 text-xs font-medium mb-2">
                          <FiDatabase size={14} />
                          <span>Projects Indexed</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats?.totalProjects || 0}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-200 dark:border-emerald-800/30">
                        <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-xs font-medium mb-2">
                          <FiFileText size={14} />
                          <span>Files Indexed</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats?.totalDocuments || 0}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-200 dark:border-purple-800/30">
                        <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400 text-xs font-medium mb-2">
                          <FiLayers size={14} />
                          <span>Total Chunks</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats?.totalChunks || 0}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border border-yellow-200 dark:border-yellow-800/30">
                        <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400 text-xs font-medium mb-2">
                          <FiZap size={14} />
                          <span>Embeddings</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats?.documentsWithEmbeddings || 0}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-500/10 to-blue-500/10 border border-indigo-200 dark:border-indigo-800/30">
                        <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 text-xs font-medium mb-2">
                          <FiClock size={14} />
                          <span>Last Training</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {stats?.lastTrainingDate ? new Date(stats.lastTrainingDate).toLocaleString() : 'Never'}
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-200 dark:border-cyan-800/30">
                        <div className="flex items-center gap-2 text-cyan-700 dark:text-cyan-400 text-xs font-medium mb-2">
                          <FiTrendingUp size={14} />
                          <span>Training Sessions</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats?.totalSessions || 0}</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Logs Tab */}
              {activeTab === 'logs' && (
                <motion.div
                  key="logs"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">Training Logs</h3>
                    <button
                      onClick={() => setLogsExpanded(!logsExpanded)}
                      className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    >
                      {logsExpanded ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                      {logsExpanded ? 'Collapse' : 'Expand'}
                    </button>
                  </div>

                  <div className={`rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden ${logsExpanded ? 'h-96' : 'h-48'}`}>
                    <div className="h-full overflow-y-auto p-4 font-mono text-xs space-y-1 custom-scrollbar">
                      {logs.length === 0 ? (
                        <p className="text-gray-500">No logs available. Start training to see logs.</p>
                      ) : (
                        logs.map((log, index) => (
                          <div key={index} className="flex gap-2 hover:bg-slate-800/50 px-2 py-1 rounded">
                            <span className="text-gray-500 shrink-0">
                              {new Date(log.timestamp).toLocaleTimeString()}
                            </span>
                            <span className={`shrink-0 font-bold ${getLogColor(log.level)}`}>
                              [{log.level?.toUpperCase() || 'INFO'}]
                            </span>
                            <span className="text-gray-300 break-all">{log.message}</span>
                          </div>
                        ))
                      )}
                      <div ref={logsEndRef} />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* History Tab */}
              {activeTab === 'history' && (
                <motion.div
                  key="history"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">Training History</h3>

                  {loading ? (
                    <div className="flex items-center justify-center h-48">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-pink-500 rounded-full blur-xl opacity-20 animate-pulse" />
                        <div className="relative w-10 h-10 border-3 border-gray-200 dark:border-slate-700 border-t-blue-600 rounded-full animate-spin" />
                      </div>
                    </div>
                  ) : history.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-gray-500/10 to-slate-500/10 flex items-center justify-center">
                        <FiClock size={28} className="text-gray-400 dark:text-gray-500" />
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No training history</h4>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Start training to see history.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gradient-to-r from-blue-500/5 to-pink-500/5 border-b border-white/20 dark:border-slate-700/50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Files</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Chunks</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Duration</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10 dark:divide-slate-700/30">
                          {history.map((session, index) => {
                            const duration = session.startTime && session.endTime
                              ? new Date(session.endTime) - new Date(session.startTime)
                              : 0;
                            const minutes = Math.floor(duration / 60000);
                            const seconds = Math.floor((duration % 60000) / 1000);

                            return (
                              <motion.tr
                                key={session.sessionId || session._id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.03 }}
                                className="hover:bg-blue-500/5 transition-colors"
                              >
                                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                                  {session.startTime ? new Date(session.startTime).toLocaleString() : '-'}
                                </td>
                                <td className="px-4 py-3">
                                  <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold ${
                                    session.type === 'full' 
                                      ? 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/30'
                                      : 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800/30'
                                  }`}>
                                    {session.type === 'full' ? 'Full' : 'Incremental'}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">{session.filesProcessed || 0}</td>
                                <td className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">{session.chunksCreated || 0}</td>
                                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                  {duration > 0 ? `${minutes}m ${seconds}s` : '-'}
                                </td>
                                <td className="px-4 py-3">{getStatusBadge(session.status)}</td>
                              </motion.tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Statistics Tab */}
              {activeTab === 'stats' && (
                <motion.div
                  key="stats"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">Training Statistics</h3>

                  {stats ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="p-5 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-200 dark:border-blue-800/30">
                        <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 text-sm font-semibold mb-2">
                          <FiDatabase size={16} />
                          <span>Vector Database</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.vectorDatabase || 'chroma'}</p>
                      </div>
                      <div className="p-5 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-200 dark:border-purple-800/30">
                        <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400 text-sm font-semibold mb-2">
                          <FiLayers size={16} />
                          <span>Embedding Model</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.embeddingModel || 'huggingface'}</p>
                      </div>
                      <div className="p-5 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-200 dark:border-green-800/30">
                        <div className="flex items-center gap-2 text-green-700 dark:text-green-400 text-sm font-semibold mb-2">
                          <FiCpu size={16} />
                          <span>Current LLM</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.currentLLM || 'openai'}</p>
                      </div>
                      <div className="p-5 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-200 dark:border-emerald-800/30">
                        <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-sm font-semibold mb-2">
                          <FiCheckCircle size={16} />
                          <span>Completed Sessions</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.completedSessions || 0}</p>
                      </div>
                      <div className="p-5 rounded-xl bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-200 dark:border-red-800/30">
                        <div className="flex items-center gap-2 text-red-700 dark:text-red-400 text-sm font-semibold mb-2">
                          <FiXCircle size={16} />
                          <span>Failed Sessions</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.failedSessions || 0}</p>
                      </div>
                      <div className="p-5 rounded-xl bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border border-amber-200 dark:border-amber-800/30">
                        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 text-sm font-semibold mb-2">
                          <FiFileText size={16} />
                          <span>Files Processed</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.processedDocuments || 0}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-48">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-pink-500 rounded-full blur-xl opacity-20 animate-pulse" />
                        <div className="relative w-10 h-10 border-3 border-gray-200 dark:border-slate-700 border-t-blue-600 rounded-full animate-spin" />
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingCenter;