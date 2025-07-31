import { useState, useEffect, useCallback } from 'react';
import { simpleChat, SimpleConversation, SimpleMessage } from '@/services/simpleChat';

export const useSimpleChat = (userEmail: string, userName: string) => {
  const [conversations, setConversations] = useState<SimpleConversation[]>([]);
  const [messages, setMessages] = useState<SimpleMessage[]>([]);
  const [loading, setLoading] = useState(false);

  console.log('🎯 useSimpleChat initialisé pour:', userEmail);

  // Écouter les conversations
  useEffect(() => {
    if (!userEmail) return;

    console.log('👂 Démarrage écoute conversations pour:', userEmail);
    const unsubscribe = simpleChat.subscribeToConversations(userEmail, setConversations);
    return unsubscribe;
  }, [userEmail]);

  // Écouter les messages d'une conversation
  const subscribeToMessages = useCallback((conversationId: string) => {
    console.log('👂 Écoute messages conversation:', conversationId);
    return simpleChat.subscribeToMessages(conversationId, setMessages);
  }, []);

  // Envoyer un message
  const sendMessage = useCallback(async (otherUserEmail: string, otherUserName: string, content: string) => {
    if (!userEmail || !userName) return;

    try {
      setLoading(true);
      console.log('📤 Envoi message à:', otherUserName);
      
      // Créer ou récupérer la conversation
      const conversationId = await simpleChat.getOrCreateConversation(
        userEmail, 
        otherUserEmail, 
        userName, 
        otherUserName
      );
      
      // Envoyer le message
      await simpleChat.sendMessage(conversationId, userEmail, userName, content);
      
      console.log('✅ Message envoyé avec succès');
    } catch (error) {
      console.error('❌ Erreur envoi message:', error);
    } finally {
      setLoading(false);
    }
  }, [userEmail, userName]);

  return {
    conversations,
    messages,
    loading,
    sendMessage,
    subscribeToMessages
  };
};