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
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

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
  content: string;
  timestamp: Timestamp;
  read: boolean;
}

export const useTenantChat = (currentUserId: string) => {
  const [conversations, setConversations] = useState<TenantConversation[]>([]);
  const [messages, setMessages] = useState<TenantMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Écouter les conversations
  useEffect(() => {
    if (!currentUserId) return;

    try {
      const conversationsRef = collection(db, 'tenant_conversations');
      const conversationsQuery = query(
        conversationsRef,
        where('participants', 'array-contains', currentUserId)
      );

      const unsubscribe = onSnapshot(conversationsQuery, (snapshot) => {
        const conversationsList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as TenantConversation[];
        
        // Trier par date de dernier message
        conversationsList.sort((a, b) => {
          const timeA = a.lastMessageTime?.toMillis() || 0;
          const timeB = b.lastMessageTime?.toMillis() || 0;
          return timeB - timeA;
        });
        
        setConversations(conversationsList);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Erreur lors de l\'écoute des conversations:', error);
    }
  }, [currentUserId]);

  // Écouter les messages d'une conversation
  const subscribeToMessages = (conversationId: string) => {
    if (!conversationId) return;

    setLoadingMessages(true);
    
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
      
      setMessages(messagesList);
      setLoadingMessages(false);
    });

    return unsubscribe;
  };

  // Créer une nouvelle conversation
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

      const conversationData = {
        participant1Id: currentUserId,
        participant1Name: 'Moi', // Sera mis à jour avec le vrai nom
        participant2Id: otherUserId,
        participant2Name: otherUserName,
        participants: [currentUserId, otherUserId],
        lastMessage: '',
        lastMessageTime: serverTimestamp(),
        unreadCount: 0,
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'tenant_conversations'), conversationData);
      return docRef.id;
    } catch (error) {
      console.error('Erreur lors de la création de la conversation:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Envoyer un message
  const sendMessage = async (otherUserId: string, content: string) => {
    try {
      setLoading(true);

      // Trouver ou créer la conversation
      let conversation = conversations.find(conv => 
        (conv.participant1Id === currentUserId && conv.participant2Id === otherUserId) ||
        (conv.participant1Id === otherUserId && conv.participant2Id === currentUserId)
      );

      let conversationId = conversation?.id;
      if (!conversationId) {
        conversationId = await createConversation(otherUserId, 'Contact', '');
        if (!conversationId) throw new Error('Impossible de créer la conversation');
      }

      // Ajouter le message
      const messageData = {
        conversationId,
        senderId: currentUserId,
        senderName: 'Moi', // Sera mis à jour avec le vrai nom
        content,
        timestamp: serverTimestamp(),
        read: false
      };

      await addDoc(collection(db, 'tenant_messages'), messageData);

      // Mettre à jour la conversation
      if (conversationId) {
        await updateDoc(doc(db, 'tenant_conversations', conversationId), {
          lastMessage: content,
          lastMessageTime: serverTimestamp(),
          unreadCount: conversation ? conversation.unreadCount + 1 : 1
        });
      }

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