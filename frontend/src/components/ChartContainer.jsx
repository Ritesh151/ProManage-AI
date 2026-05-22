// src/components/ChartContainer.js
import React from 'react';
import { motion } from 'framer-motion';
import { FiRefreshCw, FiBarChart2, FiTrendingUp } from 'react-icons/fi';

export const ChartContainer = ({ title, subtitle, icon: Icon, children, loading, error, onRetry }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
      className="group relative backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      {/* Gradient Top Border */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Background Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-transparent to-pink-500/0 group-hover:from-blue-500/5 group-hover:to-pink-500/5 transition-all duration-500" />

      {/* Header */}
      <div className="relative p-5 pb-3 border-b border-white/20 dark:border-slate-700/50">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/10 to-pink-500/10">
                <Icon size={16} className="text-blue-600 dark:text-blue-400" />
              </div>
            )}
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white tracking-tight">
                {title}
              </h3>
              {subtitle && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          
          {/* Loading Indicator in Header */}
          {loading && (
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
              <span className="text-xs text-gray-500 dark:text-gray-400">Loading...</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="relative p-5">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-pink-500 rounded-full blur-xl opacity-20 animate-pulse" />
              <div className="relative w-10 h-10 border-3 border-gray-200 dark:border-slate-700 border-t-blue-600 rounded-full animate-spin" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 font-medium">
              Loading chart data...
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-red-500/10 to-orange-500/10 flex items-center justify-center">
              <FiBarChart2 size={28} className="text-red-500 dark:text-red-400" />
            </div>
            <p className="text-sm text-red-600 dark:text-red-400 font-medium mb-2">
              Failed to load data
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 text-center max-w-xs">
              {error}
            </p>
            {onRetry && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onRetry}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-pink-500 text-white text-sm font-medium shadow-md hover:shadow-lg transition-all"
              >
                <FiRefreshCw size={14} />
                Retry
              </motion.button>
            )}
          </div>
        ) : (
          <div className="w-full">
            {children}
          </div>
        )}
      </div>

      {/* Bottom Glow Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </motion.div>
  );
};

export default ChartContainer;