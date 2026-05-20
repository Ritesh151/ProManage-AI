export const formatINR = (amount) => {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
};

export const formatINRPlain = (amount) => {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(num);
};

export const formatCurrency = formatINR;
