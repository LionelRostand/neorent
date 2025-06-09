
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { ChatMessage } from '@/types/chat';

interface ChatMessagesProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({ 
  messages, 
  onSendMessage 
}) => {
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  console.log('ChatMessages: Rendu avec', messages.length, 'messages');
  messages.forEach((msg, index) => {
    console.log(`ChatMessages: Message ${index}:`, {
      id: msg.id,
      sender: msg.sender,
      message: msg.message,
      timestamp: msg.timestamp
    });
  });

  // Auto-scroll vers le bas lors de nouveaux messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      console.log('ChatMessages: Envoi du message:', newMessage.trim());
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>Conversation démarrée ! Envoyez votre premier message.</p>
            </div>
          ) : (
            messages.map((message) => {
              console.log('ChatMessages: Affichage du message:', message);
              return (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === 'client' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                      message.sender === 'client'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-900'
                    }`}
                  >
                    <div className="font-medium text-xs mb-1">
                      {message.senderName}
                    </div>
                    <div>{message.message}</div>
                    <div
                      className={`text-xs mt-1 ${
                        message.sender === 'client'
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
                </div>
              );
            })
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Tapez votre message..."
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={!newMessage.trim()}
            size="sm"
            className="bg-green-500 hover:bg-green-600"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};
