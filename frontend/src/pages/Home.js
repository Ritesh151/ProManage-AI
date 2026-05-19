import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiFolder, FiCheckCircle, FiFileText, FiPlus } from 'react-icons/fi';
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
  'Total Projects': 'blue',
  'Active Projects': 'green',
  'Generated Proposals': 'purple',
  'Total Revenue': 'orange',
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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text tracking-tight">Dashboard</h1>
          <p className="text-secondary mt-1.5">Overview of your projects and metrics</p>
        </div>
        <button
          onClick={() => navigate('/projects')}
          className="btn-primary"
        >
          <FiPlus size={18} /> New Project
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
      >
        {dashLoading ? (
          <>
            <CardSkeleton /><CardSkeleton /><CardSkeleton /><CardSkeleton />
          </>
        ) : (
          stats.map((stat, i) => (
            <DashboardCard
              key={stat.label}
              title={stat.label}
              value={formatValue(stat.label, stat.value)}
              icon={iconMap[stat.label] || FiFolder}
              color={colorMap[stat.label] || 'blue'}
              index={i}
            />
          ))
        )}
      </motion.div>

      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-text">Recent Projects</h2>
          <button
            onClick={() => navigate('/projects')}
            className="text-sm font-medium text-primary hover:text-primary-dark transition-colors"
          >
            View all
          </button>
        </div>
        {loading ? (
          <TableSkeleton rows={5} />
        ) : (
          <ProjectTable
            projects={projects}
            onEdit={() => navigate('/projects')}
            onDelete={() => {}}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
