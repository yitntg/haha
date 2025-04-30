import React from 'react';
import FloatingChatWidget from './components/FloatingChatWidget';
import MapView from './components/MapView';
import { ChatProvider } from './contexts/ChatContext';

const App: React.FC = () => {
  return (
    <ChatProvider>
      <div className="app-container">
        <div className="debug-info">测试信息 - 如果您能看到此消息，则基本渲染正常</div>
        <MapView />
        <FloatingChatWidget />
        <div className="content-overlay">
          {/* 其他内容可以放在这里 */}
        </div>
      </div>
    </ChatProvider>
  );
};

export default App; 