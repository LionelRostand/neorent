
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
      console.log('🔥 messageSubscriptions: Souscription aux messages pour conversation:', conversationId);
      
      // Requête simplifiée sans orderBy pour éviter les problèmes d'index
      const q = query(
        collection(db, 'rent_messages'),
        where('conversationId', '==', conversationId)
      );

      return onSnapshot(q, 
        (snapshot) => {
          console.log('🔥 messageSubscriptions: Snapshot reçu pour conversation:', conversationId);
          console.log('🔥 messageSubscriptions: Nombre de documents:', snapshot.docs.length);
          console.log('🔥 messageSubscriptions: Documents vides?', snapshot.empty);
          
          if (snapshot.empty) {
            console.log('🔥 messageSubscriptions: Aucun message trouvé pour la conversation:', conversationId);
            callback([]);
            return;
          }

          const messages = snapshot.docs.map(doc => {
            const data = doc.data();
            console.log('🔥 messageSubscriptions: Message doc:', {
              id: doc.id,
              conversationId: data.conversationId,
              sender: data.sender,
              senderName: data.senderName,
              message: data.message,
              timestamp: data.timestamp?.toDate?.() || 'pas de timestamp'
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

          // Trier côté client par timestamp
          messages.sort((a, b) => {
            if (!a.timestamp || !b.timestamp) return 0;
            return a.timestamp.toMillis() - b.timestamp.toMillis();
          });

          console.log('🔥 messageSubscriptions: Messages triés pour conversation', conversationId, ':', messages.length);
          messages.forEach((msg, index) => {
            console.log(`🔥 Message ${index}:`, msg.message);
          });
          
          callback(messages);
        }, 
        (error) => {
          console.error('🔥 Error listening to messages for conversation', conversationId, ':', error);
          console.log('🔥 Tentative de récupération avec getDocs...');
          
          // Fallback avec getDocs
          getDocs(q).then(snapshot => {
            console.log('🔥 getDocs fallback - docs trouvés:', snapshot.docs.length);
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
            
            messages.sort((a, b) => {
              if (!a.timestamp || !b.timestamp) return 0;
              return a.timestamp.toMillis() - b.timestamp.toMillis();
            });
            
            console.log('🔥 getDocs fallback - messages récupérés:', messages.length);
            callback(messages);
          }).catch(err => {
            console.error('🔥 Error getDocs fallback:', err);
            callback([]);
          });
        }
      );
    } catch (error) {
      console.error('🔥 Error subscribing to messages for conversation', conversationId, ':', error);
      return () => {};
    }
  },

  // Écouter toutes les conversations
  subscribeToConversations(callback: (conversations: Conversation[]) => void) {
    try {
      console.log('🔥 messageSubscriptions: Souscription aux conversations');
      
      const q = query(
        collection(db, 'conversations'),
        orderBy('lastMessageTime', 'desc')
      );

      return onSnapshot(q, 
        (snapshot) => {
          console.log('🔥 messageSubscriptions: Conversations snapshot reçu, docs:', snapshot.docs.length);
          
          const conversations = snapshot.docs.map(doc => {
            const data = doc.data();
            console.log('🔥 messageSubscriptions: Conversation doc data:', {
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

          console.log('🔥 messageSubscriptions: Conversations traitées:', conversations.length);
          callback(conversations);
        }, 
        (error) => {
          console.error('🔥 Error listening to conversations:', error);
          callback([]);
        }
      );
    } catch (error) {
      console.error('🔥 Error subscribing to conversations:', error);
      return () => {};
    }
  }
};
