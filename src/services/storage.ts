const STORAGE_KEY = 'deepseek-chat-messages';

export function saveMessages(messages: any[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch (error) {
    console.error('Failed to save messages:', error);
  }
}

export function loadMessages(): any[] {
  try {
    const messages = localStorage.getItem(STORAGE_KEY);
    return messages ? JSON.parse(messages) : [];
  } catch (error) {
    console.error('Failed to load messages:', error);
    return [];
  }
}

export function clearMessages() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear messages:', error);
  }
} 