import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FiFolder,
  FiCheckCircle,
  FiFileText,
  FiPlus
} from 'react-icons/fi';
import { FaRupeeSign } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import DashboardCard from '../components/DashboardCard';
import ProjectTable from '../components/ProjectTable';
import { useApp } from '../context/AppContext';
import { useDashboard } from '../hooks/useDashboard';
import { CardSkeleton, TableSkeleton } from '../components/Loader';
import { formatCurrency } from '../utils/formatters';

const iconMap = {
  'Total Projects': FiFolder,
  'Active Projects': FiCheckCircle,
  'Generated Proposals': FiFileText,
  'Total Revenue': FaRupeeSign,
};

const colorMap = {
  'Total Projects': 'gray',
  'Active Projects': 'gray',
  'Generated Proposals': 'gray',
  'Total Revenue': 'gray',
};

const formatValue = (label, value) => {
  if (label === 'Total Revenue') return formatCurrency(value);
  return value;
};

const Home = () => {
  const { projects, loading, fetchProjects } = useApp();
  const { stats, loading: dashLoading } = useDashboard();

  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects({ limit: 5 });
  }, [fetchProjects]);

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8"
      >
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
            Dashboard
          </h1>
          <p className="mt-1 text-gray-500 text-sm">
            Monitor projects, revenue and proposal activity
          </p>
        </div>

        <button
          onClick={() => navigate('/projects')}
          className="
            flex
            items-center
            gap-2
            px-4
            py-2
            rounded-lg
            bg-gray-900
            text-white
            font-medium
            text-sm
            hover:bg-gray-800
            transition-all
            duration-200
            shadow-sm
          "
        >
          <FiPlus size={16} />
          New Project
        </button>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8"
      >
        {dashLoading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : (
          stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
            >
              <DashboardCard
                title={stat.label}
                value={formatValue(stat.label, stat.value)}
                icon={iconMap[stat.label]}
                color={colorMap[stat.label]}
                index={i}
              />
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Projects Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl border border-gray-100 shadow-sm"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Projects
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Latest created projects overview
            </p>
          </div>

          <button
            onClick={() => navigate('/projects')}
            className="
              px-3
              py-1.5
              rounded-md
              bg-gray-50
              text-gray-600
              text-sm
              font-medium
              hover:bg-gray-100
              transition-all
              duration-200
            "
          >
            View All
          </button>
        </div>

        <div className="p-6 pt-0">
          {loading ? (
            <TableSkeleton rows={5} />
          ) : (
            <div className="overflow-hidden">
              <ProjectTable
                projects={projects}
                onEdit={() => navigate('/projects')}
                onDelete={() => {}}
              />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
