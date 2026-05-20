import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiDatabase, FiSearch, FiRefreshCw } from 'react-icons/fi';
import { PageHeader } from '../components/PageHeader';
import { KnowledgeCard } from '../components/KnowledgeCard';
import { EmptyState } from '../components/EmptyState';
import { useSearch } from '../hooks/useSearch';

const KnowledgeBase = () => {
  const { knowledgeBase, stats, loading, error, refetchKnowledgeBase } = useSearch();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return knowledgeBase;
    return knowledgeBase.filter((project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [knowledgeBase, searchTerm]);

  if (loading && knowledgeBase.length === 0) {
    return (
      <div className="space-y-8">
        <PageHeader title="Knowledge Base" description="Browse indexed projects and their content" icon={FiDatabase} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 bg-gray-200 rounded" />
                <div className="h-5 bg-gray-200 rounded w-1/3" />
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div className="h-10 bg-gray-100 rounded" />
                <div className="h-10 bg-gray-100 rounded" />
              </div>
              <div className="h-4 bg-gray-100 rounded w-1/2 mt-3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error && knowledgeBase.length === 0) {
    return (
      <div className="space-y-8">
        <PageHeader title="Knowledge Base" description="Browse indexed projects and their content" icon={FiDatabase} />
        <div className="bg-white rounded-lg border border-red-200 p-8 text-center">
          <p className="text-red-600 text-lg font-medium mb-2">Knowledge service unavailable</p>
          <p className="text-gray-500 text-sm mb-4">{error}</p>
          <button
            onClick={refetchKnowledgeBase}
            className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors inline-flex items-center gap-2"
          >
            <FiRefreshCw size={14} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Knowledge Base"
        description="Browse indexed projects and their content"
        icon={FiDatabase}
        actions={
          <button
            onClick={refetchKnowledgeBase}
            disabled={loading}
            className="px-3 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <FiRefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        }
      />

      {/* Search */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative">
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
      {filtered.length === 0 ? (
        <EmptyState
          icon={FiDatabase}
          title={searchTerm ? 'No matching projects found' : 'No indexed projects found'}
          description={searchTerm ? 'Try a different search term' : 'Start training to index your projects'}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project) => (
            <KnowledgeCard key={project.id} project={project} />
          ))}
        </div>
      )}

      {/* Statistics */}
      {stats && stats.totalProjects > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Knowledge Base Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Total Projects</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProjects}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Files</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalFiles}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Chunks</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalChunks}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Chunks/Project</p>
              <p className="text-2xl font-bold text-gray-900">{stats.averageChunksPerProject}</p>
            </div>
          </div>
          {stats.lastTrainingTimestamp && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                Last trained:{' '}
                <span className="font-medium text-gray-900">
                  {new Date(stats.lastTrainingTimestamp).toLocaleString()}
                </span>
              </p>
              {stats.indexingRate !== undefined && (
                <p className="text-sm text-gray-600 mt-1">
                  Indexing rate:{' '}
                  <span className="font-medium text-gray-900">{stats.indexingRate}%</span>
                </p>
              )}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default KnowledgeBase;
