import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const STORAGE_KEY = 'app_settings';

export const settingsService = {
  getSettings: async () => {
    try {
      const response = await axios.get(`${API_BASE}/settings`);
      return response.data;
    } catch (error) {
      console.error('Error fetching settings:', error);
      return settingsService.getLocalSettings();
    }
  },

  updateSettings: async (settings) => {
    try {
      const response = await axios.put(`${API_BASE}/settings`, settings);
      settingsService.saveLocalSettings(settings);
      return response.data;
    } catch (error) {
      console.error('Error updating settings:', error);
      settingsService.saveLocalSettings(settings);
      throw error;
    }
  },

  saveLocalSettings: (settings) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  },

  getLocalSettings: () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : settingsService.getDefaultSettings();
  },

  getDefaultSettings: () => ({
    general: {
      appName: 'ProposalForge',
      language: 'en',
      timezone: 'UTC',
    },
    theme: {
      mode: 'light',
      primaryColor: '#3b82f6',
      accentColor: '#8b5cf6',
    },
    ai: {
      provider: 'openai',
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 2000,
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      trainingAlerts: true,
      exportAlerts: true,
    },
    api: {
      apiKey: '',
      apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    },
  }),

  validateApiKey: async (apiKey) => {
    try {
      const response = await axios.post(`${API_BASE}/settings/validate-api-key`, { apiKey });
      return response.data;
    } catch (error) {
      console.error('Error validating API key:', error);
      throw error;
    }
  },
};
