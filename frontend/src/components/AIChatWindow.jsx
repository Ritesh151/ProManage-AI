// src/components/AIChatWindow.js
import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AIMessage } from './AIMessage';
import { FiMessageSquare } from 'react-icons/fi';

export const AIChatWindow = ({ messages }) => {
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!messages || messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
        <div className="w-20 h-20 mb-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-pink-500/10 flex items-center justify-center">
          <FiMessageSquare size={32} className="text-gray-400 dark:text-gray-500" />
        </div>
        <p className="text-gray-500 dark:text-gray-400 font-medium">No messages yet</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Start a conversation by typing a message below</p>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="flex flex-col space-y-4 pb-4 min-h-[400px] max-h-[calc(100vh-300px)] overflow-y-auto custom-scrollbar"
    >
      <AnimatePresence mode="popLayout">
        {messages.map((message, index) => (
          <motion.div
            key={message.id || index}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ 
              duration: 0.3, 
              delay: index * 0.03,
              ease: [0.4, 0, 0.2, 1]
            }}
          >
            <AIMessage message={message} index={index} />
          </motion.div>
        ))}
      </AnimatePresence>
      
      {/* Typing Indicator Placeholder - to be used by parent */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default AIChatWindow;
