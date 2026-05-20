import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiDatabase, FiSearch } from 'react-icons/fi';
import { PageHeader } from '../components/PageHeader';
import { KnowledgeCard } from '../components/KnowledgeCard';
import { EmptyState } from '../components/EmptyState';
import { useSearch } from '../hooks/useSearch';

const KnowledgeBase = () => {
  const { knowledgeBase, loading } = useSearch();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = knowledgeBase.filter((project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Knowledge Base"
        description="Browse indexed projects and their content"
        icon={FiDatabase}
      />

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <FiSearch className="absolute left-3 top-3 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </motion.div>

      {/* Projects Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={FiDatabase}
          title="No projects found"
          description="Start training to index your projects"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project) => (
            <KnowledgeCard key={project.id} project={project} />
          ))}
        </div>
      )}

      {/* Statistics */}
      {knowledgeBase.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Knowledge Base Statistics</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Total Projects</p>
              <p className="text-2xl font-bold text-gray-900">{knowledgeBase.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Files</p>
              <p className="text-2xl font-bold text-gray-900">
                {knowledgeBase.reduce((sum, p) => sum + p.fileCount, 0)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Chunks</p>
              <p className="text-2xl font-bold text-gray-900">
                {knowledgeBase.reduce((sum, p) => sum + p.chunkCount, 0)}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default KnowledgeBase;
