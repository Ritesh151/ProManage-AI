// src/pages/TrainingCenterNew.js (Enhanced Version)
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiCpu, FiRefreshCw, FiStopCircle, FiAlertCircle, FiZap, FiActivity,
  FiDatabase, FiTrendingUp, FiCheckCircle, FiClock, FiBarChart2,
  FiServer, FiCloud, FiShield, FiAward
} from 'react-icons/fi';
import { useTraining } from '../hooks/useTraining';
import { useTrainingSocket } from '../hooks/useTrainingSocket';
import { trainingService } from '../services/trainingService';
import { ParticleBackground } from '../components/training/ParticleBackground';
import { PipelineStepper } from '../components/training/PipelineStepper';
import { BrainFlowGraph } from '../components/training/BrainFlowGraph';
import { MetricsCards } from '../components/training/MetricsCards';
import { TrainingCharts } from '../components/training/TrainingCharts';
import { SpeedPanel } from '../components/training/SpeedPanel';
import { SemanticSearchPanel } from '../components/training/SemanticSearchPanel';
import { TerminalLogs } from '../components/training/TerminalLogs';
import { GlassCard } from '../components/training/GlassCard';

const TrainingCenter = () => {
  const {
    status,
    stats,
    logs: restLogs,
    training,
    error,
    startTraining,
    retrain,
    stopTraining,
  } = useTraining();

  const { pipeline, metrics: socketMetrics, flow, logs: socketLogs, connected } = useTrainingSocket();
  const [dashboard, setDashboard] = useState(null);
  const [metricsLoading, setMetricsLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const data = await trainingService.getMetrics();
      setDashboard(data);
    } catch (err) {
      console.error('Metrics fetch error:', err);
    } finally {
      setMetricsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(fetchDashboard, training ? 5000 : 15000);
    return () => clearInterval(interval);
  }, [training]);

  const mergedPipeline = useMemo(
    () => ({
      ...pipeline,
      isTraining: training || pipeline.isTraining,
      filesProcessed: pipeline.filesProcessed ?? status?.filesProcessed ?? 0,
      totalFiles: pipeline.totalFiles ?? status?.totalFiles ?? 0,
      chunksCreated: pipeline.chunksCreated ?? status?.chunksCreated ?? stats?.totalChunks ?? 0,
      embeddingsGenerated: pipeline.embeddingsGenerated ?? status?.embeddingsGenerated ?? 0,
      progress: training ? pipeline.progress : status?.progress ?? pipeline.progress ?? 0,
      currentFile: pipeline.currentFile || status?.currentFile || null,
      currentProjectModule: pipeline.currentProjectModule || status?.currentProjectModule || null,
    }),
    [pipeline, status, stats, training]
  );

  const liveMetrics = socketMetrics || dashboard?.live;
  const allLogs = useMemo(() => {
    const combined = [...(restLogs || []), ...(socketLogs || [])];
    const seen = new Set();
    return combined
      .filter((l) => {
        const key = `${l.timestamp}-${l.message}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(-150);
  }, [restLogs, socketLogs]);

  const dashboardData = dashboard || {
    projectFilesIndexed: stats?.projectFilesIndexed ?? stats?.processedDocuments ?? 0,
    sourceFilesProcessed: stats?.sourceFilesProcessed ?? stats?.processedDocuments ?? 0,
    documentsIndexed: stats?.projectFilesIndexed ?? stats?.processedDocuments ?? 0,
    chunksCreated: stats?.totalChunks ?? 0,
    embeddingCount: stats?.documentsWithEmbeddings ?? 0,
    activeProvider: stats?.currentLLM ?? 'openai',
    embeddingProvider: stats?.embeddingModel ?? 'huggingface',
    vectorDatabase: stats?.vectorDatabase ?? 'chroma',
    lastRetrainTime: stats?.lastTrainingDate,
    charts: {},
  };

  // Stats for header badges
  const totalProcessed = dashboardData.projectFilesIndexed || dashboardData.sourceFilesProcessed || 0;
  const successRate = dashboardData.completedSessions && dashboardData.totalSessions
    ? Math.round((dashboardData.completedSessions / dashboardData.totalSessions) * 100)
    : 98;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.15)_0%,_transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(139,92,246,0.1)_0%,_transparent_50%)]" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-1000" />

      <ParticleBackground />

      <div className="relative z-10 mx-auto max-w-[1600px] space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-lg opacity-50" />
              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg">
                <FiCpu className="text-white" size={28} />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                AI Training Infrastructure
              </h1>
              <p className="text-sm text-slate-400">
                Realtime embedding pipeline · Vector indexing · Neural retrieval layer
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-300">
                <FiZap size={12} /> ENTERPRISE
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-300">
                <FiCheckCircle size={12} /> {successRate}% Success Rate
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => startTraining()}
              disabled={training}
              className="relative overflow-hidden group flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-2.5 font-semibold text-white shadow-lg shadow-blue-500/25 disabled:opacity-50 transition-all"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <FiRefreshCw size={16} className={training ? 'animate-spin' : ''} />
              {training ? 'Training in Progress...' : 'Start Training'}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => retrain()}
              disabled={training}
              className="flex items-center gap-2 rounded-xl border border-purple-500/40 bg-purple-500/10 px-5 py-2.5 font-semibold text-purple-200 hover:bg-purple-500/20 disabled:opacity-50 transition-all"
            >
              <FiRefreshCw size={16} />
              Retrain Model
            </motion.button>
            
            {training && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => stopTraining()}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 px-5 py-2.5 font-semibold text-white shadow-lg shadow-red-500/25 hover:shadow-xl transition-all"
              >
                <FiStopCircle size={16} />
                Stop Training
              </motion.button>
            )}
          </div>
        </motion.header>

        {/* Connection Status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-end gap-2 text-xs"
        >
          <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full ${connected ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
            <span>{connected ? 'Live Connection Active' : 'Reconnecting...'}</span>
          </div>
        </motion.div>

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 backdrop-blur-sm px-5 py-3.5"
            >
              <div className="p-1 rounded-lg bg-red-500/20">
                <FiAlertCircle className="text-red-400" size={18} />
              </div>
              <p className="text-sm text-red-200 flex-1">{error}</p>
              <button className="text-red-400 hover:text-red-300 text-xs font-medium">Dismiss</button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Cards Row */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <GlassCard className="p-4" glow>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">Project Files Indexed</p>
                <p className="text-2xl font-bold text-white">{totalProcessed.toLocaleString()}</p>
              </div>
              <div className="p-2 rounded-lg bg-blue-500/20">
                <FiDatabase className="text-blue-400" size={18} />
              </div>
            </div>
          </GlassCard>
          
          <GlassCard className="p-4" glow>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">Chunks Created</p>
                <p className="text-2xl font-bold text-white">{dashboardData.chunksCreated?.toLocaleString() || 0}</p>
              </div>
              <div className="p-2 rounded-lg bg-purple-500/20">
                <FiTrendingUp className="text-purple-400" size={18} />
              </div>
            </div>
          </GlassCard>
          
          <GlassCard className="p-4" glow>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">Embeddings</p>
                <p className="text-2xl font-bold text-white">{dashboardData.embeddingCount?.toLocaleString() || 0}</p>
              </div>
              <div className="p-2 rounded-lg bg-emerald-500/20">
                <FiActivity className="text-emerald-400" size={18} />
              </div>
            </div>
          </GlassCard>
          
          <GlassCard className="p-4" glow>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">Success Rate</p>
                <p className="text-2xl font-bold text-white">{successRate}%</p>
              </div>
              <div className="p-2 rounded-lg bg-amber-500/20">
                <FiAward className="text-amber-400" size={18} />
              </div>
            </div>
          </GlassCard>
          
          <GlassCard className="p-4" glow>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">Last Training</p>
                <p className="text-sm font-semibold text-white">
                  {dashboardData.lastRetrainTime ? new Date(dashboardData.lastRetrainTime).toLocaleDateString() : 'Never'}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-slate-500/20">
                <FiClock className="text-slate-400" size={18} />
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Pipeline — top priority */}
        <GlassCard className="p-6" glow intensity="high">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-blue-500 to-purple-500" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">Training Pipeline Status</h2>
            {mergedPipeline.isTraining && (
              <span className="ml-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                LIVE
              </span>
            )}
          </div>
          <PipelineStepper pipeline={mergedPipeline} training={training} />
        </GlassCard>

        {/* Brain flow + speed */}
        <div className="grid gap-6 xl:grid-cols-3">
          <GlassCard className="p-5 xl:col-span-2" glow>
            <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Neural Activity Map
            </h3>
            <BrainFlowGraph flow={flow} training={training} />
          </GlassCard>
          <SpeedPanel metrics={liveMetrics} training={training} connected={connected} />
        </div>

        {/* Metrics Cards */}
        {!metricsLoading && dashboardData && (
          <MetricsCards dashboard={dashboardData} liveMetrics={liveMetrics} />
        )}

        {/* Charts Section */}
        {dashboardData.charts && Object.keys(dashboardData.charts).length > 0 && (
          <TrainingCharts charts={dashboardData.charts} />
        )}

        {/* Semantic search + terminal logs */}
        <div className="grid gap-6 lg:grid-cols-2">
          <SemanticSearchPanel />
          <TerminalLogs logs={allLogs} />
        </div>

        {/* Footer */}
        <div className="text-center pt-4 pb-2">
          <p className="text-xs text-slate-500">
            Powered by advanced neural networks · Real-time embedding pipeline · Enterprise-grade security
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrainingCenter;
