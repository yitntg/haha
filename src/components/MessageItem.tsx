import React from 'react';
import { FaRobot, FaUser, FaCopy, FaDownload } from 'react-icons/fa';
import type { Message } from '../types';

interface MessageItemProps {
  message: Message;
  onCopy: (content: string) => void;
  onDownload: (content: string) => void;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, onCopy, onDownload }) => {
  const isAssistant = message.type === 'assistant';

  return (
    <div className={`flex gap-4 p-6 ${isAssistant ? 'bg-input-dark' : ''}`}>
      <div className="flex-shrink-0">
        {isAssistant ? (
          <FaRobot className="text-2xl text-primary-blue" />
        ) : (
          <FaUser className="text-2xl text-gray-400" />
        )}
      </div>
      <div className="flex-1">
        <div className="whitespace-pre-wrap">{message.content}</div>
      </div>
      {isAssistant && (
        <div className="flex gap-2">
          <button
            onClick={() => onCopy(message.content)}
            className="p-2 hover:bg-button-dark rounded-lg text-gray-400"
            title="复制"
          >
            <FaCopy />
          </button>
          <button
            onClick={() => onDownload(message.content)}
            className="p-2 hover:bg-button-dark rounded-lg text-gray-400"
            title="下载"
          >
            <FaDownload />
          </button>
        </div>
      )}
    </div>
  );
};

export default MessageItem; 