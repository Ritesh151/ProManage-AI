import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const trainingService = {
  startTraining: async (projectIds = []) => {
    try {
      const response = await axios.post(`${API_BASE}/ai/train`, { projectIds });
      return response.data;
    } catch (error) {
      console.error('Error starting training:', error);
      throw error;
    }
  },

  retrain: async (sessionId) => {
    try {
      const response = await axios.post(`${API_BASE}/ai/retrain`, { sessionId });
      return response.data;
    } catch (error) {
      console.error('Error retraining:', error);
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

  getSessionLogs: async (sessionId) => {
    try {
      const response = await axios.get(`${API_BASE}/ai/training/${sessionId}/logs`);
      return response.data;
    } catch (error) {
      console.error('Error fetching session logs:', error);
      throw error;
    }
  },

  getMockStatus: () => ({
    status: 'idle',
    documents: 45,
    processedDocuments: 45,
    totalChunks: 1250,
    projects: 8,
    currentSession: null,
    lastTraining: new Date(Date.now() - 86400000),
  }),

  getMockHistory: () => [
    { id: 1, startTime: new Date(Date.now() - 86400000), endTime: new Date(Date.now() - 82800000), status: 'completed', filesProcessed: 45, chunksCreated: 1250 },
    { id: 2, startTime: new Date(Date.now() - 172800000), endTime: new Date(Date.now() - 169200000), status: 'completed', filesProcessed: 42, chunksCreated: 1180 },
  ],
};
