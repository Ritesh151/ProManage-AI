import React from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

export const FilterBar = ({ filters, onFilterChange }) => {
  const priceRanges = [
    { label: '₹0–5000', min: 0, max: 5000 },
    { label: '₹5000–10000', min: 5000, max: 10000 },
    { label: '₹10000–20000', min: 10000, max: 20000 },
    { label: '₹20000+', min: 20000, max: null },
  ];

  const handlePriceFilter = (min, max) => {
    onFilterChange({
      priceMin: filters.priceMin === min && filters.priceMax === max ? null : min,
      priceMax: filters.priceMin === min && filters.priceMax === max ? null : max,
    });
  };

  const hasActiveFilters = filters.search || filters.priceMin || filters.sort !== 'newest';

  return (
    <div className="mb-6">
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors duration-200" size={16} />
          <input
            type="text"
            placeholder="Search categories..."
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200/80 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100/60 transition-all duration-200"
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
            className="appearance-none px-4 py-2.5 pr-8 bg-white border border-gray-200/80 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100/60 transition-all duration-200 cursor-pointer"
          >
            <option value="">All Prices</option>
            {priceRanges.map((range) => (
              <option key={range.label} value={`${range.min}-${range.max}`}>
                {range.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
              <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Sort */}
        <div className="relative">
          <select
            value={filters.sort}
            onChange={(e) => onFilterChange({ sort: e.target.value })}
            className="appearance-none px-4 py-2.5 pr-8 bg-white border border-gray-200/80 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100/60 transition-all duration-200 cursor-pointer"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
              <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Reset */}
        {hasActiveFilters && (
          <button
            onClick={() => onFilterChange({ search: '', priceMin: null, priceMax: null, sort: 'newest' })}
            className="flex items-center gap-1.5 px-3 py-2.5 text-sm text-gray-500 hover:text-gray-700 border border-gray-200/60 rounded-lg hover:bg-gray-50 transition-all duration-200"
          >
            <FiX size={14} />
            Reset
          </button>
        )}
      </div>
    </div>
  );
};
