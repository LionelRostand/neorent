import { useState, useEffect, useCallback } from 'react';
import { unifiedChatService } from '@/services/unifiedChatService';
import type { UnifiedConversation, UnifiedMessage } from '@/types/unifiedChat';

export const useUnifiedChat = (userEmail: string) => {
  const [conversations, setConversations] = useState<UnifiedConversation[]>([]);
  const [messages, setMessages] = useState<UnifiedMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);

  console.log('🗨️ useUnifiedChat - Hook initialisé avec userEmail:', userEmail);

  // Écouter les conversations
  useEffect(() => {
    if (!userEmail) return;

    console.log('🗨️ useUnifiedChat - Écoute des conversations pour:', userEmail);
    
    const unsubscribe = unifiedChatService.subscribeToConversations(userEmail, (conversations) => {
      setConversations(conversations);
    });

    return unsubscribe;
  }, [userEmail]);

  // Écouter les messages d'une conversation
  const subscribeToMessages = useCallback((conversationId: string) => {
    if (!conversationId) return;

    console.log('🗨️ useUnifiedChat - Souscription aux messages pour conversation:', conversationId);
    setLoadingMessages(true);
    
    const unsubscribe = unifiedChatService.subscribeToMessages(conversationId, (messages) => {
      setMessages(messages);
      setLoadingMessages(false);
    });

    return unsubscribe;
  }, []);

  // Créer ou trouver une conversation
  const createOrFindConversation = useCallback(async (
    otherUserEmail: string, 
    otherUserName: string, 
    userName: string
  ): Promise<string | null> => {
    try {
      setLoading(true);
      
      const participants = [userEmail, otherUserEmail].sort();
      
      // Chercher une conversation existante
      let conversationId = await unifiedChatService.findConversation(participants);
      
      if (!conversationId) {
        // Créer une nouvelle conversation
        const participantNames = {
          [userEmail]: userName,
          [otherUserEmail]: otherUserName
        };

        // Déterminer le type de conversation
        let type: 'tenant_to_tenant' | 'tenant_to_admin' | 'admin_to_tenant' = 'tenant_to_tenant';
        if (otherUserEmail.includes('admin') || otherUserEmail.includes('neotech')) {
          type = 'tenant_to_admin';
        } else if (userEmail.includes('admin') || userEmail.includes('neotech')) {
          type = 'admin_to_tenant';
        }

        conversationId = await unifiedChatService.createConversation({
          participants,
          participantNames,
          type
        });
      }

      return conversationId;
    } catch (error) {
      console.error('Erreur lors de la création/recherche de conversation:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [userEmail]);

  // Envoyer un message
  const sendMessage = useCallback(async (
    otherUserEmail: string, 
    content: string, 
    userName: string = userEmail,
    otherUserName: string = otherUserEmail
  ) => {
    try {
      setLoading(true);
      
      // Créer ou trouver la conversation
      const conversationId = await createOrFindConversation(otherUserEmail, otherUserName, userName);
      
      if (!conversationId) {
        throw new Error('Impossible de créer ou trouver la conversation');
      }

      // Envoyer le message
      await unifiedChatService.sendMessage({
        conversationId,
        senderEmail: userEmail,
        senderName: userName,
        content
      });

      console.log('✅ Message envoyé avec succès');
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi du message:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [userEmail, createOrFindConversation]);

  // Marquer les messages comme lus
  const markAsRead = useCallback(async (conversationId: string) => {
    try {
      await unifiedChatService.markAsRead(conversationId, userEmail);
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
    }
  }, [userEmail]);

  return {
    conversations,
    messages,
    loading,
    loadingMessages,
    sendMessage,
    subscribeToMessages,
    markAsRead,
    createOrFindConversation
  };
};