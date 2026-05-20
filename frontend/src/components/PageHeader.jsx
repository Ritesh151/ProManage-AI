import React from 'react';
import { motion } from 'framer-motion';

export const PageHeader = ({ title, description, icon: Icon, actions }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          {Icon && (
            <div className="p-3 bg-blue-100 rounded-lg">
              <Icon size={24} className="text-blue-600" />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            {description && <p className="text-gray-600 mt-1">{description}</p>}
          </div>
        </div>
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>
    </motion.div>
  );
};
