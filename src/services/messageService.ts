
import { conversationService } from './conversationService';
import { messageOperations } from './messageOperations';
import { messageSubscriptions } from './messageSubscriptions';

// Réexporter toutes les fonctionnalités avec l'interface originale
export const messageService = {
  // Fonctionnalités des conversations
  createConversation: conversationService.createConversation,
  findConversationByEmail: conversationService.findConversationByEmail,
  deleteConversation: async (conversationId: string): Promise<void> => {
    try {
      // Supprimer tous les messages
      await messageOperations.deleteConversationMessages(conversationId);
      // Supprimer la conversation
      await conversationService.deleteConversation(conversationId);
    } catch (error) {
      console.error('Error deleting conversation:', error);
      throw error;
    }
  },

  // Fonctionnalités des messages
  sendMessage: messageOperations.sendMessage,
  deleteMessage: messageOperations.deleteMessage,
  markMessagesAsRead: async (conversationId: string): Promise<void> => {
    try {
      // Mettre à jour le compteur dans la conversation
      await conversationService.markMessagesAsRead(conversationId);
      // Marquer tous les messages comme lus
      await messageOperations.markConversationMessagesAsRead(conversationId);
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }
  },

  // Abonnements temps réel
  subscribeToMessages: messageSubscriptions.subscribeToMessages,
  subscribeToConversations: messageSubscriptions.subscribeToConversations
};

// Réexporter les services individuels pour un usage avancé si nécessaire
export { conversationService } from './conversationService';
export { messageOperations } from './messageOperations';
export { messageSubscriptions } from './messageSubscriptions';
