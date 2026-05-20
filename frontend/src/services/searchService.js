import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const searchService = {
  semanticSearch: async (query, params = {}) => {
    try {
      const response = await axios.get(`${API_BASE}/ai/search`, {
        params: { q: query, ...params },
      });
      return response.data;
    } catch (error) {
      console.error('Error performing semantic search:', error);
      throw error;
    }
  },

  getKnowledgeBase: async (params = {}) => {
    try {
      const response = await axios.get(`${API_BASE}/ai/knowledge`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching knowledge base:', error);
      throw error;
    }
  },

  getKnowledgeBaseSearch: async (query, params = {}) => {
    try {
      const response = await axios.get(`${API_BASE}/ai/knowledge/search`, {
        params: { q: query, ...params },
      });
      return response.data;
    } catch (error) {
      console.error('Error searching knowledge base:', error);
      throw error;
    }
  },

  getProjects: async () => {
    try {
      const response = await axios.get(`${API_BASE}/ai/projects`);
      return response.data;
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  },
};
