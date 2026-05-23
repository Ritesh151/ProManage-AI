import React, { useState, useEffect } from 'react';
import { AssistantMessage } from './AssistantMessage';
import { shouldRenderStructured } from '../chat/parseResponseContent';

export const StreamingMessage = ({ message, speed = 12, onComplete, onSuggestionClick }) => {
  const full = message?.content || '';
  const hasStructuredData = Boolean(message.data?.project?.projectName) || message.responseType === 'project_list' || message.data?.projects?.length > 0;
  const [displayed, setDisplayed] = useState(hasStructuredData ? full : '');
  const [streamDone, setStreamDone] = useState(hasStructuredData);

  useEffect(() => {
    if (hasStructuredData) {
      onComplete?.();
      return undefined;
    }
    if (!full) return undefined;

    let i = 0;
    setDisplayed('');
    setStreamDone(false);
    const id = setInterval(() => {
      i += 1;
      setDisplayed(full.slice(0, i));
      if (i >= full.length) {
        clearInterval(id);
        setStreamDone(true);
        onComplete?.();
      }
    }, speed);
    return () => clearInterval(id);
  }, [full, speed, onComplete, hasStructuredData]);

  const renderMessage = {
    ...message,
    content: streamDone || hasStructuredData ? full : displayed,
  };

  if (!streamDone && !hasStructuredData && shouldRenderStructured(renderMessage)) {
    return (
      <AssistantMessage
        message={{ ...renderMessage, content: displayed }}
        index={message.index}
        onSuggestionClick={onSuggestionClick}
      />
    );
  }

  return (
    <AssistantMessage
      message={renderMessage}
      index={message.index}
      onSuggestionClick={onSuggestionClick}
    />
  );
};
