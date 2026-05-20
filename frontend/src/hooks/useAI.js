import { useState, useEffect, useCallback, useRef } from 'react';
import { aiService } from '../services/aiService';

export const useAI = () => {
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);
  const abortControllerRef = useRef(null);

  const fetchConversations = useCallback(async () => {
    try {
      const data = await aiService.getConversations({ limit: 20 }).catch(() => ({
        conversations: aiService.getMockConversations(),
      }));
      setConversations(data.conversations || []);
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setConversations(aiService.getMockConversations());
    }
  }, []);

  const fetchStatus = useCallback(async () => {
    try {
      const data = await aiService.getStatus().catch(() => ({}));
      setStatus(data);
    } catch (err) {
      console.error('Error fetching status:', err);
    }
  }, []);

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
      const data = await aiService.getConversation(conversation.id).catch(() => ({
        messages: [],
      }));
      setMessages(data.messages || []);
    } catch (err) {
      console.error('Error loading conversation:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteConversation = useCallback(async (conversationId) => {
    try {
      await aiService.deleteConversation(conversationId).catch(() => {});
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
  }, [fetchConversations, fetchStatus]);

  return {
    conversations,
    currentConversation,
    messages,
    loading,
    error,
    status,
    sendMessage,
    createConversation,
    selectConversation,
    deleteConversation,
    clearMessages,
    refetchConversations: fetchConversations,
  };
};
