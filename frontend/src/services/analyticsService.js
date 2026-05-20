import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const analyticsService = {
  getFullAnalytics: async () => {
    try {
      const response = await axios.get(`${API_BASE}/dashboard/analytics`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  },

  getOverview: async () => {
    try {
      const response = await axios.get(`${API_BASE}/dashboard`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching overview:', error);
      throw error;
    }
  },
};
