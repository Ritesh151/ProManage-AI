import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const trainingService = {
  startTraining: async () => {
    try {
      const response = await axios.post(`${API_BASE}/ai/train`);
      return response.data;
    } catch (error) {
      console.error('Error starting training:', error);
      throw error;
    }
  },

  retrain: async () => {
    try {
      const response = await axios.post(`${API_BASE}/ai/retrain`);
      return response.data;
    } catch (error) {
      console.error('Error retraining:', error);
      throw error;
    }
  },

  stopTraining: async () => {
    try {
      const response = await axios.post(`${API_BASE}/ai/stop`);
      return response.data;
    } catch (error) {
      console.error('Error stopping training:', error);
      throw error;
    }
  },

  getStatus: async () => {
    try {
      const response = await axios.get(`${API_BASE}/ai/status`);
      return response.data;
    } catch (error) {
      console.error('Error fetching training status:', error);
      throw error;
    }
  },

  getHistory: async (params = {}) => {
    try {
      const response = await axios.get(`${API_BASE}/ai/training-history`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching training history:', error);
      throw error;
    }
  },

  getStats: async () => {
    try {
      const response = await axios.get(`${API_BASE}/ai/training-stats`);
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
      throw error;
    }
  },
};
