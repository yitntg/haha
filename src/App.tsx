import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Header from './components/Header'
import ChatInput from './components/ChatInput'
import MessageList from './components/MessageList'
import { sendMessage } from './services/api'
import type { Message } from './types'
import './index.css'

function App() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isThinking, setIsThinking] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  const handleSend = async (content: string) => {
    const newMessage: Message = {
      id: uuidv4(),
      content,
      type: 'user',
      timestamp: Date.now(),
    }
    setMessages((prev) => [...prev, newMessage])
    
    try {
      setIsThinking(true)
      const response = await sendMessage(content)
      
      const assistantMessage: Message = {
        id: uuidv4(),
        content: response,
        type: 'assistant',
        timestamp: Date.now(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error:', error)
      const errorMessage: Message = {
        id: uuidv4(),
        content: '抱歉，发生了一些错误。请稍后再试。',
        type: 'assistant',
        timestamp: Date.now(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsThinking(false)
    }
  }

  const handleThink = () => {
    setIsThinking((prev) => !prev)
  }

  const handleSearch = () => {
    setIsSearching((prev) => !prev)
  }

  const handleUpload = (file: File) => {
    // 处理文件上传
    console.log('Uploaded file:', file.name)
  }

  return (
    <div className="flex flex-col h-screen bg-deep-dark text-white">
      <Header />
      <main className="flex-1 flex flex-col overflow-hidden">
        <MessageList messages={messages} />
      </main>
      <ChatInput
        onSend={handleSend}
        onThink={handleThink}
        onSearch={handleSearch}
        onUpload={handleUpload}
        isThinking={isThinking}
        isSearching={isSearching}
      />
    </div>
  )
}

export default App 