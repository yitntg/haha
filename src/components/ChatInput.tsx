import React, { useState, useRef, KeyboardEvent } from 'react';
import { BiBrain } from 'react-icons/bi';
import { FiGlobe, FiPaperclip, FiArrowUp } from 'react-icons/fi';

interface ChatInputProps {
  onSend: (message: string) => void;
  onThink: () => void;
  onSearch: () => void;
  onUpload: (file: File) => void;
  isThinking: boolean;
  isSearching: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  onThink,
  onSearch,
  onUpload,
  isThinking,
  isSearching
}) => {
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (message.trim()) {
      onSend(message.trim());
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
      onUpload(file);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="relative bg-input-dark rounded-lg">
        <div className="flex items-center p-2">
          <button
            className={`p-2 hover:bg-button-dark rounded-lg flex items-center gap-2 ${
              isThinking ? 'text-primary-blue' : 'text-gray-400'
            }`}
            onClick={onThink}
          >
            <BiBrain className="text-xl" />
            <span>深度思考</span>
          </button>
          <button
            className={`p-2 hover:bg-button-dark rounded-lg flex items-center gap-2 ${
              isSearching ? 'text-primary-blue' : 'text-gray-400'
            }`}
            onClick={onSearch}
          >
            <FiGlobe className="text-xl" />
            <span>联网搜索</span>
          </button>
        </div>
        <div className="flex items-center p-2 border-t border-gray-700">
          <textarea
            className="flex-1 bg-transparent outline-none resize-none px-2 h-10 leading-10"
            placeholder="给 DeepSeek 发送消息"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            rows={1}
          />
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              className="p-2 hover:bg-button-dark rounded-full text-gray-400"
              onClick={() => fileInputRef.current?.click()}
            >
              <FiPaperclip className="text-xl" />
            </button>
            <button
              className="p-2 bg-primary-blue hover:bg-blue-600 rounded-full text-white"
              onClick={handleSend}
            >
              <FiArrowUp className="text-xl" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput; 