import React from 'react';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';
import { FiActivity, FiClock, FiLayers, FiZap, FiServer, FiCpu } from 'react-icons/fi';
import { GlassCard } from './GlassCard';

const formatEta = (seconds) => {
  if (seconds == null || seconds <= 0) return '—';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;
};

const LiveMetric = ({ icon: Icon, label, value, unit, live }) => (
  <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-slate-800/50 px-4 py-3">
    <div className="relative">
      <Icon className="text-blue-400" size={18} />
      {live && (
        <span className="absolute -right-0.5 -top-0.5 flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
      )}
    </div>
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-lg font-bold text-white">
        <CountUp end={Number(value) || 0} decimals={unit === '/s' ? 1 : 0} duration={0.6} preserveValue />
        {unit && <span className="text-sm font-normal text-slate-400 ml-1">{unit}</span>}
      </p>
    </div>
  </div>
);

export const SpeedPanel = ({ metrics, training, connected }) => {
  const m = metrics || {};

  return (
    <GlassCard className="p-5" glow>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FiActivity className="text-blue-400" />
          <h3 className="font-bold text-white">Realtime Training Speed</h3>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className={`h-2 w-2 rounded-full ${connected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
          <span className="text-slate-400">{connected ? 'LIVE' : 'OFFLINE'}</span>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <LiveMetric icon={FiLayers} label="Chunks / sec" value={m.chunksPerSec} unit="/s" live={training} />
        <LiveMetric icon={FiZap} label="Embeddings / sec" value={m.embeddingsPerSec} unit="/s" live={training} />
        <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-slate-800/50 px-4 py-3">
          <FiClock className="text-purple-400" size={18} />
          <div>
            <p className="text-xs text-slate-500">ETA</p>
            <p className="text-lg font-bold text-white font-mono">{formatEta(m.etaSeconds)}</p>
          </div>
        </div>
        <LiveMetric icon={FiServer} label="Queue Depth" value={m.queueDepth} live={training} />
        <LiveMetric icon={FiCpu} label="Memory" value={m.memoryUsageMb} unit=" MB" live={training} />
        <LiveMetric icon={FiActivity} label="CPU Load" value={m.cpuPercent} unit="%" live={training} />
      </div>

      {training && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 h-1 overflow-hidden rounded-full bg-slate-700"
        >
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            style={{ width: '40%' }}
          />
        </motion.div>
      )}
    </GlassCard>
  );
};
