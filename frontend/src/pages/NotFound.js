// src/pages/NotFound.js
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiSearch, FiArrowLeft, FiHelpCircle } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center px-4">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
          className="absolute top-20 -left-48 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 dark:opacity-20"
        />
        <motion.div
          animate={{ x: [0, -100, 0], y: [0, 80, 0] }}
          transition={{ duration: 25, repeat: Infinity, repeatType: "reverse" }}
          className="absolute top-40 -right-48 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 dark:opacity-20"
        />
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, -50, 0] }}
          transition={{ duration: 22, repeat: Infinity, repeatType: "reverse" }}
          className="absolute -bottom-48 left-1/3 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 dark:opacity-20"
        />
      </div>

      <div className="relative z-10 max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          {/* Animated 404 Number */}
          <div className="relative mb-8">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2, type: "spring", bounce: 0.5 }}
              className="text-8xl md:text-9xl font-black bg-gradient-to-r from-blue-600 to-pink-500 bg-clip-text text-transparent"
            >
              404
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-lg"
            >
              <FiSearch size={20} className="text-white" />
            </motion.div>
          </div>

          {/* Title and Description */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3"
          >
            Oops! Page Not Found
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="text-gray-500 dark:text-gray-400 mb-2"
          >
            The page you are looking for doesn't exist or has been moved.
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-gray-400 dark:text-gray-500 mb-8"
          >
            Please check the URL or navigate back to the dashboard.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-pink-500 text-white font-semibold hover:shadow-lg transition-all group"
            >
              <FiHome size={18} className="group-hover:scale-110 transition-transform" />
              Back to Dashboard
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-slate-800 transition-all group"
            >
              <FiArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              Go Back
            </button>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 pt-8 border-t border-gray-200 dark:border-slate-700"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex items-center justify-center gap-2">
              <FiHelpCircle size={14} />
              Need help? Try these pages:
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {[
                { to: '/', label: 'Dashboard' },
                { to: '/projects', label: 'Projects' },
                { to: '/proposal', label: 'Proposal' },
                { to: '/ai', label: 'AI Assistant' },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Decorative Elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 flex justify-center gap-2"
          >
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-600 to-pink-500"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
