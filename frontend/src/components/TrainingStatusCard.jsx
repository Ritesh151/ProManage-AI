import React from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiAlertCircle, FiLoader } from 'react-icons/fi';

export const TrainingStatusCard = ({ status, loading }) => {
  if (!status) return null;

  const getStatusIcon = (s) => {
    switch (s) {
      case 'completed':
        return <FiCheckCircle size={24} className="text-green-600" />;
      case 'failed':
        return <FiAlertCircle size={24} className="text-red-600" />;
      case 'in_progress':
        return <FiLoader size={24} className="text-blue-600 animate-spin" />;
      default:
        return null;
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-lg border p-6 ${getStatusColor(status.currentSession?.status || 'idle')}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Training Status</h3>
          <div className="mt-4 space-y-2">
            <p className="text-sm text-gray-600">
              Documents: <span className="font-semibold text-gray-900">{status.documents}</span>
            </p>
            <p className="text-sm text-gray-600">
              Processed: <span className="font-semibold text-gray-900">{status.processedDocuments}</span>
            </p>
            <p className="text-sm text-gray-600">
              Chunks: <span className="font-semibold text-gray-900">{status.totalChunks}</span>
            </p>
            <p className="text-sm text-gray-600">
              Projects: <span className="font-semibold text-gray-900">{status.projects}</span>
            </p>
          </div>
        </div>
        {status.currentSession && getStatusIcon(status.currentSession.status)}
      </div>
      {status.currentSession?.status === 'in_progress' && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${(status.currentSession.filesProcessed / (status.currentSession.totalFiles || 1)) * 100}%`,
              }}
              className="bg-blue-600 h-2 rounded-full"
            />
          </div>
          <p className="text-xs text-gray-600 mt-2">
            {status.currentSession.filesProcessed} / {status.currentSession.totalFiles} files
          </p>
        </div>
      )}
    </motion.div>
  );
};
