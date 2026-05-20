import React from 'react';
import { motion } from 'framer-motion';
import { AIMessage } from './AIMessage';

export const AIChatWindow = ({ messages }) => {
  return (
    <div className="space-y-4">
      {messages.map((message, index) => (
        <motion.div
          key={message.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <AIMessage message={message} />
        </motion.div>
      ))}
    </div>
  );
};
