
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
            console.log('🔥 messageSubscriptions: Tentative avec getDocs pour vérifier...');
            
            // Test avec getDocs pour voir s'il y a vraiment des données
            getDocs(q).then(testSnapshot => {
              console.log('🔥 messageSubscriptions: Test getDocs résultat:', {
                empty: testSnapshot.empty,
                size: testSnapshot.size
              });
              if (!testSnapshot.empty) {
                console.log('🔥 messageSubscriptions: getDocs trouve des documents mais onSnapshot ne les voit pas!');
                testSnapshot.docs.forEach(doc => {
                  console.log('🔥 messageSubscriptions: Document trouvé par getDocs:', {
                    id: doc.id,
                    data: doc.data()
                  });
                });
              }
            });
            
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
          messages.forEach((msg, index) => {
            console.log(`🔥 Message final ${index}:`, {
              id: msg.id,
              message: msg.message.substring(0, 30) + '...',
              sender: msg.sender
            });
          });
          
          callback(messages);
        }, 
        (error) => {
          console.error('🔥 messageSubscriptions: Erreur onSnapshot pour conversation', conversationId, ':', error);
          console.error('🔥 messageSubscriptions: Erreur détails:', {
            code: error.code,
            message: error.message,
            stack: error.stack
          });
          
          // Fallback avec getDocs
          console.log('🔥 messageSubscriptions: Tentative de fallback avec getDocs...');
          getDocs(q).then(snapshot => {
            console.log('🔥 messageSubscriptions: getDocs fallback - docs trouvés:', snapshot.docs.length);
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
            
            console.log('🔥 messageSubscriptions: getDocs fallback - messages récupérés:', messages.length);
            callback(messages);
          }).catch(err => {
            console.error('🔥 messageSubscriptions: Erreur getDocs fallback:', err);
            callback([]);
          });
        }
      );
    } catch (error) {
      console.error('🔥 messageSubscriptions: Erreur lors de la souscription aux messages pour conversation', conversationId, ':', error);
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
          callback([]);
        }
      );
    } catch (error) {
      console.error('🔥 messageSubscriptions: Error subscribing to conversations:', error);
      return () => {};
    }
  }
};
