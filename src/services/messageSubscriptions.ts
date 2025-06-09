
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  orderBy,
  getDocs
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
            console.log('messageSubscriptions: Message doc data:', {
              id: doc.id,
              conversationId: data.conversationId,
              sender: data.sender,
              senderName: data.senderName,
              message: data.message,
              timestamp: data.timestamp
            });
            return {
              id: doc.id,
              conversationId: data.conversationId,
              sender: data.sender,
              senderName: data.senderName,
              senderEmail: data.senderEmail,
              message: data.message,
              timestamp: data.timestamp,
              read: data.read || false
            } as ChatMessage;
          });

          console.log('messageSubscriptions: Messages traités pour conversation', conversationId, ':', messages.length);
          callback(messages);
        }, 
        (error) => {
          console.error('Error listening to messages for conversation', conversationId, ':', error);
          // En cas d'erreur, essayer de récupérer les messages une seule fois
          getDocs(q).then(snapshot => {
            const messages = snapshot.docs.map(doc => {
              const data = doc.data();
              return {
                id: doc.id,
                conversationId: data.conversationId,
                sender: data.sender,
                senderName: data.senderName,
                senderEmail: data.senderEmail,
                message: data.message,
                timestamp: data.timestamp,
                read: data.read || false
              } as ChatMessage;
            });
            console.log('messageSubscriptions: Messages récupérés via getDocs:', messages.length);
            callback(messages);
          }).catch(err => {
            console.error('Error getting messages via getDocs:', err);
            callback([]);
          });
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
            console.log('messageSubscriptions: Conversation doc data:', {
              id: doc.id,
              clientName: data.clientName,
              clientEmail: data.clientEmail,
              lastMessage: data.lastMessage,
              unreadCount: data.unreadCount
            });
            return {
              id: doc.id,
              clientName: data.clientName,
              clientEmail: data.clientEmail,
              lastMessage: data.lastMessage || '',
              lastMessageTime: data.lastMessageTime,
              unreadCount: data.unreadCount || 0,
              status: data.status || 'offline',
              createdAt: data.createdAt
            } as Conversation;
          });

          console.log('messageSubscriptions: Conversations traitées:', conversations.length);
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
