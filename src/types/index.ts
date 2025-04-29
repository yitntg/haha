export interface Message {
  id: string;
  content: string;
  type: 'user' | 'assistant';
  timestamp: number;
}

export interface ChatState {
  messages: Message[];
  isThinking: boolean;
  isSearching: boolean;
} 