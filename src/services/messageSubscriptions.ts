
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
      console.log('🔥 messageSubscriptions: Vérification de la connectivité Firebase...');
      
      // Vérifier la connectivité Firebase avant de continuer
      if (!db) {
        console.error('🔥 messageSubscriptions: Base de données Firebase non initialisée');
        callback([]);
        return () => {};
      }
      
      // Requête simplifiée sans orderBy pour éviter les problèmes d'index
      const q = query(
        collection(db, 'rent_messages'),
        where('conversationId', '==', conversationId)
      );

      console.log('🔥 messageSubscriptions: Query créée, démarrage de onSnapshot...');

      return onSnapshot(q, 
        (snapshot) => {
          console.log('🔥 messageSubscriptions: Snapshot reçu pour conversation:', conversationId);
          console.log('🔥 messageSubscriptions: Snapshot metadata:', {
            hasPendingWrites: snapshot.metadata.hasPendingWrites,
            isFromCache: snapshot.metadata.fromCache,
            size: snapshot.size,
            empty: snapshot.empty
          });
          
          if (snapshot.empty) {
            console.log('🔥 messageSubscriptions: Snapshot vide - aucun message trouvé pour la conversation:', conversationId);
            callback([]);
            return;
          }

          console.log('🔥 messageSubscriptions: Processing', snapshot.docs.length, 'documents');
          const messages = snapshot.docs.map(doc => {
            const data = doc.data();
            console.log('🔥 messageSubscriptions: Processing document:', {
              id: doc.id,
              conversationId: data.conversationId,
              sender: data.sender,
              senderName: data.senderName,
              message: data.message ? data.message.substring(0, 50) + '...' : 'no message',
              timestamp: data.timestamp,
              timestampType: typeof data.timestamp,
              hasToDate: data.timestamp && typeof data.timestamp.toDate === 'function'
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

          console.log('🔥 messageSubscriptions: Messages finaux pour conversation', conversationId, ':', messages.length);
          callback(messages);
        }, 
        (error) => {
          console.error('🔥 messageSubscriptions: Erreur onSnapshot pour conversation', conversationId, ':', error);
          console.error('🔥 messageSubscriptions: Erreur détails:', {
            code: error.code,
            message: error.message,
            stack: error.stack
          });
          
          // Vérifier si c'est une erreur réseau (502)
          if (error.message.includes('502') || error.code === 'unavailable') {
            console.error('🔥 messageSubscriptions: Erreur 502 détectée - problème de connectivité serveur');
          }
          
          callback([]);
        }
      );
    } catch (error) {
      console.error('🔥 messageSubscriptions: Erreur lors de la souscription aux messages pour conversation', conversationId, ':', error);
      console.error('🔥 messageSubscriptions: Type d\'erreur:', typeof error, error);
      return () => {};
    }
  },

  // Écouter toutes les conversations
  subscribeToConversations(callback: (conversations: Conversation[]) => void) {
    try {
      console.log('🔥 messageSubscriptions: Souscription aux conversations');
      console.log('🔥 messageSubscriptions: Vérification de la connectivité Firebase...');
      
      // Vérifier la connectivité Firebase avant de continuer
      if (!db) {
        console.error('🔥 messageSubscriptions: Base de données Firebase non initialisée');
        callback([]);
        return () => {};
      }
      
      const q = query(
        collection(db, 'conversations'),
        orderBy('lastMessageTime', 'desc')
      );

      return onSnapshot(q, 
        (snapshot) => {
          console.log('🔥 messageSubscriptions: Conversations snapshot reçu, docs:', snapshot.docs.length);
          console.log('🔥 messageSubscriptions: Conversations snapshot metadata:', {
            hasPendingWrites: snapshot.metadata.hasPendingWrites,
            isFromCache: snapshot.metadata.fromCache,
            size: snapshot.size,
            empty: snapshot.empty
          });
          
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
          console.error('🔥 messageSubscriptions: Error listening to conversations:', error);
          console.error('🔥 messageSubscriptions: Erreur détails:', {
            code: error.code,
            message: error.message,
            stack: error.stack
          });
          
          // Vérifier si c'est une erreur réseau (502)
          if (error.message.includes('502') || error.code === 'unavailable') {
            console.error('🔥 messageSubscriptions: Erreur 502 détectée dans conversations - problème de connectivité serveur');
          }
          
          callback([]);
        }
      );
    } catch (error) {
      console.error('🔥 messageSubscriptions: Error subscribing to conversations:', error);
      console.error('🔥 messageSubscriptions: Type d\'erreur:', typeof error, error);
      return () => {};
    }
  }
};
