import React from 'react';
import { motion } from 'framer-motion';
import { FiFolder, FiCalendar, FiDollarSign, FiActivity } from 'react-icons/fi';

export const ProjectCards = ({ projects = [] }) => {
  if (!projects.length) return null;

  return (
    <div className="mt-3 grid gap-2 sm:grid-cols-2">
      {projects.map((p, i) => (
        <motion.div
          key={p._id || i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04 }}
          className="rounded-xl border border-white/10 bg-slate-800/60 p-3 hover:border-blue-500/30 transition-colors"
        >
          <div className="flex items-start gap-2">
            <div className="rounded-lg bg-blue-500/20 p-1.5">
              <FiFolder className="text-blue-400" size={14} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-white text-sm truncate">{p.projectName}</p>
              <p className="text-[10px] text-slate-500 truncate">{p.clientName || p.companyName}</p>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap gap-2 text-[10px] text-slate-400">
            <span className="inline-flex items-center gap-1">
              <FiActivity size={10} />
              {p.status || 'Active'}
            </span>
            {p.cost != null && (
              <span className="inline-flex items-center gap-1">
                <FiDollarSign size={10} />
                ₹{p.cost}
              </span>
            )}
            {p.createdAt && (
              <span className="inline-flex items-center gap-1">
                <FiCalendar size={10} />
                {new Date(p.createdAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};
