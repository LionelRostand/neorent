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
      console.log('💬 messageOperations: Envoi du message:', {
        conversationId: data.conversationId,
        sender: data.sender,
        senderName: data.senderName,
        message: data.message.substring(0, 50) + '...'
      });

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

      console.log('💬 messageOperations: Données du message à sauvegarder:', messageData);
      const docRef = await addDoc(collection(db, 'rent_messages'), messageData);
      console.log('💬 messageOperations: Message sauvegardé avec ID:', docRef.id);

      // Mettre à jour la conversation
      const conversationRef = doc(db, 'conversations', data.conversationId);
      const updateData: any = {
        lastMessage: data.message,
        lastMessageTime: Timestamp.now()
      };

      // Si c'est un message client, incrémenter unreadCount
      if (data.sender === 'client') {
        console.log('💬 messageOperations: Message client, incrémentation unreadCount');
        // On récupère d'abord le document pour incrémenter
        const conversationQuery = query(
          collection(db, 'conversations'),
          where('__name__', '==', data.conversationId)
        );
        const snapshot = await getDocs(conversationQuery);
        if (!snapshot.empty) {
          const currentData = snapshot.docs[0].data();
          updateData.unreadCount = (currentData.unreadCount || 0) + 1;
          console.log('💬 messageOperations: Nouveau unreadCount:', updateData.unreadCount);
        }
      }

      await updateDoc(conversationRef, updateData);
      console.log('💬 messageOperations: Conversation mise à jour');
    } catch (error) {
      console.error('💬 messageOperations: Erreur lors de l\'envoi du message:', error);
      throw error;
    }
  },

  // Créer une session avec message de bienvenue
  async createSessionWithWelcome(conversationId: string, clientName: string): Promise<void> {
    try {
      console.log('💬 messageOperations: Création du message de bienvenue pour:', clientName, 'conversation:', conversationId);
      
      // Message de bienvenue automatique du support
      const welcomeMessage = {
        conversationId,
        sender: 'staff' as const,
        senderName: 'Support NeoRent',
        senderEmail: 'support@neorent.fr',
        message: `Bonjour ${clientName} ! Bienvenue sur le chat NeoRent. Notre équipe est là pour vous aider. Comment pouvons-nous vous assister aujourd'hui ?`,
        timestamp: Timestamp.now(),
        read: false
      };

      console.log('💬 messageOperations: Données du message de bienvenue:', welcomeMessage);
      const docRef = await addDoc(collection(db, 'rent_messages'), welcomeMessage);
      console.log('💬 messageOperations: Message de bienvenue sauvegardé avec ID:', docRef.id);

      // Mettre à jour la conversation avec le message de bienvenue
      const conversationRef = doc(db, 'conversations', conversationId);
      await updateDoc(conversationRef, {
        lastMessage: welcomeMessage.message,
        lastMessageTime: Timestamp.now()
      });
      console.log('💬 messageOperations: Conversation mise à jour avec le message de bienvenue');
    } catch (error) {
      console.error('💬 messageOperations: Erreur lors de la création du message de bienvenue:', error);
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
