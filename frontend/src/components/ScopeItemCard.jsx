// src/components/ScopeItemCard.js
import React from 'react';
import { motion } from 'framer-motion';
import { FiEdit2, FiTrash2, FiCalendar, FiDollarSign, FiClock } from 'react-icons/fi';
import { formatPrice } from '../utils/currencyFormatter';

export const ScopeItemCard = ({ item, onEdit, onDelete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ x: 4 }}
      transition={{ duration: 0.2 }}
      className="group/item relative backdrop-blur-sm bg-gradient-to-r from-gray-50/80 to-white/80 dark:from-slate-800/50 dark:to-slate-800/30 rounded-xl border border-gray-200/50 dark:border-slate-700/50 hover:border-blue-200 dark:hover:border-blue-800/50 hover:shadow-md transition-all duration-300 overflow-hidden"
    >
      {/* Gradient Border on Hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-transparent to-pink-500/0 group-hover/item:from-blue-500/10 group-hover/item:to-pink-500/10 transition-all duration-500" />
      
      {/* Left Accent Bar */}
      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-pink-500 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />

      <div className="relative p-4">
        {/* Header Section */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-pink-500" />
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm tracking-tight">
                {item.title}
              </h4>
            </div>
            {item.description && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 pl-3">
                {item.description}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-all duration-300 translate-x-2 group-hover/item:translate-x-0">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onEdit(item)}
              className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all"
              title="Edit scope item"
            >
              <FiEdit2 size={13} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDelete(item)}
              className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all"
              title="Delete scope item"
            >
              <FiTrash2 size={13} />
            </motion.button>
          </div>
        </div>

        {/* Footer Section */}
        <div className="mt-3 flex flex-wrap items-center gap-3">
          {/* Price Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-emerald-500/10 to-teal-500/10">
            <FiDollarSign size={12} className="text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              {formatPrice(item.price)}
            </span>
            <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Est. Cost
            </span>
          </div>

          {/* Date Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-gray-500/10 to-gray-600/10">
            <FiClock size={11} className="text-gray-500 dark:text-gray-400" />
            <span className="text-[10px] font-medium text-gray-600 dark:text-gray-300">
              {new Date(item.createdAt).toLocaleDateString('en-IN', { 
                day: '2-digit', 
                month: 'short', 
                year: 'numeric' 
              })}
            </span>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-blue-500/10 to-indigo-500/10">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">
              Active
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Border Glow */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
};
