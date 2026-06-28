import { useState, useCallback } from 'react';
import { Trash2 } from 'lucide-react';
import type { Message } from './types/chat';
import { ChatContainer } from './components/ChatContainer';
import { ChatInput } from './components/ChatInput';
import { useLocalStorage } from './hooks/useLocalStorage';
import { fetchStreamResponse } from './services/deepseekApi';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export default function App() {
  const [messages, setMessages] = useLocalStorage<Message[]>('chat-messages', []);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessageId, setLoadingMessageId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSendMessage = useCallback(async (content: string) => {
    if (isLoading) return;

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    const aiMessage: Message = {
      id: generateId(),
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, aiMessage]);
    setLoadingMessageId(aiMessage.id);

    const validMessages = messages.filter((m) => m.role !== 'system');
    const allMessages = [...validMessages, userMessage];

    await fetchStreamResponse(
      allMessages,
      (chunk) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === aiMessage.id ? { ...m, content: m.content + chunk } : m
          )
        );
      },
      () => {
        setIsLoading(false);
        setLoadingMessageId(null);
      },
      (err) => {
        setError(err);
        setIsLoading(false);
        setLoadingMessageId(null);
        setMessages((prev) => prev.filter((m) => m.id !== aiMessage.id));
      }
    );
  }, [isLoading, messages]);

  const handleClearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, [setMessages]);

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <header className="bg-gray-900 border-b border-gray-700 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl font-bold">AI</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">AI 聊天助手</h1>
              <p className="text-sm text-gray-400">基于 DeepSeek API</p>
            </div>
          </div>
          {messages.length > 0 && (
            <button
              onClick={handleClearChat}
              className="flex items-center gap-2 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span className="text-sm">清空对话</span>
            </button>
          )}
        </div>
      </header>

      {error && (
        <div className="bg-red-900/50 border-b border-red-700 px-4 py-3">
          <div className="max-w-4xl mx-auto text-red-300 text-sm">
            {error}
          </div>
        </div>
      )}

      <ChatContainer messages={messages} loadingMessageId={loadingMessageId} />

      <ChatInput onSend={handleSendMessage} disabled={isLoading} />
    </div>
  );
}
