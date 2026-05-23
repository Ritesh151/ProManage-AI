import { useState, useEffect, useCallback, useRef } from 'react';
import { trainingService } from '../services/trainingService';

export const useTraining = () => {
  const [status, setStatus] = useState(null);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [training, setTraining] = useState(false);
  const [error, setError] = useState(null);
  const pollIntervalRef = useRef(null);

  const fetchStatus = useCallback(async () => {
    try {
      const data = await trainingService.getStatus();
      setStatus(data);
      setTraining(data.isTraining || false);
    } catch (err) {
      console.error('Error fetching training status:', err);
      setStatus({ status: 'error', isTraining: false, progress: 0, logs: [] });
      setTraining(false);
    }
  }, []);

  const fetchHistory = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const data = await trainingService.getHistory(params);
      setHistory(data.history || []);
    } catch (err) {
      console.error('Error fetching training history:', err);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const data = await trainingService.getStats();
      setStats(data);
    } catch (err) {
      console.error('Error fetching training stats:', err);
    }
  }, []);

  const fetchLogs = useCallback(async () => {
    try {
      const data = await trainingService.getLogs();
      setLogs(data.logs || []);
    } catch (err) {
      console.error('Error fetching training logs:', err);
    }
  }, []);

  const startPolling = useCallback(() => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);

    pollIntervalRef.current = setInterval(async () => {
      try {
        const updatedStatus = await trainingService.getStatus();
        setStatus(updatedStatus);
        setTraining(updatedStatus.isTraining || false);

        const logsData = await trainingService.getLogs();
        setLogs(logsData.logs || []);

        if (!updatedStatus.isTraining) {
          clearInterval(pollIntervalRef.current);
          setTraining(false);
          fetchHistory();
          fetchStats();
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 2000);
  }, [fetchHistory, fetchStats]);

  const startTraining = useCallback(async () => {
    setTraining(true);
    setError(null);
    setLogs([]);
    try {
      await trainingService.startTraining();
      startPolling();
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      setTraining(false);
    }
  }, [startPolling]);

  const retrain = useCallback(async () => {
    setTraining(true);
    setError(null);
    setLogs([]);
    try {
      await trainingService.retrain();
      startPolling();
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      setTraining(false);
    }
  }, [startPolling]);

  const stopTraining = useCallback(async () => {
    try {
      await trainingService.stopTraining();
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      setTraining(false);
      fetchStatus();
      fetchHistory();
      fetchStats();
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  }, [fetchStatus, fetchHistory, fetchStats]);

  useEffect(() => {
    fetchStatus();
    fetchHistory();
    fetchStats();
    fetchLogs();

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [fetchStatus, fetchHistory, fetchStats, fetchLogs]);

  useEffect(() => {
    if (training && !pollIntervalRef.current) {
      startPolling();
    }
  }, [training, startPolling]);

  return {
    status,
    history,
    stats,
    logs,
    loading,
    training,
    error,
    startTraining,
    retrain,
    stopTraining,
    refetchStatus: fetchStatus,
    refetchHistory: fetchHistory,
    refetchStats: fetchStats,
    refetchLogs: fetchLogs,
  };
};
