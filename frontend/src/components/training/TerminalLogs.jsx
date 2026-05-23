import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiTerminal } from 'react-icons/fi';
import { GlassCard } from './GlassCard';

const levelColors = {
  info: 'text-blue-400',
  success: 'text-emerald-400',
  SUCCESS: 'text-emerald-400',
  error: 'text-red-400',
  warning: 'text-amber-400',
};

export const TerminalLogs = ({ logs = [] }) => {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const displayLogs = logs.length > 0 ? logs : [
    { level: 'info', message: 'AI Training Infrastructure ready.', timestamp: new Date().toISOString() },
    { level: 'info', message: 'Start training to stream live pipeline logs...', timestamp: new Date().toISOString() },
  ];

  return (
    <GlassCard className="overflow-hidden">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2 bg-slate-900/80">
        <FiTerminal className="text-green-400" size={14} />
        <span className="text-xs font-mono text-slate-400">training-pipeline.log</span>
        <span className="ml-auto flex gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
        </span>
      </div>
      <div className="h-48 overflow-y-auto p-4 font-mono text-xs space-y-0.5 custom-scrollbar bg-black/40">
        {displayLogs.map((log, i) => (
          <motion.div
            key={`${log.timestamp}-${i}`}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-2 hover:bg-white/5 px-1 rounded"
          >
            <span className="text-slate-600 shrink-0">
              {new Date(log.timestamp).toLocaleTimeString()}
            </span>
            <span className={`shrink-0 font-bold ${levelColors[log.level] || levelColors.info}`}>
              [{log.level?.toUpperCase() || 'INFO'}]
            </span>
            <span className="text-slate-300 break-all">{log.message}</span>
          </motion.div>
        ))}
        <div ref={endRef} />
      </div>
    </GlassCard>
  );
};
