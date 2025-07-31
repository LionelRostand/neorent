import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp,
  doc,
  updateDoc,
  Timestamp,
  getDocs,
  increment
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Conversation } from '@/types/chat';

interface TenantConversation {
  id: string;
  participant1Id: string;
  participant1Name: string;
  participant2Id: string;
  participant2Name: string;
  lastMessage: string;
  lastMessageTime: Timestamp;
  unreadCount: number;
  createdAt: Timestamp;
}

interface TenantMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderType: 'tenant' | 'roommate' | 'owner' | 'admin';
  content: string;
  timestamp: Timestamp;
  read: boolean;
}

export const useTenantChat = (currentUserId: string) => {
  const [conversations, setConversations] = useState<TenantConversation[]>([]);
  const [messages, setMessages] = useState<TenantMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);

  console.log('🗨️ useTenantChat - Hook initialisé avec currentUserId:', currentUserId);

  // Écouter les conversations - système unifié pour tous les utilisateurs
  useEffect(() => {
    if (!currentUserId) return;

    console.log('🗨️ useTenantChat - Écoute unifié des conversations pour userId:', currentUserId);
    
    try {
      // 1. Écouter toutes les conversations tenant_conversations où l'utilisateur participe
      const conversationsRef = collection(db, 'tenant_conversations');
      const conversationsQuery = query(
        conversationsRef,
        where('participants', 'array-contains', currentUserId)
      );

      const unsubscribe1 = onSnapshot(conversationsQuery, (snapshot) => {
        const tenantConversations = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as TenantConversation[];
        
        console.log('🗨️ useTenantChat - Conversations tenant trouvées:', tenantConversations.length);
        
        // 2. Écouter aussi les conversations admin spécifiques à cet utilisateur
        const adminConversationsRef = collection(db, 'conversations');
        const adminQuery = query(
          adminConversationsRef,
          where('clientEmail', '==', currentUserId)
        );
        
        const unsubscribe2 = onSnapshot(adminQuery, (adminSnapshot) => {
          const adminConversations = adminSnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() } as Conversation))
            .map((conv: Conversation) => ({
              // Adapter le format admin vers le format tenant
              id: conv.id,
              participant1Id: 'admin',
              participant1Name: 'Support NeoRent',
              participant2Id: currentUserId,
              participant2Name: conv.clientName || 'Utilisateur',
              lastMessage: conv.lastMessage || '',
              lastMessageTime: conv.lastMessageTime,
              unreadCount: conv.unreadCount || 0,
              createdAt: conv.createdAt
            })) as TenantConversation[];
            
          console.log('🗨️ useTenantChat - Conversations admin trouvées:', adminConversations.length);
          
          // Fusionner et trier toutes les conversations
          const allConversations = [...tenantConversations, ...adminConversations];
          allConversations.sort((a, b) => {
            const timeA = a.lastMessageTime?.toMillis() || 0;
            const timeB = b.lastMessageTime?.toMillis() || 0;
            return timeB - timeA;
          });
          
          console.log('🗨️ useTenantChat - Total conversations:', allConversations.length);
          setConversations(allConversations);
        });
        
        return () => {
          unsubscribe2();
        };
      });

      return () => {
        unsubscribe1();
      };
    } catch (error) {
      console.error('Erreur lors de l\'écoute des conversations:', error);
    }
  }, [currentUserId]);

  // Écouter les messages d'une conversation (tenant + admin)
  const subscribeToMessages = (conversationId: string) => {
    if (!conversationId) return;

    console.log('🗨️ useTenantChat - Souscription aux messages pour conversation:', conversationId);
    setLoadingMessages(true);
    
    // Vérifier si c'est une conversation admin ou tenant
    const isAdminConversation = conversations.find(conv => 
      conv.id === conversationId && conv.participant1Id === 'admin'
    );
    
    if (isAdminConversation) {
      console.log('🗨️ useTenantChat - Écoute des messages admin (rent_messages)');
      // Écouter les messages admin
      const adminMessagesQuery = query(
        collection(db, 'rent_messages'),
        where('conversationId', '==', conversationId),
        orderBy('timestamp', 'asc')
      );

      const unsubscribe = onSnapshot(adminMessagesQuery, (snapshot) => {
        const adminMessages = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            conversationId: data.conversationId,
            senderId: data.sender === 'staff' ? 'admin' : data.senderEmail,
            senderName: data.senderName,
            senderType: data.sender === 'staff' ? 'admin' : 'tenant',
            content: data.message,
            timestamp: data.timestamp,
            read: data.read
          };
        }) as TenantMessage[];
        
        console.log('🗨️ useTenantChat - Messages admin reçus:', adminMessages.length);
        setMessages(adminMessages);
        setLoadingMessages(false);
      });

      return unsubscribe;
    } else {
      console.log('🗨️ useTenantChat - Écoute des messages tenant (tenant_messages)');
      // Écouter les messages tenant normaux
      const messagesQuery = query(
        collection(db, 'tenant_messages'),
        where('conversationId', '==', conversationId),
        orderBy('timestamp', 'asc')
      );

      const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
        const messagesList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as TenantMessage[];
        
        console.log('🗨️ useTenantChat - Messages tenant reçus:', messagesList.length);
        setMessages(messagesList);
        setLoadingMessages(false);
      });

      return unsubscribe;
    }
  };

  // Créer une nouvelle conversation partagée
  const createConversation = async (otherUserId: string, otherUserName: string, otherUserEmail: string) => {
    try {
      setLoading(true);
      
      // Vérifier si la conversation existe déjà
      const existingConversation = conversations.find(conv => 
        (conv.participant1Id === currentUserId && conv.participant2Id === otherUserId) ||
        (conv.participant1Id === otherUserId && conv.participant2Id === currentUserId)
      );

      if (existingConversation) {
        return existingConversation.id;
      }

      // Créer une conversation visible par les deux participants
      const conversationData = {
        participant1Id: currentUserId,
        participant1Name: currentUserId, // Sera mis à jour avec le vrai nom
        participant2Id: otherUserId,
        participant2Name: otherUserName,
        participants: [currentUserId, otherUserId], // Important: tableau pour les requêtes array-contains
        lastMessage: '',
        lastMessageTime: serverTimestamp(),
        unreadCount: 0,
        createdAt: serverTimestamp()
      };

      console.log('🗨️ useTenantChat - Création conversation avec participants:', [currentUserId, otherUserId]);
      const docRef = await addDoc(collection(db, 'tenant_conversations'), conversationData);
      console.log('🗨️ useTenantChat - Conversation créée avec ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Erreur lors de la création de la conversation:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Envoyer un message (tenant ou admin selon le type de conversation)
  const sendMessage = async (otherUserId: string, content: string) => {
    try {
      setLoading(true);
      console.log('🗨️ useTenantChat - Envoi message vers:', otherUserId, 'contenu:', content);

      // Déterminer si c'est une conversation admin
      const isAdminConversation = otherUserId.startsWith('owner_') || otherUserId === 'admin';
      
      if (isAdminConversation) {
        console.log('🗨️ useTenantChat - Envoi vers conversation admin (rent_messages)');
        
        // Trouver ou créer une conversation admin
        let adminConversation = conversations.find(conv => 
          conv.participant1Id === 'admin' && conv.participant2Id === currentUserId
        );

        if (!adminConversation) {
          // Créer une nouvelle conversation admin
          const adminConversationData = {
            clientName: currentUserId, // Utiliser l'ID comme nom temporaire
            clientEmail: currentUserId,
            lastMessage: content,
            lastMessageTime: serverTimestamp(),
            unreadCount: 1,
            status: 'online',
            createdAt: serverTimestamp()
          };

          const docRef = await addDoc(collection(db, 'conversations'), adminConversationData);
          console.log('🗨️ useTenantChat - Nouvelle conversation admin créée:', docRef.id);
        }

        // Recharger les conversations pour obtenir l'ID de la nouvelle conversation
        const conversationsRef = collection(db, 'conversations');
        const adminConversationsQuery = query(
          conversationsRef,
          where('clientEmail', '==', currentUserId)
        );
        
        const adminSnapshot = await getDocs(adminConversationsQuery);
        const adminConvData = adminSnapshot.docs[0];
        
        if (adminConvData) {
          // Envoyer le message via rent_messages
          const messageData = {
            conversationId: adminConvData.id,
            sender: 'client',
            senderName: currentUserId,
            senderEmail: currentUserId,
            message: content,
            timestamp: serverTimestamp(),
            read: false
          };

          await addDoc(collection(db, 'rent_messages'), messageData);
          
          // Mettre à jour la conversation admin
          await updateDoc(doc(db, 'conversations', adminConvData.id), {
            lastMessage: content,
            lastMessageTime: serverTimestamp(),
            unreadCount: increment(1)
          });
        }
        
      } else {
        console.log('🗨️ useTenantChat - Envoi vers conversation tenant (tenant_messages)');
        
        // Conversation tenant normale - s'assurer que les deux participants peuvent voir la conversation
        let conversation = conversations.find(conv => 
          (conv.participant1Id === currentUserId && conv.participant2Id === otherUserId) ||
          (conv.participant1Id === otherUserId && conv.participant2Id === currentUserId)
        );

        let conversationId = conversation?.id;
        if (!conversationId) {
          conversationId = await createConversation(otherUserId, 'Contact', '');
          if (!conversationId) throw new Error('Impossible de créer la conversation');
        }

        // Ajouter le message tenant
        const messageData = {
          conversationId,
          senderId: currentUserId,
          senderName: currentUserId, // Utiliser l'ID temporairement
          senderType: 'tenant' as const,
          content,
          timestamp: serverTimestamp(),
          read: false
        };

        await addDoc(collection(db, 'tenant_messages'), messageData);
        
        // Mettre à jour la conversation tenant
        if (conversationId) {
          await updateDoc(doc(db, 'tenant_conversations', conversationId), {
            lastMessage: content,
            lastMessageTime: serverTimestamp(),
            unreadCount: increment(1)
          });
        }
      }

      console.log('🗨️ useTenantChat - Message envoyé avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    conversations,
    messages,
    loading,
    loadingMessages,
    createConversation,
    sendMessage,
    subscribeToMessages
  };
};