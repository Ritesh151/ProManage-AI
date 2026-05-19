import { useState, useEffect, useCallback } from 'react';
import { categoryAPI } from '../services/api';

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [scopeByCategory, setScopeByCategory] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await categoryAPI.getAll();
      const data = res.data.data || {};
      setScopeByCategory(data.scopeByCategory || {});
      setCategories(data.categories || []);
    } catch {
      setScopeByCategory({});
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const getScopeByCategory = useCallback((category) => {
    return scopeByCategory[category] || [];
  }, [scopeByCategory]);

  return { categories, scopeByCategory, getScopeByCategory, loading, refetch: fetchCategories };
}
