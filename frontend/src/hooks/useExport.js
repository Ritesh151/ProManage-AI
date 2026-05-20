import { useState, useCallback, useEffect } from 'react';
import { exportService } from '../services/exportService';

export const useExport = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(null);

  const fetchHistory = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const data = await exportService.getExportHistory(params).catch(() => ({
        exports: exportService.getMockHistory(),
      }));
      setHistory(data.exports || []);
    } catch (err) {
      console.error('Error fetching export history:', err);
      setHistory(exportService.getMockHistory());
    } finally {
      setLoading(false);
    }
  }, []);

  const exportToPDF = useCallback(async (data) => {
    setExporting(true);
    setError(null);
    try {
      const blob = await exportService.exportPDF(data);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `export_${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      fetchHistory();
    } catch (err) {
      setError(err.message);
    } finally {
      setExporting(false);
    }
  }, [fetchHistory]);

  const exportToDOCX = useCallback(async (data) => {
    setExporting(true);
    setError(null);
    try {
      const blob = await exportService.exportDOCX(data);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `export_${Date.now()}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      fetchHistory();
    } catch (err) {
      setError(err.message);
    } finally {
      setExporting(false);
    }
  }, [fetchHistory]);

  const exportToCSV = useCallback(async (data) => {
    setExporting(true);
    setError(null);
    try {
      const blob = await exportService.exportCSV(data);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `export_${Date.now()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      fetchHistory();
    } catch (err) {
      setError(err.message);
    } finally {
      setExporting(false);
    }
  }, [fetchHistory]);

  const exportToExcel = useCallback(async (data) => {
    setExporting(true);
    setError(null);
    try {
      const blob = await exportService.exportExcel(data);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `export_${Date.now()}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      fetchHistory();
    } catch (err) {
      setError(err.message);
    } finally {
      setExporting(false);
    }
  }, [fetchHistory]);

  const retryExport = useCallback(async (exportId) => {
    setExporting(true);
    setError(null);
    try {
      await exportService.retryExport(exportId);
      fetchHistory();
    } catch (err) {
      setError(err.message);
    } finally {
      setExporting(false);
    }
  }, [fetchHistory]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return {
    history,
    loading,
    exporting,
    error,
    exportToPDF,
    exportToDOCX,
    exportToCSV,
    exportToExcel,
    retryExport,
    refetchHistory: fetchHistory,
  };
};
