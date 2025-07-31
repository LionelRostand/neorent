
import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AdminLayout } from '@/components/Layout/AdminLayout';
import { MessageStats } from '@/components/Messages/MessageStats';
import { ContactList } from '@/components/Messages/ContactList';
import { ChatWindow } from '@/components/Messages/ChatWindow';
import { useSimpleChat } from '@/hooks/useSimpleChat';
import { AuthContext } from '@/contexts/AuthContext';
import type { Conversation, ChatMessage } from '@/types/chat';

const Messages = () => {
  const { t } = useTranslation();
  const { userProfile } = useContext(AuthContext);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  // Utiliser le système de chat simple
  const {
    conversations,
    messages,
    sendMessage,
    subscribeToMessages,
    loading
  } = useSimpleChat(userProfile?.email || '', userProfile?.name || '');

  console.log('📨 Messages page SIMPLE: Rendu avec', conversations.length, 'conversations et', messages.length, 'messages');
  console.log('📨 Messages page SIMPLE: Conversation sélectionnée:', selectedConversationId);
  console.log('📨 Messages page SIMPLE: Profil utilisateur:', userProfile);

  // Convertir les conversations simples vers l'ancien format pour la compatibilité
  const adaptedConversations: Conversation[] = conversations.map(conv => {
    const otherParticipant = conv.participants.find(p => p !== userProfile?.email) || conv.participants[0];
    const participantName = conv.participantNames[otherParticipant] || otherParticipant;
    
    return {
      id: conv.id,
      clientName: participantName,
      clientEmail: otherParticipant,
      lastMessage: conv.lastMessage,
      lastMessageTime: conv.lastMessageTime,
      unreadCount: 0, // Simplifié pour l'instant
      status: 'online' as const,
      createdAt: conv.createdAt
    };
  });

  // Convertir les messages simples vers l'ancien format
  const adaptedMessages: ChatMessage[] = messages.map(msg => ({
    id: msg.id,
    conversationId: msg.conversationId,
    sender: msg.senderEmail === userProfile?.email ? 'staff' : 'client',
    senderName: msg.senderName,
    senderEmail: msg.senderEmail,
    message: msg.content,
    timestamp: msg.timestamp,
    read: true // Simplifié pour l'instant
  }));

  // Créer des conversations de test avec les utilisateurs existants
  useEffect(() => {
    const createTestConversations = async () => {
      if (conversations.length === 0 && userProfile?.email === 'admin@neotech-consulting.com') {
        console.log('🧪 Création de conversations de test...');
        
        const testUsers = [
          { email: 'ruthmegha35@gmail.com', name: 'Ruth MEGHA' },
          { email: 'entrepreneurpro19@gmail.com', name: 'Emad Adam' },
          { email: 'rostandlionel@yahoo.fr', name: 'ROSTAND' }
        ];

        for (const user of testUsers) {
          try {
            await sendMessage(
              user.email,
              user.name,
              `Bonjour ${user.name}! Bienvenue dans le système de messagerie.`
            );
            console.log(`✅ Conversation créée avec ${user.name}`);
          } catch (error) {
            console.error(`❌ Erreur création conversation avec ${user.name}:`, error);
          }
        }
      }
    };

    const timer = setTimeout(createTestConversations, 1000);
    return () => clearTimeout(timer);
  }, [conversations.length, userProfile?.email, sendMessage]);

  // Auto-sélection de la première conversation
  useEffect(() => {
    if (!selectedConversationId && conversations.length > 0) {
      console.log('📨 Auto-sélection de la première conversation:', conversations[0].id);
      setSelectedConversationId(conversations[0].id);
    }
  }, [conversations, selectedConversationId]);

  // Abonnement aux messages de la conversation sélectionnée
  useEffect(() => {
    if (!selectedConversationId) return;

    console.log('📨 Souscription aux messages pour conversation:', selectedConversationId);
    const unsubscribe = subscribeToMessages(selectedConversationId);
    return unsubscribe;
  }, [selectedConversationId, subscribeToMessages]);

  const handleConversationSelect = (conversation: Conversation) => {
    console.log('📨 Sélection de la conversation:', conversation.id);
    setSelectedConversationId(conversation.id);
  };

  const handleConversationDelete = async (conversationId: string) => {
    console.log('📨 Suppression non supportée pour:', conversationId);
  };

  const handleSendMessage = async (message: string) => {
    const selectedConversation = conversations.find(c => c.id === selectedConversationId);
    if (!selectedConversation || !userProfile) return;

    try {
      console.log('📨 Envoi du message:', message);
      
      const otherParticipant = selectedConversation.participants.find(p => p !== userProfile.email);
      if (!otherParticipant) {
        console.error('📨 Aucun autre participant trouvé');
        return;
      }

      const otherParticipantName = selectedConversation.participantNames[otherParticipant] || 'Utilisateur';
      
      await sendMessage(otherParticipant, otherParticipantName, message);
      console.log('📨 Message envoyé avec succès');
    } catch (error) {
      console.error('📨 Erreur envoi message:', error);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    console.log('📨 Suppression de message non supportée pour:', messageId);
  };

  return (
    <AdminLayout>
      <div className="h-full flex flex-col">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{t('messages.title')}</h1>
          <p className="text-gray-600">{t('messages.subtitle')}</p>
        </div>

         <MessageStats conversations={adaptedConversations} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 mt-6">
          <div className="lg:col-span-1">
            <ContactList
              conversations={adaptedConversations}
              selectedConversation={adaptedConversations.find(c => c.id === selectedConversationId) || null}
              onConversationSelect={handleConversationSelect}
              onConversationDelete={handleConversationDelete}
              loading={loading}
            />
          </div>
          
          <div className="lg:col-span-2 h-full">
            {selectedConversationId && adaptedConversations.length > 0 ? (() => {
              const currentConversation = adaptedConversations.find(c => c.id === selectedConversationId);
              return currentConversation ? (
                <ChatWindow
                  conversation={currentConversation}
                  messages={adaptedMessages}
                  onSendMessage={handleSendMessage}
                  onDeleteMessage={handleDeleteMessage}
                />
              ) : (
                <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <p className="text-gray-500">Chargement de la conversation...</p>
                  </div>
                </div>
              );
            })() : (
              <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <p className="text-gray-500">{t('messages.selectContact')}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Messages;
