import React from 'react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { GlassCard } from './GlassCard';

const chartTooltipStyle = {
  contentStyle: { background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 },
  labelStyle: { color: '#94a3b8' },
};

export const TrainingCharts = ({ charts }) => {
  const throughput = charts?.throughput || [];
  const embeddings = charts?.embeddings || [];
  const retrieval = charts?.retrieval || [];
  const vectorGrowth = charts?.vectorGrowth || [];

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <GlassCard className="p-4">
        <h4 className="mb-3 text-sm font-semibold text-slate-300">Training Throughput</h4>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={throughput}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} />
            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
            <Tooltip {...chartTooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="chunks" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="embeddings" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </GlassCard>

      <GlassCard className="p-4">
        <h4 className="mb-3 text-sm font-semibold text-slate-300">Embedding Generation</h4>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={embeddings}>
            <defs>
              <linearGradient id="embedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
            <Tooltip {...chartTooltipStyle} />
            <Area type="monotone" dataKey="count" stroke="#a855f7" fill="url(#embedGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </GlassCard>

      <GlassCard className="p-4">
        <h4 className="mb-3 text-sm font-semibold text-slate-300">Retrieval Quality</h4>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={retrieval}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} />
            <YAxis domain={[0.7, 1]} tick={{ fill: '#64748b', fontSize: 11 }} />
            <Tooltip {...chartTooltipStyle} />
            <Line type="monotone" dataKey="score" stroke="#06b6d4" strokeWidth={2} dot={{ fill: '#06b6d4' }} />
          </LineChart>
        </ResponsiveContainer>
      </GlassCard>

      <GlassCard className="p-4">
        <h4 className="mb-3 text-sm font-semibold text-slate-300">Vector Growth</h4>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={vectorGrowth}>
            <defs>
              <linearGradient id="vecGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} />
            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
            <Tooltip {...chartTooltipStyle} />
            <Area type="monotone" dataKey="size" stroke="#3b82f6" fill="url(#vecGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </GlassCard>
    </div>
  );
};
