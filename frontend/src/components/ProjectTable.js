// src/components/ProjectTable.js
import React from 'react';
import { motion } from 'framer-motion';
import { FiEdit2, FiTrash2, FiEye, FiFolder, FiCalendar, FiMoreHorizontal } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { formatCurrency, formatDate, statusColor, statusDot } from '../utils/formatters';

const ProjectTable = ({ projects, onEdit, onDelete, onTimeline }) => {
  const navigate = useNavigate();

  if (!projects || projects.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20 backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 rounded-2xl border border-white/20 dark:border-slate-700/50"
      >
        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-pink-500/10 flex items-center justify-center">
          <FiFolder className="text-gray-400 dark:text-gray-500" size={32} />
        </div>
        <p className="text-lg font-semibold text-gray-500 dark:text-gray-400">No projects found</p>
        <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Create a project to get started</p>
      </motion.div>
    );
  }

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/20 dark:border-slate-700/50 bg-gradient-to-r from-blue-500/5 to-pink-500/5">
              <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">#</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Project</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Client</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cost</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
              <th className="text-right px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 dark:divide-slate-700/30">
            {projects.map((project, i) => (
              <motion.tr
                key={project._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03, duration: 0.3 }}
                whileHover={{ 
                  backgroundColor: "rgba(37, 99, 235, 0.04)",
                  transition: { duration: 0.2 }
                }}
                className="group cursor-pointer transition-all duration-200"
                onClick={() => navigate(`/proposal?id=${project._id}`)}
              >
                <td className="px-6 py-4">
                  <span className="text-sm font-mono text-gray-400 dark:text-gray-500">{project.srNo || i + 1}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-block px-2.5 py-1 text-xs font-mono font-semibold bg-gradient-to-r from-blue-500/10 to-pink-500/10 text-blue-600 dark:text-blue-400 rounded-lg">
                    {project.projectId || 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {project.projectName}
                    </p>
                    {project.description && (
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 line-clamp-1 max-w-xs">
                        {project.description}
                      </p>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{project.category || '—'}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{project.clientName || '—'}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-bold text-gray-900 dark:text-white bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    {formatCurrency(project.cost)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${statusColor(project.status)}`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${statusDot(project.status)}`} />
                    {project.status || '—'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(project.createdAt)}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => { e.stopPropagation(); navigate(`/proposal?id=${project._id}`); }}
                      className="p-2 rounded-lg hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-pink-500/10 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                      title="View Proposal"
                    >
                      <FiEye size={16} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => { e.stopPropagation(); onTimeline && onTimeline(project); }}
                      className="p-2 rounded-lg hover:bg-gradient-to-r hover:from-emerald-500/10 hover:to-teal-500/10 text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all"
                      title="View Timeline"
                    >
                      <FiCalendar size={16} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => { e.stopPropagation(); onEdit(project); }}
                      className="p-2 rounded-lg hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-indigo-500/10 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                      title="Edit"
                    >
                      <FiEdit2 size={16} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => { e.stopPropagation(); onDelete(project); }}
                      className="p-2 rounded-lg hover:bg-gradient-to-r hover:from-red-500/10 hover:to-orange-500/10 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-all"
                      title="Delete"
                    >
                      <FiTrash2 size={16} />
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectTable;