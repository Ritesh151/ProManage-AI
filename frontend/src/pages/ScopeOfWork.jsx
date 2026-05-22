// src/pages/ScopeOfWork.js
import React, { useState } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { FiBriefcase, FiPlus, FiAlertCircle, FiFilter } from 'react-icons/fi';
import { useScope } from '../hooks/useScope';
import { FilterBar } from '../components/FilterBar';
import { ScopeCategoryCard } from '../components/ScopeCategoryCard';
import { CategoryModal } from '../components/CategoryModal';
import { ScopeItemModal } from '../components/ScopeItemModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { EmptyState } from '../components/EmptyState';

const ScopeOfWork = () => {
  const {
    categories,
    loading,
    error,
    filters,
    updateFilters,
    createCategory,
    updateCategory,
    deleteCategory,
    createScopeItem,
    updateScopeItem,
    deleteScopeItem,
    clearError,
  } = useScope();

  const [categoryModal, setCategoryModal] = useState({ isOpen: false, data: null });
  const [itemModal, setItemModal] = useState({ isOpen: false, categoryId: null, data: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, type: null, data: null });
  const [savingCategory, setSavingCategory] = useState(false);
  const [savingItem, setSavingItem] = useState(false);
  const [deletingItem, setDeletingItem] = useState(false);

  // Category Modal Handlers
  const handleOpenCategoryModal = (category = null) => {
    setCategoryModal({ isOpen: true, data: category });
  };

  const handleCloseCategoryModal = () => {
    setCategoryModal({ isOpen: false, data: null });
  };

  const handleSaveCategory = async (data) => {
    setSavingCategory(true);
    try {
      if (categoryModal.data) {
        await updateCategory(categoryModal.data._id, data);
      } else {
        await createCategory(data);
      }
      handleCloseCategoryModal();
    } catch (err) {
      console.error('Error saving category:', err);
    } finally {
      setSavingCategory(false);
    }
  };

  // Item Modal Handlers
  const handleOpenItemModal = (category, item = null) => {
    setItemModal({ isOpen: true, categoryId: category._id, data: item });
  };

  const handleCloseItemModal = () => {
    setItemModal({ isOpen: false, categoryId: null, data: null });
  };

  const handleSaveItem = async (data) => {
    setSavingItem(true);
    try {
      if (itemModal.data) {
        await updateScopeItem(itemModal.categoryId, itemModal.data._id, data);
      } else {
        await createScopeItem(itemModal.categoryId, data);
      }
      handleCloseItemModal();
    } catch (err) {
      console.error('Error saving item:', err);
    } finally {
      setSavingItem(false);
    }
  };

  // Delete Modal Handlers
  const handleOpenDeleteModal = (type, data) => {
    setDeleteModal({ isOpen: true, type, data });
  };

  const handleCloseDeleteModal = () => {
    setDeleteModal({ isOpen: false, type: null, data: null });
  };

  const handleConfirmDelete = async () => {
    setDeletingItem(true);
    try {
      if (deleteModal.type === 'category') {
        await deleteCategory(deleteModal.data._id);
      } else if (deleteModal.type === 'item') {
        await deleteScopeItem(deleteModal.data.categoryId, deleteModal.data.item._id);
      }
      handleCloseDeleteModal();
    } catch (err) {
      console.error('Error deleting:', err);
    } finally {
      setDeletingItem(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 px-8 py-8">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
          className="absolute top-20 -left-48 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 dark:opacity-20"
        />
        <motion.div
          animate={{ x: [0, -100, 0], y: [0, 80, 0] }}
          transition={{ duration: 25, repeat: Infinity, repeatType: "reverse" }}
          className="absolute top-40 -right-48 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 dark:opacity-20"
        />
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, -50, 0] }}
          transition={{ duration: 22, repeat: Infinity, repeatType: "reverse" }}
          className="absolute -bottom-48 left-1/3 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 dark:opacity-20"
        />
      </div>

      <div className="relative z-10 space-y-6">
        {/* Header - Premium Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 rounded-3xl border border-white/20 dark:border-slate-700/50 shadow-xl p-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/10 to-pink-500/10">
                <FiBriefcase size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
                  Scope Of Work
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Manage categories and pricing for proposal generation
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleOpenCategoryModal()}
              className="relative group flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-pink-500 text-white rounded-xl font-medium text-sm shadow-lg hover:shadow-xl transition-all"
            >
              <FiPlus size={16} className="transition-transform duration-200 group-hover:rotate-90" />
              Add Category
            </motion.button>
          </div>
        </motion.div>

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="backdrop-blur-xl bg-red-500/10 dark:bg-red-500/5 border border-red-200 dark:border-red-800/30 rounded-2xl p-4 flex items-start gap-3"
            >
              <div className="p-1.5 rounded-xl bg-red-100 dark:bg-red-900/30">
                <FiAlertCircle size={16} className="text-red-600 dark:text-red-400 flex-shrink-0" />
              </div>
              <div className="flex-1">
                <p className="text-red-800 dark:text-red-300 text-sm font-medium">{error}</p>
              </div>
              <button
                onClick={clearError}
                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm font-medium transition-colors"
              >
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filters */}
        <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-lg overflow-hidden">
          <div className="p-5">
            <FilterBar filters={filters} onFilterChange={updateFilters} />
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-96"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-pink-500 rounded-full blur-xl opacity-40 animate-pulse" />
                <div className="relative animate-spin rounded-full h-12 w-12 border-3 border-transparent border-t-blue-600 dark:border-t-blue-400"></div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 font-medium">Loading scope items...</p>
            </motion.div>
          ) : categories.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <EmptyState
                icon={FiBriefcase}
                title="No categories found"
                description="Create your first scope category to get started"
                action={
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleOpenCategoryModal()}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-pink-500 text-white rounded-xl font-medium text-sm shadow-lg hover:shadow-xl transition-all"
                  >
                    <FiPlus size={14} />
                    Add Category
                  </motion.button>
                }
              />
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {categories.map((category, index) => (
                <motion.div
                  key={category._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ScopeCategoryCard
                    category={category}
                    onEditCategory={() => handleOpenCategoryModal(category)}
                    onDeleteCategory={() => handleOpenDeleteModal('category', category)}
                    onAddItem={() => handleOpenItemModal(category)}
                    onEditItem={(categoryId, item) => handleOpenItemModal(category, item)}
                    onDeleteItem={(categoryId, item) =>
                      handleOpenDeleteModal('item', { categoryId, item })
                    }
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modals */}
        <CategoryModal
          isOpen={categoryModal.isOpen}
          category={categoryModal.data}
          onClose={handleCloseCategoryModal}
          onSave={handleSaveCategory}
          loading={savingCategory}
        />

        <ScopeItemModal
          isOpen={itemModal.isOpen}
          item={itemModal.data}
          onClose={handleCloseItemModal}
          onSave={handleSaveItem}
          loading={savingItem}
        />

        <DeleteConfirmModal
          isOpen={deleteModal.isOpen}
          title={deleteModal.type === 'category' ? 'Delete Category' : 'Delete Scope Item'}
          message={
            deleteModal.type === 'category'
              ? `Are you sure you want to delete "${deleteModal.data?.name}"? This action cannot be undone.`
              : `Are you sure you want to delete "${deleteModal.data?.item?.title}"? This action cannot be undone.`
          }
          onConfirm={handleConfirmDelete}
          onCancel={handleCloseDeleteModal}
          loading={deletingItem}
        />
      </div>
    </div>
  );
};

export default ScopeOfWork;
