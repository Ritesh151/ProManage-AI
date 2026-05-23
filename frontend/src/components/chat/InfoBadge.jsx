import React from 'react';
import { motion } from 'framer-motion';

const STATUS_STYLES = {
  completed: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-emerald-500/20',
  active: 'bg-blue-500/20 text-blue-300 border-blue-500/40 shadow-blue-500/20',
  pending: 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-amber-500/20',
  'on hold': 'bg-orange-500/20 text-orange-300 border-orange-500/40 shadow-orange-500/20',
  cancelled: 'bg-red-500/20 text-red-300 border-red-500/40 shadow-red-500/20',
  default: 'bg-violet-500/15 text-violet-200 border-violet-500/30 shadow-violet-500/10',
};

export const InfoBadge = ({ label, value, variant = 'default', index = 0 }) => {
  if (value == null || value === '' || value === '—') return null;

  const statusKey = String(value).toLowerCase();
  const style =
    variant === 'status'
      ? STATUS_STYLES[statusKey] || STATUS_STYLES.default
      : STATUS_STYLES.default;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 min-w-0"
    >
      <span className="text-[11px] uppercase tracking-wider text-slate-500 shrink-0">{label}</span>
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border shadow-sm ${style}`}
      >
        {value}
      </span>
    </motion.div>
  );
};
