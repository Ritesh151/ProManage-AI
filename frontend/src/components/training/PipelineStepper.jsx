import React from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiZap, FiLoader } from 'react-icons/fi';
import { PIPELINE_STAGES, STAGE_INDEX } from '../../constants/trainingPipeline';

const ProgressRing = ({ progress, size = 72 }) => {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (progress / 100) * circ;

  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="url(#ringGrad)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={circ}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 0.4 }}
      />
      <defs>
        <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export const PipelineStepper = ({ pipeline, training }) => {
  const currentIdx = STAGE_INDEX[pipeline?.stage] ?? 0;
  const overallProgress = pipeline?.progress ?? 0;

  const getStageState = (idx) => {
    if (idx < currentIdx) return 'done';
    if (idx === currentIdx) return training ? 'active' : 'pending';
    return 'pending';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-5">
          <div className="relative flex items-center justify-center">
            <ProgressRing progress={overallProgress} />
            <span className="absolute text-lg font-bold text-white">{overallProgress}%</span>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-400">Live AI Pipeline</p>
            <h3 className="text-xl font-bold text-white">
              {training ? 'Processing in realtime' : 'Pipeline idle'}
            </h3>
            {(pipeline?.currentProjectModule || pipeline?.currentFile) && (
              <motion.div
                key={`${pipeline.currentProjectModule}-${pipeline.currentFile}`}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="mt-1 max-w-md"
              >
                {pipeline?.currentProjectModule && (
                  <p className="text-xs font-semibold text-purple-300/90">{pipeline.currentProjectModule}</p>
                )}
                {pipeline?.currentFile && (
                  <p className="truncate font-mono text-sm text-cyan-300/90">{pipeline.currentFile}</p>
                )}
              </motion.div>
            )}
          </div>
        </div>
        <div className="flex gap-4 text-sm text-slate-400">
          <span>
            Files: <strong className="text-white">{pipeline?.filesProcessed || 0}</strong> / {pipeline?.totalFiles || 0}
          </span>
          <span>
            Chunks: <strong className="text-white">{pipeline?.chunksCreated || 0}</strong>
          </span>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {PIPELINE_STAGES.map((stage, idx) => {
          const state = getStageState(idx);
          const isActive = state === 'active';
          const isDone = state === 'done';

          return (
            <motion.div
              key={stage.id}
              layout
              className={`relative overflow-hidden rounded-xl border px-4 py-3 transition-all ${
                isActive
                  ? 'border-blue-500/50 bg-blue-500/10 shadow-lg shadow-blue-500/20'
                  : isDone
                  ? 'border-emerald-500/30 bg-emerald-500/5'
                  : 'border-white/5 bg-slate-800/40'
              }`}
              animate={isActive ? { boxShadow: ['0 0 20px rgba(59,130,246,0.3)', '0 0 35px rgba(139,92,246,0.4)', '0 0 20px rgba(59,130,246,0.3)'] } : {}}
              transition={{ duration: 2, repeat: isActive ? Infinity : 0 }}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                    isDone ? 'bg-emerald-500/20 text-emerald-400' : isActive ? 'bg-blue-500/30 text-blue-300' : 'bg-slate-700/50 text-slate-500'
                  }`}
                >
                  {isDone ? (
                    <FiCheck size={16} />
                  ) : isActive ? (
                    <FiZap size={16} className="animate-pulse" />
                  ) : (
                    <span className="text-xs font-bold">{idx + 1}</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-semibold ${isActive ? 'text-white' : isDone ? 'text-emerald-300/90' : 'text-slate-400'}`}>
                    {stage.label}
                  </p>
                  {isActive && pipeline?.stageProgress != null && (
                    <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-slate-700">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                        animate={{ width: `${pipeline.stageProgress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  )}
                </div>
                {isActive && <FiLoader className="animate-spin text-blue-400" size={14} />}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
