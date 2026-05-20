import React from 'react';
import { motion } from 'framer-motion';
import { FiDownload, FiRefreshCw, FiTrash2 } from 'react-icons/fi';

export const ExportCard = ({ export: exp, onRetry, onDelete }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <FiDownload size={18} className="text-blue-600" />
            <h4 className="font-semibold text-gray-900">{exp.fileName}</h4>
          </div>
          <p className="text-sm text-gray-600 mt-1">{exp.type} • {exp.size}</p>
          <p className="text-xs text-gray-500 mt-1">{new Date(exp.timestamp).toLocaleString()}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(exp.status)}`}>
            {exp.status}
          </span>
          {exp.status === 'failed' && (
            <button
              onClick={() => onRetry(exp.id)}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              title="Retry export"
            >
              <FiRefreshCw size={16} className="text-gray-600" />
            </button>
          )}
          <button
            onClick={() => onDelete(exp.id)}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title="Delete export"
          >
            <FiTrash2 size={16} className="text-gray-600" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
