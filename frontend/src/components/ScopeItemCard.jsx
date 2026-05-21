import React from 'react';
import { motion } from 'framer-motion';
import { FiEdit2, FiTrash2, FiCalendar } from 'react-icons/fi';

export const ScopeItemCard = ({ item, onEdit, onDelete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="group/item relative pl-4 pr-4 py-3.5 bg-gray-50/60 rounded-lg border border-transparent hover:border-gray-200 hover:bg-white transition-all duration-200"
    >
      {/* Nested depth indicator line */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200 ml-2" />

      {/* Date badge - top right */}
      <div className="absolute top-3 right-3 flex items-center gap-1 text-gray-400">
        <FiCalendar size={11} />
        <span className="text-[10px] font-medium">
          {new Date(item.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: '2-digit' })}
        </span>
      </div>


      <div className="flex items-start justify-between pr-20">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 text-sm">{item.title}</h4>
          {item.description && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
          )}
        </div>
        {/* Action icons - faded by default */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover/item:opacity-100 transition-opacity duration-200 ml-3">
          <button
            onClick={() => onEdit(item)}
            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            title="Edit"
          >
            <FiEdit2 size={14} />
          </button>
          <button
            onClick={() => onDelete(item)}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title="Delete"
          >
            <FiTrash2 size={14} />
          </button>
        </div>
      </div>

      {/* Price - clean text with green dot */}
      <div className="mt-2.5 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
        <span className="text-sm font-semibold text-gray-800">
          ₹{item.price.toLocaleString('en-IN')}
        </span>
        <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Estimated Cost</span>
      </div>
    </motion.div>
  );
};
