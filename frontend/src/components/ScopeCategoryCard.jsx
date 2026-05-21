import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiEdit2, FiTrash2, FiPlus, FiLayers, FiDollarSign } from 'react-icons/fi';
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative bg-white rounded-xl border border-gray-200/80 overflow-hidden hover:shadow-lg hover:border-gray-300/80 transition-all duration-300"
    >
      {/* Left accent bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 transition-colors duration-300 ${isExpanded ? 'bg-blue-500' : 'bg-gray-200'}`} />

      {/* Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="pl-4 pr-5 py-4 cursor-pointer hover:bg-gray-50/50 transition-colors duration-200"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="flex-shrink-0 text-gray-400 group-hover:text-gray-600 transition-colors"
            >
              <FiChevronDown size={18} />
            </motion.div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-base">{category.name}</h3>
              {category.description && (
                <p className="text-sm text-gray-500 mt-0.5 truncate">{category.description}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 ml-4 flex-shrink-0">
            {/* Pill badges */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                <FiLayers size={11} />
                {category.scopeItems.length}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                <FiDollarSign size={11} />
                {formatPrice(totalPrice)}
              </span>
            </div>

            {/* Action icons - faded by default, light up on hover */}
            <div className="flex items-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEditCategory(category);
                }}
                className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                title="Edit category"
              >
                <FiEdit2 size={15} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteCategory(category);
                }}
                className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                title="Delete category"
              >
                <FiTrash2 size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="pl-4 pr-5">
        <div className="h-px bg-gray-100" />
      </div>

      {/* Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="p-5"
          >
            {category.scopeItems.length === 0 ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3">
                  <FiLayers size={20} className="text-gray-400" />
                </div>
                <p className="text-gray-500 text-sm mb-4">No scope items yet</p>
                <button
                  onClick={() => onAddItem(category)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium text-sm shadow-sm hover:shadow-md"
                >
                  <FiPlus size={14} />
                  Add Item
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-2 mb-4">
                  {category.scopeItems.map((item) => (
                    <ScopeItemCard
                      key={item._id}
                      item={item}
                      onEdit={() => onEditItem(category._id, item)}
                      onDelete={() => onDeleteItem(category._id, item)}
                    />
                  ))}
                </div>

                <button
                  onClick={() => onAddItem(category)}
                  className="w-full px-4 py-2.5 border border-dashed border-gray-300 text-gray-500 rounded-lg hover:bg-gray-50 hover:border-gray-400 hover:text-gray-700 transition-all duration-200 font-medium text-sm flex items-center justify-center gap-2"
                >
                  <FiPlus size={14} />
                  Add Item
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
