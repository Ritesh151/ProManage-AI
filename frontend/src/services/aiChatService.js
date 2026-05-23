import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const aiChatService = {
  sendMessage: async (question, sessionId, userId = 'anonymous', userName = null, options = {}) => {
    const res = await axios.post(`${API_BASE}/ai/chat`, {
      question: options.originalQuestion || question,
      conversationId: sessionId,
      sessionId,
      userId,
      userName,
      resolveProjectName: options.resolveProjectName,
      pendingIntent: options.pendingIntent,
      originalQuestion: options.originalQuestion,
    });
    return res.data;
  },

  getHistory: async (userId = 'anonymous', limit = 20) => {
    const res = await axios.get(`${API_BASE}/ai/history`, { params: { userId, limit } });
    return res.data;
  },

  deleteSession: async (sessionId, userId = 'anonymous') => {
    const res = await axios.delete(`${API_BASE}/ai/history/${sessionId}`, {
      params: { userId },
    });
    return res.data;
  },

  clearChat: async (sessionId, userId = 'anonymous') => {
    const res = await axios.put(`${API_BASE}/ai/chat/${sessionId}/clear`, { userId });
    return res.data;
  },

  clearAllChats: async (userId = 'anonymous') => {
    const res = await axios.put(`${API_BASE}/ai/chat/clear-all`, { userId });
    return res.data;
  },

  getAllHistory: async (userId, limit = 100) => {
    const res = await axios.get(`${API_BASE}/ai/history/all`, { params: { userId, limit } });
    return res.data;
  },

  getConversations: async (userId = 'anonymous', limit = 20) => {
    const res = await axios.get(`${API_BASE}/ai/conversations`, { params: { userId, limit } });
    return res.data;
  },

  getConversation: async (sessionId) => {
    const res = await axios.get(`${API_BASE}/ai/conversation/${sessionId}`);
    return res.data;
  },

  clearConversation: async (sessionId) => {
    const res = await axios.delete(`${API_BASE}/ai/conversation/${sessionId}`);
    return res.data;
  },

  getProjects: async () => {
    const res = await axios.get(`${API_BASE}/ai/projects`);
    return res.data;
  },

  getProject: async (id) => {
    const res = await axios.get(`${API_BASE}/ai/project/${id}`);
    return res.data;
  },

  getClientProjects: async (name) => {
    const res = await axios.get(`${API_BASE}/ai/client/${encodeURIComponent(name)}`);
    return res.data;
  },

  getTrainingStatus: async () => {
    const res = await axios.get(`${API_BASE}/ai/status`);
    return res.data;
  },

  pinSession: async (sessionId, pinned = true) => {
    const res = await axios.patch(`${API_BASE}/ai/history/${sessionId}/pin`, { pinned });
    return res.data;
  },
};
