import React from 'react';
import { formatPrice } from '../utils/currencyFormatter';

export const PriceBadge = ({ price, size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  return (
    <span className={`inline-block bg-green-100 text-green-800 font-semibold rounded-lg ${sizeClasses[size]}`}>
      {formatPrice(price)}
    </span>
  );
};
