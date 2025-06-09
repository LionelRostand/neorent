
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query, 
  where, 
  orderBy,
  Timestamp,
  getDocs
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Conversation, CreateConversationData } from '@/types/chat';

export const conversationService = {
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

  // Mettre à jour une conversation
  async updateConversation(conversationId: string, data: any): Promise<void> {
    try {
      const conversationRef = doc(db, 'conversations', conversationId);
      await updateDoc(conversationRef, data);
    } catch (error) {
      console.error('Error updating conversation:', error);
      throw error;
    }
  },

  // Marquer les messages comme lus
  async markMessagesAsRead(conversationId: string): Promise<void> {
    try {
      const conversationRef = doc(db, 'conversations', conversationId);
      await updateDoc(conversationRef, {
        unreadCount: 0
      });
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }
  },

  // Supprimer une conversation
  async deleteConversation(conversationId: string): Promise<void> {
    try {
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
