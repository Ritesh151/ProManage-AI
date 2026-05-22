// src/components/Pagination.js
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';

const Pagination = ({ page, pages, onPageChange, showFirstLast = true }) => {
  if (pages <= 1) return null;

  const getPages = () => {
    const items = [];
    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = Math.min(pages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) {
      items.push(i);
    }
    return items;
  };

  const visiblePages = getPages();
  const showStartEllipsis = visiblePages[0] > 2;
  const showEndEllipsis = visiblePages[visiblePages.length - 1] < pages - 1;

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      {/* First Page Button */}
      {showFirstLast && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPageChange(1)}
          disabled={page <= 1}
          className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-gray-500 dark:text-gray-400 transition-all shadow-sm"
          title="First Page"
        >
          <FiChevronsLeft size={16} />
        </motion.button>
      )}

      {/* Previous Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-gray-500 dark:text-gray-400 transition-all shadow-sm"
        title="Previous Page"
      >
        <FiChevronLeft size={16} />
      </motion.button>

      {/* Start Ellipsis */}
      {showStartEllipsis && (
        <span className="w-10 h-10 flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm font-medium">
          ...
        </span>
      )}

      {/* Page Numbers */}
      <AnimatePresence>
        {visiblePages.map((p, idx) => (
          <motion.button
            key={p}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onPageChange(p)}
            className={`min-w-10 h-10 rounded-xl font-semibold text-sm transition-all duration-200 shadow-sm ${
              p === page
                ? 'bg-gradient-to-r from-blue-600 to-pink-500 text-white shadow-md shadow-blue-500/20'
                : 'border border-gray-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
            }`}
          >
            {p}
          </motion.button>
        ))}
      </AnimatePresence>

      {/* End Ellipsis */}
      {showEndEllipsis && (
        <span className="w-10 h-10 flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm font-medium">
          ...
        </span>
      )}

      {/* Next Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(page + 1)}
        disabled={page >= pages}
        className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-gray-500 dark:text-gray-400 transition-all shadow-sm"
        title="Next Page"
      >
        <FiChevronRight size={16} />
      </motion.button>

      {/* Last Page Button */}
      {showFirstLast && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPageChange(pages)}
          disabled={page >= pages}
          className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-gray-500 dark:text-gray-400 transition-all shadow-sm"
          title="Last Page"
        >
          <FiChevronsRight size={16} />
        </motion.button>
      )}

      {/* Page Info */}
      <div className="ml-3 text-xs text-gray-500 dark:text-gray-400 font-medium">
        Page {page} of {pages}
      </div>
    </div>
  );
};

export default Pagination;
