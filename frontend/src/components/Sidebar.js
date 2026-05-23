// src/components/Sidebar.js
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
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
  FiZap,
  FiActivity,
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
  {
    to: '/training',
    icon: FiCpu,
    label: 'AI Training Hub',
    badge: 'LIVE',
    description: 'ProposalForge codebase',
    highlight: true,
  },
  { to: '/training-history', icon: FiClock, label: 'Training History' },
];

const settingsLinks = [
  { to: '/settings', icon: FiSettings, label: 'Settings' },
];

const NavItem = ({ to, icon: Icon, label, badge, description, highlight, sidebarOpen, layoutId }) => (
  <NavLink
    to={to}
    end={to === '/'}
    className={({ isActive }) =>
      `
        relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group
        ${isActive
          ? highlight
            ? 'text-white'
            : 'text-gray-900 dark:text-white'
          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
        }
      `
    }
  >
    {({ isActive }) => (
      <>
        {isActive && (
          <motion.div
            layoutId={layoutId}
            className={`absolute inset-0 rounded-xl ${
              highlight
                ? 'bg-gradient-to-r from-blue-600/20 via-purple-600/15 to-cyan-500/20 border border-blue-500/20 shadow-lg shadow-blue-500/10'
                : 'bg-gradient-to-r from-blue-600/10 to-pink-500/10'
            }`}
            transition={{ type: 'spring', duration: 0.5 }}
          />
        )}
        <div className="relative z-10 flex min-w-0 flex-1 items-center gap-3">
          <div
            className={`shrink-0 rounded-lg p-1.5 transition-all duration-300 ${
              isActive
                ? highlight
                  ? 'bg-gradient-to-br from-blue-500/30 to-purple-500/30 text-cyan-300'
                  : 'text-blue-600 dark:text-blue-400'
                : highlight
                ? 'text-blue-500/70 group-hover:text-cyan-400'
                : 'text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400'
            }`}
          >
            <Icon size={18} />
          </div>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="min-w-0 flex-1 overflow-hidden"
              >
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-semibold tracking-tight">{label}</span>
                  {badge && (
                    <span className="inline-flex items-center gap-0.5 rounded-md bg-emerald-500/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-500 dark:text-emerald-400 border border-emerald-500/20">
                      <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                      {badge}
                    </span>
                  )}
                </div>
                {description && (
                  <p className="truncate text-[10px] text-slate-500 dark:text-slate-500 mt-0.5">
                    {description}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </>
    )}
  </NavLink>
);

const Sidebar = () => {
  const { sidebarOpen, setSidebarOpen } = useApp();
  const location = useLocation();
  const isTrainingPage = location.pathname === '/training';

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarOpen ? 280 : 80 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="
        h-screen fixed top-0 left-0 z-50 flex flex-col
        backdrop-blur-xl bg-white/70 dark:bg-slate-900/70
        border-r border-white/20 dark:border-slate-700/50 shadow-2xl overflow-hidden
      "
    >
      {/* Logo */}
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
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Ritesh Gajjar</p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500/10 to-pink-500/10 flex items-center justify-center hover:from-blue-500/20 hover:to-pink-500/20 transition-all text-gray-600 dark:text-gray-300"
          aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {sidebarOpen ? <FiChevronLeft size={16} /> : <FiChevronRight size={16} />}
        </motion.button>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-6 overflow-y-auto custom-scrollbar">
        {/* Main */}
        <div className="space-y-1">
          {mainLinks.map((link) => (
            <NavItem
              key={link.to}
              {...link}
              sidebarOpen={sidebarOpen}
              layoutId="activeNav"
            />
          ))}
        </div>

        {/* AI Infrastructure */}
        {sidebarOpen ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
              <div className="flex items-center gap-1.5">
                <FiZap size={10} className="text-cyan-500" />
                <p className="text-[10px] font-bold text-cyan-600/80 dark:text-cyan-400/80 uppercase tracking-wider">
                  AI Infrastructure
                </p>
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
            </div>
            {isTrainingPage && (
              <div className="mb-2 rounded-lg border border-blue-500/20 bg-blue-500/5 px-3 py-2">
                <div className="flex items-center gap-2 text-[10px] text-blue-600 dark:text-blue-400">
                  <FiActivity size={12} className="animate-pulse" />
                  <span className="font-semibold">Training pipeline active view</span>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <div className="flex justify-center">
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
          </div>
        )}

        <div className="space-y-1">
          {aiLinks.map((link) => (
            <NavItem
              key={link.to}
              {...link}
              sidebarOpen={sidebarOpen}
              layoutId="activeAILink"
            />
          ))}
        </div>

        {/* System */}
        {sidebarOpen ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
              <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                System
              </p>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
            </div>
          </motion.div>
        ) : (
          <div className="flex justify-center">
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
          </div>
        )}

        <div className="space-y-1">
          {settingsLinks.map((link) => (
            <NavItem
              key={link.to}
              {...link}
              sidebarOpen={sidebarOpen}
              layoutId="activeSettingsLink"
            />
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="px-5 py-5 border-t border-white/20 dark:border-slate-700/50">
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center space-y-2"
            >
              <div className="flex items-center justify-center gap-1.5 rounded-lg bg-slate-800/5 dark:bg-white/5 py-2 px-3">
                <FiCpu size={12} className="text-blue-500" />
                <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400">
                  ChromaDB · Embeddings · RAG
                </p>
              </div>
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
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600/10 to-purple-500/10 flex items-center justify-center">
              <FiZap size={14} className="text-cyan-500" />
            </div>
          </div>
        )}
      </div>
    </motion.aside>
  );
};

export default Sidebar;
