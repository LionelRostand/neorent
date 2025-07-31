
import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AdminLayout } from '@/components/Layout/AdminLayout';
import { MessageStats } from '@/components/Messages/MessageStats';
import { ContactList } from '@/components/Messages/ContactList';
import { ChatWindow } from '@/components/Messages/ChatWindow';
import { useUnifiedChat } from '@/hooks/useUnifiedChat';
import { useFirebaseRoommates } from '@/hooks/useFirebaseRoommates';
import { useFirebaseTenants } from '@/hooks/useFirebaseTenants';
import { useFirebaseOwners } from '@/hooks/useFirebaseOwners';
import { AuthContext } from '@/contexts/AuthContext';
import type { UnifiedConversation, UnifiedMessage } from '@/types/unifiedChat';
import type { Conversation, ChatMessage } from '@/types/chat';

const Messages = () => {
  const { t } = useTranslation();
  const { userProfile } = useContext(AuthContext);
  const [selectedConversation, setSelectedConversation] = useState<UnifiedConversation | null>(null);

  // Utiliser le système de chat unifié
  const {
    conversations,
    messages,
    sendMessage,
    subscribeToMessages,
    markAsRead,
    loading,
    loadingMessages
  } = useUnifiedChat(userProfile?.email || '');

  // Récupérer les données des utilisateurs réels
  const { roommates, loading: roommatesLoading } = useFirebaseRoommates();
  const { tenants, loading: tenantsLoading } = useFirebaseTenants();
  const { owners, loading: ownersLoading } = useFirebaseOwners();

  console.log('📨 Messages page UNIFIED: Rendu avec', conversations.length, 'conversations et', messages.length, 'messages');
  console.log('📨 Messages page UNIFIED: Conversation sélectionnée:', selectedConversation?.id);
  console.log('📨 Messages page UNIFIED: Profil utilisateur:', userProfile);

  // Convertir les conversations unifiées vers l'ancien format pour la compatibilité
  const adaptedConversations: Conversation[] = conversations.map(conv => {
    const participants = conv.participants;
    const otherParticipant = participants.find(p => p !== userProfile?.email) || participants[0];
    const participantName = conv.participantNames[otherParticipant] || otherParticipant;
    
    return {
      id: conv.id,
      clientName: participantName,
      clientEmail: otherParticipant,
      lastMessage: conv.lastMessage,
      lastMessageTime: conv.lastMessageTime,
      unreadCount: conv.unreadCount[userProfile?.email || ''] || 0,
      status: 'online' as const,
      createdAt: conv.createdAt
    };
  });

  // Convertir les messages unifiés vers l'ancien format
  const adaptedMessages: ChatMessage[] = messages.map(msg => ({
    id: msg.id,
    conversationId: msg.conversationId,
    sender: msg.senderEmail === userProfile?.email ? 'staff' : 'client',
    senderName: msg.senderName,
    senderEmail: msg.senderEmail,
    message: msg.content,
    timestamp: msg.timestamp,
    read: msg.readBy.includes(userProfile?.email || '')
  }));

  // Créer une conversation de test si aucune n'existe
  useEffect(() => {
    const createTestConversation = async () => {
      if (conversations.length === 0 && userProfile?.email === 'admin@neotech-consulting.com') {
        console.log('🧪 Création d\'une conversation de test avec Ruth...');
        try {
          await sendMessage(
            'ruthmegha35@gmail.com',
            'Bonjour Ruth! Comment allez-vous? Ceci est un message de test.',
            'Lionel DJOSSA',
            'Ruth MEGHA'
          );
        } catch (error) {
          console.error('❌ Erreur création conversation test:', error);
        }
      }
    };

    // Délai pour laisser le temps aux conversations de se charger
    const timer = setTimeout(createTestConversation, 2000);
    return () => clearTimeout(timer);
  }, [conversations.length, userProfile?.email, sendMessage]);

  // Auto-sélection de la première conversation
  useEffect(() => {
    if (!selectedConversation && conversations.length > 0) {
      console.log('📨 Messages page UNIFIED: Auto-sélection de la première conversation:', conversations[0].id);
      setSelectedConversation(conversations[0]);
    }
  }, [conversations, selectedConversation]);

  // Abonnement aux messages de la conversation sélectionnée
  useEffect(() => {
    if (!selectedConversation) {
      console.log('📨 Messages page UNIFIED: Pas de conversation sélectionnée');
      return;
    }

    console.log('📨 Messages page UNIFIED: Souscription aux messages pour conversation:', selectedConversation.id);
    const unsubscribe = subscribeToMessages(selectedConversation.id);
    
    // Marquer comme lu
    markAsRead(selectedConversation.id);

    return unsubscribe;
  }, [selectedConversation, subscribeToMessages, markAsRead]);

  const handleConversationSelect = (conversation: Conversation) => {
    console.log('📨 Messages page UNIFIED: Sélection de la conversation:', conversation.id);
    // Trouver la conversation unifiée correspondante
    const unifiedConv = conversations.find(c => c.id === conversation.id);
    if (unifiedConv) {
      setSelectedConversation(unifiedConv);
    }
  };

  const handleConversationDelete = async (conversationId: string) => {
    // Pour l'instant, on ne supporte pas la suppression dans le système unifié
    console.log('📨 Messages page UNIFIED: Suppression non supportée pour:', conversationId);
  };

  const handleSendMessage = async (message: string) => {
    if (!selectedConversation || !userProfile) return;

    try {
      console.log('📨 Messages page UNIFIED: Envoi du message:', message, 'pour conversation:', selectedConversation.id);
      
      // Trouver l'autre participant (pas l'admin)
      const otherParticipant = selectedConversation.participants.find(p => p !== userProfile.email);
      
      if (!otherParticipant) {
        console.error('📨 Messages page UNIFIED: Aucun autre participant trouvé');
        return;
      }

      // Utiliser le système unifié pour envoyer le message
      await sendMessage(
        otherParticipant,
        message,
        userProfile.name || 'Admin',
        selectedConversation.participantNames[otherParticipant] || 'Utilisateur'
      );
      
      console.log('📨 Messages page UNIFIED: Message envoyé avec succès');
    } catch (error) {
      console.error('📨 Messages page UNIFIED: Error sending message:', error);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    // Pour l'instant, on ne supporte pas la suppression dans le système unifié
    console.log('📨 Messages page UNIFIED: Suppression de message non supportée pour:', messageId);
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
              selectedConversation={adaptedConversations.find(c => c.id === selectedConversation?.id) || null}
              onConversationSelect={handleConversationSelect}
              onConversationDelete={handleConversationDelete}
              loading={loading}
            />
          </div>
          
          <div className="lg:col-span-2 h-full">
            {selectedConversation ? (
              <ChatWindow
                conversation={adaptedConversations.find(c => c.id === selectedConversation?.id) || adaptedConversations[0]}
                messages={adaptedMessages}
                onSendMessage={handleSendMessage}
                onDeleteMessage={handleDeleteMessage}
              />
            ) : (
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
