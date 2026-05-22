// src/components/SettingSection.js
import React from 'react';
import { motion } from 'framer-motion';

export const SettingSection = ({ title, description, icon: Icon, children, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-lg overflow-hidden ${className}`}
    >
      {/* Gradient Top Border */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Header */}
      <div className="p-6 pb-4 border-b border-white/20 dark:border-slate-700/50">
        <div className="flex items-start gap-3">
          {Icon && (
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/10 to-pink-500/10">
              <Icon size={18} className="text-blue-600 dark:text-blue-400" />
            </div>
          )}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
              {title}
            </h3>
            {description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        <div className="space-y-5">
          {children}
        </div>
      </div>
      
      {/* Bottom Glow Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </motion.div>
  );
};

export default SettingSection;