
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
      console.log('messageSubscriptions: Souscription aux messages pour conversation:', conversationId);
      
      const q = query(
        collection(db, 'rent_messages'),
        where('conversationId', '==', conversationId),
        orderBy('timestamp', 'asc')
      );

      return onSnapshot(q, 
        (snapshot) => {
          console.log('messageSubscriptions: Snapshot reçu pour conversation:', conversationId, 'docs:', snapshot.docs.length);
          
          const messages = snapshot.docs.map(doc => {
            const data = doc.data();
            console.log('messageSubscriptions: Message doc data:', data);
            return {
              id: doc.id,
              ...data
            } as ChatMessage;
          });

          console.log('messageSubscriptions: Messages traités pour conversation', conversationId, ':', messages);
          callback(messages);
        }, 
        (error) => {
          console.error('Error listening to messages for conversation', conversationId, ':', error);
          callback([]);
        }
      );
    } catch (error) {
      console.error('Error subscribing to messages for conversation', conversationId, ':', error);
      return () => {};
    }
  },

  // Écouter toutes les conversations
  subscribeToConversations(callback: (conversations: Conversation[]) => void) {
    try {
      console.log('messageSubscriptions: Souscription aux conversations');
      
      const q = query(
        collection(db, 'conversations'),
        orderBy('lastMessageTime', 'desc')
      );

      return onSnapshot(q, 
        (snapshot) => {
          console.log('messageSubscriptions: Conversations snapshot reçu, docs:', snapshot.docs.length);
          
          const conversations = snapshot.docs.map(doc => {
            const data = doc.data();
            console.log('messageSubscriptions: Conversation doc data:', data);
            return {
              id: doc.id,
              ...data
            } as Conversation;
          });

          console.log('messageSubscriptions: Conversations traitées:', conversations);
          callback(conversations);
        }, 
        (error) => {
          console.error('Error listening to conversations:', error);
          callback([]);
        }
      );
    } catch (error) {
      console.error('Error subscribing to conversations:', error);
      return () => {};
    }
  }
};
