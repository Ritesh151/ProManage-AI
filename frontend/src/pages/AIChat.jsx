// src/pages/AIChat.js
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { AIChatWindow } from '../components/AIChatWindow';
import AIChatHistory from '../components/AIChatHistory';
import AIProjectSidebar from '../components/AIProjectSidebar';
import AITyping from '../components/AITyping';
import { FiSend, FiRefreshCw, FiTrash2, FiMenu, FiX, FiCpu } from 'react-icons/fi';

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
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
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
  }, [messages, loading]);

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
      setProjects(response.data.projects || []);
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  };

  const fetchConversations = async () => {
    try {
      const response = await axios.get(`${API_BASE}/ai/conversations?limit=10`);
      setConversations(response.data.conversations || []);
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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
          className="absolute top-20 -left-48 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 dark:opacity-20"
        />
        <motion.div
          animate={{ x: [0, -100, 0], y: [0, 80, 0] }}
          transition={{ duration: 25, repeat: Infinity, repeatType: "reverse" }}
          className="absolute top-40 -right-48 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 dark:opacity-20"
        />
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, -50, 0] }}
          transition={{ duration: 22, repeat: Infinity, repeatType: "reverse" }}
          className="absolute -bottom-48 left-1/3 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 dark:opacity-20"
        />
      </div>

      <div className="relative z-10 h-screen flex">
        {/* Mobile Menu Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border border-white/20 dark:border-slate-700/50 shadow-lg"
          onClick={() => setShowMobileSidebar(!showMobileSidebar)}
        >
          {showMobileSidebar ? <FiX size={20} /> : <FiMenu size={20} />}
        </motion.button>

        {/* Sidebar - Desktop always, Mobile conditional */}
        <div className={`
          ${showMobileSidebar ? 'fixed inset-0 z-40 lg:relative lg:inset-auto' : 'hidden lg:block'}
          lg:block
        `}>
          <AIProjectSidebar
            projects={projects}
            selectedProject={selectedProject}
            onSelectProject={(project) => {
              setSelectedProject(project);
              setShowMobileSidebar(false);
            }}
            status={aiStatus}
            onTrain={handleTrainAI}
            onShowHistory={() => {
              setShowHistory(!showHistory);
              setShowMobileSidebar(false);
            }}
            onCloseMobile={() => setShowMobileSidebar(false)}
          />
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col lg:ml-0">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-b border-white/20 dark:border-slate-700/50 shadow-lg"
          >
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/10 to-pink-500/10">
                  <FiCpu size={20} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                    Project AI Assistant
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Ask questions about your projects
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-pink-500 text-white text-sm font-medium shadow-md hover:shadow-lg transition-all"
                  onClick={handleTrainAI}
                  disabled={loading}
                >
                  <FiRefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                  Train AI
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-2 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-all"
                  onClick={handleClearChat}
                  disabled={loading}
                  title="Clear conversation"
                >
                  <FiTrash2 size={18} />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            {messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]"
              >
                <div className="w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-pink-500/10 flex items-center justify-center">
                  <span className="text-4xl">💬</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">
                  Start a conversation
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8">
                  Ask me anything about your projects
                </p>
                
                <div className="w-full max-w-2xl">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3 text-center">
                    Example questions:
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {[
                      'How was the PDF export implemented?',
                      'What technologies are used in the backend?',
                      'Explain the project structure',
                      'How do I create a new project?'
                    ].map((question, idx) => (
                      <motion.button
                        key={idx}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setInput(question)}
                        className="px-4 py-2 rounded-xl backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 text-sm text-gray-700 dark:text-gray-300 hover:border-blue-500 transition-all"
                      >
                        {question}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <>
                <AIChatWindow messages={messages} />
                {loading && <AITyping />}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-t border-white/20 dark:border-slate-700/50 shadow-lg p-4"
          >
            <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  className="w-full px-5 py-3 pr-14 rounded-xl backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  placeholder="Ask a question about your projects..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={loading}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-gradient-to-r from-blue-600 to-pink-500 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <FiSend size={18} />
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>

        {/* History Sidebar */}
        <AnimatePresence>
          {showHistory && (
            <AIChatHistory
              conversations={conversations}
              onSelectConversation={handleLoadConversation}
              onClose={() => setShowHistory(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AIChat;
