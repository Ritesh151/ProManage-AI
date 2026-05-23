import React from 'react';
import { motion } from 'framer-motion';

export const ChatSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    {[1, 2].map((i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`flex gap-3 ${i % 2 === 0 ? '' : 'flex-row-reverse'}`}
      >
        <div className="h-9 w-9 rounded-xl bg-slate-700/60" />
        <div className={`space-y-2 flex-1 max-w-md ${i % 2 === 0 ? '' : 'items-end flex flex-col'}`}>
          <div className="h-4 w-full rounded-lg bg-slate-700/50" />
          <div className="h-4 w-3/4 rounded-lg bg-slate-700/40" />
        </div>
      </motion.div>
    ))}
  </div>
);
