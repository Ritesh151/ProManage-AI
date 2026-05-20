import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const analyticsService = {
  getOverview: async (params = {}) => {
    try {
      const response = await axios.get(`${API_BASE}/analytics/overview`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching analytics overview:', error);
      throw error;
    }
  },

  getRevenue: async (params = {}) => {
    try {
      const response = await axios.get(`${API_BASE}/analytics/revenue`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching revenue data:', error);
      throw error;
    }
  },

  getActivities: async (params = {}) => {
    try {
      const response = await axios.get(`${API_BASE}/analytics/activities`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching activities:', error);
      throw error;
    }
  },

  getMetrics: async (params = {}) => {
    try {
      const response = await axios.get(`${API_BASE}/analytics/metrics`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching metrics:', error);
      throw error;
    }
  },

  getMockOverview: () => ({
    totalRevenue: 125000,
    totalProjects: 24,
    activeProjects: 8,
    completedProjects: 16,
    averageProjectValue: 5208,
    monthlyGrowth: 12.5,
  }),

  getMockRevenue: () => [
    { month: 'Jan', revenue: 8000, target: 10000 },
    { month: 'Feb', revenue: 12000, target: 10000 },
    { month: 'Mar', revenue: 9500, target: 10000 },
    { month: 'Apr', revenue: 15000, target: 10000 },
    { month: 'May', revenue: 18000, target: 10000 },
    { month: 'Jun', revenue: 22000, target: 10000 },
  ],

  getMockActivities: () => [
    { id: 1, type: 'project_created', description: 'New project created', timestamp: new Date(Date.now() - 3600000) },
    { id: 2, type: 'proposal_sent', description: 'Proposal sent to client', timestamp: new Date(Date.now() - 7200000) },
    { id: 3, type: 'project_completed', description: 'Project completed', timestamp: new Date(Date.now() - 86400000) },
    { id: 4, type: 'payment_received', description: 'Payment received', timestamp: new Date(Date.now() - 172800000) },
  ],
};
