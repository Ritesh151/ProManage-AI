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
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-50 via-white to-gray-100">

      {/* Header */}

      <motion.div
        initial={{
          opacity: 0,
          y: -30
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        className="
        flex
        flex-col
        md:flex-row
        md:items-center
        md:justify-between
        gap-5
        mb-10
        "
      >
        <div>

          <h1
            className="
            text-4xl
            font-bold
            bg-gradient-to-r
            from-blue-600
            via-purple-600
            to-pink-500
            bg-clip-text
            text-transparent
            "
          >
            Dashboard
          </h1>

          <p className="mt-2 text-gray-500 text-sm">
            Monitor projects, revenue and proposal activity
          </p>

        </div>

        <button
          onClick={() => navigate('/projects')}
          className="
          flex
          items-center
          gap-3
          px-6
          py-4
          rounded-2xl
          text-white
          font-medium
          bg-gradient-to-r
          from-blue-600
          to-purple-600
          shadow-xl
          hover:scale-105
          hover:shadow-2xl
          transition-all
          duration-300
          "
        >
          <FiPlus size={20} />
          New Project
        </button>

      </motion.div>

      {/* Statistics Cards */}

      <motion.div
        initial={{
          opacity: 0,
          y: 20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          duration: .5
        }}
        className="
        grid
        grid-cols-1
        sm:grid-cols-2
        xl:grid-cols-4
        gap-6
        mb-10
        "
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
              whileHover={{
                y: -8
              }}
              transition={{
                duration: .3
              }}
              className="
              backdrop-blur-xl
              bg-white/80
              rounded-3xl
              border
              border-white
              shadow-xl
              overflow-hidden
              "
            >

              <DashboardCard
                title={stat.label}
                value={formatValue(
                  stat.label,
                  stat.value
                )}
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
        initial={{
          opacity: 0,
          y: 25
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          delay: .3
        }}
        className="
        bg-white/80
        backdrop-blur-xl
        rounded-[35px]
        border
        border-white
        shadow-2xl
        p-8
        "
      >

        <div
          className="
          flex
          items-center
          justify-between
          mb-8
          "
        >

          <div>

            <h2
              className="
              text-2xl
              font-bold
              text-gray-800
              "
            >
              Recent Projects
            </h2>

            <p
              className="
              text-sm
              text-gray-500
              mt-1
              "
            >
              Latest created projects overview
            </p>

          </div>

          <button
            onClick={() => navigate('/projects')}
            className="
            px-5
            py-3
            rounded-xl
            bg-gray-100
            text-gray-700
            font-medium
            hover:bg-gradient-to-r
            hover:from-blue-500
            hover:to-purple-500
            hover:text-white
            transition-all
            duration-300
            "
          >
            View All
          </button>

        </div>

        {loading ? (
          <TableSkeleton rows={5} />
        ) : (
          <div
            className="
            rounded-3xl
            overflow-hidden
            "
          >
            <ProjectTable
              projects={projects}
              onEdit={() =>
                navigate('/projects')
              }
              onDelete={() => { }}
            />
          </div>
        )}

      </motion.div>

    </div>
  );
};

export default Home;