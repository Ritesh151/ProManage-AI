// src/components/ScopeCategoryCard.js
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiEdit2, FiTrash2, FiPlus, FiLayers, FiDollarSign, FiTrendingUp } from 'react-icons/fi';
import { ScopeItemCard } from './ScopeItemCard';
import { formatPrice } from '../utils/currencyFormatter';

export const ScopeCategoryCard = ({
  category,
  onEditCategory,
  onDeleteCategory,
  onAddItem,
  onEditItem,
  onDeleteItem,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const totalPrice = category.scopeItems.reduce((sum, item) => sum + item.price, 0);
  const avgPrice = category.scopeItems.length > 0 ? totalPrice / category.scopeItems.length : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
      className="group relative backdrop-blur-lg bg-white/80 dark:bg-slate-900/80 rounded-2xl border border-white/20 dark:border-slate-700/50 overflow-hidden hover:shadow-2xl transition-all duration-300"
    >
      {/* Gradient Top Border */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-pink-500 transition-all duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`} />
      
      {/* Left Accent Glow */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-pink-500 transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`} />

      {/* Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="pl-5 pr-6 py-5 cursor-pointer hover:bg-gradient-to-r hover:from-blue-500/5 hover:to-pink-500/5 transition-all duration-300"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500/10 to-pink-500/10 flex items-center justify-center text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
            >
              <FiChevronDown size={18} />
            </motion.div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white tracking-tight">
                {category.name}
              </h3>
              {category.description && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                  {category.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 ml-4 flex-shrink-0">
            {/* Stats Badges */}
            <div className="flex items-center gap-2">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 text-blue-700 dark:text-blue-400 text-xs font-semibold rounded-full"
              >
                <FiLayers size={12} />
                {category.scopeItems.length} items
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold rounded-full"
              >
                <FiDollarSign size={12} />
                {formatPrice(totalPrice)}
              </motion.div>

              {category.scopeItems.length > 0 && (
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-br from-purple-500/10 to-pink-500/10 text-purple-700 dark:text-purple-400 text-xs font-semibold rounded-full"
                >
                  <FiTrendingUp size={12} />
                  Ø {formatPrice(avgPrice)}
                </motion.div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onEditCategory(category);
                }}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-all"
                title="Edit category"
              >
                <FiEdit2 size={16} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteCategory(category);
                }}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all"
                title="Delete category"
              >
                <FiTrash2 size={16} />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="px-5">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-slate-700 to-transparent" />
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="p-6">
              {category.scopeItems.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-pink-500/10 flex items-center justify-center">
                    <FiLayers size={28} className="text-gray-400 dark:text-gray-500" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 font-medium mb-4">No scope items yet</p>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onAddItem(category)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-pink-500 text-white rounded-xl font-medium text-sm shadow-lg hover:shadow-xl transition-all"
                  >
                    <FiPlus size={14} />
                    Add First Item
                  </motion.button>
                </motion.div>
              ) : (
                <>
                  <div className="space-y-2 mb-5">
                    {category.scopeItems.map((item, index) => (
                      <motion.div
                        key={item._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                      >
                        <ScopeItemCard
                          item={item}
                          onEdit={() => onEditItem(category._id, item)}
                          onDelete={() => onDeleteItem(category._id, item)}
                        />
                      </motion.div>
                    ))}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => onAddItem(category)}
                    className="w-full px-5 py-3 border-2 border-dashed border-gray-300 dark:border-slate-600 text-gray-500 dark:text-gray-400 rounded-xl hover:border-blue-500 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gradient-to-r hover:from-blue-500/5 hover:to-pink-500/5 transition-all duration-200 font-medium text-sm flex items-center justify-center gap-2 group"
                  >
                    <FiPlus size={14} className="group-hover:rotate-90 transition-transform duration-300" />
                    Add Item
                  </motion.button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Glow Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </motion.div>
  );
};