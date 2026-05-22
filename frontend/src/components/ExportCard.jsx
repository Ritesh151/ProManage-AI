import React from 'react';
import { motion } from 'framer-motion';
import { FiFileText, FiFile, FiDownload, FiTrash2, FiRefreshCw, FiCheckCircle, FiXCircle } from 'react-icons/fi';

const formatIcon = {
  PDF: FiFileText,
  DOCX: FiFileText,
  CSV: FiFile,
  Excel: FiFile,
  default: FiFile,
};

const statusConfig = {
  completed: { icon: FiCheckCircle, className: 'text-green-500' },
  failed: { icon: FiXCircle, className: 'text-red-500' },
  processing: { icon: FiRefreshCw, className: 'text-blue-500' },
};

export const ExportCard = ({ export: exp, onRetry, onDelete }) => {
  const Icon = formatIcon[exp.type] || formatIcon.default;
  const StatusIcon = statusConfig[exp.status]?.icon || FiFile;
  const statusClass = statusConfig[exp.status]?.className || 'text-gray-400';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow"
    >
      <div className="p-2.5 rounded-lg bg-blue-50">
        <Icon size={20} className="text-blue-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{exp.fileName}</p>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-xs text-gray-500">{exp.type}</span>
          <span className="text-xs text-gray-400">•</span>
          <span className="text-xs text-gray-500">{exp.size}</span>
          <span className="text-xs text-gray-400">•</span>
          <span className="text-xs text-gray-500">
            {new Date(exp.timestamp).toLocaleString()}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <StatusIcon size={16} className={statusClass} />
        <button
          onClick={() => onRetry(exp.id)}
          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="Retry"
        >
          <FiDownload size={16} />
        </button>
        <button
          onClick={() => onDelete(exp.id)}
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete"
        >
          <FiTrash2 size={16} />
        </button>
      </div>
    </motion.div>
  );
};

export default ExportCard;
