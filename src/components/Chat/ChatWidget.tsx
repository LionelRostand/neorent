import React, { useState, useEffect } from 'react';
import { ChatWidgetButton } from './ChatWidgetButton';
import { ChatWidgetWindow } from './ChatWidgetWindow';
import { messageService } from '@/services/messageService';
import type { Conversation, ChatMessage } from '@/types/chat';

interface ChatFormData {
  name: string;
  email: string;
}

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [loading, setLoading] = useState(false);

  console.log('🎯 ChatWidget: État actuel - isOpen:', isOpen, 'conversation:', conversation?.id, 'messages:', messages.length);

  // Abonnement aux messages quand une conversation est active
  useEffect(() => {
    if (!conversation?.id) {
      console.log('🎯 ChatWidget: Pas de conversation active, reset des messages');
      setMessages([]);
      return;
    }

    console.log('🎯 ChatWidget: Abonnement aux messages pour la conversation:', conversation.id);
    setLoading(true);
    
    const unsubscribe = messageService.subscribeToMessages(
      conversation.id,
      (newMessages) => {
        console.log('🎯 ChatWidget: Callback messages reçu pour conversation', conversation.id);
        console.log('🎯 ChatWidget: Nombre de messages reçus:', newMessages.length);
        newMessages.forEach((msg, index) => {
          console.log(`🎯 ChatWidget: Message ${index}:`, {
            id: msg.id,
            sender: msg.sender,
            message: msg.message.substring(0, 50) + '...'
          });
        });
        setMessages(newMessages);
        setLoading(false);
      }
    );

    return () => {
      console.log('🎯 ChatWidget: Désabonnement des messages pour conversation:', conversation.id);
      unsubscribe();
    };
  }, [conversation?.id]);

  const handleStartChat = async (formData: ChatFormData) => {
    try {
      console.log('🎯 ChatWidget: Démarrage du chat avec:', formData);
      setLoading(true);
      
      // Vérifier s'il y a déjà une conversation pour cet email
      console.log('🎯 ChatWidget: Recherche conversation existante pour email:', formData.email);
      const existingConversation = await messageService.findConversationByEmail(formData.email);
      console.log('🎯 ChatWidget: Conversation existante trouvée:', existingConversation);
      
      let conversationToUse: Conversation;
      
      if (existingConversation) {
        console.log('🎯 ChatWidget: Utilisation de la conversation existante:', existingConversation.id);
        conversationToUse = existingConversation;
      } else {
        console.log('🎯 ChatWidget: Création d\'une nouvelle conversation');
        // Créer une nouvelle conversation
        const conversationId = await messageService.createConversation({
          clientName: formData.name,
          clientEmail: formData.email
        });
        console.log('🎯 ChatWidget: Nouvelle conversation créée avec ID:', conversationId);

        // Créer une session avec message de bienvenue
        console.log('🎯 ChatWidget: Envoi du message de bienvenue...');
        await messageService.createSessionWithWelcome(conversationId, formData.name);
        console.log('🎯 ChatWidget: Message de bienvenue envoyé');

        conversationToUse = {
          id: conversationId,
          clientName: formData.name,
          clientEmail: formData.email,
          lastMessage: '',
          lastMessageTime: new Date() as any,
          unreadCount: 0,
          status: 'online',
          createdAt: new Date() as any
        };
      }

      console.log('🎯 ChatWidget: Configuration de la conversation:', conversationToUse.id);
      setConversation(conversationToUse);
      setHasStartedChat(true);
      console.log('🎯 ChatWidget: Chat démarré avec succès');
    } catch (error) {
      console.error('🎯 ChatWidget: Erreur lors du démarrage du chat:', error);
      setLoading(false);
    }
  };

  const handleSendMessage = async (message: string): Promise<void> => {
    if (!conversation) {
      console.error('🎯 ChatWidget: Pas de conversation active pour envoyer le message');
      return;
    }

    try {
      console.log('🎯 ChatWidget: Envoi du message:', message, 'pour conversation:', conversation.id);
      
      await messageService.sendMessage({
        conversationId: conversation.id,
        sender: 'client',
        senderName: conversation.clientName,
        senderEmail: conversation.clientEmail,
        message
      });
      console.log('🎯 ChatWidget: Message envoyé avec succès');
    } catch (error) {
      console.error('🎯 ChatWidget: Erreur lors de l\'envoi du message:', error);
      throw error; // Rethrow pour que ChatMessages puisse gérer l'erreur
    }
  };

  const handleClose = () => {
    console.log('🎯 ChatWidget: Fermeture du chat');
    setIsOpen(false);
    setIsMinimized(false);
    setHasStartedChat(false);
    setConversation(null);
    setMessages([]);
  };

  const handleMinimize = () => {
    console.log('🎯 ChatWidget: Minimisation du chat');
    setIsMinimized(true);
  };

  if (!isOpen) {
    return <ChatWidgetButton onClick={() => {
      console.log('🎯 ChatWidget: Ouverture du chat');
      setIsOpen(true);
    }} />;
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg cursor-pointer"
             onClick={() => {
               console.log('🎯 ChatWidget: Restauration du chat');
               setIsMinimized(false);
             }}>
          Chat NeoRent (minimisé)
        </div>
      </div>
    );
  }

  return (
    <ChatWidgetWindow
      hasStartedChat={hasStartedChat}
      messages={messages}
      onStartChat={handleStartChat}
      onSendMessage={handleSendMessage}
      onClose={handleClose}
      onMinimize={handleMinimize}
      loading={loading}
    />
  );
};
