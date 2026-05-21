import { useState, useEffect, useCallback } from 'react';
import { scopeService } from '../services/scopeService';

export const useScope = () => {
  const [categories, setCategories] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    priceMin: null,
    priceMax: null,
    sort: 'newest',
  });

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await scopeService.getCategories(filters);
      setCategories(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchStatistics = useCallback(async () => {
    try {
      const data = await scopeService.getStatistics();
      setStatistics(data);
    } catch (err) {
      console.error('Error fetching statistics:', err);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchStatistics();
  }, [fetchCategories, fetchStatistics]);

  const createCategory = useCallback(async (data) => {
    try {
      const newCategory = await scopeService.createCategory(data);
      setCategories([newCategory, ...categories]);
      await fetchStatistics();
      return newCategory;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [categories, fetchStatistics]);

  const updateCategory = useCallback(async (id, data) => {
    try {
      const updated = await scopeService.updateCategory(id, data);
      setCategories(categories.map(cat => cat._id === id ? updated : cat));
      await fetchStatistics();
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [categories, fetchStatistics]);

  const deleteCategory = useCallback(async (id) => {
    try {
      await scopeService.deleteCategory(id);
      setCategories(categories.filter(cat => cat._id !== id));
      await fetchStatistics();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [categories, fetchStatistics]);

  const createScopeItem = useCallback(async (categoryId, data) => {
    try {
      const updated = await scopeService.createScopeItem(categoryId, data);
      setCategories(categories.map(cat => cat._id === categoryId ? updated : cat));
      await fetchStatistics();
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [categories, fetchStatistics]);

  const updateScopeItem = useCallback(async (categoryId, itemId, data) => {
    try {
      const updated = await scopeService.updateScopeItem(categoryId, itemId, data);
      setCategories(categories.map(cat => cat._id === categoryId ? updated : cat));
      await fetchStatistics();
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [categories, fetchStatistics]);

  const deleteScopeItem = useCallback(async (categoryId, itemId) => {
    try {
      const updated = await scopeService.deleteScopeItem(categoryId, itemId);
      setCategories(categories.map(cat => cat._id === categoryId ? updated : cat));
      await fetchStatistics();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [categories, fetchStatistics]);

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    categories,
    statistics,
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
    refetch: fetchCategories,
  };
};
