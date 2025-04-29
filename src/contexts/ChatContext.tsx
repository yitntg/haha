import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import type { Message } from '../types';
import { sendMessage } from '../services/api';

interface ChatState {
  messages: Message[];
  isThinking: boolean;
  isSearching: boolean;
  error: string | null;
}

type ChatAction =
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'SET_THINKING'; payload: boolean }
  | { type: 'SET_SEARCHING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'EDIT_MESSAGE'; payload: { id: string; content: string } }
  | { type: 'CLEAR_MESSAGES' };

const initialState: ChatState = {
  messages: [],
  isThinking: false,
  isSearching: false,
  error: null,
};

const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    case 'SET_THINKING':
      return {
        ...state,
        isThinking: action.payload,
      };
    case 'SET_SEARCHING':
      return {
        ...state,
        isSearching: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    case 'EDIT_MESSAGE':
      return {
        ...state,
        messages: state.messages.map((msg) =>
          msg.id === action.payload.id
            ? { ...msg, content: action.payload.content }
            : msg
        ),
      };
    case 'CLEAR_MESSAGES':
      return {
        ...state,
        messages: [],
      };
    default:
      return state;
  }
};

interface ChatContextType {
  state: ChatState;
  sendUserMessage: (content: string) => Promise<void>;
  editMessage: (id: string, content: string) => void;
  clearMessages: () => void;
  toggleThinking: () => void;
  toggleSearching: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  const sendUserMessage = async (content: string) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      content,
      type: 'user',
      timestamp: Date.now(),
    };
    
    dispatch({ type: 'ADD_MESSAGE', payload: userMessage });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      dispatch({ type: 'SET_THINKING', payload: true });
      const response = await sendMessage(content);
      
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        content: response,
        type: 'assistant',
        timestamp: Date.now(),
      };
      
      dispatch({ type: 'ADD_MESSAGE', payload: assistantMessage });
    } catch (error) {
      console.error('Error:', error);
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : '发送消息时发生错误',
      });
    } finally {
      dispatch({ type: 'SET_THINKING', payload: false });
    }
  };

  const editMessage = (id: string, content: string) => {
    dispatch({ type: 'EDIT_MESSAGE', payload: { id, content } });
  };

  const clearMessages = () => {
    if (window.confirm('确定要清空所有聊天记录吗？')) {
      dispatch({ type: 'CLEAR_MESSAGES' });
    }
  };

  const toggleThinking = () => {
    dispatch({ type: 'SET_THINKING', payload: !state.isThinking });
  };

  const toggleSearching = () => {
    dispatch({ type: 'SET_SEARCHING', payload: !state.isSearching });
  };

  return (
    <ChatContext.Provider
      value={{
        state,
        sendUserMessage,
        editMessage,
        clearMessages,
        toggleThinking,
        toggleSearching,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
}; 