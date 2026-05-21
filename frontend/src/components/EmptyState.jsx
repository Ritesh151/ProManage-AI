import React from 'react';
import { motion } from 'framer-motion';
import { FiInbox } from 'react-icons/fi';

export const EmptyState = ({ icon: Icon = FiInbox, title, description, action }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <div className="relative">
        <div className="absolute inset-0 bg-blue-100 rounded-full blur-xl opacity-40" />
        <div className="relative p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full border border-gray-200/60">
          <Icon size={40} className="text-gray-400" />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mt-5 mb-1.5">{title}</h3>
      {description && <p className="text-sm text-gray-500 text-center mb-6 max-w-sm">{description}</p>}
      {action && <div>{action}</div>}
    </motion.div>
  );
};
