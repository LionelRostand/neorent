
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
  loading?: boolean;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({ 
  messages, 
  onSendMessage,
  loading = false
}) => {
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isSending, setIsSending] = useState(false);

  console.log('💬 ChatMessages: Rendu avec', messages.length, 'messages');

  // Auto-scroll vers le bas lors de nouveaux messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && !isSending) {
      console.log('💬 ChatMessages: Envoi du message:', newMessage.trim());
      setIsSending(true);
      try {
        await onSendMessage(newMessage.trim());
        setNewMessage('');
      } catch (error) {
        console.error('💬 ChatMessages: Erreur envoi message:', error);
      } finally {
        setIsSending(false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
            <p className="text-gray-500 text-sm">Chargement des messages...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Zone de messages avec scroll */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full px-3 py-2">
          <div className="space-y-3 min-h-full">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-4">
                <p className="text-sm">Conversation démarrée !</p>
                <p className="text-xs text-gray-400 mt-1">Envoyez votre premier message.</p>
              </div>
            ) : (
              messages.map((message) => {
                console.log('💬 ChatMessages: Rendu du message:', message.id);
                return (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === 'client' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[85%] px-3 py-2 rounded-lg text-sm shadow-sm ${
                        message.sender === 'client'
                          ? 'bg-green-500 text-white rounded-br-sm'
                          : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                      }`}
                    >
                      <div className={`font-medium text-xs mb-1 ${
                        message.sender === 'client' ? 'text-green-100' : 'text-gray-600'
                      }`}>
                        {message.senderName}
                      </div>
                      <div className="whitespace-pre-wrap leading-relaxed">{message.message}</div>
                      <div
                        className={`text-xs mt-1 opacity-75 ${
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
            {/* Élément invisible pour le scroll automatique */}
            <div ref={scrollRef} className="h-1" />
          </div>
        </ScrollArea>
      </div>
      
      {/* Zone de saisie fixe en bas */}
      <div className="flex-shrink-0 p-3 border-t bg-gray-50">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Tapez votre message..."
            className="flex-1 text-sm"
            disabled={isSending}
          />
          <Button
            type="submit"
            disabled={!newMessage.trim() || isSending}
            size="sm"
            className="bg-green-500 hover:bg-green-600 disabled:opacity-50 flex-shrink-0"
          >
            {isSending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};
