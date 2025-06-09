
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Circle, Mail } from 'lucide-react';
import type { Conversation } from '@/types/chat';

interface ChatHeaderProps {
  conversation: Conversation;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ conversation }) => {
  return (
    <CardHeader className="border-b">
      <CardTitle className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h3 className="text-lg font-semibold">{conversation.clientName}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail className="h-4 w-4" />
              {conversation.clientEmail}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Circle
            className={`h-3 w-3 ${
              conversation.status === 'online'
                ? 'text-green-500 fill-current'
                : 'text-gray-400 fill-current'
            }`}
          />
          <span className="text-sm text-gray-600">
            {conversation.status === 'online' ? 'En ligne' : 'Hors ligne'}
          </span>
        </div>
      </CardTitle>
    </CardHeader>
  );
};
