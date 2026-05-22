// src/components/ScopeItemModal.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiDollarSign, FiFileText, FiType, FiCheck } from 'react-icons/fi';
import { formatPrice } from '../utils/currencyFormatter';

export const ScopeItemModal = ({ isOpen, item, onClose, onSave, loading }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    currency: 'INR',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title || '',
        description: item.description || '',
        price: item.price || '',
        currency: item.currency || 'INR',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        price: '',
        currency: 'INR',
      });
    }
    setErrors({});
    setTouched({});
  }, [item, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required';
    if (formData.price && isNaN(formData.price)) newErrors.price = 'Price must be a number';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave({
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: parseInt(formData.price, 10),
        currency: formData.currency,
      });
    }
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="relative backdrop-blur-xl bg-white/95 dark:bg-slate-900/95 rounded-2xl shadow-2xl max-w-md w-full mx-4 border border-white/20 dark:border-slate-700/50 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Gradient Header */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-pink-500" />
            
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/10 to-pink-500/10">
                  <FiFileText className="text-blue-600 dark:text-blue-400" size={18} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
                    {item ? 'Edit Scope Item' : 'Add Scope Item'}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {item ? 'Update item details' : 'Create a new scope item'}
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-all"
              >
                <FiX size={20} />
              </motion.button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Title Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <FiType size={16} />
                  </div>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    onBlur={() => handleBlur('title')}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 bg-white/50 dark:bg-slate-800/50 ${
                      errors.title && touched.title
                        ? 'border-red-500 focus:ring-red-500/20'
                        : 'border-gray-200 dark:border-slate-700 focus:ring-blue-500/20 focus:border-blue-500'
                    }`}
                    placeholder="e.g., UI/UX Design"
                  />
                </div>
                {errors.title && touched.title && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-600 dark:text-red-400 text-xs mt-1 ml-1"
                  >
                    {errors.title}
                  </motion.p>
                )}
              </div>

              {/* Description Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                  placeholder="Add description..."
                  rows="3"
                />
              </div>

              {/* Price Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Price (₹) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <FiDollarSign size={16} />
                  </div>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    onBlur={() => handleBlur('price')}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 bg-white/50 dark:bg-slate-800/50 ${
                      errors.price && touched.price
                        ? 'border-red-500 focus:ring-red-500/20'
                        : 'border-gray-200 dark:border-slate-700 focus:ring-blue-500/20 focus:border-blue-500'
                    }`}
                    placeholder="0"
                    min="0"
                    step="1000"
                  />
                </div>
                {errors.price && touched.price && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-600 dark:text-red-400 text-xs mt-1 ml-1"
                  >
                    {errors.price}
                  </motion.p>
                )}
                {formData.price && !errors.price && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-gray-600 dark:text-gray-400 mt-2 flex items-center gap-2"
                  >
                    <FiCheck size={14} className="text-green-500" />
                    Preview: <span className="font-semibold text-gray-900 dark:text-white">
                      {formatPrice(parseInt(formData.price, 10))}
                    </span>
                  </motion.p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-all font-medium disabled:opacity-50"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </div>
                  ) : (
                    'Save Item'
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
