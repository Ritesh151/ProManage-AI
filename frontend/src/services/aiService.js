import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const aiService = {
  sendMessage: async (message, conversationId) => {
    try {
      const response = await axios.post(`${API_BASE}/ai/chat`, {
        question: message,
        conversationId,
        userId: 'user',
      });
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  getConversations: async (params = {}) => {
    try {
      const response = await axios.get(`${API_BASE}/ai/conversations`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
  },

  getConversation: async (id) => {
    try {
      const response = await axios.get(`${API_BASE}/ai/conversations/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching conversation:', error);
      throw error;
    }
  },

  deleteConversation: async (id) => {
    try {
      await axios.delete(`${API_BASE}/ai/conversations/${id}`);
    } catch (error) {
      console.error('Error deleting conversation:', error);
      throw error;
    }
  },

  getStatus: async () => {
    try {
      const response = await axios.get(`${API_BASE}/ai/status`);
      return response.data;
    } catch (error) {
      console.error('Error fetching AI status:', error);
      throw error;
    }
  },

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

  getTrainingHistory: async (params = {}) => {
    try {
      const response = await axios.get(`${API_BASE}/ai/training-history`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching training history:', error);
      throw error;
    }
  },

  getTrainingStats: async () => {
    try {
      const response = await axios.get(`${API_BASE}/ai/training-stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching training stats:', error);
      throw error;
    }
  },

  getTrainingLogs: async () => {
    try {
      const response = await axios.get(`${API_BASE}/ai/training/logs`);
      return response.data;
    } catch (error) {
      console.error('Error fetching training logs:', error);
      throw error;
    }
  },
};
