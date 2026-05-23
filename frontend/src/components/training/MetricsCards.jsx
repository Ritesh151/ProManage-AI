import React from 'react';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';
import {
  FiFileText, FiLayers, FiZap, FiTrendingUp, FiDatabase, FiTarget, FiCpu, FiClock,
} from 'react-icons/fi';
import { GlassCard } from './GlassCard';

const METRIC_DEFS = [
  { key: 'projectFilesIndexed', label: 'Project Files Indexed', icon: FiFileText, color: 'from-blue-500 to-cyan-500' },
  { key: 'sourceFilesProcessed', label: 'Source Files Processed', icon: FiDatabase, color: 'from-indigo-500 to-blue-500' },
  { key: 'chunksCreated', label: 'Chunks Created', icon: FiLayers, color: 'from-purple-500 to-pink-500' },
  { key: 'embeddingCount', label: 'Embedding Count', icon: FiZap, color: 'from-amber-500 to-orange-500' },
  { key: 'trainingSpeed', label: 'Training Speed', icon: FiTrendingUp, color: 'from-emerald-500 to-teal-500', suffix: '/s' },
  { key: 'vectorDbSize', label: 'Vector DB Size', icon: FiLayers, color: 'from-indigo-500 to-blue-500' },
  { key: 'averageSimilarity', label: 'Avg Similarity', icon: FiTarget, color: 'from-rose-500 to-red-500', decimals: 2 },
  { key: 'activeProvider', label: 'Active Provider', icon: FiCpu, color: 'from-violet-500 to-purple-500', isText: true },
  { key: 'lastRetrainTime', label: 'Last Retrain', icon: FiClock, color: 'from-slate-500 to-slate-600', isDate: true },
];

export const MetricsCards = ({ dashboard, liveMetrics }) => {
  const data = { ...dashboard, trainingSpeed: liveMetrics?.chunksPerSec ?? dashboard?.trainingSpeed ?? 0 };

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {METRIC_DEFS.map((m, i) => {
        const Icon = m.icon;
        const raw = data?.[m.key];
        const value = m.isDate
          ? raw
            ? new Date(raw).toLocaleString()
            : 'Never'
          : m.isText
          ? raw || '—'
          : raw ?? 0;

        return (
          <GlassCard key={m.key} className="p-4 hover:border-blue-500/30 transition-colors group" glow={i === 0}>
            <div className={`mb-3 inline-flex rounded-lg bg-gradient-to-br ${m.color} p-2 opacity-90`}>
              <Icon className="text-white" size={16} />
            </div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">{m.label}</p>
            <p className="mt-1 text-xl font-bold text-white truncate">
              {m.isDate || m.isText ? (
                <span className="text-sm">{value}</span>
              ) : (
                <>
                  <CountUp end={Number(value)} duration={1.2} decimals={m.decimals ?? 0} preserveValue />
                  {m.suffix && <span className="text-sm text-slate-400 ml-0.5">{m.suffix}</span>}
                </>
              )}
            </p>
          </GlassCard>
        );
      })}
    </div>
  );
};
