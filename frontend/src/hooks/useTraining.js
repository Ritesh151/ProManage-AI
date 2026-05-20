import { useState, useEffect, useCallback, useRef } from 'react';
import { trainingService } from '../services/trainingService';

export const useTraining = () => {
  const [status, setStatus] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [training, setTraining] = useState(false);
  const [error, setError] = useState(null);
  const pollIntervalRef = useRef(null);

  const fetchStatus = useCallback(async () => {
    try {
      const data = await trainingService.getStatus().catch(() => trainingService.getMockStatus());
      setStatus(data);
    } catch (err) {
      console.error('Error fetching training status:', err);
      setStatus(trainingService.getMockStatus());
    }
  }, []);

  const fetchHistory = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const data = await trainingService.getHistory(params).catch(() => ({
        sessions: trainingService.getMockHistory(),
      }));
      setHistory(data.sessions || []);
    } catch (err) {
      console.error('Error fetching training history:', err);
      setHistory(trainingService.getMockHistory());
    } finally {
      setLoading(false);
    }
  }, []);

  const startTraining = useCallback(async (projectIds = []) => {
    setTraining(true);
    setError(null);
    try {
      const response = await trainingService.startTraining(projectIds);
      setStatus(response);
      
      // Poll for status updates
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = setInterval(async () => {
        const updatedStatus = await trainingService.getStatus().catch(() => trainingService.getMockStatus());
        setStatus(updatedStatus);
        
        if (updatedStatus.currentSession?.status === 'completed' || updatedStatus.currentSession?.status === 'failed') {
          clearInterval(pollIntervalRef.current);
          setTraining(false);
          fetchHistory();
        }
      }, 2000);
    } catch (err) {
      setError(err.message);
      setTraining(false);
    }
  }, [fetchHistory]);

  const retrain = useCallback(async (sessionId) => {
    setTraining(true);
    setError(null);
    try {
      const response = await trainingService.retrain(sessionId);
      setStatus(response);
      
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = setInterval(async () => {
        const updatedStatus = await trainingService.getStatus().catch(() => trainingService.getMockStatus());
        setStatus(updatedStatus);
        
        if (updatedStatus.currentSession?.status === 'completed' || updatedStatus.currentSession?.status === 'failed') {
          clearInterval(pollIntervalRef.current);
          setTraining(false);
          fetchHistory();
        }
      }, 2000);
    } catch (err) {
      setError(err.message);
      setTraining(false);
    }
  }, [fetchHistory]);

  useEffect(() => {
    fetchStatus();
    fetchHistory();

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [fetchStatus, fetchHistory]);

  return {
    status,
    history,
    loading,
    training,
    error,
    startTraining,
    retrain,
    refetchStatus: fetchStatus,
    refetchHistory: fetchHistory,
  };
};
