import React from 'react';

const ChatbotMessage = ({ type, children }) => {
  return (
    <div className={`chatbot-message chatbot-message-${type}`}>
      {children}
    </div>
  );
};

export default ChatbotMessage;
