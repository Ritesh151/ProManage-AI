import React from 'react';
import { motion } from 'framer-motion';
import { FiEdit2, FiTrash2, FiEye, FiFolder } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { formatCurrency, formatDate, statusColor, statusDot } from '../utils/formatters';

const ProjectTable = ({ projects, onEdit, onDelete }) => {
  const navigate = useNavigate();

  if (!projects || projects.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-50 rounded-full flex items-center justify-center">
          <FiFolder className="text-gray-300" size={28} />
        </div>
        <p className="text-lg font-semibold text-gray-400">No projects found</p>
        <p className="text-gray-400 text-sm mt-1">Create a project to get started</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 table-sticky-header">
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">#</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">ID</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Project</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Category</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Client</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Cost</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
              <th className="text-right px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {projects.map((project, i) => (
              <motion.tr
                key={project._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03, duration: 0.25 }}
                className={`group cursor-pointer transition-all duration-200 hover:bg-blue-50/40 ${
                  i % 2 === 1 ? 'bg-gray-50/30' : ''
                }`}
                onClick={() => navigate(`/proposal?id=${project._id}`)}
              >
                <td className="px-6 py-4">
                  <span className="text-sm font-mono text-gray-400">{project.srNo || i + 1}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-block px-2.5 py-1 text-xs font-mono font-semibold bg-primary/5 text-primary rounded-lg">
                    {project.projectId || ''}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-semibold text-text group-hover:text-primary transition-colors">
                      {project.projectName}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                      {project.description || ''}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-500">{project.category || ''}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-500">{project.clientName || ''}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-bold text-text">
                    {formatCurrency(project.cost)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`badge-status ${statusColor(project.status)}`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${statusDot(project.status)}`} />
                    {project.status || ''}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-400">
                  {formatDate(project.createdAt)}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate(`/proposal?id=${project._id}`); }}
                      className="p-2 hover:bg-blue-50 rounded-lg text-gray-400 hover:text-blue-600 transition-all"
                      title="View Proposal"
                    >
                      <FiEye size={16} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onEdit(project); }}
                      className="p-2 hover:bg-blue-50 rounded-lg text-gray-400 hover:text-blue-600 transition-all"
                      title="Edit"
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onDelete(project); }}
                      className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-all"
                      title="Delete"
                    >
                      <FiTrash2 size={16} />
                    </button>
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
