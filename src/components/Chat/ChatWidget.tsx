
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

  // Vérifier s'il y a une conversation existante dans le localStorage
  useEffect(() => {
    console.log('ChatWidget: Vérification du localStorage...');
    const savedConversationId = localStorage.getItem('chatConversationId');
    const savedFormData = localStorage.getItem('chatFormData');
    
    console.log('ChatWidget: savedConversationId:', savedConversationId);
    console.log('ChatWidget: savedFormData:', savedFormData);
    
    if (savedConversationId && savedFormData) {
      console.log('ChatWidget: Conversation existante trouvée, restauration...');
      setHasStartedChat(true);
      // Charger la conversation existante
      const formData = JSON.parse(savedFormData);
      setConversation({
        id: savedConversationId,
        clientName: formData.name,
        clientEmail: formData.email,
        lastMessage: '',
        lastMessageTime: new Date() as any,
        unreadCount: 0,
        status: 'online',
        createdAt: new Date() as any
      });
    } else {
      console.log('ChatWidget: Aucune conversation existante trouvée');
    }
  }, []);

  // Abonnement aux messages quand une conversation est active
  useEffect(() => {
    if (!conversation) {
      console.log('ChatWidget: Pas de conversation active');
      return;
    }

    console.log('ChatWidget: Abonnement aux messages pour la conversation:', conversation.id);
    const unsubscribe = messageService.subscribeToMessages(
      conversation.id,
      (newMessages) => {
        console.log('ChatWidget: Messages reçus:', newMessages);
        setMessages(newMessages);
      }
    );

    return unsubscribe;
  }, [conversation]);

  const handleStartChat = async (formData: ChatFormData) => {
    try {
      console.log('ChatWidget: Démarrage du chat avec:', formData);
      
      // Vérifier s'il y a déjà une conversation pour cet email
      const existingConversation = await messageService.findConversationByEmail(formData.email);
      console.log('ChatWidget: Conversation existante trouvée:', existingConversation);
      
      let conversationId: string;
      
      if (existingConversation) {
        console.log('ChatWidget: Utilisation de la conversation existante');
        conversationId = existingConversation.id;
        setConversation(existingConversation);
      } else {
        console.log('ChatWidget: Création d\'une nouvelle conversation');
        // Créer une nouvelle conversation
        conversationId = await messageService.createConversation({
          clientName: formData.name,
          clientEmail: formData.email
        });
        console.log('ChatWidget: Nouvelle conversation créée avec ID:', conversationId);

        // Créer une session avec message de bienvenue
        await messageService.createSessionWithWelcome(conversationId, formData.name);
        console.log('ChatWidget: Message de bienvenue envoyé');

        setConversation({
          id: conversationId,
          clientName: formData.name,
          clientEmail: formData.email,
          lastMessage: '',
          lastMessageTime: new Date() as any,
          unreadCount: 0,
          status: 'online',
          createdAt: new Date() as any
        });
      }

      // Sauvegarder dans le localStorage
      localStorage.setItem('chatConversationId', conversationId);
      localStorage.setItem('chatFormData', JSON.stringify(formData));
      console.log('ChatWidget: Données sauvegardées dans localStorage');
      
      setHasStartedChat(true);
      console.log('ChatWidget: Chat démarré avec succès');
    } catch (error) {
      console.error('ChatWidget: Erreur lors du démarrage du chat:', error);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!conversation) {
      console.error('ChatWidget: Pas de conversation active pour envoyer le message');
      return;
    }

    try {
      console.log('ChatWidget: Envoi du message:', message);
      const formData = JSON.parse(localStorage.getItem('chatFormData') || '{}');
      
      await messageService.sendMessage({
        conversationId: conversation.id,
        sender: 'client',
        senderName: formData.name || 'Client',
        senderEmail: formData.email || '',
        message
      });
      console.log('ChatWidget: Message envoyé avec succès');
    } catch (error) {
      console.error('ChatWidget: Erreur lors de l\'envoi du message:', error);
    }
  };

  const handleClose = () => {
    console.log('ChatWidget: Fermeture du chat');
    setIsOpen(false);
    setIsMinimized(false);
  };

  const handleMinimize = () => {
    console.log('ChatWidget: Minimisation du chat');
    setIsMinimized(true);
  };

  console.log('ChatWidget: Rendu - isOpen:', isOpen, 'isMinimized:', isMinimized, 'hasStartedChat:', hasStartedChat);

  if (!isOpen) {
    return <ChatWidgetButton onClick={() => {
      console.log('ChatWidget: Ouverture du chat');
      setIsOpen(true);
    }} />;
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg cursor-pointer"
             onClick={() => {
               console.log('ChatWidget: Restauration du chat');
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
    />
  );
};
