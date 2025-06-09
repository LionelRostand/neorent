
import React, { useEffect, useRef } from 'react';
import { CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { ChatMessage } from '@/types/chat';

interface MessageListProps {
  messages: ChatMessage[];
}

export const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll vers le bas lors de nouveaux messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <CardContent className="flex-1 p-0">
      <ScrollArea className="h-[calc(100vh-500px)] p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              Aucun message dans cette conversation
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === 'staff' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender === 'staff'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-900'
                  }`}
                >
                  <div className="text-sm font-medium mb-1">
                    {message.senderName}
                  </div>
                  <div className="text-sm mb-1">{message.message}</div>
                  <div
                    className={`text-xs ${
                      message.sender === 'staff'
                        ? 'text-green-100'
                        : 'text-gray-500'
                    }`}
                  >
                    {formatDistanceToNow(message.timestamp.toDate(), {
                      addSuffix: true,
                      locale: fr
                    })}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </CardContent>
  );
};
