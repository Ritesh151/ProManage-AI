import React from 'react';
import { motion } from 'framer-motion';
import { FiCpu } from 'react-icons/fi';
import { FeatureChip } from './FeatureChip';

const LABEL_MAP = {
  Frontend: 'Frontend',
  'Frontend Technologies': 'Frontend',
  Backend: 'Backend',
  'Backend Technologies': 'Backend',
  Database: 'Database',
  Tools: 'Tools',
  'Other Tools': 'Tools',
};

export const TechnologyCard = ({ sections = [], technologies, projectName, index = 0 }) => {
  let groups = sections?.length
    ? sections
    : [];

  if (!groups.length && technologies) {
    const t = technologies;
    groups = [
      { label: 'Frontend', items: t.frontend },
      { label: 'Backend', items: t.backend },
      { label: 'Database', items: t.database },
      { label: 'Tools', items: t.tools || t.other },
    ].filter((g) => g.items?.length);
  }

  const hasAny = groups.some((g) => g.items?.length);
  if (!hasAny) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="rounded-2xl border border-white/10 bg-slate-800/40 backdrop-blur-md p-4"
      >
        <div className="flex items-center gap-2 mb-2">
          <FiCpu className="text-purple-400" size={16} />
          <h4 className="text-sm font-semibold text-white">Technologies</h4>
        </div>
        <p className="text-sm text-slate-500 italic">No technologies available</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="rounded-2xl border border-white/10 bg-gradient-to-br from-purple-950/30 via-slate-900/60 to-blue-950/30 backdrop-blur-md p-4 space-y-4"
    >
      <div className="flex items-center gap-2">
        <FiCpu className="text-purple-400" size={16} />
        <h4 className="text-sm font-semibold text-white">Technologies</h4>
        {projectName && (
          <span className="text-[10px] text-slate-500 truncate hidden sm:inline">· {projectName}</span>
        )}
      </div>
      {groups.map((group, gi) => {
        const items = (group.items || []).filter(Boolean);
        if (!items.length) return null;
        const title = LABEL_MAP[group.label] || group.label;
        return (
          <motion.div
            key={title}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: gi * 0.06 }}
            className="space-y-2"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400/90">{title}</p>
            <div className="flex flex-wrap gap-2">
              {items.map((item, i) => (
                <FeatureChip key={`${title}-${item}`} label={item} index={i} />
              ))}
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};
