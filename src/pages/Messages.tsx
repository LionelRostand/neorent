
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

    console.log('📨 Messages page: Initialisation avec colocataires et locataires...');
    console.log('📨 Roommates trouvés:', roommates.length);
    console.log('📨 Tenants trouvés:', tenants.length);
    
    // Créer des conversations potentielles pour tous les utilisateurs actifs
    const potentialConversations: Conversation[] = [];
    
    // Ajouter les colocataires actifs
    roommates.forEach(roommate => {
      if (roommate.status === 'Actif' && roommate.email && roommate.name) {
        // Créer un Timestamp Firebase pour éviter l'erreur .toDate()
        const now = new Date();
        const timestamp = {
          toDate: () => now,
          seconds: Math.floor(now.getTime() / 1000),
          nanoseconds: 0
        };
        
        potentialConversations.push({
          id: `roommate-${roommate.id}`,
          clientName: roommate.name,
          clientEmail: roommate.email,
          lastMessage: '',
          lastMessageTime: timestamp as any,
          unreadCount: 0,
          status: 'offline' as const,
          createdAt: timestamp as any,
        });
      }
    });

    // Ajouter les locataires actifs
    tenants.forEach(tenant => {
      if (tenant.status === 'Actif' && tenant.email && tenant.name) {
        // Créer un Timestamp Firebase pour éviter l'erreur .toDate()
        const now = new Date();
        const timestamp = {
          toDate: () => now,
          seconds: Math.floor(now.getTime() / 1000),
          nanoseconds: 0
        };
        
        potentialConversations.push({
          id: `tenant-${tenant.id}`,
          clientName: tenant.name,
          clientEmail: tenant.email,
          lastMessage: '',
          lastMessageTime: timestamp as any,
          unreadCount: 0,
          status: 'offline' as const,
          createdAt: timestamp as any,
        });
      }
    });

    console.log('📨 Messages page: Conversations potentielles créées:', potentialConversations.length);
    setConversations(potentialConversations);
    setLoading(false);

    // Écouter les vraies conversations Firebase pour mettre à jour les données
    const unsubscribe = messageService.subscribeToConversations((firebaseConversations) => {
      console.log('📨 Messages page: Conversations Firebase reçues:', firebaseConversations.length);
      
      // Fusionner les conversations potentielles avec les vraies conversations Firebase
      const mergedConversations = [...potentialConversations];
      
      firebaseConversations.forEach(firebaseConv => {
        const existingIndex = mergedConversations.findIndex(conv => 
          conv.clientEmail === firebaseConv.clientEmail
        );
        
        if (existingIndex >= 0) {
          // Remplacer la conversation potentielle par la vraie
          mergedConversations[existingIndex] = firebaseConv;
        } else {
          // Ajouter une nouvelle conversation qui n'était pas dans les potentielles
          mergedConversations.push(firebaseConv);
        }
      });
      
      setConversations(mergedConversations);
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
      
      // Vérifier si c'est une conversation potentielle (pas encore créée dans Firebase)
      const isPotentialConversation = selectedConversation.id.startsWith('roommate-') || selectedConversation.id.startsWith('tenant-');
      
      if (isPotentialConversation) {
        console.log('📨 Messages page: Création d\'une nouvelle conversation Firebase pour:', selectedConversation.clientEmail);
        
        // Créer une vraie conversation Firebase
        const realConversationId = await messageService.createConversation({
          clientName: selectedConversation.clientName,
          clientEmail: selectedConversation.clientEmail
        });
        
        console.log('📨 Messages page: Nouvelle conversation créée avec ID:', realConversationId);
        
        // Envoyer le message à la vraie conversation
        await messageService.sendMessage({
          conversationId: realConversationId,
          sender: 'staff',
          senderName: 'Support NeoRent',
          senderEmail: 'support@neorent.fr',
          message
        });
        
        // Mettre à jour la conversation sélectionnée avec le vrai ID
        setSelectedConversation(prev => prev ? {
          ...prev,
          id: realConversationId
        } : null);
        
      } else {
        // Conversation existante, envoyer le message normalement
        await messageService.sendMessage({
          conversationId: selectedConversation.id,
          sender: 'staff',
          senderName: 'Support NeoRent',
          senderEmail: 'support@neorent.fr',
          message
        });
      }
      
      console.log('📨 Messages page: Message envoyé avec succès');
    } catch (error) {
      console.error('📨 Messages page: Error sending message:', error);
    }
  };

  return (
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
  );
};

export default Messages;
