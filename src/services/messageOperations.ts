
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc,
  deleteDoc,
  query, 
  where, 
  Timestamp,
  getDocs
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { SendMessageData } from '@/types/chat';

export const messageOperations = {
  // Envoyer un message
  async sendMessage(data: SendMessageData): Promise<void> {
    try {
      // Ajouter le message dans rent_messages
      const messageData = {
        conversationId: data.conversationId,
        sender: data.sender,
        senderName: data.senderName,
        senderEmail: data.senderEmail,
        message: data.message,
        timestamp: Timestamp.now(),
        read: false
      };

      await addDoc(collection(db, 'rent_messages'), messageData);

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

  // Supprimer un message
  async deleteMessage(messageId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'rent_messages', messageId));
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  },

  // Marquer tous les messages d'une conversation comme lus
  async markConversationMessagesAsRead(conversationId: string): Promise<void> {
    try {
      const q = query(
        collection(db, 'rent_messages'),
        where('conversationId', '==', conversationId),
        where('read', '==', false)
      );

      const snapshot = await getDocs(q);
      const updatePromises = snapshot.docs.map(doc => 
        updateDoc(doc.ref, { read: true })
      );

      await Promise.all(updatePromises);
    } catch (error) {
      console.error('Error marking conversation messages as read:', error);
      throw error;
    }
  },

  // Supprimer tous les messages d'une conversation
  async deleteConversationMessages(conversationId: string): Promise<void> {
    try {
      const q = query(
        collection(db, 'rent_messages'),
        where('conversationId', '==', conversationId)
      );
      const snapshot = await getDocs(q);
      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Error deleting conversation messages:', error);
      throw error;
    }
  }
};
