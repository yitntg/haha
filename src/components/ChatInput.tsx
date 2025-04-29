import React, { useState, useRef, KeyboardEvent } from 'react';
import { BiBrain } from 'react-icons/bi';
import { FiGlobe, FiPaperclip, FiArrowUp } from 'react-icons/fi';
import { useChatContext } from '../contexts/ChatContext';

const ChatInput: React.FC = () => {
  const { state, sendUserMessage, toggleThinking, toggleSearching } = useChatContext();
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (message.trim()) {
      sendUserMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // TODO: 实现文件上传功能
      console.log('File selected:', file);
    }
  };

  return (
    <div className="chat-input-container">
      <div className="relative bg-input-dark rounded-lg shadow-lg max-w-2xl mx-auto">
        <div className="flex items-center p-2 border-b border-gray-700">
          <button
            className={`p-2 hover:bg-button-dark rounded-lg flex items-center gap-2 ${
              state.isThinking ? 'text-primary-blue' : 'text-gray-400'
            }`}
            onClick={toggleThinking}
          >
            <BiBrain className="text-xl" />
            <span>深度思考</span>
          </button>
          <button
            className={`p-2 hover:bg-button-dark rounded-lg flex items-center gap-2 ${
              state.isSearching ? 'text-primary-blue' : 'text-gray-400'
            }`}
            onClick={toggleSearching}
          >
            <FiGlobe className="text-xl" />
            <span>联网搜索</span>
          </button>
        </div>
        <div className="p-4">
          <textarea
            className="w-full bg-transparent outline-none resize-none"
            placeholder="给 DeepSeek 发送消息"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            rows={3}
          />
          <div className="flex items-center justify-between mt-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              className="p-2 hover:bg-button-dark rounded-lg text-gray-400"
              onClick={() => fileInputRef.current?.click()}
            >
              <FiPaperclip className="text-xl" />
            </button>
            <button
              className="px-4 py-2 bg-primary-blue hover:bg-blue-600 rounded-lg text-white flex items-center gap-2"
              onClick={handleSend}
              disabled={!message.trim() || state.isThinking}
            >
              <FiArrowUp className="text-xl" />
              <span>发送</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput; 