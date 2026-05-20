import React from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

export const AnalyticsCard = ({ title, value, change, icon: Icon, trend = 'up' }) => {
  const isPositive = trend === 'up';
  const TrendIcon = isPositive ? FiTrendingUp : FiTrendingDown;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {change !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              <TrendIcon size={16} />
              <span>{Math.abs(change)}%</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className="p-3 bg-blue-100 rounded-lg">
            <Icon size={24} className="text-blue-600" />
          </div>
        )}
      </div>
    </motion.div>
  );
};
