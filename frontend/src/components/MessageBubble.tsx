import React from 'react';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} message-enter`}>
      <div className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl ${
        isUser
          ? 'bg-primary-600 text-white'
          : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
      } rounded-2xl px-4 py-2`}>
        <p className="text-sm whitespace-pre-wrap break-words">
          {message.content}
        </p>
        <p className={`text-xs mt-1 ${
          isUser
            ? 'text-primary-200'
            : 'text-gray-500 dark:text-gray-400'
        }`}>
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;