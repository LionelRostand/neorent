
import React from 'react';
import { Card } from '@/components/ui/card';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import type { Conversation, ChatMessage } from '@/types/chat';

interface ChatWindowProps {
  conversation: Conversation;
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  conversation,
  messages,
  onSendMessage
}) => {
  return (
    <Card className="h-full flex flex-col">
      <ChatHeader conversation={conversation} />
      <MessageList messages={messages} />
      <MessageInput onSendMessage={onSendMessage} />
    </Card>
  );
};
