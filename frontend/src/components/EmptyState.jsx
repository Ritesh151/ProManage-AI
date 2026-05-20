import React from 'react';
import { motion } from 'framer-motion';

export const EmptyState = ({ icon: Icon, title, description, action }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-12 px-4"
    >
      {Icon && (
        <div className="mb-4 p-4 bg-gray-100 rounded-full">
          <Icon size={48} className="text-gray-400" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      {description && <p className="text-gray-600 text-center mb-6 max-w-sm">{description}</p>}
      {action && <div>{action}</div>}
    </motion.div>
  );
};
