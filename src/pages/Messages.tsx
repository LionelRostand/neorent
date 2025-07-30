
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AdminLayout } from '@/components/Layout/AdminLayout';
import { MessageStats } from '@/components/Messages/MessageStats';
import { ContactList } from '@/components/Messages/ContactList';
import { ChatWindow } from '@/components/Messages/ChatWindow';
import { messageService } from '@/services/messageService';
import { useFirebaseRoommates } from '@/hooks/useFirebaseRoommates';
import { useFirebaseTenants } from '@/hooks/useFirebaseTenants';
import { useFirebaseOwners } from '@/hooks/useFirebaseOwners';
import type { Conversation, ChatMessage } from '@/types/chat';

const Messages = () => {
  const { t } = useTranslation();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  // Récupérer les données des utilisateurs réels
  const { roommates, loading: roommatesLoading } = useFirebaseRoommates();
  const { tenants, loading: tenantsLoading } = useFirebaseTenants();
  const { owners, loading: ownersLoading } = useFirebaseOwners();

  console.log('📨 Messages page: Rendu avec', conversations.length, 'conversations et', messages.length, 'messages');
  console.log('📨 Messages page: Conversation sélectionnée:', selectedConversation?.id);
  console.log('📨 Users data:', { roommates: roommates.length, tenants: tenants.length, owners: owners.length });

  // Créer des conversations basées sur les vrais utilisateurs
  useEffect(() => {
    // Attendre que toutes les données soient chargées
    if (roommatesLoading || tenantsLoading || ownersLoading) {
      return;
    }

    console.log('📨 Messages page: Création des conversations à partir des utilisateurs réels...');
    
    const realConversations: Conversation[] = [];

    // Ajouter les colocataires
    roommates.forEach((roommate, index) => {
      if (roommate.email && roommate.name) {
        realConversations.push({
          id: `roommate-${roommate.id}`,
          clientName: roommate.name,
          clientEmail: roommate.email,
          lastMessage: `Colocataire de ${roommate.property || 'N/A'} - ${roommate.roomNumber || 'Chambre'}`,
          lastMessageTime: { toDate: () => new Date(Date.now() - index * 3600000), toMillis: () => Date.now() - index * 3600000 } as any,
          unreadCount: Math.floor(Math.random() * 3),
          status: Math.random() > 0.5 ? 'online' as const : 'offline' as const,
          createdAt: { toDate: () => new Date(), toMillis: () => Date.now() } as any
        });
      }
    });

    // Ajouter les locataires
    tenants.forEach((tenant, index) => {
      if (tenant.email && tenant.name) {
        realConversations.push({
          id: `tenant-${tenant.id}`,
          clientName: tenant.name,
          clientEmail: tenant.email,
          lastMessage: `Locataire de ${tenant.property || 'N/A'}`,
          lastMessageTime: { toDate: () => new Date(Date.now() - (roommates.length + index) * 3600000), toMillis: () => Date.now() - (roommates.length + index) * 3600000 } as any,
          unreadCount: Math.floor(Math.random() * 3),
          status: Math.random() > 0.5 ? 'online' as const : 'offline' as const,
          createdAt: { toDate: () => new Date(), toMillis: () => Date.now() } as any
        });
      }
    });

    // Ajouter les propriétaires (s'ils ne sont pas admin)
    owners.forEach((owner, index) => {
      if (owner.email && owner.name && owner.role !== 'admin') {
        realConversations.push({
          id: `owner-${owner.id}`,
          clientName: owner.name,
          clientEmail: owner.email,
          lastMessage: `Propriétaire`,
          lastMessageTime: { toDate: () => new Date(Date.now() - (roommates.length + tenants.length + index) * 3600000), toMillis: () => Date.now() - (roommates.length + tenants.length + index) * 3600000 } as any,
          unreadCount: Math.floor(Math.random() * 2),
          status: Math.random() > 0.5 ? 'online' as const : 'offline' as const,
          createdAt: { toDate: () => new Date(), toMillis: () => Date.now() } as any
        });
      }
    });

    console.log('📨 Messages page: Conversations créées:', realConversations.length);
    console.log('📨 Details:', realConversations.map(c => ({ name: c.clientName, email: c.clientEmail, type: c.id.split('-')[0] })));
    
    setConversations(realConversations);
    setLoading(false);

    // Également écouter les vraies conversations Firebase s'il y en a
    const unsubscribe = messageService.subscribeToConversations((firebaseConversations) => {
      console.log('📨 Messages page: Conversations Firebase reçues:', firebaseConversations.length);
      if (firebaseConversations.length > 0) {
        // Fusionner avec les conversations réelles ou les remplacer
        setConversations(prev => [...firebaseConversations, ...prev]);
      }
    });

    return unsubscribe;
  }, [roommates, tenants, owners, roommatesLoading, tenantsLoading, ownersLoading]);

  // Auto-sélection de la première conversation
  useEffect(() => {
    if (!selectedConversation && conversations.length > 0) {
      console.log('📨 Messages page: Auto-sélection de la première conversation:', conversations[0].id);
      setSelectedConversation(conversations[0]);
    }
  }, [conversations, selectedConversation]);

  // Abonnement aux messages de la conversation sélectionnée
  useEffect(() => {
    if (!selectedConversation) {
      console.log('📨 Messages page: Pas de conversation sélectionnée, reset des messages');
      setMessages([]);
      return;
    }

    console.log('📨 Messages page: Souscription aux messages pour conversation:', selectedConversation.id);
    const unsubscribe = messageService.subscribeToMessages(
      selectedConversation.id,
      (newMessages) => {
        console.log('📨 Messages page: Callback messages reçu pour conversation', selectedConversation.id);
        console.log('📨 Messages page: Nombre de messages reçus:', newMessages.length);
        newMessages.forEach((msg, index) => {
          console.log(`📨 Message ${index}:`, {
            id: msg.id,
            sender: msg.sender,
            senderName: msg.senderName,
            message: msg.message.substring(0, 50) + '...',
            timestamp: msg.timestamp
          });
        });
        setMessages(newMessages);
      }
    );

    return unsubscribe;
  }, [selectedConversation]);

  // Marquer les messages comme lus quand on sélectionne une conversation
  useEffect(() => {
    if (selectedConversation && selectedConversation.unreadCount > 0) {
      console.log('📨 Messages page: Marquage des messages comme lus pour conversation:', selectedConversation.id);
      messageService.markMessagesAsRead(selectedConversation.id);
    }
  }, [selectedConversation]);

  const handleConversationSelect = (conversation: Conversation) => {
    console.log('📨 Messages page: Sélection de la conversation:', conversation.id);
    setSelectedConversation(conversation);
  };

  const handleConversationDelete = async (conversationId: string) => {
    try {
      console.log('📨 Messages page: Suppression de la conversation:', conversationId);
      await messageService.deleteConversation(conversationId);
      if (selectedConversation?.id === conversationId) {
        setSelectedConversation(null);
      }
    } catch (error) {
      console.error('📨 Messages page: Error deleting conversation:', error);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!selectedConversation) return;

    try {
      console.log('📨 Messages page: Envoi du message:', message, 'pour conversation:', selectedConversation.id);
      
      await messageService.sendMessage({
        conversationId: selectedConversation.id,
        sender: 'staff',
        senderName: 'Support NeoRent',
        senderEmail: 'support@neorent.fr',
        message
      });
      console.log('📨 Messages page: Message envoyé avec succès');
    } catch (error) {
      console.error('📨 Messages page: Error sending message:', error);
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-4 md:p-6 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('messages.title')}</h1>
            <p className="text-gray-600">{t('messages.subtitle')}</p>
          </div>

          <MessageStats conversations={conversations} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-300px)]">
            <div className="lg:col-span-1">
              <ContactList
                conversations={conversations}
                selectedConversation={selectedConversation}
                onConversationSelect={handleConversationSelect}
                onConversationDelete={handleConversationDelete}
                loading={loading}
              />
            </div>
            
            <div className="lg:col-span-2">
              {selectedConversation ? (
                <ChatWindow
                  conversation={selectedConversation}
                  messages={messages}
                  onSendMessage={handleSendMessage}
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
      </div>
    </AdminLayout>
  );
};

export default Messages;
