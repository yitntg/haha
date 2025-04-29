import React, { useRef, useState } from 'react';
import { FaRobot, FaMinus } from 'react-icons/fa';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import ThemeToggle from './ThemeToggle';
import { useChatContext } from '../contexts/ChatContext';

interface Position {
  x: number;
  y: number;
}

const FloatingChatWidget: React.FC = () => {
  const { state, clearMessages } = useChatContext();
  const [isExpanded, setIsExpanded] = useState(true);
  const [position, setPosition] = useState<Position>({ x: window.innerWidth - 600, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // 处理拖动开始
  const handleMouseDown = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
    }
  };

  // 处理拖动
  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      setPosition({ x: newX, y: newY });
    }
  };

  // 处理拖动结束
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      className={`fixed shadow-lg rounded-lg transition-all duration-300 ${
        isDragging ? 'cursor-grabbing' : ''
      }`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        width: isExpanded ? '580px' : '60px',
        height: isExpanded ? '700px' : '60px',
        backgroundColor: 'var(--bg-input-dark)',
        zIndex: 1000,
      }}
    >
      {isExpanded ? (
        <>
          {/* 标题栏 */}
          <div
            className="flex items-center justify-between p-3 bg-button-dark rounded-t-lg cursor-grab"
            onMouseDown={handleMouseDown}
          >
            <div className="flex items-center gap-2">
              <FaRobot className="text-2xl text-primary-blue" />
              <span className="text-white font-medium">DeepSeek AI助手</span>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                onClick={clearMessages}
                className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg"
                title="清空聊天记录"
              >
                清空
              </button>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-2 hover:bg-button-dark rounded-lg text-gray-400"
                title="最小化"
              >
                <FaMinus />
              </button>
            </div>
          </div>

          {/* 聊天内容 */}
          <div className="flex flex-col h-[calc(100%-120px)] overflow-hidden">
            <MessageList />
            {state.error && (
              <div className="p-4 bg-red-500/10 text-red-500 text-center">
                {state.error}
              </div>
            )}
          </div>

          {/* 输入框 */}
          <div className="h-[120px] border-t border-gray-700">
            <ChatInput />
          </div>
        </>
      ) : (
        // 折叠状态
        <button
          className="w-full h-full flex items-center justify-center hover:bg-button-dark rounded-lg"
          onClick={() => setIsExpanded(true)}
        >
          <FaRobot className="text-2xl text-primary-blue" />
        </button>
      )}
    </div>
  );
};

export default FloatingChatWidget; 