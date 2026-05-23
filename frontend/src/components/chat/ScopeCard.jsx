import React from 'react';
import { motion } from 'framer-motion';
import { FiClipboard } from 'react-icons/fi';
import { FeatureChip } from './FeatureChip';

export const ScopeCard = ({ items = [], index = 0 }) => {
  const list = (items || []).filter(Boolean);
  if (!list.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/50 to-indigo-950/40 backdrop-blur-md p-4"
    >
      <div className="flex items-center gap-2 mb-3">
        <FiClipboard className="text-indigo-400" size={16} />
        <h4 className="text-sm font-semibold text-white">Scope Of Work</h4>
      </div>
      <div className="flex flex-wrap gap-2">
        {list.map((item, i) => (
          <FeatureChip key={`${item}-${i}`} label={item} index={i} />
        ))}
      </div>
    </motion.div>
  );
};
