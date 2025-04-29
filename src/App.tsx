import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Header from './components/Header'
import ChatInput from './components/ChatInput'
import MessageList from './components/MessageList'
import type { Message } from './types'
import './index.css'

function App() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isThinking, setIsThinking] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  const handleSend = (content: string) => {
    const newMessage: Message = {
      id: uuidv4(),
      content,
      type: 'user',
      timestamp: Date.now(),
    }
    setMessages((prev) => [...prev, newMessage])

    // 模拟助手回复
    setTimeout(() => {
      const response: Message = {
        id: uuidv4(),
        content: `我收到了您的消息：${content}`,
        type: 'assistant',
        timestamp: Date.now(),
      }
      setMessages((prev) => [...prev, response])
    }, 1000)
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