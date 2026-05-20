import React from 'react';
import { motion } from 'framer-motion';
import { FiSearch } from 'react-icons/fi';
import { PageHeader } from '../components/PageHeader';
import { SearchResultCard } from '../components/SearchResultCard';
import { EmptyState } from '../components/EmptyState';
import { useSearch } from '../hooks/useSearch';

const SemanticSearch = () => {
  const { results, loading, query, handleSearch, page, totalPages, goToPage } = useSearch();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Semantic Search"
        description="Search your knowledge base with AI-powered semantic understanding"
        icon={FiSearch}
      />

      {/* Search Input */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg border border-gray-200 p-6"
      >
        <div className="relative">
          <FiSearch className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Ask anything about your projects..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-lg"
          />
        </div>
      </motion.div>

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : results.length === 0 && query ? (
        <EmptyState
          icon={FiSearch}
          title="No results found"
          description="Try searching with different keywords"
        />
      ) : results.length === 0 ? (
        <EmptyState
          icon={FiSearch}
          title="Start searching"
          description="Enter a query to search your knowledge base"
        />
      ) : (
        <>
          <div className="space-y-3">
            {results.map((result) => (
              <SearchResultCard key={result.id} result={result} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center gap-2"
            >
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page === 1}
                className="px-3 py-2 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => goToPage(p)}
                  className={`px-3 py-2 rounded-lg ${
                    page === p
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => goToPage(page + 1)}
                disabled={page === totalPages}
                className="px-3 py-2 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50"
              >
                Next
              </button>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default SemanticSearch;
