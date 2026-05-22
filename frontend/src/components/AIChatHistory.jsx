// src/components/AIChatHistory.js
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiTrash2, FiMessageSquare, FiClock, FiStar } from 'react-icons/fi';

const AIChatHistory = ({ conversations, onSelectConversation, onClose, onDelete, selectedId }) => {
  const formatDate = (date) => {
    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) {
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (d.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100%', opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="fixed right-0 top-0 h-full w-96 backdrop-blur-xl bg-white/95 dark:bg-slate-900/95 shadow-2xl border-l border-white/20 dark:border-slate-700/50 z-50 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/20 dark:border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/10 to-pink-500/10">
              <FiMessageSquare className="text-blue-600 dark:text-blue-400" size={18} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white tracking-tight">Chat History</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {conversations.length} conversations
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-all"
          >
            <FiX size={18} />
          </motion.button>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {conversations.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-full text-center p-8"
            >
              <div className="w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-pink-500/10 flex items-center justify-center">
                <FiMessageSquare size={28} className="text-gray-400 dark:text-gray-500" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-medium">No conversations yet</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Start a new chat to see history</p>
            </motion.div>
          ) : (
            conversations.map((conv, index) => (
              <motion.div
                key={conv._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                whileHover={{ x: 4 }}
                className={`group relative rounded-xl transition-all duration-200 ${
                  selectedId === conv._id
                    ? 'bg-gradient-to-r from-blue-600/10 to-pink-500/10 border border-blue-200 dark:border-blue-800'
                    : 'hover:bg-gray-50 dark:hover:bg-slate-800 border border-transparent'
                }`}
              >
                <div
                  className="flex-1 p-4 cursor-pointer"
                  onClick={() => onSelectConversation(conv)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {selectedId === conv._id ? (
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-600 to-pink-500" />
                      ) : (
                        <FiMessageSquare size={14} className="text-gray-400 dark:text-gray-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {conv.lastQuery || 'New conversation'}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="flex items-center gap-1">
                          <FiClock size={10} className="text-gray-400" />
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(conv.createdAt)}
                          </span>
                        </div>
                        {conv.messages && conv.messages.length > 0 && (
                          <div className="flex items-center gap-1">
                            <FiStar size={10} className="text-yellow-500" />
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {conv.messages.length} messages
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete && onDelete(conv._id);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                  title="Delete conversation"
                >
                  <FiTrash2 size={14} />
                </motion.button>
              </motion.div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/20 dark:border-slate-700/50">
          <div className="flex items-center justify-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-600 to-pink-500" />
            <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500">
              Conversations are saved locally
            </p>
            <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-pink-500 to-blue-600" />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AIChatHistory;