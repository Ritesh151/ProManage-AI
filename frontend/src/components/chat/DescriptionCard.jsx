import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiFileText } from 'react-icons/fi';

const TRUNCATE = 250;

export const DescriptionCard = ({ text, index = 0 }) => {
  const [expanded, setExpanded] = useState(false);
  if (!text?.trim()) return null;

  const long = text.length > TRUNCATE;
  const display = expanded || !long ? text : `${text.slice(0, TRUNCATE).trim()}…`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-md p-4"
    >
      <div className="flex items-center gap-2 mb-2">
        <FiFileText className="text-cyan-400" size={16} />
        <h4 className="text-sm font-semibold text-white">Description</h4>
      </div>
      <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap break-words">{display}</p>
      {long && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="mt-2 text-xs font-medium text-violet-400 hover:text-violet-300"
        >
          {expanded ? 'Read Less' : 'Read More'}
        </button>
      )}
    </motion.div>
  );
};
