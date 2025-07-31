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
      console.log('📤 DEBUT sendMessage');
      console.log('📤 conversationId:', conversationId);
      console.log('📤 senderEmail:', senderEmail);
      console.log('📤 senderName:', senderName);
      console.log('📤 content:', content);
      
      // Ajouter le message
      const messagesRef = collection(db, 'simple_messages');
      console.log('📤 Collection messages ref créée');
      
      const messageData = {
        conversationId,
        senderEmail,
        senderName,
        content,
        timestamp: serverTimestamp()
      };
      console.log('📤 Message data:', messageData);
      
      const messageDoc = await addDoc(messagesRef, messageData);
      console.log('✅ Message ajouté avec ID:', messageDoc.id);

      // Mettre à jour la conversation
      const conversationRef = doc(db, 'simple_conversations', conversationId);
      await updateDoc(conversationRef, {
        lastMessage: content,
        lastMessageTime: serverTimestamp()
      });
      console.log('✅ Conversation mise à jour');

      console.log('✅ Message envoyé avec succès !');
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi du message:', error);
      console.error('❌ Error details:', error.message);
      throw error;
    }
  },

  // Écouter les conversations d'un utilisateur
  subscribeToConversations(userEmail: string, callback: (conversations: SimpleConversation[]) => void) {
    console.log('🔍 DEBUT écoute conversations pour:', userEmail);
    
    try {
      const conversationsRef = collection(db, 'simple_conversations');
      console.log('🔍 Collection ref créée');
      
      // Query simple sans orderBy pour éviter les problèmes d'index
      const q = query(
        conversationsRef,
        where('participants', 'array-contains', userEmail)
      );
      console.log('🔍 Query créée');

      return onSnapshot(q, 
        (snapshot) => {
          console.log('📊 ✅ SNAPSHOT RECU - Documents:', snapshot.docs.length);
          
          if (snapshot.docs.length > 0) {
            snapshot.docs.forEach((doc, index) => {
              console.log(`📄 Doc ${index}:`, doc.id, doc.data());
            });
          }
          
          const conversations = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              participants: data.participants || [],
              participantNames: data.participantNames || {},
              lastMessage: data.lastMessage || '',
              lastMessageTime: data.lastMessageTime,
              createdAt: data.createdAt
            };
          }) as SimpleConversation[];

          console.log('📨 ✅ RETOUR:', conversations.length, 'conversations');
          callback(conversations);
        }, 
        (error) => {
          console.error('❌ ERREUR Firebase listener:', error);
          callback([]);
        }
      );
    } catch (error) {
      console.error('❌ ERREUR lors création listener:', error);
      callback([]);
      return () => {};
    }
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