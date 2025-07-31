import { unifiedChatService } from '@/services/unifiedChatService';

export const createInitialConversations = async () => {
  console.log('🔄 Création des conversations initiales...');
  
  const adminEmail = 'admin@neotech-consulting.com';
  const adminName = 'Lionel DJOSSA';
  
  // Utilisateurs existants
  const users = [
    {
      email: 'ruthmegha35@gmail.com',
      name: 'Ruth MEGHA'
    },
    {
      email: 'entrepreneurpro19@gmail.com',
      name: 'Emad Adam'
    },
    {
      email: 'rostandlionel@yahoo.fr',
      name: 'ROSTAND'
    }
  ];

  try {
    for (const user of users) {
      console.log(`🔄 Création conversation avec ${user.name}...`);
      
      // Vérifier si la conversation existe déjà
      const participants = [adminEmail, user.email].sort();
      const existingConversationId = await unifiedChatService.findConversation(participants);
      
      if (!existingConversationId) {
        // Créer une nouvelle conversation
        const conversationId = await unifiedChatService.createConversation({
          participants,
          participantNames: {
            [adminEmail]: adminName,
            [user.email]: user.name
          },
          type: 'admin_to_tenant'
        });

        console.log(`✅ Conversation créée avec ${user.name}: ${conversationId}`);

        // Envoyer un message de bienvenue
        await unifiedChatService.sendMessage({
          conversationId,
          senderEmail: adminEmail,
          senderName: adminName,
          content: `Bonjour ${user.name}! Bienvenue dans le nouveau système de messagerie. N'hésitez pas à me contacter si vous avez des questions.`
        });
      } else {
        console.log(`ℹ️ Conversation avec ${user.name} existe déjà: ${existingConversationId}`);
      }
    }
    
    console.log('✅ Toutes les conversations initiales ont été créées');
  } catch (error) {
    console.error('❌ Erreur lors de la création des conversations initiales:', error);
    throw error;
  }
};