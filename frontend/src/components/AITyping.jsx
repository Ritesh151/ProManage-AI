// src/components/AITyping.js
import React from 'react';
import { motion } from 'framer-motion';

const AITyping = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex gap-3 mb-4"
    >
      {/* Avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-md">
        <span className="text-white text-sm">🤖</span>
      </div>

      {/* Typing Indicator */}
      <div className="backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 rounded-2xl rounded-tl-none px-5 py-3 shadow-lg">
        <div className="flex items-center gap-1.5">
          <motion.span
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
            className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-600 to-pink-500"
          />
          <motion.span
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.1 }}
            className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-600 to-pink-500"
          />
          <motion.span
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
            className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-600 to-pink-500"
          />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 font-medium">
          AI is thinking...
        </p>
      </div>
    </motion.div>
  );
};

export default AITyping;
