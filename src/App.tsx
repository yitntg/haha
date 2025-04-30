import React from 'react';
import FloatingChatWidget from './components/FloatingChatWidget';
import MapView from './components/MapView';
import { ChatProvider } from './contexts/ChatContext';

const App: React.FC = () => {
  return (
    <ChatProvider>
      <div className="app-container">
        <MapView />
        <FloatingChatWidget />
      </div>
    </ChatProvider>
  );
};

export default App; 