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
      const response = await axios.get(`${API_BASE}/ai/knowledge-base`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching knowledge base:', error);
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

  getMockSearchResults: (query) => [
    {
      id: 1,
      title: 'Database Schema Design',
      content: `The database schema includes tables for projects, proposals, and users. ${query} is implemented using...`,
      similarity: 0.95,
      source: 'backend/models/Project.js',
      project: 'ProposalForge',
      type: 'code',
    },
    {
      id: 2,
      title: 'API Documentation',
      content: `API endpoints are documented in the backend. ${query} endpoint returns...`,
      similarity: 0.87,
      source: 'backend/routes/projectRoutes.js',
      project: 'ProposalForge',
      type: 'documentation',
    },
    {
      id: 3,
      title: 'Frontend Components',
      content: `React components handle ${query} with proper state management...`,
      similarity: 0.82,
      source: 'frontend/src/pages/Projects.jsx',
      project: 'ProposalForge',
      type: 'code',
    },
  ],

  getMockKnowledgeBase: () => [
    { id: 1, name: 'ProposalForge', fileCount: 45, chunkCount: 1250, lastTrained: new Date(Date.now() - 86400000), status: 'indexed' },
    { id: 2, name: 'Backend API', fileCount: 28, chunkCount: 890, lastTrained: new Date(Date.now() - 172800000), status: 'indexed' },
    { id: 3, name: 'Frontend UI', fileCount: 32, chunkCount: 1050, lastTrained: new Date(Date.now() - 259200000), status: 'indexed' },
  ],
};
