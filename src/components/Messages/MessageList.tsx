
import React, { useEffect, useRef, useState } from 'react';
import { CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Trash2, MoreVertical } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { ChatMessage } from '@/types/chat';

interface MessageListProps {
  messages: ChatMessage[];
  onDeleteMessage?: (messageId: string) => void;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, onDeleteMessage }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hoveredMessage, setHoveredMessage] = useState<string | null>(null);

  console.log('📋 MessageList: Rendu avec', messages.length, 'messages');
  console.log('📋 MessageList: Messages reçus:', messages);
  
  if (messages.length > 0) {
    messages.forEach((msg, index) => {
      console.log(`📋 MessageList: Message ${index}:`, {
        id: msg.id,
        conversationId: msg.conversationId,
        sender: msg.sender,
        senderName: msg.senderName,
        message: msg.message,
        timestamp: msg.timestamp,
        timestampType: typeof msg.timestamp,
        hasToDate: msg.timestamp && typeof msg.timestamp.toDate === 'function'
      });
    });
  } else {
    console.log('📋 MessageList: Aucun message à afficher');
  }
  
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
              <p>Aucun message dans cette conversation</p>
              <p className="text-sm mt-2">Debug: {messages.length} messages reçus</p>
            </div>
          ) : (
            messages.map((message) => {
              console.log('📋 MessageList: Rendu du message:', message.id, message.message);
              return (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === 'staff' ? 'justify-end' : 'justify-start'
                  }`}
                  onMouseEnter={() => setHoveredMessage(message.id)}
                  onMouseLeave={() => setHoveredMessage(null)}
                >
                  <div className="relative group">
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
                      <div className="text-sm mb-1 whitespace-pre-wrap">{message.message}</div>
                      <div
                        className={`text-xs ${
                          message.sender === 'staff'
                            ? 'text-green-100'
                            : 'text-gray-500'
                        }`}
                      >
                        {message.timestamp && typeof message.timestamp.toDate === 'function' ? (
                          formatDistanceToNow(message.timestamp.toDate(), {
                            addSuffix: true,
                            locale: fr
                          })
                        ) : (
                          'Maintenant'
                        )}
                      </div>
                    </div>
                    
                    {/* Bouton de suppression qui apparaît au hover */}
                    {onDeleteMessage && hoveredMessage === message.id && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`absolute -top-2 ${
                          message.sender === 'staff' ? '-left-10' : '-right-10'
                        } opacity-0 group-hover:opacity-100 transition-opacity bg-white shadow-md hover:bg-red-50 text-red-600 h-8 w-8 p-0`}
                        onClick={() => onDeleteMessage(message.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </CardContent>
  );
};
