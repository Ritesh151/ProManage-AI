// src/components/Drawer.js
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiMaximize2, FiMinimize2 } from 'react-icons/fi';

const Drawer = ({ isOpen, onClose, title, children, width = 'max-w-[700px]', subtitle, icon: Icon }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'tween', duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className={`fixed right-0 top-0 h-full w-full ${isExpanded ? 'max-w-full' : width} backdrop-blur-xl bg-white/95 dark:bg-slate-900/95 shadow-2xl z-50 flex flex-col border-l border-white/20 dark:border-slate-700/50`}
          >
            {/* Gradient Header Border */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-pink-500" />

            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/20 dark:border-slate-700/50">
              <div className="flex items-center gap-3">
                {Icon && (
                  <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/10 to-pink-500/10">
                    <Icon className="text-blue-600 dark:text-blue-400" size={20} />
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                    {title}
                  </h2>
                  {subtitle && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {subtitle}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-all"
                  title={isExpanded ? 'Minimize' : 'Maximize'}
                >
                  {isExpanded ? <FiMinimize2 size={18} /> : <FiMaximize2 size={18} />}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-all"
                >
                  <FiX size={20} />
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {children}
            </div>

            {/* Footer Glow */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-blue-500/5 via-transparent to-transparent pointer-events-none" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Drawer;