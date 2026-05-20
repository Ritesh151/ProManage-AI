/**
 * AI Chat Page
 * Main page for AI assistant interaction
 */

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { AIChatWindow } from '../components/AIChatWindow';
import AIChatHistory from '../components/AIChatHistory';
import AIProjectSidebar from '../components/AIProjectSidebar';
import AITyping from '../components/AITyping';
import { FiSend, FiRefreshCw, FiTrash2 } from 'react-icons/fi';
import './AIChat.css';

const AIChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [aiStatus, setAiStatus] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef(null);

  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // Initialize
  useEffect(() => {
    fetchStatus();
    fetchProjects();
    fetchConversations();
    generateNewConversation();
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchStatus = async () => {
    try {
      const response = await axios.get(`${API_BASE}/ai/status`);
      setAiStatus(response.data);
    } catch (err) {
      console.error('Error fetching AI status:', err);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${API_BASE}/ai/projects`);
      setProjects(response.data.projects);
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  };

  const fetchConversations = async () => {
    try {
      const response = await axios.get(`${API_BASE}/ai/conversations?limit=10`);
      setConversations(response.data.conversations);
    } catch (err) {
      console.error('Error fetching conversations:', err);
    }
  };

  const generateNewConversation = () => {
    const newId = `conv-${Date.now()}`;
    setConversationId(newId);
    setMessages([]);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!input.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE}/ai/chat`, {
        question: input,
        conversationId,
        userId: 'user',
      });

      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.data.answer,
        sources: response.data.sources,
        responseTime: response.data.responseTime,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: `Error: ${err.response?.data?.error || err.message}`,
        isError: true,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm('Clear this conversation?')) {
      generateNewConversation();
    }
  };

  const handleLoadConversation = async (conv) => {
    setConversationId(conv._id);
    setMessages(
      conv.messages.map((msg, idx) => ({
        id: idx,
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp,
      }))
    );
    setShowHistory(false);
  };

  const handleTrainAI = async () => {
    if (window.confirm('Start AI training? This may take a while.')) {
      try {
        setLoading(true);
        await axios.post(`${API_BASE}/ai/train`);
        alert('Training started. Check status for progress.');
        fetchStatus();
      } catch (err) {
        alert(`Error: ${err.response?.data?.error || err.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="ai-chat-container">
      <div className="ai-chat-layout">
        {/* Sidebar */}
        <AIProjectSidebar
          projects={projects}
          selectedProject={selectedProject}
          onSelectProject={setSelectedProject}
          status={aiStatus}
          onTrain={handleTrainAI}
          onShowHistory={() => setShowHistory(!showHistory)}
        />

        {/* Main Chat Area */}
        <div className="ai-chat-main">
          {/* Header */}
          <div className="ai-chat-header">
            <div className="ai-chat-title">
              <h1>🤖 Project AI Assistant</h1>
              <p>Ask questions about your projects</p>
            </div>
            <div className="ai-chat-actions">
              <button
                className="ai-btn ai-btn-secondary"
                onClick={handleTrainAI}
                disabled={loading}
                title="Train AI on project files"
              >
                <FiRefreshCw /> Train
              </button>
              <button
                className="ai-btn ai-btn-danger"
                onClick={handleClearChat}
                disabled={loading}
                title="Clear conversation"
              >
                <FiTrash2 /> Clear
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="ai-chat-messages">
            {messages.length === 0 ? (
              <div className="ai-chat-empty">
                <div className="ai-empty-icon">💬</div>
                <h2>Start a conversation</h2>
                <p>Ask me anything about your projects</p>
                <div className="ai-example-questions">
                  <p className="ai-example-label">Example questions:</p>
                  <button
                    className="ai-example-btn"
                    onClick={() => setInput('How was the PDF export implemented?')}
                  >
                    How was the PDF export implemented?
                  </button>
                  <button
                    className="ai-example-btn"
                    onClick={() => setInput('What technologies are used in the backend?')}
                  >
                    What technologies are used in the backend?
                  </button>
                  <button
                    className="ai-example-btn"
                    onClick={() => setInput('Explain the project structure')}
                  >
                    Explain the project structure
                  </button>
                </div>
              </div>
            ) : (
              <>
                <AIChatWindow messages={messages} />
                {loading && <AITyping />}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input */}
          <form className="ai-chat-input-form" onSubmit={handleSendMessage}>
            <div className="ai-input-wrapper">
              <input
                type="text"
                className="ai-chat-input"
                placeholder="Ask a question about your projects..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
              />
              <button
                type="submit"
                className="ai-send-btn"
                disabled={loading || !input.trim()}
              >
                <FiSend />
              </button>
            </div>
          </form>
        </div>

        {/* History Sidebar */}
        {showHistory && (
          <AIChatHistory
            conversations={conversations}
            onSelectConversation={handleLoadConversation}
            onClose={() => setShowHistory(false)}
          />
        )}
      </div>
    </div>
  );
};

export default AIChat;
