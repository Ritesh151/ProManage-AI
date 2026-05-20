import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiHome,
  FiFolder,
  FiFileText,
  FiChevronLeft,
  FiChevronRight,
  FiMessageSquare,
  FiBarChart2,
  FiDownload,
  FiCpu,
  FiDatabase,
  FiSearch,
  FiClock,
  FiSettings
} from 'react-icons/fi';
import { useApp } from '../context/AppContext';

const mainLinks = [
  { to: '/', icon: FiHome, label: 'Dashboard' },
  { to: '/projects', icon: FiFolder, label: 'Projects' },
  { to: '/proposal', icon: FiFileText, label: 'Proposal' },
  { to: '/analytics', icon: FiBarChart2, label: 'Analytics' },
  { to: '/export', icon: FiDownload, label: 'Export Center' },
  { to: '/ai', icon: FiMessageSquare, label: 'AI Assistant' },
];

const aiLinks = [
  { to: '/training', icon: FiCpu, label: 'Training Center' },
  { to: '/knowledge', icon: FiDatabase, label: 'Knowledge Base' },
  { to: '/search', icon: FiSearch, label: 'Semantic Search' },
  { to: '/training-history', icon: FiClock, label: 'Training History' },
];

const settingsLinks = [
  { to: '/settings', icon: FiSettings, label: 'Settings' },
];

const Sidebar = () => {
  const { sidebarOpen, setSidebarOpen } = useApp();

  return (
    <motion.aside
      initial={false}
      animate={{
        width: sidebarOpen ? 260 : 72
      }}
      transition={{
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }}
      className="
        h-screen
        fixed
        top-0
        left-0
        z-50
        flex
        flex-col
        bg-white
        border-r
        border-gray-100
        shadow-sm
        overflow-hidden
      "
    >
      {/* Logo Section */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-gray-100">
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <h1 className="text-lg font-semibold text-gray-900 tracking-tight">
                ProposalForge AI
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">
                Ritesh Gajjar
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="
            w-8
            h-8
            rounded-lg
            bg-gray-50
            flex
            items-center
            justify-center
            hover:bg-gray-100
            transition-all
            duration-200
            text-gray-500
            hover:text-gray-700
          "
        >
          {sidebarOpen ? (
            <FiChevronLeft size={16} />
          ) : (
            <FiChevronRight size={16} />
          )}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-6 space-y-6 overflow-y-auto">
        {/* Main Navigation */}
        <div className="space-y-1">
          {mainLinks.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `
                  relative
                  flex
                  items-center
                  gap-3
                  px-3
                  py-2.5
                  rounded-lg
                  transition-all
                  duration-200
                  ${isActive
                    ? `
                      bg-gray-100
                      text-gray-900
                      `
                    : `
                      text-gray-500
                      hover:bg-gray-50
                      hover:text-gray-700
                      `
                  }
                `
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={18} className="flex-shrink-0" />
                  <AnimatePresence>
                    {sidebarOpen && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="
                          text-sm
                          font-medium
                          whitespace-nowrap
                          overflow-hidden
                        "
                      >
                        {label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* AI System */}
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pt-4 border-t border-gray-200"
          >
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              AI System
            </p>
          </motion.div>
        )}
        <div className="space-y-1">
          {aiLinks.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `
                  relative
                  flex
                  items-center
                  gap-3
                  px-3
                  py-2.5
                  rounded-lg
                  transition-all
                  duration-200
                  ${isActive
                    ? `
                      bg-gray-100
                      text-gray-900
                      `
                    : `
                      text-gray-500
                      hover:bg-gray-50
                      hover:text-gray-700
                      `
                  }
                `
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={18} className="flex-shrink-0" />
                  <AnimatePresence>
                    {sidebarOpen && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="
                          text-sm
                          font-medium
                          whitespace-nowrap
                          overflow-hidden
                        "
                      >
                        {label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Settings */}
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pt-4 border-t border-gray-200"
          >
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              System
            </p>
          </motion.div>
        )}
        <div className="space-y-1">
          {settingsLinks.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `
                  relative
                  flex
                  items-center
                  gap-3
                  px-3
                  py-2.5
                  rounded-lg
                  transition-all
                  duration-200
                  ${isActive
                    ? `
                      bg-gray-100
                      text-gray-900
                      `
                    : `
                      text-gray-500
                      hover:bg-gray-50
                      hover:text-gray-700
                      `
                  }
                `
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={18} className="flex-shrink-0" />
                  <AnimatePresence>
                    {sidebarOpen && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="
                          text-sm
                          font-medium
                          whitespace-nowrap
                          overflow-hidden
                        "
                      >
                        {label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Footer Section */}
      <div className="px-4 py-5 border-t border-gray-100">
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="text-center"
            >
              <p className="text-xs text-gray-400">
                Made by Ritesh Gajjar
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
