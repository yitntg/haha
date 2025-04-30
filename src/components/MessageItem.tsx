import { useState } from 'react';
import { FaRobot, FaUser, FaCopy, FaDownload, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import type { Message } from '../types';

interface MessageItemProps {
  message: Message;
  onCopy: (content: string) => void;
  onDownload: (content: string) => void;
  onEdit: (id: string, newContent: string) => void;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, onCopy, onDownload, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const isAssistant = message.type === 'assistant';

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onEdit(message.id, editContent);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditContent(message.content);
    setIsEditing(false);
  };

  return (
    <div className={`flex gap-4 p-4 ${isAssistant ? 'bg-input-dark' : ''} ${!isAssistant ? 'flex-row-reverse' : ''}`}>
      <div className="flex-shrink-0">
        {isAssistant ? (
          <FaRobot className="text-2xl text-primary-blue" />
        ) : (
          <FaUser className="text-2xl text-gray-400" />
        )}
      </div>
      <div className={`flex-1 max-w-[460px] ${!isAssistant ? 'flex flex-col items-end' : ''}`}>
        {isEditing ? (
          <div className="flex flex-col gap-2 w-full">
            <textarea
              className="w-full bg-transparent border border-gray-600 rounded-lg p-2 focus:outline-none focus:border-primary-blue"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={4}
            />
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="px-3 py-1 bg-primary-blue text-white rounded-lg hover:bg-blue-600"
              >
                <FaCheck />
              </button>
              <button
                onClick={handleCancel}
                className="px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                <FaTimes />
              </button>
            </div>
          </div>
        ) : (
          <div 
            className={`whitespace-pre-wrap rounded-lg p-4 ${
              isAssistant 
                ? 'bg-button-dark text-white font-medium text-base leading-relaxed shadow-md' 
                : 'bg-primary-blue text-white font-medium'
            }`}
          >
            {message.content}
          </div>
        )}
      </div>
      {isAssistant && !isEditing && (
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
          <button
            onClick={handleEdit}
            className="p-2 hover:bg-button-dark rounded-lg text-gray-400"
            title="编辑"
          >
            <FaEdit />
          </button>
        </div>
      )}
    </div>
  );
};

export default MessageItem; 