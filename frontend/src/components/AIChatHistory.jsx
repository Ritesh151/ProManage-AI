/**
 * AI Chat History Component
 * Shows conversation history
 */

import React from 'react';
import { FiX, FiTrash2 } from 'react-icons/fi';
import './AIChatHistory.css';

const AIChatHistory = ({ conversations, onSelectConversation, onClose }) => {
  const formatDate = (date) => {
    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) {
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (d.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="ai-history-sidebar">
      <div className="ai-history-header">
        <h3>💬 Chat History</h3>
        <button className="ai-close-btn" onClick={onClose}>
          <FiX />
        </button>
      </div>

      <div className="ai-history-list">
        {conversations.length === 0 ? (
          <p className="ai-no-history">No conversations yet</p>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv._id}
              className="ai-history-item"
              onClick={() => onSelectConversation(conv)}
            >
              <div className="ai-history-content">
                <p className="ai-history-preview">
                  {conv.lastQuery || 'New conversation'}
                </p>
                <span className="ai-history-date">{formatDate(conv.createdAt)}</span>
              </div>
              <button
                className="ai-history-delete"
                onClick={(e) => {
                  e.stopPropagation();
                  // TODO: Implement delete
                }}
              >
                <FiTrash2 />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AIChatHistory;
