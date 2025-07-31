import {
  collection,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  increment,
  getDocs,
  arrayUnion,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { 
  UnifiedConversation, 
  UnifiedMessage, 
  CreateConversationData, 
  SendMessageData 
} from '@/types/unifiedChat';

export const unifiedChatService = {
  // Créer une nouvelle conversation
  async createConversation(data: CreateConversationData): Promise<string> {
    try {
      const conversationData = {
        participants: data.participants,
        participantNames: data.participantNames,
        lastMessage: '',
        lastMessageTime: serverTimestamp(),
        unreadCount: data.participants.reduce((acc, email) => {
          acc[email] = 0;
          return acc;
        }, {} as Record<string, number>),
        createdAt: serverTimestamp(),
        type: data.type
      };

      const docRef = await addDoc(collection(db, 'unified_conversations'), conversationData);
      console.log('✅ Conversation unifiée créée:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ Erreur création conversation:', error);
      throw error;
    }
  },

  // Trouver une conversation existante entre participants
  async findConversation(participants: string[]): Promise<string | null> {
    try {
      const conversationsRef = collection(db, 'unified_conversations');
      const q = query(
        conversationsRef,
        where('participants', 'array-contains-any', participants)
      );

      const snapshot = await getDocs(q);
      
      for (const doc of snapshot.docs) {
        const data = doc.data();
        const docParticipants = data.participants as string[];
        
        // Vérifier si tous les participants correspondent
        if (participants.every(p => docParticipants.includes(p)) && 
            docParticipants.every(p => participants.includes(p))) {
          return doc.id;
        }
      }
      
      return null;
    } catch (error) {
      console.error('❌ Erreur recherche conversation:', error);
      return null;
    }
  },

  // Envoyer un message
  async sendMessage(data: SendMessageData): Promise<void> {
    try {
      // Ajouter le message
      const messageData = {
        conversationId: data.conversationId,
        senderEmail: data.senderEmail,
        senderName: data.senderName,
        content: data.content,
        timestamp: serverTimestamp(),
        readBy: [data.senderEmail] // L'expéditeur a automatiquement "lu" son message
      };

      await addDoc(collection(db, 'unified_messages'), messageData);

      // Mettre à jour la conversation
      const conversationRef = doc(db, 'unified_conversations', data.conversationId);
      await updateDoc(conversationRef, {
        lastMessage: data.content,
        lastMessageTime: serverTimestamp(),
        [`unreadCount.${data.senderEmail}`]: 0 // Reset pour l'expéditeur
      });

      // Incrémenter le compteur non lu pour les autres participants
      const conversationDoc = await getDocs(query(
        collection(db, 'unified_conversations'),
        where('__name__', '==', data.conversationId)
      ));

      if (!conversationDoc.empty) {
        const participants = conversationDoc.docs[0].data().participants as string[];
        const otherParticipants = participants.filter(p => p !== data.senderEmail);

        for (const participant of otherParticipants) {
          await updateDoc(conversationRef, {
            [`unreadCount.${participant}`]: increment(1)
          });
        }
      }

      console.log('✅ Message unifié envoyé');
    } catch (error) {
      console.error('❌ Erreur envoi message:', error);
      throw error;
    }
  },

  // Marquer les messages comme lus
  async markAsRead(conversationId: string, userEmail: string): Promise<void> {
    try {
      // Mettre à jour le compteur dans la conversation
      const conversationRef = doc(db, 'unified_conversations', conversationId);
      await updateDoc(conversationRef, {
        [`unreadCount.${userEmail}`]: 0
      });

      // Marquer tous les messages non lus comme lus
      const messagesRef = collection(db, 'unified_messages');
      const q = query(
        messagesRef,
        where('conversationId', '==', conversationId)
      );

      const snapshot = await getDocs(q);
      
      for (const messageDoc of snapshot.docs) {
        const messageData = messageDoc.data();
        const readBy = messageData.readBy as string[];
        
        if (!readBy.includes(userEmail)) {
          await updateDoc(doc(db, 'unified_messages', messageDoc.id), {
            readBy: arrayUnion(userEmail)
          });
        }
      }

      console.log('✅ Messages marqués comme lus');
    } catch (error) {
      console.error('❌ Erreur marquage comme lu:', error);
      throw error;
    }
  },

  // Écouter les conversations d'un utilisateur
  subscribeToConversations(userEmail: string, callback: (conversations: UnifiedConversation[]) => void) {
    console.log('🔍 Recherche de conversations pour userEmail:', userEmail);
    
    const conversationsRef = collection(db, 'unified_conversations');
    const q = query(
      conversationsRef,
      where('participants', 'array-contains', userEmail),
      orderBy('lastMessageTime', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      console.log('📊 Snapshot reçu - Documents trouvés:', snapshot.docs.length);
      
      const conversations = snapshot.docs.map(doc => {
        const data = doc.data();
        console.log('📄 Document conversation:', doc.id, data);
        return {
          id: doc.id,
          ...data
        };
      }) as UnifiedConversation[];

      console.log('🔄 Conversations unifiées reçues:', conversations.length, conversations);
      callback(conversations);
    }, (error) => {
      console.error('❌ Erreur lors de l\'écoute des conversations:', error);
      callback([]);
    });
  },

  // Écouter les messages d'une conversation
  subscribeToMessages(conversationId: string, callback: (messages: UnifiedMessage[]) => void) {
    const messagesRef = collection(db, 'unified_messages');
    const q = query(
      messagesRef,
      where('conversationId', '==', conversationId),
      orderBy('timestamp', 'asc')
    );

    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UnifiedMessage[];

      console.log('🔄 Messages unifiés reçus:', messages.length);
      callback(messages);
    });
  }
};