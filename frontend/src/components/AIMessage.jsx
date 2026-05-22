// src/components/AIMessage.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCopy, FiCheck, FiUser, FiCpu, FiClock, FiBookOpen } from 'react-icons/fi';

export const AIMessage = ({ message, index = 0 }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isUser = message.role === 'user';
  const isError = message.isError;

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: isUser ? 20 : -20, y: 10 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`flex gap-3 max-w-[80%] lg:max-w-[70%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${
          isUser 
            ? 'bg-gradient-to-br from-blue-600 to-indigo-600' 
            : isError
            ? 'bg-gradient-to-br from-red-600 to-orange-600'
            : 'bg-gradient-to-br from-purple-600 to-pink-600'
        } shadow-md`}>
          {isUser ? (
            <FiUser size={14} className="text-white" />
          ) : (
            <FiCpu size={14} className="text-white" />
          )}
        </div>

        {/* Message Bubble */}
        <div className="flex-1">
          <div className={`relative px-5 py-3 rounded-2xl shadow-md ${
            isUser
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none'
              : isError
              ? 'bg-gradient-to-r from-red-500/10 to-orange-500/10 backdrop-blur-xl border border-red-200 dark:border-red-800/30 text-red-900 dark:text-red-200 rounded-tl-none'
              : 'backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-tl-none shadow-lg'
          }`}>
            {/* Message Content */}
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
              {message.content}
            </p>

            {/* Response Time Badge */}
            {!isUser && message.responseTime && !isError && (
              <div className="flex items-center gap-1 mt-2 pt-2 border-t border-white/20 dark:border-gray-700/50">
                <FiClock size={10} className="opacity-60" />
                <span className="text-[10px] opacity-60">
                  Response time: {message.responseTime}ms
                </span>
              </div>
            )}

            {/* Sources Section */}
            {message.sources && message.sources.length > 0 && !isError && (
              <div className="mt-3 pt-2 border-t border-white/20 dark:border-gray-700/50">
                <div className="flex items-center gap-1.5 mb-2">
                  <FiBookOpen size={11} className="opacity-70" />
                  <p className="text-[10px] font-semibold uppercase tracking-wider opacity-70">
                    Sources
                  </p>
                </div>
                <div className="space-y-1">
                  {message.sources.map((source, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-current opacity-50" />
                      <p className="text-[10px] opacity-70 break-all">
                        {source}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Timestamp and Actions */}
          <div className={`flex items-center gap-2 mt-1 ${isUser ? 'justify-end' : 'justify-start'}`}>
            {message.timestamp && (
              <span className="text-[10px] text-gray-400 dark:text-gray-500">
                {formatTime(message.timestamp)}
              </span>
            )}
            
            {!isUser && !isError && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCopy}
                className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all"
                title="Copy message"
              >
                {copied ? <FiCheck size={12} /> : <FiCopy size={12} />}
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AIMessage;