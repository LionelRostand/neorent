import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Users, Send, User } from 'lucide-react';
import { useFirebaseRoommates } from '@/hooks/useFirebaseRoommates';
import { useAuth } from '@/hooks/useAuth';
import { useTenantChat } from '@/hooks/useTenantChat';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface TenantChatProps {
  currentProfile: any;
}

const TenantChat: React.FC<TenantChatProps> = ({ currentProfile }) => {
  const { t, i18n } = useTranslation();
  const { roommates } = useFirebaseRoommates();
  const { user } = useAuth();
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [messageText, setMessageText] = useState('');

  const {
    conversations,
    messages,
    sendMessage,
    createConversation,
    loading,
    loadingMessages,
    subscribeToMessages
  } = useTenantChat(currentProfile?.id);

  // Souscrire aux messages quand un contact est sélectionné
  useEffect(() => {
    if (!selectedContact || !currentProfile) return;

    const conversation = conversations.find(conv => 
      (conv.participant1Id === currentProfile.id && conv.participant2Id === selectedContact.id) ||
      (conv.participant1Id === selectedContact.id && conv.participant2Id === currentProfile.id)
    );

    if (conversation?.id) {
      const unsubscribe = subscribeToMessages(conversation.id);
      return unsubscribe;
    }
  }, [selectedContact, conversations, currentProfile, subscribeToMessages]);

  // Filtrer les colocataires/locataires disponibles pour le chat
  const availableContacts = roommates.filter(r => 
    r.id !== currentProfile?.id && 
    r.status === 'Actif' &&
    (r.property === currentProfile?.property || r.primaryTenant === currentProfile?.name)
  );

  const handleStartConversation = async (contact: any) => {
    try {
      // Vérifier s'il existe déjà une conversation
      const existingConversation = conversations.find(conv => 
        (conv.participant1Id === currentProfile.id && conv.participant2Id === contact.id) ||
        (conv.participant1Id === contact.id && conv.participant2Id === currentProfile.id)
      );

      if (existingConversation) {
        setSelectedContact(contact);
        return;
      }

      // Créer une nouvelle conversation
      const conversationId = await createConversation(contact.id, contact.name, contact.email);
      if (conversationId) {
        setSelectedContact(contact);
      }
    } catch (error) {
      console.error('Erreur lors de la création de la conversation:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedContact) return;

    try {
      await sendMessage(selectedContact.id, messageText.trim());
      setMessageText('');
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
    }
  };

  const currentConversation = selectedContact ? conversations.find(conv => 
    (conv.participant1Id === currentProfile.id && conv.participant2Id === selectedContact.id) ||
    (conv.participant1Id === selectedContact.id && conv.participant2Id === currentProfile.id)
  ) : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      {/* Liste des contacts */}
      <div className="lg:col-span-1">
        <Card className="h-full">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 text-blue-600" />
              {t('tenantSpace.chat.contacts')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {availableContacts.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <Users className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">{t('tenantSpace.chat.noContacts')}</p>
                </div>
              ) : (
                availableContacts.map((contact) => {
                  const conversation = conversations.find(conv => 
                    (conv.participant1Id === currentProfile.id && conv.participant2Id === contact.id) ||
                    (conv.participant1Id === contact.id && conv.participant2Id === currentProfile.id)
                  );
                  
                  return (
                    <div
                      key={contact.id}
                      className={`p-3 hover:bg-gray-50 cursor-pointer border-b transition-colors ${
                        selectedContact?.id === contact.id ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                      onClick={() => handleStartConversation(contact)}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={contact.image} />
                          <AvatarFallback>
                            <User className="h-5 w-5" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-gray-900 truncate">
                            {contact.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {contact.property} - Chambre {contact.roomNumber}
                          </p>
                          {conversation && (
                            <p className="text-xs text-gray-400 truncate mt-1">
                              {conversation.lastMessage}
                            </p>
                          )}
                        </div>
                        {conversation && conversation.unreadCount > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Zone de chat */}
      <div className="lg:col-span-2">
        <Card className="h-full flex flex-col">
          {selectedContact ? (
            <>
              <CardHeader className="pb-3 border-b">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedContact.image} />
                    <AvatarFallback>
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedContact.name}</h3>
                    <p className="text-sm text-gray-500">
                      {selectedContact.property} - Chambre {selectedContact.roomNumber}
                    </p>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 p-0 flex flex-col">
                <div className="flex-1 p-4 overflow-y-auto space-y-4 max-h-[400px]">
                  {loadingMessages ? (
                    <div className="flex justify-center items-center h-32">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm">{t('tenantSpace.chat.startConversation')}</p>
                    </div>
                  ) : (
                    messages.map((message) => {
                      const isMyMessage = message.senderId === currentProfile.id;
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              isMyMessage
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p className={`text-xs mt-1 ${
                              isMyMessage ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              {message.timestamp && formatDistanceToNow(
                                message.timestamp.toDate(), 
                                { 
                                  addSuffix: true, 
                                  locale: i18n.language === 'fr' ? fr : undefined 
                                }
                              )}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Zone de saisie */}
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder={t('tenantSpace.chat.typeMessage')}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!messageText.trim() || loading}
                      size="sm"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="font-medium text-gray-900 mb-2">
                  {t('tenantSpace.chat.selectContact')}
                </h3>
                <p className="text-sm">{t('tenantSpace.chat.selectContactDescription')}</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default TenantChat;