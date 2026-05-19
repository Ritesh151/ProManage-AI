import React from 'react';
import { motion } from 'framer-motion';

const colorMap = {
  blue: { bg: 'bg-blue-50', text: 'text-blue-600', icon: 'text-blue-600' },
  green: { bg: 'bg-emerald-50', text: 'text-emerald-600', icon: 'text-emerald-600' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-600', icon: 'text-purple-600' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-600', icon: 'text-orange-600' },
};

const DashboardCard = ({ title, value, icon: Icon, color = 'blue', index = 0 }) => {
  const c = colorMap[color] || colorMap.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm card-hover"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-secondary">{title}</p>
          <p className={`text-3xl font-bold mt-2 ${c.text}`}>{value}</p>
        </div>
        <div className={`p-3.5 rounded-xl ${c.bg}`}>
          <Icon className={c.icon} size={24} />
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardCard;
