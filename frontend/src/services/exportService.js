import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const exportService = {
  exportPDF: async (data) => {
    try {
      const response = await axios.post(`${API_BASE}/export/pdf`, data, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting PDF:', error);
      throw error;
    }
  },

  exportDOCX: async (data) => {
    try {
      const response = await axios.post(`${API_BASE}/export/docx`, data, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting DOCX:', error);
      throw error;
    }
  },

  exportCSV: async (data) => {
    try {
      const response = await axios.post(`${API_BASE}/export/csv`, data, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting CSV:', error);
      throw error;
    }
  },

  exportExcel: async (data) => {
    try {
      const response = await axios.post(`${API_BASE}/export/excel`, data, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting Excel:', error);
      throw error;
    }
  },

  getExportHistory: async (params = {}) => {
    try {
      const response = await axios.get(`${API_BASE}/export/history`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching export history:', error);
      throw error;
    }
  },

  retryExport: async (exportId) => {
    try {
      const response = await axios.post(`${API_BASE}/export/${exportId}/retry`);
      return response.data;
    } catch (error) {
      console.error('Error retrying export:', error);
      throw error;
    }
  },

  getMockHistory: () => [
    { id: 1, type: 'PDF', fileName: 'proposal_2024.pdf', status: 'completed', timestamp: new Date(Date.now() - 3600000), size: '2.5 MB' },
    { id: 2, type: 'Excel', fileName: 'projects_data.xlsx', status: 'completed', timestamp: new Date(Date.now() - 7200000), size: '1.2 MB' },
    { id: 3, type: 'CSV', fileName: 'export_2024.csv', status: 'failed', timestamp: new Date(Date.now() - 86400000), size: '0 MB' },
  ],
};
