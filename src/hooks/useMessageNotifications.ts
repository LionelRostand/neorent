
import { useState, useEffect } from 'react';
import { messageService } from '@/services/messageService';
import type { Conversation } from '@/types/chat';

export const useMessageNotifications = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasNewMessages, setHasNewMessages] = useState(false);

  useEffect(() => {
    const unsubscribe = messageService.subscribeToConversations((newConversations) => {
      const previousUnreadCount = unreadCount;
      setConversations(newConversations);
      
      const totalUnread = newConversations.reduce((sum, conv) => sum + conv.unreadCount, 0);
      setUnreadCount(totalUnread);

      // Détecter de nouveaux messages
      if (totalUnread > previousUnreadCount && previousUnreadCount > 0) {
        setHasNewMessages(true);
        // Notification sonore ou visuelle peut être ajoutée ici
        console.log('Nouveau message reçu!');
      }
    });

    return unsubscribe;
  }, [unreadCount]);

  const clearNewMessageFlag = () => {
    setHasNewMessages(false);
  };

  const getRecentConversations = (limit: number = 5) => {
    return conversations
      .sort((a, b) => b.lastMessageTime.toMillis() - a.lastMessageTime.toMillis())
      .slice(0, limit);
  };

  return {
    conversations,
    unreadCount,
    hasNewMessages,
    clearNewMessageFlag,
    getRecentConversations
  };
};
