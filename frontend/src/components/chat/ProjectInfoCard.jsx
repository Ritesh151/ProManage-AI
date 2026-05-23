import React from 'react';
import { motion } from 'framer-motion';
import { FiFolder } from 'react-icons/fi';
import { InfoBadge } from './InfoBadge';
import { formatPrice } from '../../utils/currencyFormatter';

const formatCost = (cost) => {
  if (cost == null) return null;
  return formatPrice(cost);
};

export const ProjectInfoCard = ({ project, title = 'Project Details', compact = false, index = 0 }) => {
  if (!project?.projectName) return null;

  const fields = [
    { label: 'Status', value: project.status, variant: 'status' },
    { label: 'Category', value: project.category || project.projectCategory?.name },
    { label: 'Cost', value: formatCost(project.cost) },
    { label: 'Timeline', value: project.timeline },
    { label: 'Client', value: project.clientName },
    { label: 'Company', value: project.companyName },
    { label: 'Branch', value: project.branch },
    { label: 'Pages', value: project.numberOfPages != null ? String(project.numberOfPages) : null },
  ].filter((f) => f.value);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      whileHover={{ scale: compact ? 1 : 1.01 }}
      className="rounded-2xl border border-white/10 bg-gradient-to-br from-violet-950/40 via-slate-900/70 to-blue-950/40 backdrop-blur-xl p-4 sm:p-5 shadow-xl shadow-violet-500/5"
    >
      <div className="flex items-center gap-2 mb-4">
        <FiFolder className="text-violet-400" size={18} />
        <h3 className="text-sm font-bold text-white">{title}</h3>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-4 rounded-xl border border-violet-500/25 bg-gradient-to-r from-violet-600/20 to-blue-600/15 px-4 py-3 text-center"
      >
        <p className="text-base sm:text-lg font-bold text-white tracking-tight break-words">
          {project.projectName}
        </p>
      </motion.div>

      {fields.length > 0 && (
        <div className={`grid gap-3 ${compact ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
          {fields.map((f, i) => (
            <InfoBadge key={f.label} label={f.label} value={f.value} variant={f.variant} index={i} />
          ))}
        </div>
      )}
    </motion.div>
  );
};
