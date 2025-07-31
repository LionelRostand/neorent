import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  doc,
  updateDoc,
  getDocs
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface SimpleConversation {
  id: string;
  participants: string[];
  participantNames: Record<string, string>;
  lastMessage: string;
  lastMessageTime: any;
  createdAt: any;
}

export interface SimpleMessage {
  id: string;
  conversationId: string;
  senderEmail: string;
  senderName: string;
  content: string;
  timestamp: any;
}

export const simpleChat = {
  // Créer ou récupérer une conversation
  async getOrCreateConversation(userEmail: string, otherUserEmail: string, userName: string, otherUserName: string): Promise<string> {
    try {
      // Chercher une conversation existante
      const conversationsRef = collection(db, 'simple_conversations');
      const q = query(
        conversationsRef,
        where('participants', 'array-contains', userEmail)
      );
      
      const snapshot = await getDocs(q);
      
      // Vérifier si une conversation existe déjà avec l'autre utilisateur
      for (const doc of snapshot.docs) {
        const data = doc.data();
        if (data.participants.includes(otherUserEmail)) {
          console.log('📞 Conversation existante trouvée:', doc.id);
          return doc.id;
        }
      }
      
      // Créer une nouvelle conversation
      console.log('🆕 Création d\'une nouvelle conversation entre', userName, 'et', otherUserName);
      const newConversation = {
        participants: [userEmail, otherUserEmail],
        participantNames: {
          [userEmail]: userName,
          [otherUserEmail]: otherUserName
        },
        lastMessage: '',
        lastMessageTime: serverTimestamp(),
        createdAt: serverTimestamp()
      };
      
      const docRef = await addDoc(conversationsRef, newConversation);
      console.log('✅ Nouvelle conversation créée:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ Erreur lors de la création/récupération de la conversation:', error);
      throw error;
    }
  },

  // Envoyer un message
  async sendMessage(conversationId: string, senderEmail: string, senderName: string, content: string): Promise<void> {
    try {
      // Ajouter le message
      const messagesRef = collection(db, 'simple_messages');
      await addDoc(messagesRef, {
        conversationId,
        senderEmail,
        senderName,
        content,
        timestamp: serverTimestamp()
      });

      // Mettre à jour la conversation
      const conversationRef = doc(db, 'simple_conversations', conversationId);
      await updateDoc(conversationRef, {
        lastMessage: content,
        lastMessageTime: serverTimestamp()
      });

      console.log('✅ Message envoyé avec succès');
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi du message:', error);
      throw error;
    }
  },

  // Écouter les conversations d'un utilisateur
  subscribeToConversations(userEmail: string, callback: (conversations: SimpleConversation[]) => void) {
    console.log('🔍 Écoute des conversations pour:', userEmail);
    
    const conversationsRef = collection(db, 'simple_conversations');
    const q = query(
      conversationsRef,
      where('participants', 'array-contains', userEmail),
      orderBy('lastMessageTime', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const conversations = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SimpleConversation[];

      console.log('📨 Conversations reçues:', conversations.length);
      callback(conversations);
    }, (error) => {
      console.error('❌ Erreur écoute conversations:', error);
      callback([]);
    });
  },

  // Écouter les messages d'une conversation
  subscribeToMessages(conversationId: string, callback: (messages: SimpleMessage[]) => void) {
    console.log('💬 Écoute des messages pour conversation:', conversationId);
    
    const messagesRef = collection(db, 'simple_messages');
    const q = query(
      messagesRef,
      where('conversationId', '==', conversationId),
      orderBy('timestamp', 'asc')
    );

    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SimpleMessage[];

      console.log('💬 Messages reçus:', messages.length);
      callback(messages);
    }, (error) => {
      console.error('❌ Erreur écoute messages:', error);
      callback([]);
    });
  }
};