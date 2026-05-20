import React from 'react';
import { motion } from 'framer-motion';
import { FiFileText, FiFolder } from 'react-icons/fi';

export const SearchResultCard = ({ result }) => {
  const getTypeIcon = (type) => {
    switch (type) {
      case 'code':
        return <FiFileText size={18} className="text-blue-600" />;
      case 'documentation':
        return <FiFileText size={18} className="text-purple-600" />;
      default:
        return <FiFolder size={18} className="text-gray-600" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start gap-3">
        {getTypeIcon(result.type)}
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">{result.title}</h4>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{result.content}</p>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <span className="px-2 py-1 bg-gray-100 rounded">{result.project}</span>
              <span className="px-2 py-1 bg-gray-100 rounded">{result.source}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${result.similarity * 100}%` }}
                  className="h-full bg-green-500"
                />
              </div>
              <span className="text-xs font-semibold text-gray-900">{Math.round(result.similarity * 100)}%</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
