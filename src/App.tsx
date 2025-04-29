import FloatingChatWidget from './components/FloatingChatWidget'
import { ChatProvider } from './contexts/ChatContext'
import './index.css'

function App() {
  return (
    <ChatProvider>
      <div className="min-h-screen bg-deep-dark">
        <FloatingChatWidget />
      </div>
    </ChatProvider>
  )
}

export default App 