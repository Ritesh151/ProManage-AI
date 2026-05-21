import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const scopeService = {
  getCategories: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.priceMin) params.append('priceMin', filters.priceMin);
      if (filters.priceMax) params.append('priceMax', filters.priceMax);
      if (filters.sort) params.append('sort', filters.sort);

      const response = await axios.get(`${API_BASE}/scopes?${params.toString()}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  getCategory: async (id) => {
    try {
      const response = await axios.get(`${API_BASE}/scopes/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching category:', error);
      throw error;
    }
  },

  getScopeByCategory: async (categoryName) => {
    try {
      const categories = await scopeService.getCategories();
      const category = categories.find(cat => cat.name === categoryName);
      if (category) {
        return {
          data: category.scopeItems.map(item => ({
            _id: item._id,
            title: item.title,
            name: item.title,
            description: item.description || '',
            price: item.price || 0,
            currency: item.currency || 'INR',
          }))
        };
      }
      return { data: [] };
    } catch (error) {
      console.error('Error fetching scope items by category:', error);
      throw error;
    }
  },

  createCategory: async (data) => {
    try {
      const response = await axios.post(`${API_BASE}/scopes`, data);
      return response.data.data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  updateCategory: async (id, data) => {
    try {
      const response = await axios.put(`${API_BASE}/scopes/${id}`, data);
      return response.data.data;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },

  deleteCategory: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE}/scopes/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  },

  createScopeItem: async (categoryId, data) => {
    try {
      const response = await axios.post(`${API_BASE}/scopes/${categoryId}/items`, data);
      return response.data.data;
    } catch (error) {
      console.error('Error creating scope item:', error);
      throw error;
    }
  },

  updateScopeItem: async (categoryId, itemId, data) => {
    try {
      const response = await axios.put(`${API_BASE}/scopes/${categoryId}/items/${itemId}`, data);
      return response.data.data;
    } catch (error) {
      console.error('Error updating scope item:', error);
      throw error;
    }
  },

  deleteScopeItem: async (categoryId, itemId) => {
    try {
      const response = await axios.delete(`${API_BASE}/scopes/${categoryId}/items/${itemId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error deleting scope item:', error);
      throw error;
    }
  },

  getStatistics: async () => {
    try {
      const response = await axios.get(`${API_BASE}/scopes/statistics`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching statistics:', error);
      throw error;
    }
  },
};
