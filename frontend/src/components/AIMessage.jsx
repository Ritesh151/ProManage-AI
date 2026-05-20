import React from 'react';
import { motion } from 'framer-motion';
import { FiCopy, FiCheck } from 'react-icons/fi';
import { useState } from 'react';

export const AIMessage = ({ message }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, x: isUser ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-none'
            : message.isError
            ? 'bg-red-100 text-red-900 rounded-bl-none'
            : 'bg-gray-100 text-gray-900 rounded-bl-none'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
        {message.sources && message.sources.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-300 text-xs">
            <p className="font-semibold mb-1">Sources:</p>
            {message.sources.map((source, idx) => (
              <p key={idx} className="text-xs opacity-75">
                • {source}
              </p>
            ))}
          </div>
        )}
        {!isUser && !message.isError && (
          <button
            onClick={handleCopy}
            className="mt-2 p-1 hover:bg-gray-200 rounded transition-colors"
            title="Copy message"
          >
            {copied ? <FiCheck size={14} /> : <FiCopy size={14} />}
          </button>
        )}
      </div>
    </motion.div>
  );
};
