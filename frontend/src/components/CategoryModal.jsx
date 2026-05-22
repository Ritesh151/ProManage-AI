// src/components/CategoryModal.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiBriefcase, FiFolder, FiCode, FiSmartphone, FiGlobe, FiSettings, FiSave } from 'react-icons/fi';

const iconOptions = [
  { value: 'FiBriefcase', icon: FiBriefcase, label: 'Briefcase' },
  { value: 'FiFolder', icon: FiFolder, label: 'Folder' },
  { value: 'FiCode', icon: FiCode, label: 'Code' },
  { value: 'FiSmartphone', icon: FiSmartphone, label: 'Mobile' },
  { value: 'FiGlobe', icon: FiGlobe, label: 'Website' },
  { value: 'FiSettings', icon: FiSettings, label: 'Settings' },
];

export const CategoryModal = ({ isOpen, category, onClose, onSave, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: 'FiBriefcase',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        description: category.description || '',
        icon: category.icon || 'FiBriefcase',
      });
    } else {
      setFormData({
        name: '',
        description: '',
        icon: 'FiBriefcase',
      });
    }
    setErrors({});
  }, [category, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Category name is required';
    if (formData.name.length < 2) newErrors.name = 'Category name must be at least 2 characters';
    if (formData.name.length > 50) newErrors.name = 'Category name must be less than 50 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave({
        name: formData.name.trim(),
        description: formData.description.trim(),
        icon: formData.icon,
      });
    }
  };

  const SelectedIcon = iconOptions.find(opt => opt.value === formData.icon)?.icon || FiBriefcase;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="relative w-full max-w-md bg-white/95 dark:bg-slate-900/95 rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/50 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Gradient Top Border */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-pink-500" />

            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/10 to-pink-500/10">
                  <FiBriefcase size={18} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
                    {category ? 'Edit Category' : 'Add Category'}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {category ? 'Update category details' : 'Create a new scope category'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Category Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-xl border-2 bg-white/50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 transition-all duration-200 ${
                    errors.name 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                      : 'border-gray-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20'
                  }`}
                  placeholder="e.g., Mobile App Development"
                  autoFocus
                />
                {errors.name && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-red-500 mt-1"
                  >
                    {errors.name}
                  </motion.p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 resize-none"
                  placeholder="Add a brief description of this category..."
                  rows="3"
                />
              </div>

              {/* Icon Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Category Icon
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {iconOptions.map((opt) => {
                    const IconComponent = opt.icon;
                    const isSelected = formData.icon === opt.value;
                    return (
                      <motion.button
                        key={opt.value}
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setFormData({ ...formData, icon: opt.value })}
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                            : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        <IconComponent size={20} />
                        <span className="text-xs font-medium">{opt.label}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Preview */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/5 to-pink-500/5 border border-gray-200 dark:border-slate-700">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Preview</p>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/10 to-pink-500/10">
                    <SelectedIcon size={20} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{formData.name || 'Category Name'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{formData.description || 'Category description will appear here'}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 px-4 py-2.5 border-2 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-all font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiSave size={14} />
                      {category ? 'Update Category' : 'Create Category'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CategoryModal;