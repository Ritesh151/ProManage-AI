// src/components/ConfirmModal.js
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertTriangle, FiX } from 'react-icons/fi';

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirm Action', 
  message = 'Are you sure you want to proceed?',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  type = 'danger', // danger, warning, info
  loading = false
}) => {
  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          gradient: 'from-red-600 to-orange-500',
          iconBg: 'from-red-500/10 to-orange-500/10',
          iconColor: 'text-red-600 dark:text-red-400',
          buttonGradient: 'from-red-600 to-orange-500',
          borderColor: 'border-red-200 dark:border-red-800/30'
        };
      case 'warning':
        return {
          gradient: 'from-yellow-600 to-amber-500',
          iconBg: 'from-yellow-500/10 to-amber-500/10',
          iconColor: 'text-yellow-600 dark:text-yellow-400',
          buttonGradient: 'from-yellow-600 to-amber-500',
          borderColor: 'border-yellow-200 dark:border-yellow-800/30'
        };
      case 'info':
        return {
          gradient: 'from-blue-600 to-indigo-500',
          iconBg: 'from-blue-500/10 to-indigo-500/10',
          iconColor: 'text-blue-600 dark:text-blue-400',
          buttonGradient: 'from-blue-600 to-indigo-500',
          borderColor: 'border-blue-200 dark:border-blue-800/30'
        };
      default:
        return {
          gradient: 'from-red-600 to-orange-500',
          iconBg: 'from-red-500/10 to-orange-500/10',
          iconColor: 'text-red-600 dark:text-red-400',
          buttonGradient: 'from-red-600 to-orange-500',
          borderColor: 'border-red-200 dark:border-red-800/30'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`relative backdrop-blur-xl bg-white/95 dark:bg-slate-900/95 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border ${styles.borderColor}`}>
              {/* Gradient Top Border */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${styles.gradient}`} />
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute right-4 top-4 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all z-10"
              >
                <FiX size={18} />
              </button>

              <div className="p-6 text-center">
                {/* Icon */}
                <div className={`mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br ${styles.iconBg} flex items-center justify-center mb-4`}>
                  <FiAlertTriangle size={28} className={styles.iconColor} />
                </div>
                
                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">
                  {title}
                </h3>
                
                {/* Message */}
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
                  {message}
                </p>
                
                {/* Actions */}
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    disabled={loading}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all font-medium disabled:opacity-50"
                  >
                    {cancelText}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onConfirm}
                    disabled={loading}
                    className={`flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r ${styles.buttonGradient} text-white font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      confirmText
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
