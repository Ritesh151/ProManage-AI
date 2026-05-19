import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHome, FiFolder, FiFileText, FiDownload, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { FaCalculator } from 'react-icons/fa';
import { useApp } from '../context/AppContext';

const links = [
  { to: '/', icon: FiHome, label: 'Home' },
  { to: '/projects', icon: FiFolder, label: 'Projects' },
  { to: '/calculator', icon: FaCalculator, label: 'Calculator' },
  { to: '/proposal', icon: FiFileText, label: 'Proposal' },
  { to: '/export', icon: FiDownload, label: 'Export' },
];

const Sidebar = () => {
  const { sidebarOpen, setSidebarOpen } = useApp();

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarOpen ? 260 : 72 }}
      className="h-screen bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 z-50 sidebar-transition shadow-sm"
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <AnimatePresence>
          {sidebarOpen && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xl font-bold text-primary"
            >
              Ritesh Gajjar : PMS
            </motion.span>
          )}
        </AnimatePresence>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 text-secondary"
        >
          {sidebarOpen ? <FiChevronLeft size={20} /> : <FiChevronRight size={20} />}
        </button>
      </div>

      <nav className="flex-1 py-4 space-y-1 px-2">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${isActive
                ? 'bg-primary text-white shadow-md'
                : 'text-secondary hover:bg-gray-100 hover:text-text'
              }`
            }
          >
            <Icon size={20} />
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="text-sm font-medium whitespace-nowrap overflow-hidden"
                >
                  {label}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        {sidebarOpen && (
          <p className="text-xs text-secondary text-center">v1.0.0</p>
        )}
      </div>
    </motion.aside>
  );
};

export default Sidebar;
