// src/components/FilterBar.js
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX, FiFilter, FiChevronDown } from 'react-icons/fi';

export const FilterBar = ({ filters, onFilterChange }) => {
  const [showMobileFilters, setShowMobileFilters] = React.useState(false);
  
  const priceRanges = [
    { label: '₹0–5,000', min: 0, max: 5000 },
    { label: '₹5,000–10,000', min: 5000, max: 10000 },
    { label: '₹10,000–20,000', min: 10000, max: 20000 },
    { label: '₹20,000+', min: 20000, max: null },
  ];

  const handlePriceFilter = (min, max) => {
    onFilterChange({
      priceMin: filters.priceMin === min && filters.priceMax === max ? null : min,
      priceMax: filters.priceMin === min && filters.priceMax === max ? null : max,
    });
  };

  const hasActiveFilters = filters.search || filters.priceMin || filters.sort !== 'newest';

  const FilterContent = () => (
    <>
      {/* Search */}
      <div className="relative flex-1">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={16} />
        <input
          type="text"
          placeholder="Search categories..."
          value={filters.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          className="w-full pl-11 pr-4 py-2.5 backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
        />
      </div>

      {/* Price Filter */}
      <div className="relative">
        <select
          value={filters.priceMin ? `${filters.priceMin}-${filters.priceMax}` : ''}
          onChange={(e) => {
            if (e.target.value) {
              const [min, max] = e.target.value.split('-');
              handlePriceFilter(parseInt(min), max === 'null' ? null : parseInt(max));
            } else {
              onFilterChange({ priceMin: null, priceMax: null });
            }
          }}
          className="appearance-none px-4 py-2.5 pr-10 backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 cursor-pointer"
        >
          <option value="">All Prices</option>
          {priceRanges.map((range) => (
            <option key={range.label} value={`${range.min}-${range.max}`}>
              {range.label}
            </option>
          ))}
        </select>
        <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 dark:text-gray-500" size={14} />
      </div>

      {/* Sort */}
      <div className="relative">
        <select
          value={filters.sort}
          onChange={(e) => onFilterChange({ sort: e.target.value })}
          className="appearance-none px-4 py-2.5 pr-10 backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 cursor-pointer"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
        <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 dark:text-gray-500" size={14} />
      </div>

      {/* Reset Button */}
      <AnimatePresence>
        {hasActiveFilters && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onFilterChange({ search: '', priceMin: null, priceMax: null, sort: 'newest' })}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-slate-700 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-all duration-200"
          >
            <FiX size={14} />
            Clear All
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );

  return (
    <div className="mb-6">
      {/* Desktop Filters */}
      <div className="hidden md:flex items-center gap-3">
        <FilterContent />
      </div>

      {/* Mobile Filters - Toggle */}
      <div className="md:hidden">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search..."
              value={filters.search}
              onChange={(e) => onFilterChange({ search: e.target.value })}
              className="w-full pl-11 pr-4 py-2.5 backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-200 ${
              showMobileFilters || hasActiveFilters
                ? 'bg-gradient-to-r from-blue-600/10 to-pink-500/10 border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400'
                : 'bg-white/50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-400'
            }`}
          >
            <FiFilter size={16} />
            <span className="text-sm font-medium">Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-blue-600" />
            )}
          </motion.button>
        </div>

        {/* Expanded Mobile Filters */}
        <AnimatePresence>
          {showMobileFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="mt-3 space-y-3 overflow-hidden"
            >
              {/* Price Filter */}
              <select
                value={filters.priceMin ? `${filters.priceMin}-${filters.priceMax}` : ''}
                onChange={(e) => {
                  if (e.target.value) {
                    const [min, max] = e.target.value.split('-');
                    handlePriceFilter(parseInt(min), max === 'null' ? null : parseInt(max));
                  } else {
                    onFilterChange({ priceMin: null, priceMax: null });
                  }
                }}
                className="w-full px-4 py-2.5 pr-10 backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
              >
                <option value="">All Prices</option>
                {priceRanges.map((range) => (
                  <option key={range.label} value={`${range.min}-${range.max}`}>
                    {range.label}
                  </option>
                ))}
              </select>

              {/* Sort Filter */}
              <select
                value={filters.sort}
                onChange={(e) => onFilterChange({ sort: e.target.value })}
                className="w-full px-4 py-2.5 pr-10 backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>

              {/* Reset Button */}
              {hasActiveFilters && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => onFilterChange({ search: '', priceMin: null, priceMax: null, sort: 'newest' })}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-slate-700 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-all"
                >
                  <FiX size={14} />
                  Clear All Filters
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Active Filters Display */}
      <AnimatePresence>
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-wrap gap-2 mt-3"
          >
            {filters.search && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-700 dark:text-blue-400 text-xs font-medium"
              >
                <span>Search: {filters.search}</span>
                <button
                  onClick={() => onFilterChange({ search: '' })}
                  className="hover:text-blue-900 dark:hover:text-blue-300"
                >
                  <FiX size={12} />
                </button>
              </motion.div>
            )}
            
            {filters.priceMin && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 text-green-700 dark:text-green-400 text-xs font-medium"
              >
                <span>
                  Price: ₹{filters.priceMin.toLocaleString()} - {filters.priceMax ? `₹${filters.priceMax.toLocaleString()}` : '∞'}
                </span>
                <button
                  onClick={() => onFilterChange({ priceMin: null, priceMax: null })}
                  className="hover:text-green-900 dark:hover:text-green-300"
                >
                  <FiX size={12} />
                </button>
              </motion.div>
            )}
            
            {filters.sort !== 'newest' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-700 dark:text-purple-400 text-xs font-medium"
              >
                <span>Sort: {filters.sort === 'oldest' ? 'Oldest First' : filters.sort === 'price-low' ? 'Price: Low to High' : 'Price: High to Low'}</span>
                <button
                  onClick={() => onFilterChange({ sort: 'newest' })}
                  className="hover:text-purple-900 dark:hover:text-purple-300"
                >
                  <FiX size={12} />
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};