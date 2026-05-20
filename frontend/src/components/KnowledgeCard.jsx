import React from 'react';
import { motion } from 'framer-motion';
import { FiDatabase, FiClock, FiCheckCircle, FiLoader, FiAlertCircle } from 'react-icons/fi';

const statusConfig = {
  indexed: { color: 'bg-green-100 text-green-800', icon: FiCheckCircle, label: 'Indexed' },
  processing: { color: 'bg-blue-100 text-blue-800', icon: FiLoader, label: 'Processing' },
  pending: { color: 'bg-yellow-100 text-yellow-800', icon: FiAlertCircle, label: 'Pending' },
};

export const KnowledgeCard = ({ project }) => {
  const status = statusConfig[project.status] || statusConfig.pending;
  const StatusIcon = status.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <FiDatabase size={18} className="text-blue-600" />
            <h4 className="font-semibold text-gray-900">{project.name}</h4>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs text-gray-600">Files</p>
              <p className="text-lg font-semibold text-gray-900">{project.fileCount}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Chunks</p>
              <p className="text-lg font-semibold text-gray-900">{project.chunkCount}</p>
            </div>
          </div>
          {project.lastTrained && (
            <div className="mt-3 flex items-center gap-1 text-xs text-gray-600">
              <FiClock size={14} />
              <span>Last trained: {new Date(project.lastTrained).toLocaleDateString()}</span>
            </div>
          )}
        </div>
        <div className="flex items-center">
          <span className={`px-2 py-1 text-xs font-medium rounded inline-flex items-center gap-1 ${status.color}`}>
            <StatusIcon size={12} />
            {status.label}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
