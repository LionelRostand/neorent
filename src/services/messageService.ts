
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query, 
  where, 
  onSnapshot, 
  orderBy,
  Timestamp,
  getDocs
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Conversation, ChatMessage, CreateConversationData, SendMessageData } from '@/types/chat';

export const messageService = {
  // Créer une nouvelle conversation
  async createConversation(data: CreateConversationData): Promise<string> {
    try {
      const conversationData = {
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        lastMessage: '',
        lastMessageTime: Timestamp.now(),
        unreadCount: 0,
        status: 'online' as const,
        createdAt: Timestamp.now()
      };

      const docRef = await addDoc(collection(db, 'conversations'), conversationData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  },

  // Envoyer un message
  async sendMessage(data: SendMessageData): Promise<void> {
    try {
      // Ajouter le message
      const messageData = {
        conversationId: data.conversationId,
        sender: data.sender,
        senderName: data.senderName,
        senderEmail: data.senderEmail,
        message: data.message,
        timestamp: Timestamp.now(),
        read: false
      };

      await addDoc(collection(db, 'garage_messages'), messageData);

      // Mettre à jour la conversation
      const conversationRef = doc(db, 'conversations', data.conversationId);
      const updateData: any = {
        lastMessage: data.message,
        lastMessageTime: Timestamp.now()
      };

      // Si c'est un message client, incrémenter unreadCount
      if (data.sender === 'client') {
        // On récupère d'abord le document pour incrémenter
        const conversationQuery = query(
          collection(db, 'conversations'),
          where('__name__', '==', data.conversationId)
        );
        const snapshot = await getDocs(conversationQuery);
        if (!snapshot.empty) {
          const currentData = snapshot.docs[0].data();
          updateData.unreadCount = (currentData.unreadCount || 0) + 1;
        }
      }

      await updateDoc(conversationRef, updateData);
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // Écouter les messages d'une conversation
  subscribeToMessages(conversationId: string, callback: (messages: ChatMessage[]) => void) {
    try {
      const q = query(
        collection(db, 'garage_messages'),
        where('conversationId', '==', conversationId)
      );

      return onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as ChatMessage));

        // Tri par timestamp côté client
        messages.sort((a, b) => a.timestamp.toMillis() - b.timestamp.toMillis());
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

        callback(conversations);
      }, (error) => {
        console.error('Error listening to conversations:', error);
        callback([]);
      });
    } catch (error) {
      console.error('Error subscribing to conversations:', error);
      return () => {};
    }
  },

  // Marquer les messages comme lus
  async markMessagesAsRead(conversationId: string): Promise<void> {
    try {
      // Mettre à jour le compteur dans la conversation
      const conversationRef = doc(db, 'conversations', conversationId);
      await updateDoc(conversationRef, {
        unreadCount: 0
      });

      // Marquer tous les messages non lus comme lus
      const q = query(
        collection(db, 'garage_messages'),
        where('conversationId', '==', conversationId),
        where('read', '==', false)
      );

      const snapshot = await getDocs(q);
      const updatePromises = snapshot.docs.map(doc => 
        updateDoc(doc.ref, { read: true })
      );

      await Promise.all(updatePromises);
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }
  },

  // Supprimer un message
  async deleteMessage(messageId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'garage_messages', messageId));
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  },

  // Supprimer une conversation
  async deleteConversation(conversationId: string): Promise<void> {
    try {
      // Supprimer tous les messages
      const q = query(
        collection(db, 'garage_messages'),
        where('conversationId', '==', conversationId)
      );
      const snapshot = await getDocs(q);
      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);

      // Supprimer la conversation
      await deleteDoc(doc(db, 'conversations', conversationId));
    } catch (error) {
      console.error('Error deleting conversation:', error);
      throw error;
    }
  },

  // Rechercher une conversation par email
  async findConversationByEmail(email: string): Promise<Conversation | null> {
    try {
      const q = query(
        collection(db, 'conversations'),
        where('clientEmail', '==', email)
      );
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data()
        } as Conversation;
      }
      
      return null;
    } catch (error) {
      console.error('Error finding conversation by email:', error);
      return null;
    }
  }
};
