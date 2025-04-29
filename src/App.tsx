import Header from './components/Header'
import ChatInput from './components/ChatInput'
import './index.css'

function App() {
  return (
    <div className="flex flex-col h-screen bg-deep-dark text-white">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center">
        {/* 这里可以放置聊天内容 */}
      </main>
      <ChatInput />
    </div>
  )
}

export default App 