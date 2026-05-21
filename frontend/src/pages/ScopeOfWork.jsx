import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiBriefcase, FiPlus, FiAlertCircle } from 'react-icons/fi';
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
    <div className="space-y-6">
      {/* Header - Hero Area */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-xl bg-white/80 backdrop-blur-md border border-gray-200/60 shadow-sm p-6 mb-2"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-transparent to-indigo-50/30 pointer-events-none" />
        <div className="relative flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 border border-blue-200/50 shadow-sm">
              <FiBriefcase size={22} className="text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Scope Of Work</h1>
              <p className="text-sm text-gray-500 mt-0.5">Manage categories and pricing for proposal generation</p>
            </div>
          </div>
          <button
            onClick={() => handleOpenCategoryModal()}
            className="relative group flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium text-sm shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
          >
            <FiPlus size={16} className="transition-transform duration-200 group-hover:rotate-90" />
            Add Category
          </button>
        </div>
      </motion.div>

      {/* Error Alert */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50/80 backdrop-blur-sm border border-red-200/60 rounded-xl p-4 flex items-start gap-3"
        >
          <div className="p-1.5 bg-red-100 rounded-lg">
            <FiAlertCircle size={16} className="text-red-600 flex-shrink-0" />
          </div>
          <div className="flex-1">
            <p className="text-red-800 text-sm font-medium">{error}</p>
          </div>
          <button
            onClick={clearError}
            className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
          >
            Dismiss
          </button>
        </motion.div>
      )}

      {/* Filters */}
      <FilterBar filters={filters} onFilterChange={updateFilters} />

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-100 rounded-full blur-xl opacity-40" />
            <div className="relative animate-spin rounded-full h-8 w-8 border-2 border-blue-200 border-t-blue-600"></div>
          </div>
          <p className="text-sm text-gray-500 mt-4">Loading scope items...</p>
        </div>
      ) : categories.length === 0 ? (
        <EmptyState
          icon={FiBriefcase}
          title="No categories found"
          description="Create your first scope category to get started"
          action={
            <button
              onClick={() => handleOpenCategoryModal()}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium text-sm shadow-sm hover:shadow-md"
            >
              <FiPlus size={14} />
              Add Category
            </button>
          }
        />
      ) : (
        <div className="space-y-3">
          {categories.map((category) => (
            <ScopeCategoryCard
              key={category._id}
              category={category}
              onEditCategory={() => handleOpenCategoryModal(category)}
              onDeleteCategory={() => handleOpenDeleteModal('category', category)}
              onAddItem={() => handleOpenItemModal(category)}
              onEditItem={(categoryId, item) => handleOpenItemModal(category, item)}
              onDeleteItem={(categoryId, item) =>
                handleOpenDeleteModal('item', { categoryId, item })
              }
            />
          ))}
        </div>
      )}

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
  );
};

export default ScopeOfWork;
