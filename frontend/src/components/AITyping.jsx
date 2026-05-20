/**
 * AI Typing Component
 * Shows typing animation
 */

import React from 'react';
import './AITyping.css';

const AITyping = () => {
  return (
    <div className="ai-message ai-message-assistant">
      <div className="ai-message-avatar">🤖</div>
      <div className="ai-message-content">
        <div className="ai-typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default AITyping;
