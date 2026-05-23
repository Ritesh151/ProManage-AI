import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from 'framer-motion';
import { FiCopy, FiCheck, FiUser, FiCpu, FiClock } from 'react-icons/fi';
import { ProjectCards } from './ProjectCards';
import { FollowUpChips } from './FollowUpChips';
import { AIResponseCard } from '../chat/AIResponseCard';
import { shouldRenderStructured } from '../chat/parseResponseContent';

export const AssistantMessage = ({ message, index = 0, onSuggestionClick }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';
  const isError = message.isError || message.format === 'error';
  const isConfirm = message.format === 'confirm';
  const useStructured = !isUser && !isError && !isConfirm && shouldRenderStructured(message);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (ts) => {
    if (!ts) return '';
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-5`}
    >
      <div
        className={`flex gap-3 ${isUser ? 'flex-row-reverse max-w-[88%]' : useStructured ? 'flex-row max-w-[min(100%,44rem)] w-full' : 'flex-row max-w-[88%]'}`}
      >
        <div
          className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center shadow-lg ${
            isUser
              ? 'bg-gradient-to-br from-blue-500 to-indigo-600'
              : isError
              ? 'bg-gradient-to-br from-red-500 to-orange-600'
              : 'bg-gradient-to-br from-violet-600 to-fuchsia-600 ring-2 ring-violet-500/20'
          }`}
        >
          {isUser ? <FiUser size={15} className="text-white" /> : <FiCpu size={15} className="text-white" />}
        </div>

        <div className={`min-w-0 flex-1 ${isUser ? 'text-right' : ''}`}>
          <div
            className={`inline-block text-left rounded-2xl px-4 py-3 shadow-xl ${
              isUser
                ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-tr-sm'
                : isError
                ? 'bg-red-500/10 border border-red-500/30 text-red-200 rounded-tl-sm'
                : isConfirm
                ? 'bg-amber-500/10 border border-amber-500/30 text-amber-100 rounded-tl-sm'
                : useStructured
                ? 'bg-transparent border-0 p-0 shadow-none w-full max-w-full'
                : 'bg-slate-800/80 backdrop-blur-xl border border-white/10 text-slate-100 rounded-tl-sm'
            }`}
          >
            {isUser ? (
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
            ) : (
              <>
                {useStructured ? (
                  <AIResponseCard message={message} intent={message.intent} />
                ) : (
                  <div className="prose prose-invert prose-sm max-w-none prose-p:my-1 prose-headings:my-2 prose-ul:my-1">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                  </div>
                )}
                {isConfirm && (message.data?.suggestions?.length || message.suggestions?.length) ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(message.data?.suggestions || message.suggestions).map((name) => (
                      <button
                        key={name}
                        type="button"
                        onClick={() =>
                          onSuggestionClick?.(name, {
                            resolveProjectName: name,
                            pendingIntent: message.pendingIntent,
                            originalQuestion: message.originalQuestion,
                          })
                        }
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500/20 border border-amber-500/40 text-amber-200 hover:bg-amber-500/30"
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                ) : null}
                {message.format === 'project_cards' && message.data?.projects && (
                  <ProjectCards projects={message.data.projects} />
                )}
                <FollowUpChips
                  suggestions={message.followUpSuggestions}
                  onSelect={onSuggestionClick}
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  {message.verified && (
                    <span className="text-[10px] text-emerald-500/80 border border-emerald-500/20 rounded px-1.5 py-0.5">
                      ✓ Verified DB
                    </span>
                  )}
                  {message.confidence != null && (
                    <span className="text-[10px] text-slate-500 border border-slate-700 rounded px-1.5 py-0.5">
                      {message.confidence}% match
                    </span>
                  )}
                  {message.intent && (
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 border border-slate-700 rounded px-1.5 py-0.5">
                      {message.intent.replace(/_/g, ' ')}
                    </span>
                  )}
                </div>
              </>
            )}
          </div>

          <div className={`flex items-center gap-2 mt-1.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
            {message.timestamp && (
              <span className="text-[10px] text-slate-500 flex items-center gap-1">
                <FiClock size={10} />
                {formatTime(message.timestamp)}
              </span>
            )}
            {message.responseTime && !isUser && (
              <span className="text-[10px] text-slate-600">{message.responseTime}ms</span>
            )}
            {!isUser && !isError && (
              <button
                type="button"
                onClick={handleCopy}
                className="p-1 rounded text-slate-500 hover:text-slate-300 transition-colors"
              >
                {copied ? <FiCheck size={12} /> : <FiCopy size={12} />}
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
