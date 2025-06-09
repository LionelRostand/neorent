
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Minus } from 'lucide-react';
import { ChatForm } from './ChatForm';
import { ChatMessages } from './ChatMessages';
import type { ChatMessage } from '@/types/chat';

interface ChatFormData {
  name: string;
  email: string;
}

interface ChatWidgetWindowProps {
  hasStartedChat: boolean;
  messages: ChatMessage[];
  onStartChat: (formData: ChatFormData) => void;
  onSendMessage: (message: string) => void;
  onClose: () => void;
  onMinimize: () => void;
  loading?: boolean;
}

export const ChatWidgetWindow: React.FC<ChatWidgetWindowProps> = ({
  hasStartedChat,
  messages,
  onStartChat,
  onSendMessage,
  onClose,
  onMinimize,
  loading = false
}) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 h-96">
      <Card className="h-full flex flex-col">
        <CardHeader className="bg-green-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center justify-between text-lg">
            Chat NeoRent
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={onMinimize}
                className="text-white hover:bg-green-600 p-1 h-auto"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-green-600 p-1 h-auto"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 p-0 flex flex-col">
          {!hasStartedChat ? (
            <ChatForm onSubmit={onStartChat} />
          ) : (
            <ChatMessages 
              messages={messages} 
              onSendMessage={onSendMessage}
              loading={loading}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
