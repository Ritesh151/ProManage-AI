export const formatCurrency = (amount) => {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
};

export const formatDate = (date, options = {}) => {
  if (!date) return '';
  const defaults = { day: 'numeric', month: 'short', year: 'numeric' };
  return new Date(date).toLocaleDateString('en-IN', { ...defaults, ...options });
};

export const statusColor = (status) => {
  const map = {
    Active: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
    Completed: 'bg-blue-50 text-blue-600 border border-blue-200',
    'On Hold': 'bg-amber-50 text-amber-600 border border-amber-200',
    Cancelled: 'bg-rose-50 text-rose-600 border border-rose-200',
  };
  return map[status] || 'bg-gray-50 text-gray-600 border border-gray-200';
};

export const statusDot = (status) => {
  const map = {
    Active: 'bg-emerald-500',
    Completed: 'bg-blue-500',
    'On Hold': 'bg-amber-500',
    Cancelled: 'bg-rose-500',
  };
  return map[status] || 'bg-gray-500';
};

export const statusOptions = ['Active', 'Completed', 'On Hold', 'Cancelled'];
