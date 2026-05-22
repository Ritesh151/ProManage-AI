// src/components/Sidebar.js
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
  FiClock,
  FiSettings,
  FiBriefcase,
  FiTrendingUp,
  FiStar
} from 'react-icons/fi';
import { useApp } from '../context/AppContext';

const mainLinks = [
  { to: '/', icon: FiHome, label: 'Dashboard' },
  { to: '/projects', icon: FiFolder, label: 'Projects' },
  { to: '/proposal', icon: FiFileText, label: 'Proposal' },
  { to: '/scope-work', icon: FiBriefcase, label: 'Scope Of Work' },
  { to: '/analytics', icon: FiBarChart2, label: 'Analytics' },
  { to: '/export', icon: FiDownload, label: 'Export Center' },
  { to: '/ai', icon: FiMessageSquare, label: 'AI Assistant' },
];

const aiLinks = [
  { to: '/training', icon: FiCpu, label: 'Training Center' },
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
        width: sidebarOpen ? 280 : 80
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
        backdrop-blur-xl
        bg-white/70
        dark:bg-slate-900/70
        border-r
        border-white/20
        dark:border-slate-700/50
        shadow-2xl
        overflow-hidden
      "
    >
      {/* Logo Section */}
      <div className="flex items-center justify-between px-5 py-6 border-b border-white/20 dark:border-slate-700/50">
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-pink-500 bg-clip-text text-transparent">
                OptiMatrix
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Ritesh Gajjar
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="
            w-8
            h-8
            rounded-xl
            bg-gradient-to-br
            from-blue-500/10
            to-pink-500/10
            flex
            items-center
            justify-center
            hover:from-blue-500/20
            hover:to-pink-500/20
            transition-all
            duration-200
            text-gray-600
            dark:text-gray-300
          "
        >
          {sidebarOpen ? (
            <FiChevronLeft size={16} />
          ) : (
            <FiChevronRight size={16} />
          )}
        </motion.button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-8 space-y-8 overflow-y-auto">
        {/* Main Navigation */}
        <div className="space-y-1.5">
          {mainLinks.map(({ to, icon: Icon, label }, index) => (
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
                  rounded-xl
                  transition-all
                  duration-300
                  group
                  ${isActive
                    ? `
                      bg-gradient-to-r
                      from-blue-600/10
                      to-pink-500/10
                      text-gray-900
                      dark:text-white
                      shadow-sm
                      `
                    : `
                      text-gray-600
                      dark:text-gray-400
                      hover:bg-gradient-to-r
                      hover:from-blue-600/5
                      hover:to-pink-500/5
                      hover:text-gray-900
                      dark:hover:text-white
                      `
                  }
                `
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-pink-500/10 rounded-xl"
                      transition={{ type: "spring", duration: 0.5 }}
                    />
                  )}
                  <div className="relative z-10 flex items-center gap-3">
                    <div className={`
                      p-1.5 rounded-lg transition-all duration-300
                      ${isActive 
                        ? 'text-blue-600 dark:text-blue-400' 
                        : 'text-gray-500 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                      }
                    `}>
                      <Icon size={18} />
                    </div>
                    <AnimatePresence>
                      {sidebarOpen && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2 }}
                          className="
                            text-sm
                            font-semibold
                            whitespace-nowrap
                            overflow-hidden
                            tracking-tight
                          "
                        >
                          {label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* AI System Section */}
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pt-2"
          >
            <div className="px-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-pink-500/30 to-transparent" />
                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  AI Intelligence
                </p>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-pink-500/30 to-transparent" />
              </div>
            </div>
          </motion.div>
        )}
        
        {!sidebarOpen && (
          <div className="flex justify-center pt-2">
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-pink-500/30 to-transparent" />
          </div>
        )}

        <div className="space-y-1.5">
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
                  rounded-xl
                  transition-all
                  duration-300
                  group
                  ${isActive
                    ? `
                      bg-gradient-to-r
                      from-pink-500/10
                      to-purple-500/10
                      text-gray-900
                      dark:text-white
                      `
                    : `
                      text-gray-600
                      dark:text-gray-400
                      hover:bg-gradient-to-r
                      hover:from-pink-500/5
                      hover:to-purple-500/5
                      hover:text-gray-900
                      dark:hover:text-white
                      `
                  }
                `
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="activeAILink"
                      className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-xl"
                      transition={{ type: "spring", duration: 0.5 }}
                    />
                  )}
                  <div className="relative z-10 flex items-center gap-3">
                    <div className={`
                      p-1.5 rounded-lg transition-all duration-300
                      ${isActive 
                        ? 'text-pink-600 dark:text-pink-400' 
                        : 'text-gray-500 dark:text-gray-500 group-hover:text-pink-600 dark:group-hover:text-pink-400'
                      }
                    `}>
                      <Icon size={18} />
                    </div>
                    <AnimatePresence>
                      {sidebarOpen && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2 }}
                          className="
                            text-sm
                            font-semibold
                            whitespace-nowrap
                            overflow-hidden
                            tracking-tight
                          "
                        >
                          {label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* System Section */}
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pt-2"
          >
            <div className="px-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  System
                </p>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
              </div>
            </div>
          </motion.div>
        )}
        
        {!sidebarOpen && (
          <div className="flex justify-center pt-2">
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
          </div>
        )}

        <div className="space-y-1.5">
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
                  rounded-xl
                  transition-all
                  duration-300
                  group
                  ${isActive
                    ? `
                      bg-gradient-to-r
                      from-blue-600/10
                      to-indigo-500/10
                      text-gray-900
                      dark:text-white
                      `
                    : `
                      text-gray-600
                      dark:text-gray-400
                      hover:bg-gradient-to-r
                      hover:from-blue-600/5
                      hover:to-indigo-500/5
                      hover:text-gray-900
                      dark:hover:text-white
                      `
                  }
                `
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="activeSettingsLink"
                      className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-500/10 rounded-xl"
                      transition={{ type: "spring", duration: 0.5 }}
                    />
                  )}
                  <div className="relative z-10 flex items-center gap-3">
                    <div className={`
                      p-1.5 rounded-lg transition-all duration-300
                      ${isActive 
                        ? 'text-blue-600 dark:text-blue-400' 
                        : 'text-gray-500 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                      }
                    `}>
                      <Icon size={18} />
                    </div>
                    <AnimatePresence>
                      {sidebarOpen && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2 }}
                          className="
                            text-sm
                            font-semibold
                            whitespace-nowrap
                            overflow-hidden
                            tracking-tight
                          "
                        >
                          {label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Footer Section */}
      <div className="px-5 py-5 border-t border-white/20 dark:border-slate-700/50">
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="text-center"
            >
              <div className="flex items-center justify-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-600 to-pink-500" />
                <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500">
                  Made by Ritesh Gajjar
                </p>
                <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-pink-500 to-blue-600" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {!sidebarOpen && (
          <div className="flex justify-center">
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-600/10 to-pink-500/10 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-600 to-pink-500" />
            </div>
          </div>
        )}
      </div>
    </motion.aside>
  );
};

export default Sidebar;
