// src/components/EmptyState.js
import React from 'react';
import { motion } from 'framer-motion';
import { FiInbox, FiFolder, FiSearch, FiFileText, FiDatabase, FiCpu, FiMessageSquare } from 'react-icons/fi';

const iconMap = {
  inbox: FiInbox,
  folder: FiFolder,
  search: FiSearch,
  file: FiFileText,
  database: FiDatabase,
  cpu: FiCpu,
  message: FiMessageSquare,
};

export const EmptyState = ({ 
  icon = 'inbox', 
  title, 
  description, 
  action,
  size = 'md',
  variant = 'default'
}) => {
  const IconComponent = typeof icon === 'string' ? iconMap[icon] || FiInbox : icon;
  
  const sizeClasses = {
    sm: {
      wrapper: 'p-3',
      icon: 28,
      title: 'text-base',
      description: 'text-xs'
    },
    md: {
      wrapper: 'p-4',
      icon: 40,
      title: 'text-lg',
      description: 'text-sm'
    },
    lg: {
      wrapper: 'p-6',
      icon: 56,
      title: 'text-2xl',
      description: 'text-base'
    }
  };

  const variantClasses = {
    default: {
      bg: 'from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50',
      border: 'border-gray-200/60 dark:border-gray-700/30',
      iconBg: 'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700',
      text: 'text-gray-400 dark:text-gray-500'
    },
    primary: {
      bg: 'from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30',
      border: 'border-blue-200/60 dark:border-blue-800/30',
      iconBg: 'bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30',
      text: 'text-blue-400 dark:text-blue-500'
    },
    gradient: {
      bg: 'from-blue-500/5 to-pink-500/5',
      border: 'border-blue-200/30 dark:border-blue-800/20',
      iconBg: 'bg-gradient-to-br from-blue-500/10 to-pink-500/10',
      text: 'text-blue-500 dark:text-blue-400'
    }
  };

  const styles = variantClasses[variant] || variantClasses.default;
  const sizes = sizeClasses[size] || sizeClasses.md;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="relative overflow-hidden"
    >
      {/* Animated Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${styles.bg} rounded-2xl`} />
      
      {/* Floating Blur Effects */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" />
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-1000" />

      <div className={`relative flex flex-col items-center justify-center py-12 px-6 rounded-2xl border ${styles.border} backdrop-blur-sm`}>
        {/* Icon Container */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, type: "spring", bounce: 0.5 }}
          className={`relative ${sizes.wrapper} rounded-2xl ${styles.iconBg} mb-4`}
        >
          <IconComponent size={sizes.icon} className={styles.text} />
          
          {/* Pulse Ring */}
          <div className="absolute inset-0 rounded-2xl border-2 border-current opacity-20 animate-ping" />
        </motion.div>

        {/* Title */}
        <motion.h3 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`${sizes.title} font-bold text-gray-900 dark:text-white text-center tracking-tight mb-2`}
        >
          {title}
        </motion.h3>

        {/* Description */}
        {description && (
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className={`${sizes.description} text-gray-500 dark:text-gray-400 text-center max-w-md mb-6`}
          >
            {description}
          </motion.p>
        )}

        {/* Action Button */}
        {action && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {action}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default EmptyState;
