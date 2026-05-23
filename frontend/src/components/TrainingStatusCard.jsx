import React from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiAlertCircle, FiLoader, FiHardDrive, FiDatabase, FiCpu, FiFileText, FiLayers } from 'react-icons/fi';

export const TrainingStatusCard = ({ status, stats, loading }) => {
  if (!status && !stats) return null;

  const getStatusIcon = (s) => {
    switch (s) {
      case 'completed':
        return <FiCheckCircle size={24} className="text-green-600" />;
      case 'failed':
        return <FiAlertCircle size={24} className="text-red-600" />;
      case 'in_progress':
        return <FiLoader size={24} className="text-blue-600 animate-spin" />;
      default:
        return <FiHardDrive size={24} className="text-gray-400" />;
    }
  };

  const getStatusColor = (s) => {
    switch (s) {
      case 'completed':
        return 'bg-green-50 border-green-200';
      case 'failed':
        return 'bg-red-50 border-red-200';
      case 'in_progress':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const currentStatus = status?.status || stats?.status || 'idle';
  const progress = status?.progress || 0;
  const currentModule = status?.currentProjectModule || status?.currentModule;
  const currentFile = status?.currentFile;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-lg border p-6 ${getStatusColor(currentStatus)}`}
    >
    
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">AI Status</h3>
          <p className="text-sm text-gray-500 mt-1">
            {currentStatus === 'in_progress' ? 'Training in progress' : currentStatus === 'completed' ? 'Training complete' : 'Ready to train'}
          </p>
        </div>
        {getStatusIcon(currentStatus)}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-white rounded-lg p-3 border border-gray-100">
          <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
            <FiFileText size={14} />
            <span>Project Files Indexed</span>
          </div>
          <p className="text-xl font-bold text-gray-900">
            {stats?.projectFilesIndexed || stats?.processedDocuments || status?.filesProcessed || 0}
          </p>
        </div>

        <div className="bg-white rounded-lg p-3 border border-gray-100">
          <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
            <FiCheckCircle size={14} />
            <span>Source Files Processed</span>
          </div>
          <p className="text-xl font-bold text-gray-900">
            {stats?.sourceFilesProcessed || stats?.processedDocuments || status?.filesProcessed || 0}
          </p>
        </div>

        <div className="bg-white rounded-lg p-3 border border-gray-100">
          <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
            <FiLayers size={14} />
            <span>Total Chunks</span>
          </div>
          <p className="text-xl font-bold text-gray-900">
            {stats?.totalChunks || status?.chunksCreated || 0}
          </p>
        </div>

        <div className="bg-white rounded-lg p-3 border border-gray-100">
          <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
            <FiDatabase size={14} />
            <span>Projects</span>
          </div>
          <p className="text-xl font-bold text-gray-900">
            {stats?.totalProjects || status?.totalProjects || 0}
          </p>
        </div>
      </div>

      {currentStatus === 'in_progress' && (
        <div className="mt-4 bg-white rounded-lg p-4 border border-gray-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Training Progress</span>
            <span className="text-sm font-bold text-blue-600">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
              className="bg-blue-600 h-2.5 rounded-full"
            />
          </div>
          {(currentModule || currentFile) && (
            <div className="text-xs text-gray-500 mt-2">
              {currentModule && <p className="font-medium text-gray-700 truncate">Current Project Module: {currentModule}</p>}
              {currentFile && <p className="truncate font-mono">{currentFile}</p>}
            </div>
          )}
        </div>
      )}

      <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
        <div className="bg-white rounded p-2 border border-gray-100">
          <span className="text-gray-500">Embedding Model</span>
          <p className="font-medium text-gray-900 truncate">{stats?.embeddingModel || 'huggingface'}</p>
        </div>
        <div className="bg-white rounded p-2 border border-gray-100">
          <span className="text-gray-500">Vector DB</span>
          <p className="font-medium text-gray-900 truncate">{stats?.vectorDatabase || 'chroma'}</p>
        </div>
        <div className="bg-white rounded p-2 border border-gray-100">
          <span className="text-gray-500">LLM</span>
          <p className="font-medium text-gray-900 truncate">{stats?.currentLLM || 'openai'}</p>
        </div>
      </div>
    </motion.div>
  );
};
