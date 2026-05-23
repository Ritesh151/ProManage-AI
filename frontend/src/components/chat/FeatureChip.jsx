import React from 'react';
import { motion } from 'framer-motion';

export const FeatureChip = ({ label, index = 0 }) => {
  if (!label) return null;

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.03 }}
      whileHover={{ scale: 1.05 }}
      className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-violet-500/25 to-fuchsia-500/20 text-violet-100 border border-violet-500/30 hover:border-violet-400/50 hover:shadow-[0_0_12px_rgba(139,92,246,0.35)] transition-shadow"
    >
      {label}
    </motion.span>
  );
};
