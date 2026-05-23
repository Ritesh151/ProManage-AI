import React, { createContext, useContext, useState, useCallback } from 'react';
import { aiChatService } from '../services/aiChatService';

const AIChatContext = createContext(null);

export const AIChatProvider = ({ children }) => {
  const [sessionId, setSessionId] = useState(null);
  const [lastProject, setLastProject] = useState(null);

  const createSession = useCallback(() => {
    const id = `sess-${Date.now()}`;
    setSessionId(id);
    return id;
  }, []);

  const sendMessage = useCallback(async (question, sid, userId) => {
    const res = await aiChatService.sendMessage(question, sid || sessionId, userId);
    if (res.data?.project) {
      setLastProject(res.data.project);
    }
    if (res.sessionId || res.conversationId) {
      setSessionId(res.sessionId || res.conversationId);
    }
    return res;
  }, [sessionId]);

  return (
    <AIChatContext.Provider
      value={{
        sessionId,
        setSessionId,
        lastProject,
        createSession,
        sendMessage,
      }}
    >
      {children}
    </AIChatContext.Provider>
  );
};

export const useAIChat = () => {
  const ctx = useContext(AIChatContext);
  if (!ctx) throw new Error('useAIChat must be used within AIChatProvider');
  return ctx;
};

export default AIChatContext;
