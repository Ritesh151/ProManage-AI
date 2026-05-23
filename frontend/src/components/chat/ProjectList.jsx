import React from 'react';
import { motion } from 'framer-motion';
import { FiFolder, FiInbox } from 'react-icons/fi';
import { ProjectCard } from './ProjectCard';

export const ProjectList = ({ projects = [], title }) => {
  if (!projects?.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-dashed border-white/10 bg-slate-800/30 backdrop-blur-md p-8 text-center"
      >
        <FiInbox className="mx-auto text-slate-600 mb-3" size={32} />
        <p className="text-sm font-medium text-slate-400">No projects found in database</p>
        <p className="text-[11px] text-slate-600 mt-1">Create a project to get started.</p>
      </motion.div>
    );
  }

  const header = title || `Projects Found: ${projects.length}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-full overflow-hidden"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="rounded-lg bg-violet-500/20 p-1.5">
          <FiFolder className="text-violet-400" size={16} />
        </div>
        <h3 className="text-sm font-bold text-white">{header}</h3>
      </div>
      <div className="grid gap-3">
        {projects.map((project, i) => (
          <ProjectCard key={project._id || i} project={project} index={i} />
        ))}
      </div>
    </motion.div>
  );
};
