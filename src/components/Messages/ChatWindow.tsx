
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
  onDeleteMessage?: (messageId: string) => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  conversation,
  messages,
  onSendMessage,
  onDeleteMessage
}) => {
  return (
    <Card className="h-full flex flex-col">
      <ChatHeader conversation={conversation} />
      <MessageList messages={messages} onDeleteMessage={onDeleteMessage} />
      <MessageInput onSendMessage={onSendMessage} />
    </Card>
  );
};
