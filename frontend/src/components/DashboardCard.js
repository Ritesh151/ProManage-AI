// src/components/DashboardCard.js
import React from 'react';
import { motion } from 'framer-motion';

const colorMap = {
  blue: { 
    bg: 'bg-gradient-to-br from-blue-500/10 to-blue-600/5', 
    text: 'text-blue-600 dark:text-blue-400',
    icon: 'text-blue-600 dark:text-blue-400',
    border: 'from-blue-500 to-blue-600'
  },
  green: { 
    bg: 'bg-gradient-to-br from-emerald-500/10 to-emerald-600/5', 
    text: 'text-emerald-600 dark:text-emerald-400',
    icon: 'text-emerald-600 dark:text-emerald-400',
    border: 'from-emerald-500 to-emerald-600'
  },
  purple: { 
    bg: 'bg-gradient-to-br from-purple-500/10 to-purple-600/5', 
    text: 'text-purple-600 dark:text-purple-400',
    icon: 'text-purple-600 dark:text-purple-400',
    border: 'from-purple-500 to-purple-600'
  },
  orange: { 
    bg: 'bg-gradient-to-br from-orange-500/10 to-orange-600/5', 
    text: 'text-orange-600 dark:text-orange-400',
    icon: 'text-orange-600 dark:text-orange-400',
    border: 'from-orange-500 to-orange-600'
  },
  pink: { 
    bg: 'bg-gradient-to-br from-pink-500/10 to-pink-600/5', 
    text: 'text-pink-600 dark:text-pink-400',
    icon: 'text-pink-600 dark:text-pink-400',
    border: 'from-pink-500 to-pink-600'
  },
  indigo: { 
    bg: 'bg-gradient-to-br from-indigo-500/10 to-indigo-600/5', 
    text: 'text-indigo-600 dark:text-indigo-400',
    icon: 'text-indigo-600 dark:text-indigo-400',
    border: 'from-indigo-500 to-indigo-600'
  },
};

const DashboardCard = ({ title, value, icon: Icon, color = 'blue', index = 0, trend, trendValue }) => {
  const c = colorMap[color] || colorMap.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="group relative overflow-hidden backdrop-blur-lg bg-white/80 dark:bg-slate-900/80 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
    >
      {/* Gradient Top Border */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${c.border} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      
      {/* Background Gradient on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-transparent group-hover:from-blue-500/5 group-hover:to-pink-500/5 transition-all duration-500" />
      
      <div className="relative p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {title}
            </p>
            <p className={`text-3xl font-bold mt-2 tracking-tight ${c.text}`}>
              {value}
            </p>
            
            {/* Trend Indicator */}
            {trend && (
              <div className="flex items-center gap-1.5 mt-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.06 + 0.2 }}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                    trend === 'up' 
                      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                      : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                  }`}
                >
                  <span>{trend === 'up' ? '↑' : '↓'}</span>
                  <span>{trendValue}</span>
                </motion.div>
                <span className="text-xs text-gray-400 dark:text-gray-500">vs last month</span>
              </div>
            )}
          </div>
          
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ duration: 0.2 }}
            className={`relative p-3.5 rounded-xl ${c.bg} backdrop-blur-sm shadow-sm`}
          >
            <Icon className={c.icon} size={22} />
            
            {/* Animated Pulse Ring */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </motion.div>
        </div>
      </div>
      
      {/* Bottom Glow Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-transparent via-transparent to-transparent group-hover:from-blue-500/5 pointer-events-none transition-all duration-500" />
    </motion.div>
  );
};

export default DashboardCard;