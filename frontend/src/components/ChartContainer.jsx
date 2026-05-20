import React from 'react';
import { motion } from 'framer-motion';

export const ChartContainer = ({ title, children, loading }) => {
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
      ) : (
        children
      )}
    </motion.div>
  );
};
