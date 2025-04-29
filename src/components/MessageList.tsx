import MessageItem from './MessageItem';
import { FaSpinner, FaRobot } from 'react-icons/fa';
import { useChatContext } from '../contexts/ChatContext';

const MessageList: React.FC = () => {
  const { state, editMessage } = useChatContext();

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const handleDownload = (content: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `deepseek-chat-${new Date().getTime()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="message-container">
        {state.messages.map((message) => (
          <div key={message.id} className="message-item">
            <MessageItem
              message={message}
              onCopy={handleCopy}
              onDownload={handleDownload}
              onEdit={editMessage}
            />
          </div>
        ))}
        {state.isThinking && (
          <div className="message-item">
            <div className="flex gap-4 p-6 bg-input-dark rounded-lg">
              <div className="flex-shrink-0">
                <FaRobot className="text-2xl text-primary-blue" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <FaSpinner className="animate-spin text-primary-blue" />
                  <span className="text-gray-400">正在思考中...</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageList; 