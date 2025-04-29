import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Header from './components/Header'
import ChatInput from './components/ChatInput'
import MessageList from './components/MessageList'
import ThemeToggle from './components/ThemeToggle'
import { sendMessage } from './services/api'
import { saveMessages, loadMessages, clearMessages } from './services/storage'
import type { Message } from './types'
import FloatingChatWidget from './components/FloatingChatWidget'
import './index.css'

function App() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isThinking, setIsThinking] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 加载保存的消息
  useEffect(() => {
    const savedMessages = loadMessages();
    if (savedMessages.length > 0) {
      setMessages(savedMessages);
    }
  }, []);

  // 保存消息到本地存储
  useEffect(() => {
    if (messages.length > 0) {
      saveMessages(messages);
    }
  }, [messages]);

  const handleSend = async (content: string) => {
    const newMessage: Message = {
      id: uuidv4(),
      content,
      type: 'user',
      timestamp: Date.now(),
    }
    setMessages((prev) => [...prev, newMessage])
    setError(null)
    
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
      setError(error instanceof Error ? error.message : '发送消息时发生错误')
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

  const handleEditMessage = (id: string, newContent: string) => {
    setMessages((prev) =>
      prev.map((message) =>
        message.id === id ? { ...message, content: newContent } : message
      )
    );
  };

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

  const handleClearHistory = () => {
    if (window.confirm('确定要清空所有聊天记录吗？')) {
      clearMessages();
      setMessages([]);
    }
  }

  return (
    <div className="min-h-screen bg-deep-dark">
      <FloatingChatWidget />
    </div>
  )
}

export default App 