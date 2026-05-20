import React from 'react';
import { motion } from 'framer-motion';
import { FiRefreshCw } from 'react-icons/fi';

export const ChartContainer = ({ title, children, loading, error, onRetry }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-gray-200 p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
          <p className="mb-3">{error}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <FiRefreshCw size={14} />
              Retry
            </button>
          )}
        </div>
      ) : (
        children
      )}
    </motion.div>
  );
};
