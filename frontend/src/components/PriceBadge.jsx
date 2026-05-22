// src/components/PriceBadge.js
import React from 'react';
import { motion } from 'framer-motion';
import { FiDollarSign, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import { formatPrice } from '../utils/currencyFormatter';

export const PriceBadge = ({ price, size = 'md', variant = 'default', showIcon = true, trend, className = '' }) => {
  const sizeClasses = {
    sm: {
      wrapper: 'px-2 py-1',
      icon: 'w-3 h-3',
      text: 'text-xs',
    },
    md: {
      wrapper: 'px-3 py-1.5',
      icon: 'w-3.5 h-3.5',
      text: 'text-sm',
    },
    lg: {
      wrapper: 'px-4 py-2',
      icon: 'w-4 h-4',
      text: 'text-base',
    },
  };

  const variantStyles = {
    default: {
      bg: 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10',
      text: 'text-emerald-700 dark:text-emerald-400',
      border: 'border-emerald-200 dark:border-emerald-800/30',
    },
    premium: {
      bg: 'bg-gradient-to-r from-amber-500/10 to-yellow-500/10',
      text: 'text-amber-700 dark:text-amber-400',
      border: 'border-amber-200 dark:border-amber-800/30',
    },
    discount: {
      bg: 'bg-gradient-to-r from-red-500/10 to-orange-500/10',
      text: 'text-red-700 dark:text-red-400',
      border: 'border-red-200 dark:border-red-800/30',
    },
    success: {
      bg: 'bg-gradient-to-r from-green-500/10 to-emerald-500/10',
      text: 'text-green-700 dark:text-green-400',
      border: 'border-green-200 dark:border-green-800/30',
    },
  };

  const selectedVariant = variantStyles[variant] || variantStyles.default;

  const formatPriceWithSymbol = (priceValue) => {
    return formatPrice(priceValue);
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      className={`inline-flex items-center gap-1.5 rounded-xl border ${selectedVariant.bg} ${selectedVariant.border} ${selectedVariant.text} font-bold ${sizeClasses[size].wrapper} ${className}`}
    >
      {showIcon && (
        <FiDollarSign className={sizeClasses[size].icon} />
      )}
      <span className={sizeClasses[size].text}>
        {formatPriceWithSymbol(price)}
      </span>
      {trend && (
        <div className={`flex items-center gap-0.5 ml-1 ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
          {trend === 'up' ? (
            <FiTrendingUp className="w-2.5 h-2.5" />
          ) : (
            <FiTrendingDown className="w-2.5 h-2.5" />
          )}
          <span className="text-[10px] font-semibold">{Math.abs(trend)}%</span>
        </div>
      )}
    </motion.div>
  );
};

export default PriceBadge;