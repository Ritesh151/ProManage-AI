import React from 'react';
import { motion } from 'framer-motion';
import { FiLayers, FiServer, FiDatabase, FiTool } from 'react-icons/fi';

const ICONS = {
  Frontend: FiLayers,
  Backend: FiServer,
  Database: FiDatabase,
  'Tools & Services': FiTool,
};

export const TechnologySections = ({ sections = [], projectName }) => {
  if (!sections.length) return null;

  return (
    <div className="mt-3 space-y-2">
      {projectName && (
        <p className="text-xs font-semibold text-cyan-400/90 uppercase tracking-wider">{projectName}</p>
      )}
      {sections.map((sec, i) => {
        const Icon = ICONS[sec.label] || FiLayers;
        return (
          <motion.div
            key={sec.label}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl border border-white/10 bg-slate-800/50 p-3"
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon className="text-purple-400" size={14} />
              <span className="text-sm font-semibold text-white">{sec.label}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {sec.items.map((item) => (
                <span
                  key={item}
                  className="px-2 py-0.5 rounded-md bg-blue-500/15 text-blue-300 text-xs border border-blue-500/20"
                >
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
