import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiDownload } from 'react-icons/fi';
import { PageHeader } from '../components/PageHeader';
import { EmptyState } from '../components/EmptyState';
import { useTraining } from '../hooks/useTraining';

const TrainingHistory = () => {
  const { history, loading } = useTraining();
  const [sortBy, setSortBy] = useState('date');

  const sorted = [...history].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.startTime) - new Date(a.startTime);
    }
    return 0;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Training History"
        description="View past training sessions and their results"
        icon={FiClock}
        actions={
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="date">Sort by Date</option>
            <option value="status">Sort by Status</option>
          </select>
        }
      />

      {/* History Table */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : history.length === 0 ? (
        <EmptyState
          icon={FiClock}
          title="No training history"
          description="Start training to see history"
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg border border-gray-200 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Start Time</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">End Time</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Files</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Chunks</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sorted.map((session) => {
                  const duration = new Date(session.endTime) - new Date(session.startTime);
                  const minutes = Math.floor(duration / 60000);
                  const seconds = Math.floor((duration % 60000) / 1000);

                  return (
                    <tr key={session.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(session.startTime).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(session.endTime).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                          {session.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{session.filesProcessed}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{session.chunksCreated}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {minutes}m {seconds}s
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Export History */}
      {history.length > 0 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          <FiDownload size={18} />
          Export History
        </motion.button>
      )}
    </div>
  );
};

export default TrainingHistory;
