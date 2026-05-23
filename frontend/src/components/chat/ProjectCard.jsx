import React from 'react';
import { motion } from 'framer-motion';
import { FiFolder, FiClock, FiDollarSign, FiActivity, FiLayers, FiServer, FiDatabase, FiUser, FiHash } from 'react-icons/fi';
import { formatPrice } from '../../utils/currencyFormatter';

const formatCost = (cost) => {
  if (cost == null) return '—';
  return formatPrice(cost);
};

const STATUS_STYLES = {
  completed: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  active: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
  pending: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  'on hold': 'bg-orange-500/20 text-orange-300 border-orange-500/40',
  cancelled: 'bg-red-500/20 text-red-300 border-red-500/40',
  default: 'bg-violet-500/15 text-violet-200 border-violet-500/30',
};

export const ProjectCard = ({ project, index = 0 }) => {
  if (!project) return null;

  const tech = project.technologies || {};
  const statusKey = (project.status || '').toLowerCase();
  const statusStyle = STATUS_STYLES[statusKey] || STATUS_STYLES.default;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/60 via-slate-900/70 to-slate-800/40 backdrop-blur-xl p-4 sm:p-5 shadow-xl hover:border-violet-500/30 hover:shadow-violet-500/5 transition-all duration-300"
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="rounded-xl bg-gradient-to-br from-violet-600/30 to-blue-600/20 p-2.5 border border-violet-500/20 shrink-0">
          <FiFolder className="text-violet-400" size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-base font-bold text-white tracking-tight break-words mb-1">
            {project.projectName}
          </p>
          <div className="flex flex-wrap items-center gap-2 text-[11px]">
            {project.projectId && (
              <span className="inline-flex items-center gap-1 text-slate-400">
                <FiHash size={11} />
                {project.projectId}
              </span>
            )}
            {project.createdAt && (
              <span className="inline-flex items-center gap-1 text-slate-500">
                <FiClock size={11} />
                {new Date(project.createdAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
        <span className={`shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${statusStyle}`}>
          {project.status || 'Active'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {project.clientName && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/5 min-w-0">
            <FiUser className="text-cyan-400 shrink-0" size={13} />
            <div className="min-w-0">
              <p className="text-[9px] uppercase tracking-wider text-slate-500">Client</p>
              <p className="text-xs font-medium text-slate-200 truncate">{project.clientName}</p>
            </div>
          </div>
        )}
        {project.category && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/5 min-w-0">
            <FiActivity className="text-amber-400 shrink-0" size={13} />
            <div className="min-w-0">
              <p className="text-[9px] uppercase tracking-wider text-slate-500">Category</p>
              <p className="text-xs font-medium text-slate-200 truncate">{project.category}</p>
            </div>
          </div>
        )}
        {project.cost != null && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/5 min-w-0">
            <FiDollarSign className="text-emerald-400 shrink-0" size={13} />
            <div className="min-w-0">
              <p className="text-[9px] uppercase tracking-wider text-slate-500">Cost</p>
              <p className="text-xs font-medium text-slate-200">{formatCost(project.cost)}</p>
            </div>
          </div>
        )}
        {project.timeline && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/5 min-w-0">
            <FiClock className="text-purple-400 shrink-0" size={13} />
            <div className="min-w-0">
              <p className="text-[9px] uppercase tracking-wider text-slate-500">Timeline</p>
              <p className="text-xs font-medium text-slate-200 truncate">{project.timeline}</p>
            </div>
          </div>
        )}
      </div>

      {(tech.frontend?.length > 0 || tech.backend?.length > 0 || tech.database?.length > 0) && (
        <div className="mt-3 pt-3 border-t border-white/5">
          <div className="flex flex-wrap gap-x-4 gap-y-1.5">
            {tech.frontend?.length > 0 && (
              <span className="inline-flex items-center gap-1.5 text-[11px]">
                <FiLayers className="text-blue-400 shrink-0" size={12} />
                <span className="text-slate-400">Frontend:</span>
                <span className="text-slate-300">{tech.frontend.join(', ')}</span>
              </span>
            )}
            {tech.backend?.length > 0 && (
              <span className="inline-flex items-center gap-1.5 text-[11px]">
                <FiServer className="text-green-400 shrink-0" size={12} />
                <span className="text-slate-400">Backend:</span>
                <span className="text-slate-300">{tech.backend.join(', ')}</span>
              </span>
            )}
            {tech.database?.length > 0 && (
              <span className="inline-flex items-center gap-1.5 text-[11px]">
                <FiDatabase className="text-orange-400 shrink-0" size={12} />
                <span className="text-slate-400">Database:</span>
                <span className="text-slate-300">{tech.database.join(', ')}</span>
              </span>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};
