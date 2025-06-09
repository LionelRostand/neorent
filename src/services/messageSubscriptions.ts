
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  orderBy
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Conversation, ChatMessage } from '@/types/chat';

export const messageSubscriptions = {
  // Écouter les messages d'une conversation
  subscribeToMessages(conversationId: string, callback: (messages: ChatMessage[]) => void) {
    try {
      const q = query(
        collection(db, 'rent_messages'),
        where('conversationId', '==', conversationId),
        orderBy('timestamp', 'asc')
      );

      return onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as ChatMessage));

        console.log(`Messages reçus pour conversation ${conversationId}:`, messages);
        callback(messages);
      }, (error) => {
        console.error('Error listening to messages:', error);
        callback([]);
      });
    } catch (error) {
      console.error('Error subscribing to messages:', error);
      return () => {};
    }
  },

  // Écouter toutes les conversations
  subscribeToConversations(callback: (conversations: Conversation[]) => void) {
    try {
      const q = query(
        collection(db, 'conversations'),
        orderBy('lastMessageTime', 'desc')
      );

      return onSnapshot(q, (snapshot) => {
        const conversations = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Conversation));

        console.log('Conversations reçues:', conversations);
        callback(conversations);
      }, (error) => {
        console.error('Error listening to conversations:', error);
        callback([]);
      });
    } catch (error) {
      console.error('Error subscribing to conversations:', error);
      return () => {};
    }
  }
};
