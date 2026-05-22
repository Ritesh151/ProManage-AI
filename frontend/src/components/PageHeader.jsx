// src/components/PageHeader.js
import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export const PageHeader = ({ 
  title, 
  description, 
  icon: Icon, 
  actions, 
  showBackButton = false,
  backUrl = '/',
  subtitle,
  badge,
  gradient = false
}) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-8"
    >
      <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            {/* Back Button */}
            {showBackButton && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => backUrl ? navigate(backUrl) : navigate(-1)}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-all"
              >
                <FiArrowLeft size={20} />
              </motion.button>
            )}
            
            {/* Icon */}
            {Icon && (
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/10 to-pink-500/10">
                <Icon size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
            )}
            
            {/* Title Section */}
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className={`text-2xl lg:text-3xl font-bold tracking-tight ${
                  gradient 
                    ? 'bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent'
                    : 'text-gray-900 dark:text-white'
                }`}>
                  {title}
                </h1>
                {badge && (
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-blue-600 to-pink-500 text-white shadow-md">
                    {badge}
                  </span>
                )}
              </div>
              {subtitle && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {subtitle}
                </p>
              )}
              {description && !subtitle && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {description}
                </p>
              )}
            </div>
          </div>
          
          {/* Actions */}
          {actions && (
            <div className="flex items-center gap-3 flex-wrap">
              {actions}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PageHeader;