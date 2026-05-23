import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiSend, FiPlus, FiTrash2, FiMenu, FiX, FiCpu, FiDatabase,
  FiMessageSquare, FiPaperclip, FiMic, FiZap, FiFolder, FiClock,
  FiChevronRight, FiSearch, FiStar, FiTarget,
} from 'react-icons/fi';
import { aiChatService } from '../services/aiChatService';
import { AssistantMessage } from '../components/ai/AssistantMessage';
import { StreamingMessage } from '../components/ai/StreamingMessage';
import { ChatSkeleton } from '../components/ai/ChatSkeleton';
import AITyping from '../components/AITyping';

const SUGGESTED_PROMPTS = [
  'Give me proposal of Project RadheDispoWorld',
  'What technologies are used in Project RadheDispoWorld?',
  'Show projects of client ABC Company',
  'How was PDF export implemented?',
  'Show details of Project RadheDispoWorld',
  'How do I create a project?',
];

const QUICK_ACTIONS = [
  { label: 'List Projects', prompt: 'Show all recent projects' },
  { label: 'PDF Export', prompt: 'How was PDF export implemented?' },
  { label: 'Architecture', prompt: 'Explain project structure' },
  { label: 'Help', prompt: 'What can you help me with?' },
];

const AIChat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [projects, setProjects] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [dbConnected, setDbConnected] = useState(true);
  const [currentProject, setCurrentProject] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);
  const [streamingId, setStreamingId] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const [followUpSuggestions, setFollowUpSuggestions] = useState([]);
  const [confirmModal, setConfirmModal] = useState(null);
  const [lastMessage, setLastMessage] = useState(null);
  const messagesEndRef = useRef(null);

  const newSession = useCallback(() => {
    const id = `sess-${Date.now()}`;
    setSessionId(id);
    setMessages([]);
    setCurrentProject(null);
    setStreamingId(null);
    setFollowUpSuggestions([]);
    setLastMessage(null);
  }, []);

  useEffect(() => {
    newSession();
    loadProjects();
    loadSessions();
    checkHealth();
    setInitialLoad(false);
  }, [newSession]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (lastMessage?.responseType === 'navigation' && lastMessage?.route) {
      console.log('Navigation response:', lastMessage);
      console.log('Route:', lastMessage.route);
      const timer = setTimeout(() => {
        try {
          navigate(lastMessage.route);
          console.log('Redirect success');
        } catch {
          window.location.href = lastMessage.route;
        }
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [lastMessage, navigate]);

  const checkHealth = async () => {
    try {
      await aiChatService.getTrainingStatus();
      setDbConnected(true);
    } catch {
      setDbConnected(false);
    }
  };

  const loadProjects = async () => {
    try {
      const data = await aiChatService.getProjects();
      setProjects(data.projects || []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadSessions = async () => {
    try {
      const data = await aiChatService.getHistory();
      setSessions(data.history || []);
    } catch {
      try {
        const alt = await aiChatService.getConversations();
        setSessions(alt.conversations || []);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const loadSession = async (sess) => {
    const id = sess.sessionId || sess._id;
    setSessionId(id);
    try {
      const data = await aiChatService.getConversation(id);
      const msgs = (data.messages || data.conversation?.messages || []).map((m, idx) => ({
        id: idx,
        role: m.role,
        content: m.content,
        format: m.format,
        data: m.data,
        intent: m.intent,
        timestamp: m.timestamp,
      }));
      setMessages(msgs);
      if (data.conversation?.currentProject) {
        setCurrentProject(data.conversation.currentProject);
      }
    } catch {
      setMessages(
        (sess.messages || []).map((m, idx) => ({
          id: idx,
          role: m.role,
          content: m.content,
          timestamp: m.timestamp,
        }))
      );
    }
    setMobileSidebar(false);
  };

  const handleSend = async (e, overrideText, chatOptions = {}) => {
    e?.preventDefault();
    const text = typeof overrideText === 'string' ? overrideText.trim() : (input || '').trim();
    if (!text && !chatOptions.resolveProjectName) return;
    if (loading) return;

    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: chatOptions.resolveProjectName ? `Selected: ${chatOptions.resolveProjectName}` : text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await aiChatService.sendMessage(
        text || chatOptions.originalQuestion || 'Resolve project',
        sessionId,
        'anonymous',
        null,
        chatOptions
      );
      if (res.conversationId && res.conversationId !== sessionId) {
        setSessionId(res.conversationId);
      }
      if (res.currentProject) setCurrentProject(res.currentProject);
      setFollowUpSuggestions(res.followUpSuggestions || []);
      setRecentSearches((prev) => [text, ...prev.filter((q) => q !== text)].slice(0, 8));

      const nav = res.responseType === 'navigation' || res.intent === 'navigation';
      const route = res.route || (res.data?.route) || (res.responseType === 'navigation' ? '/' : null);

      if (nav && route) {
        const navMsg = {
          id: Date.now() + 1,
          role: 'assistant',
          content: res.message || `Opening ${res.page || 'page'}...`,
          format: 'markdown',
          intent: 'navigation',
          responseType: 'navigation',
          data: { route, page: res.page },
          route,
          page: res.page,
          message: res.message,
          verified: true,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, navMsg]);
        setLastMessage(navMsg);
        setLoading(false);
        loadSessions();
        return;
      }

      const assistantId = Date.now() + 1;
      const assistantMsg = {
        id: assistantId,
        role: 'assistant',
        content: res.answer || res.content || "I couldn't find verified project data.",
        followUpSuggestions: res.followUpSuggestions || [],
        format: res.format,
        data: res.data,
        intent: res.intent,
        responseTime: res.responseTime,
        isError: !!res.error,
        verified: res.verified,
        confidence: res.confidence,
        suggestions: res.suggestions,
        pendingIntent: res.pendingIntent,
        originalQuestion: chatOptions.originalQuestion || text,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setStreamingId(assistantId);
      loadSessions();
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          content: err.response?.data?.answer || err.response?.data?.content || 'No matching verified project found.',
          isError: true,
          format: 'error',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handlePinSession = async (id, e) => {
    e?.stopPropagation();
    try {
      const sess = sessions.find((s) => (s.sessionId || s._id) === id);
      await aiChatService.pinSession(id, !sess?.pinnedChats);
      loadSessions();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSession = async (id) => {
    try {
      await aiChatService.clearChat(id);
      setSessions((prev) => prev.filter((s) => (s.sessionId || s._id) !== id));
      if (sessionId === id) newSession();
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearChat = async () => {
    if (!sessionId) {
      newSession();
      return;
    }
    try {
      await aiChatService.clearChat(sessionId);
      setSessions((prev) => prev.filter((s) => (s.sessionId || s._id) !== sessionId));
      newSession();
    } catch (err) {
      console.error(err);
    }
    setConfirmModal(null);
  };

  const handleDeleteAllChats = async () => {
    try {
      await aiChatService.clearAllChats();
      setSessions([]);
      newSession();
    } catch (err) {
      console.error(err);
    }
    setConfirmModal(null);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-[#0a0a0f] text-slate-100">
      {/* Left Sidebar */}
      <AnimatePresence>
        {(sidebarOpen || mobileSidebar) && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            className={`${
              mobileSidebar ? 'fixed inset-y-0 left-0 z-50 w-72' : 'hidden lg:flex'
            } lg:relative lg:w-72 flex-col border-r border-white/10 bg-slate-900/80 backdrop-blur-xl`}
          >
            <div className="p-4 border-b border-white/10">
              <button
                type="button"
                onClick={newSession}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 py-2.5 text-sm font-semibold shadow-lg shadow-violet-500/20 hover:opacity-90 transition-opacity"
              >
                <FiPlus size={16} />
                New Chat
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-4">
              {recentSearches.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-2 mb-2">
                    Recent Searches
                  </p>
                  <div className="space-y-1 mb-4">
                    {recentSearches.slice(0, 5).map((q, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setInput(q)}
                        className="w-full text-left px-3 py-1.5 rounded-lg text-[11px] text-slate-500 hover:bg-white/5 truncate"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-2 mb-2">
                  Recent Chats
                </p>
                <div className="space-y-1">
                  {sessions.length === 0 ? (
                    <p className="text-xs text-slate-600 px-2">No sessions yet</p>
                  ) : (
                    sessions.map((s) => {
                      const id = s.sessionId || s._id;
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => loadSession(s)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors group flex items-center gap-2 ${
                            sessionId === id
                              ? 'bg-violet-500/20 text-violet-200 border border-violet-500/30'
                              : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                          }`}
                        >
                          {s.pinnedChats && <FiStar size={10} className="text-amber-400 shrink-0 fill-amber-400" />}
                          <FiMessageSquare size={12} className="shrink-0" />
                          <span className="truncate flex-1">
                            {s.messages?.[0]?.content?.substring(0, 40) || s.preview || 'Chat'}
                          </span>
                          <FiStar
                            size={12}
                            className={`shrink-0 ${s.pinnedChats ? 'text-amber-400 fill-amber-400' : 'opacity-0 group-hover:opacity-60 text-slate-500'}`}
                            onClick={(e) => handlePinSession(id, e)}
                          />
                          <FiTrash2
                            size={12}
                            className="opacity-0 group-hover:opacity-100 text-red-400 shrink-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteSession(id);
                            }}
                          />
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-2 mb-2">
                  Quick Actions
                </p>
                <div className="space-y-1">
                  {QUICK_ACTIONS.map((a) => (
                    <button
                      key={a.label}
                      type="button"
                      onClick={() => handleSend(null, a.prompt)}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs text-slate-400 hover:bg-white/5 hover:text-cyan-300 flex items-center gap-2"
                    >
                      <FiZap size={12} className="text-amber-400" />
                      {a.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-2 mb-2">
                  Projects ({projects.length})
                </p>
                <div className="space-y-1 max-h-40 overflow-y-auto custom-scrollbar">
                  {projects.slice(0, 8).map((p) => (
                    <button
                      key={p.id || p.name}
                      type="button"
                      onClick={() =>
                        handleSend(null, `Show details of Project ${p.name}`)
                      }
                      className="w-full text-left px-3 py-2 rounded-lg text-xs text-slate-400 hover:bg-white/5 flex items-center gap-2"
                    >
                      <FiFolder size={12} className="text-blue-400 shrink-0" />
                      <span className="truncate">{p.name}</span>
                      <FiChevronRight size={10} className="shrink-0 opacity-40" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-3 border-t border-white/10">
              <Link
                to="/training"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-500 hover:text-violet-300 hover:bg-white/5"
              >
                <FiCpu size={14} />
                Training Center
              </Link>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {mobileSidebar && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setMobileSidebar(false)}
          aria-label="Close sidebar"
        />
      )}



      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="shrink-0 border-b border-white/10 bg-slate-900/60 backdrop-blur-xl px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="lg:hidden p-2 rounded-lg hover:bg-white/10"
                onClick={() => setMobileSidebar(true)}
              >
                <FiMenu size={18} />
              </button>
              <button
                type="button"
                className="hidden lg:block p-2 rounded-lg hover:bg-white/10 text-slate-400"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <FiX size={18} /> : <FiMenu size={18} />}
              </button>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 shadow-lg">
                <FiCpu className="text-white" size={18} />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight">Project AI Assistant</h1>
                <div className="flex items-center gap-3 text-[10px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <span className={`h-1.5 w-1.5 rounded-full ${dbConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                    {dbConnected ? 'Connected' : 'Offline'}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiDatabase size={10} />
                    MongoDB
                  </span>
                  <span className="flex items-center gap-1">
                    <FiClock size={10} />
                    {sessionId ? sessionId.slice(-8) : '—'}
                  </span>
                  {currentProject?.projectName && (
                    <span className="flex items-center gap-1 text-violet-400">
                      <FiTarget size={10} />
                      {currentProject.projectName}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setConfirmModal('clear')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-amber-300 hover:bg-amber-500/10 border border-transparent hover:border-amber-500/20"
                title="Clear Chat"
              >
                <FiTrash2 size={14} />
                Clear Chat
              </button>
              <button
                type="button"
                onClick={() => setConfirmModal('deleteAll')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20"
                title="Delete All Chats"
              >
                <FiTrash2 size={14} />
                Delete All
              </button>
            </div>
          </div>
        </header>

        <AnimatePresence>
          {confirmModal && (
            <>
              <motion.button
                type="button"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] bg-black/70"
                onClick={() => setConfirmModal(null)}
                aria-label="Close modal"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed left-1/2 top-1/2 z-[70] w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl"
              >
                <h3 className="text-lg font-semibold text-white mb-2">
                  {confirmModal === 'clear' ? 'Clear this conversation?' : 'Delete all chats?'}
                </h3>
                <p className="text-sm text-slate-400 mb-6">
                  {confirmModal === 'clear'
                    ? 'Messages will disappear from the UI. The chat record stays stored in MongoDB.'
                    : 'Chats will disappear from the UI but remain stored internally.'}
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setConfirmModal(null)}
                    className="px-4 py-2 rounded-lg text-sm text-slate-300 hover:bg-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={confirmModal === 'clear' ? handleClearChat : handleDeleteAllChats}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 hover:bg-red-500 text-white"
                  >
                    {confirmModal === 'clear' ? 'Clear' : 'Delete'}
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-6">
          <div className="max-w-3xl mx-auto">
            {initialLoad ? (
              <ChatSkeleton />
            ) : messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center min-h-[50vh] text-center"
              >
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 border border-white/10">
                  <FiSearch className="text-violet-400" size={36} />
                </div>
                <h2 className="text-2xl font-bold mb-2">ProposalForge AI Assistant</h2>
                <p className="text-slate-400 text-sm max-w-md mb-8">
                  Query projects, proposals, technologies, and clients from your MongoDB database.
                </p>

                <div className="grid gap-2 w-full max-w-xl sm:grid-cols-2">
                  {SUGGESTED_PROMPTS.map((prompt, idx) => (
                    <motion.button
                      key={idx}
                      type="button"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      onClick={() => setInput(prompt)}
                      className="text-left px-4 py-3 rounded-xl border border-white/10 bg-slate-800/40 text-sm text-slate-300 hover:border-violet-500/40 hover:bg-violet-500/10 transition-all"
                    >
                      {prompt}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <>
                {messages.map((msg, idx) =>
                  msg.id === streamingId && msg.role === 'assistant' ? (
                    <StreamingMessage
                      key={msg.id}
                      message={{ ...msg, index: idx }}
                      speed={8}
                      onComplete={() => setStreamingId(null)}
                      onSuggestionClick={(name, opts) => handleSend(null, name, opts || {})}
                    />
                  ) : (
                    <AssistantMessage
                      key={msg.id || idx}
                      message={msg}
                      index={idx}
                      onSuggestionClick={(name, opts) => handleSend(null, name, opts || {})}
                    />
                  )
                )}
                {loading && <AITyping />}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
        </div>

        <footer className="shrink-0 border-t border-white/10 bg-slate-900/80 backdrop-blur-xl p-4">
          <form onSubmit={handleSend} className="max-w-3xl mx-auto">
            <div className="flex items-end gap-2 rounded-2xl border border-white/10 bg-slate-800/60 p-2 focus-within:border-violet-500/40 focus-within:ring-2 focus-within:ring-violet-500/10 transition-all">
              <button type="button" className="p-2.5 text-slate-500 hover:text-slate-300 rounded-lg" title="Attach">
                <FiPaperclip size={18} />
              </button>
              <textarea
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(e);
                  }
                }}
                placeholder="Ask about projects, proposals, technologies, clients..."
                disabled={loading}
                className="flex-1 resize-none bg-transparent py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none max-h-32"
              />
              <button type="button" className="p-2.5 text-slate-500 hover:text-slate-300 rounded-lg" title="Voice (coming soon)">
                <FiMic size={18} />
              </button>
              <motion.button
                type="submit"
                disabled={loading || !input.trim()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white disabled:opacity-40 shadow-lg"
              >
                <FiSend size={18} />
              </motion.button>
            </div>
            {followUpSuggestions.length > 0 && !loading && (
              <div className="mt-3 flex flex-wrap gap-2 justify-center">
                {followUpSuggestions.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => handleSend(null, q)}
                    className="px-3 py-1.5 rounded-full text-xs border border-violet-500/30 bg-violet-500/10 text-violet-300 hover:bg-violet-500/20"
                  >
                    {q}
                  </button>
                ))}
              </div>

            )}
            <p className="text-center text-[10px] text-slate-600 mt-2">
              Powered by MongoDB · Verified data only · No external AI APIs
            </p>
          </form>
        </footer>
      </div>
    </div>
  );
};

export default AIChat;