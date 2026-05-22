// src/components/AnalyticsCard.js
import React from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiTrendingDown, FiMinus } from 'react-icons/fi';

export const AnalyticsCard = ({ title, value, change, icon: Icon, trend = 'up', loading = false }) => {
  const isPositive = trend === 'up';
  const TrendIcon = isPositive ? FiTrendingUp : FiTrendingDown;
  const trendColor = isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400';
  const trendBg = isPositive ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-red-100 dark:bg-red-900/30';

  if (loading) {
    return (
      <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 rounded-2xl border border-white/20 dark:border-slate-700/50 p-6 animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/3 mb-3" />
        <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-1/2" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative overflow-hidden backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-lg hover:shadow-2xl transition-all duration-300"
    >
      {/* Gradient Top Border */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Background Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-transparent to-pink-500/0 group-hover:from-blue-500/5 group-hover:to-pink-500/5 transition-all duration-500" />

      <div className="relative p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {title}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2 tracking-tight">
              {value}
            </p>
            
            {change !== undefined && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-center gap-1.5 mt-3 px-2 py-1 rounded-lg ${trendBg} inline-flex`}
              >
                <TrendIcon size={12} className={trendColor} />
                <span className={`text-xs font-bold ${trendColor}`}>
                  {Math.abs(change)}%
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">vs last month</span>
              </motion.div>
            )}
          </div>

          {Icon && (
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ duration: 0.2 }}
              className="p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-pink-500/10 group-hover:from-blue-500/20 group-hover:to-pink-500/20 transition-all duration-300"
            >
              <Icon size={22} className="text-blue-600 dark:text-blue-400" />
            </motion.div>
          )}
        </div>

        {/* Bottom Glow Effect */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </div>
    </motion.div>
  );
};