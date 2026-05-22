// src/components/AIProjectSidebar.js
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiRefreshCw, 
  FiClock, 
  FiFolder, 
  FiFileText, 
  FiDatabase, 
  FiTrendingUp,
  FiCheckCircle,
  FiAlertCircle,
  FiLoader,
  FiCpu,
  FiX
} from 'react-icons/fi';

const AIProjectSidebar = ({
  projects,
  selectedProject,
  onSelectProject,
  status,
  onTrain,
  onShowHistory,
  onCloseMobile,
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-emerald-600 dark:text-emerald-400';
      case 'in_progress':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'failed':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-500 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <FiCheckCircle size={12} />;
      case 'in_progress':
        return <FiLoader size={12} className="animate-spin" />;
      case 'failed':
        return <FiAlertCircle size={12} />;
      default:
        return <FiFolder size={12} />;
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-100 dark:bg-emerald-900/30';
      case 'in_progress':
        return 'bg-yellow-100 dark:bg-yellow-900/30';
      case 'failed':
        return 'bg-red-100 dark:bg-red-900/30';
      default:
        return 'bg-gray-100 dark:bg-gray-800';
    }
  };

  return (
    <motion.div
      initial={{ x: -280, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="w-80 h-full backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-r border-white/20 dark:border-slate-700/50 shadow-xl flex flex-col overflow-y-auto"
    >
      {/* Mobile Close Button */}
      {onCloseMobile && (
        <div className="lg:hidden flex justify-end p-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCloseMobile}
            className="p-2 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400"
          >
            <FiX size={18} />
          </motion.button>
        </div>
      )}

      <div className="p-5 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/10 to-pink-500/10">
            <FiCpu size={20} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
              AI Intelligence
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Project Knowledge Base
            </p>
          </div>
        </div>

        {/* Status Card */}
        <div className="backdrop-blur-sm bg-gradient-to-br from-blue-500/5 to-pink-500/5 rounded-xl border border-white/20 dark:border-slate-700/50 p-4">
          <div className="flex items-center gap-2 mb-3">
            <FiDatabase size={14} className="text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              System Status
            </h3>
          </div>
          
          {status ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-2 rounded-lg bg-white/50 dark:bg-slate-800/50">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {status.documents || 0}
                  </p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Documents
                  </p>
                </div>
                <div className="text-center p-2 rounded-lg bg-white/50 dark:bg-slate-800/50">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {status.processedDocuments || 0}
                  </p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Processed
                  </p>
                </div>
                <div className="text-center p-2 rounded-lg bg-white/50 dark:bg-slate-800/50">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {status.totalChunks || 0}
                  </p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Chunks
                  </p>
                </div>
                <div className="text-center p-2 rounded-lg bg-white/50 dark:bg-slate-800/50">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {status.projects || 0}
                  </p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Projects
                  </p>
                </div>
              </div>

              {status.currentSession && (
                <div className="mt-3 p-3 rounded-lg bg-white/50 dark:bg-slate-800/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(status.currentSession.status)}
                      <span className={`text-xs font-semibold ${getStatusColor(status.currentSession.status)}`}>
                        {status.currentSession.status === 'in_progress' ? 'Training in progress' : 
                         status.currentSession.status === 'completed' ? 'Training completed' : 
                         status.currentSession.status === 'failed' ? 'Training failed' : 'Idle'}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {status.currentSession.filesProcessed}/{status.currentSession.totalFiles}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(status.currentSession.filesProcessed / (status.currentSession.totalFiles || 1)) * 100}%` }}
                      className="h-full bg-gradient-to-r from-blue-600 to-pink-500 rounded-full"
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center py-6">
              <div className="w-6 h-6 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onTrain}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-pink-500 text-white text-sm font-medium shadow-md hover:shadow-lg transition-all"
          >
            <FiRefreshCw size={14} />
            Train AI
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onShowHistory}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl backdrop-blur-sm bg-white/50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 text-sm font-medium hover:shadow-md transition-all"
          >
            <FiClock size={14} />
            History
          </motion.button>
        </div>

        {/* Projects Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FiFolder size={14} className="text-blue-600 dark:text-blue-400" />
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Projects
              </h3>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {projects.length} total
            </span>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
            {projects.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-gradient-to-br from-gray-500/10 to-slate-500/10 flex items-center justify-center">
                  <FiFolder size={20} className="text-gray-400 dark:text-gray-500" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">No projects found</p>
              </div>
            ) : (
              projects.map((project, index) => (
                <motion.button
                  key={project.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  whileHover={{ x: 4 }}
                  onClick={() => onSelectProject(project)}
                  className={`w-full text-left p-3 rounded-xl transition-all duration-200 ${
                    selectedProject?.path === project.path
                      ? 'bg-gradient-to-r from-blue-600/10 to-pink-500/10 border border-blue-200 dark:border-blue-800'
                      : 'hover:bg-gray-50 dark:hover:bg-slate-800 border border-transparent'
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900 dark:text-white truncate flex-1">
                      {project.name}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${getStatusBg(project.status)} ${getStatusColor(project.status)} ml-2`}>
                      {project.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1">
                      <FiFileText size={10} className="text-gray-400" />
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {project.fileCount} files
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiTrendingUp size={10} className="text-gray-400" />
                      <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                        {project.type}
                      </span>
                    </div>
                  </div>
                </motion.button>
              ))
            )}
          </div>
        </div>

        {/* Info Tip */}
        <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500/5 to-pink-500/5 border border-blue-200 dark:border-blue-800/30">
          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
            💡 Train the AI to index all your projects and enable intelligent search across your knowledge base.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default AIProjectSidebar;
