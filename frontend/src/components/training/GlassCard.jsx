import React from 'react';
import { motion } from 'framer-motion';

export const GlassCard = ({ children, className = '', glow = false, ...props }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    className={`relative rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-2xl ${
      glow ? 'shadow-blue-500/10' : ''
    } ${className}`}
    {...props}
  >
    {glow && (
      <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 opacity-50 blur-sm" />
    )}
    <div className="relative">{children}</div>
  </motion.div>
);
