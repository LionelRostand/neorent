
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
    const savedConversationId = localStorage.getItem('chatConversationId');
    const savedFormData = localStorage.getItem('chatFormData');
    
    if (savedConversationId && savedFormData) {
      setHasStartedChat(true);
      // Ici on pourrait recharger la conversation existante
    }
  }, []);

  // Abonnement aux messages quand une conversation est active
  useEffect(() => {
    if (!conversation) return;

    const unsubscribe = messageService.subscribeToMessages(
      conversation.id,
      setMessages
    );

    return unsubscribe;
  }, [conversation]);

  const handleStartChat = async (formData: ChatFormData) => {
    try {
      // Vérifier s'il y a déjà une conversation pour cet email
      const existingConversation = await messageService.findConversationByEmail(formData.email);
      
      let conversationId: string;
      
      if (existingConversation) {
        conversationId = existingConversation.id;
        setConversation(existingConversation);
      } else {
        // Créer une nouvelle conversation
        conversationId = await messageService.createConversation({
          clientName: formData.name,
          clientEmail: formData.email
        });

        // Envoyer un message de bienvenue automatique
        await messageService.sendMessage({
          conversationId,
          sender: 'staff',
          senderName: 'Support NeoRent',
          senderEmail: 'support@neorent.fr',
          message: `Bonjour ${formData.name} ! Bienvenue sur NeoRent. Comment pouvons-nous vous aider aujourd'hui ?`
        });

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
      
      setHasStartedChat(true);
    } catch (error) {
      console.error('Error starting chat:', error);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!conversation) return;

    try {
      const formData = JSON.parse(localStorage.getItem('chatFormData') || '{}');
      
      await messageService.sendMessage({
        conversationId: conversation.id,
        sender: 'client',
        senderName: formData.name || 'Client',
        senderEmail: formData.email || '',
        message
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  if (!isOpen) {
    return <ChatWidgetButton onClick={() => setIsOpen(true)} />;
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg cursor-pointer"
             onClick={() => setIsMinimized(false)}>
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
