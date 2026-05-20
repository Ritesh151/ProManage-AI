import React from 'react';
import { motion } from 'framer-motion';
import { FiCpu, FiRefreshCw } from 'react-icons/fi';
import { PageHeader } from '../components/PageHeader';
import { TrainingStatusCard } from '../components/TrainingStatusCard';
import { useTraining } from '../hooks/useTraining';

const TrainingCenter = () => {
  const { status, training, startTraining, retrain } = useTraining();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Training Center"
        description="Train and manage your AI models"
        icon={FiCpu}
        actions={
          <button
            onClick={() => startTraining()}
            disabled={training}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            <FiRefreshCw size={18} />
            {training ? 'Training...' : 'Start Training'}
          </button>
        }
      />

      {/* Training Status */}
      {status && <TrainingStatusCard status={status} loading={training} />}

      {/* Training Information */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Training Information</h3>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              <span className="font-semibold">Training Process:</span> The AI system will scan all your project files, extract relevant information, create embeddings, and build a searchable knowledge base.
            </p>
          </div>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-900">
              <span className="font-semibold">Last Training:</span> {status?.lastTraining ? new Date(status.lastTraining).toLocaleString() : 'Never'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Training Tips */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tips for Better Training</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Ensure all project files are properly organized and named</span>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Include README files and documentation for better context</span>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Remove unnecessary files and folders before training</span>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Retrain periodically to keep the knowledge base updated</span>
          </li>
        </ul>
      </motion.div>
    </div>
  );
};

export default TrainingCenter;
