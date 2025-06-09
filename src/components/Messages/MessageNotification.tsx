
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { messageService } from '@/services/messageService';
import type { Conversation } from '@/types/chat';

export const MessageNotification: React.FC = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    const unsubscribe = messageService.subscribeToConversations((newConversations) => {
      setConversations(newConversations);
      const totalUnread = newConversations.reduce((sum, conv) => sum + conv.unreadCount, 0);
      setUnreadCount(totalUnread);
    });

    return unsubscribe;
  }, []);

  return (
    <Link to="/admin/messages">
      <Button variant="ghost" size="sm" className="relative">
        <MessageCircle className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge 
            className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>
    </Link>
  );
};
