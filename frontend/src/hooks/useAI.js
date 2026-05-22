import { useState, useEffect, useCallback, useRef } from 'react';
import { aiService } from '../services/aiService';

export const useAI = () => {
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);
  const [training, setTraining] = useState(false);
  const [trainingStatus, setTrainingStatus] = useState(null);
  const [trainingStats, setTrainingStats] = useState(null);
  const [trainingLogs, setTrainingLogs] = useState([]);
  const abortControllerRef = useRef(null);
  const pollIntervalRef = useRef(null);

  const fetchConversations = useCallback(async () => {
    try {
      const data = await aiService.getConversations({ limit: 20 });
      setConversations(data.conversations || []);
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setConversations([]);
    }
  }, []);

  const fetchStatus = useCallback(async () => {
    try {
      const data = await aiService.getStatus();
      setStatus(data);
    } catch (err) {
      console.error('Error fetching status:', err);
    }
  }, []);

  const fetchTrainingStatus = useCallback(async () => {
    try {
      const data = await aiService.getStatus();
      setTrainingStatus(data);
      setTraining(data.isTraining || false);
    } catch (err) {
      console.error('Error fetching training status:', err);
    }
  }, []);

  const fetchTrainingStats = useCallback(async () => {
    try {
      const data = await aiService.getTrainingStats();
      setTrainingStats(data);
    } catch (err) {
      console.error('Error fetching training stats:', err);
    }
  }, []);

  const fetchTrainingLogs = useCallback(async () => {
    try {
      const data = await aiService.getTrainingLogs();
      setTrainingLogs(data.logs || []);
    } catch (err) {
      console.error('Error fetching training logs:', err);
    }
  }, []);

  const startPolling = useCallback(() => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);

    pollIntervalRef.current = setInterval(async () => {
      try {
        const data = await aiService.getStatus();
        setTrainingStatus(data);
        setTraining(data.isTraining || false);

        const logsData = await aiService.getTrainingLogs();
        setTrainingLogs(logsData.logs || []);

        if (!data.isTraining) {
          clearInterval(pollIntervalRef.current);
          setTraining(false);
          fetchTrainingStats();
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 2000);
  }, [fetchTrainingStats]);

  const startTraining = useCallback(async () => {
    setTraining(true);
    setError(null);
    setTrainingLogs([]);
    try {
      await aiService.startTraining();
      startPolling();
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      setTraining(false);
    }
  }, [startPolling]);

  const retrain = useCallback(async () => {
    setTraining(true);
    setError(null);
    setTrainingLogs([]);
    try {
      await aiService.retrain();
      startPolling();
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      setTraining(false);
    }
  }, [startPolling]);

  const stopTraining = useCallback(async () => {
    try {
      await aiService.stopTraining();
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      setTraining(false);
      fetchTrainingStatus();
      fetchTrainingStats();
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  }, [fetchTrainingStatus, fetchTrainingStats]);

  const sendMessage = useCallback(async (message) => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setError(null);

    try {
      abortControllerRef.current = new AbortController();
      const response = await aiService.sendMessage(message, currentConversation?.id);

      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.answer || response.content,
        sources: response.sources,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError(err.message);
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: `Error: ${err.message}`,
        isError: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  }, [currentConversation]);

  const createConversation = useCallback(() => {
    const newConversation = {
      id: `conv-${Date.now()}`,
      title: 'New Conversation',
      timestamp: new Date(),
      messageCount: 0,
    };
    setCurrentConversation(newConversation);
    setMessages([]);
    setConversations((prev) => [newConversation, ...prev]);
  }, []);

  const selectConversation = useCallback(async (conversation) => {
    setCurrentConversation(conversation);
    setMessages([]);
    setLoading(true);
    try {
      const data = await aiService.getConversation(conversation.id);
      setMessages(data.messages || []);
    } catch (err) {
      console.error('Error loading conversation:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteConversation = useCallback(async (conversationId) => {
    try {
      await aiService.deleteConversation(conversationId);
      setConversations((prev) => prev.filter((c) => c.id !== conversationId));
      if (currentConversation?.id === conversationId) {
        setCurrentConversation(null);
        setMessages([]);
      }
    } catch (err) {
      console.error('Error deleting conversation:', err);
    }
  }, [currentConversation]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  useEffect(() => {
    fetchConversations();
    fetchStatus();
    fetchTrainingStatus();
    fetchTrainingStats();

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [fetchConversations, fetchStatus, fetchTrainingStatus, fetchTrainingStats]);

  return {
    conversations,
    currentConversation,
    messages,
    loading,
    error,
    status,
    training,
    trainingStatus,
    trainingStats,
    trainingLogs,
    sendMessage,
    createConversation,
    selectConversation,
    deleteConversation,
    clearMessages,
    startTraining,
    retrain,
    stopTraining,
    refetchConversations: fetchConversations,
    refetchTrainingStatus: fetchTrainingStatus,
    refetchTrainingStats: fetchTrainingStats,
    refetchTrainingLogs: fetchTrainingLogs,
  };
};
