import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const trainingService = {
  startTraining: async () => {
    try {
      const response = await axios.post(`${API_BASE}/training/start`);
      return response.data;
    } catch (error) {
      console.error('Error starting training:', error);
      throw error;
    }
  },

  retrain: async () => {
    try {
      const response = await axios.post(`${API_BASE}/training/retrain`);
      return response.data;
    } catch (error) {
      console.error('Error retraining:', error);
      throw error;
    }
  },

  stopTraining: async () => {
    try {
      const response = await axios.post(`${API_BASE}/training/stop`);
      return response.data;
    } catch (error) {
      console.error('Error stopping training:', error);
      throw error;
    }
  },

  getStatus: async () => {
    try {
      const response = await axios.get(`${API_BASE}/training/status`);
      return response.data;
    } catch (error) {
      console.error('Error fetching training status:', error);
      throw error;
    }
  },

  getHistory: async (params = {}) => {
    try {
      const response = await axios.get(`${API_BASE}/training/history`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching training history:', error);
      throw error;
    }
  },

  getStats: async () => {
    try {
      const response = await axios.get(`${API_BASE}/training/knowledge-stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching training stats:', error);
      throw error;
    }
  },

  getLogs: async () => {
    try {
      const response = await axios.get(`${API_BASE}/ai/training/logs`);
      return response.data;
    } catch (error) {
      console.error('Error fetching training logs:', error);
      return { logs: [] };
    }
  },

  getMetrics: async () => {
    try {
      const response = await axios.get(`${API_BASE}/ai/training-metrics`);
      return response.data;
    } catch (error) {
      console.error('Error fetching training metrics:', error);
      throw error;
    }
  },

  semanticSearch: async (query, limit = 5) => {
    try {
      const response = await axios.post(`${API_BASE}/ai/semantic-search`, { query, limit });
      return response.data;
    } catch (error) {
      console.error('Error running semantic search:', error);
      throw error;
    }
  },
};
