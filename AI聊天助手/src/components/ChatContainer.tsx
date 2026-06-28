import { useEffect, useRef } from 'react';
import type { Message } from '../types/chat';
import { ChatMessage } from './ChatMessage';

interface ChatContainerProps {
  messages: Message[];
  loadingMessageId: string | null;
}

export function ChatContainer({ messages, loadingMessageId }: ChatContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto p-4 space-y-4"
    >
      <div className="max-w-4xl mx-auto space-y-4">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            isLoading={message.id === loadingMessageId}
          />
        ))}
      </div>
    </div>
  );
}
