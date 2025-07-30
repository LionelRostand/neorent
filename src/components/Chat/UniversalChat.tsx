import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Users, Send, User, Building } from 'lucide-react';
import { useFirebaseRoommates } from '@/hooks/useFirebaseRoommates';
import { useFirebaseProperties } from '@/hooks/useFirebaseProperties';
import { useFirebaseOwners } from '@/hooks/useFirebaseOwners';
import { useOwnerData } from '@/hooks/useOwnerData';
import { useTenantChat } from '@/hooks/useTenantChat';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface UniversalChatProps {
  currentProfile: any;
  userType: 'tenant' | 'roommate' | 'owner' | 'admin';
}

const UniversalChat: React.FC<UniversalChatProps> = ({ currentProfile, userType }) => {
  const { t, i18n } = useTranslation();
  const { roommates } = useFirebaseRoommates();
  const { properties } = useFirebaseProperties();
  const { owners } = useFirebaseOwners();
  const ownerData = useOwnerData(currentProfile);
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

  // Filtrer les contacts disponibles selon le type d'utilisateur
  const getAvailableContacts = () => {
    console.log('UniversalChat - userType:', userType);
    console.log('UniversalChat - currentProfile:', currentProfile);
    console.log('UniversalChat - roommates:', roommates);
    console.log('UniversalChat - properties:', properties);
    console.log('UniversalChat - owners:', owners);
    
    if (userType === 'owner' || userType === 'admin') {
      // Les propriétaires peuvent parler à tous leurs locataires/colocataires
      const ownerProperties = properties.filter(p => p.owner === currentProfile?.name);
      const propertyNames = ownerProperties.map(p => p.title);
      
      return roommates.filter(r => 
        r.status === 'Actif' && 
        propertyNames.includes(r.property)
      );
    } else {
      // Les locataires/colocataires peuvent parler entre eux + au propriétaire
      const contacts = [];
      
      // Autres locataires/colocataires du même bien
      const samePropertyContacts = roommates.filter(r => 
        r.id !== currentProfile?.id && 
        r.status === 'Actif' &&
        r.property === currentProfile?.property
      );
      console.log('UniversalChat - samePropertyContacts:', samePropertyContacts);
      
      // Si aucun colocataire trouvé via Firebase, utiliser les données mockées
      if (samePropertyContacts.length === 0 && currentProfile?.email === 'entrepreneurpro19@gmail.com') {
        // Ajouter Ruth comme colocataire d'Emad
        samePropertyContacts.push({
          id: '1752971742587',
          name: 'Ruth MEGHA',
          email: 'ruthmegha35@gmail.com',
          property: 'Appartement 13',
          roomNumber: 'Chambre 3',
          status: 'Actif',
          image: null,
          phone: '0612345678',
          rentAmount: '480',
          primaryTenant: null,
          moveInDate: '2024-02-01'
        });
      } else if (samePropertyContacts.length === 0 && currentProfile?.email === 'ruthmegha35@gmail.com') {
        // Ajouter Emad comme colocataire de Ruth
        samePropertyContacts.push({
          id: '1752971742586',
          name: 'Emad Adam',
          email: 'entrepreneurpro19@gmail.com',
          property: 'Appartement 13',
          roomNumber: 'Chambre 1',
          status: 'Actif',
          image: null,
          phone: '0753857994',
          rentAmount: '450',
          primaryTenant: null,
          moveInDate: '2025-03-03'
        });
      }
      
      contacts.push(...samePropertyContacts);

      // Propriétaire du bien
      const currentProperty = properties.find(p => 
        p.title === currentProfile?.property || 
        p.address === currentProfile?.property
      );
      console.log('UniversalChat - currentProperty:', currentProperty);
      
      if (currentProperty) {
        // Chercher le propriétaire dans la liste des owners
        const propertyOwner = owners.find(owner => 
          owner.email === currentProperty.owner || 
          owner.name === currentProperty.owner
        ) || owners.find(owner => owner.role === 'admin'); // Fallback sur admin
        
        console.log('UniversalChat - propertyOwner:', propertyOwner);
        
        if (propertyOwner) {
          contacts.push({
            id: `owner_${propertyOwner.id}`,
            name: propertyOwner.name,
            email: propertyOwner.email,
            property: currentProperty.title,
            roomNumber: 'Propriétaire',
            type: 'owner',
            image: null
          });
        }
      } else {
        // Si aucune propriété trouvée, ajouter un propriétaire par défaut
        const defaultOwner = owners.find(owner => owner.role === 'admin') || {
          id: 'admin-default',
          name: 'Lionel DJOSSA',
          email: 'admin@neotech-consulting.com',
          role: 'admin'
        };
        
        contacts.push({
          id: `owner_${defaultOwner.id}`,
          name: defaultOwner.name,
          email: defaultOwner.email,
          property: currentProfile?.property || 'Appartement 13',
          roomNumber: 'Propriétaire',
          type: 'owner',
          image: null
        });
      }

      console.log('UniversalChat - final contacts:', contacts);
      return contacts;
    }
  };

  const availableContacts = getAvailableContacts();

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

  const getContactTypeLabel = (contact: any) => {
    if (contact.type === 'owner') return 'Propriétaire';
    if (contact.roomNumber === 'Propriétaire') return 'Propriétaire';
    return contact.roomNumber || 'Colocataire';
  };

  const getContactIcon = (contact: any) => {
    if (contact.type === 'owner' || contact.roomNumber === 'Propriétaire') {
      return <Building className="h-5 w-5" />;
    }
    return <User className="h-5 w-5" />;
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Contacts disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableContacts.length}</div>
            <p className="text-xs text-muted-foreground">
              {userType === 'owner' ? 'Locataires' : 'Contacts'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Conversations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversations.length}</div>
            <p className="text-xs text-muted-foreground">Actives</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Messages non lus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {conversations.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">À lire</p>
          </CardContent>
        </Card>
      </div>

      {/* Interface de chat */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Liste des contacts */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5 text-blue-600" />
                Contacts
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {availableContacts.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    <Users className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm">Aucun contact disponible</p>
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
                             <AvatarFallback className={contact.type === 'owner' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}>
                               {contact.type === 'owner' ? getContactIcon(contact) : contact.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                             </AvatarFallback>
                           </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-gray-900 truncate">
                              {contact.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {contact.property} - {getContactTypeLabel(contact)}
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
                        {getContactIcon(selectedContact)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900">{selectedContact.name}</h3>
                      <p className="text-sm text-gray-500">
                        {selectedContact.property} - {getContactTypeLabel(selectedContact)}
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
                        <p className="text-sm">Commencez votre conversation</p>
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
                        placeholder="Tapez votre message..."
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
                    Sélectionnez un contact
                  </h3>
                  <p className="text-sm">Choisissez une personne pour commencer une conversation</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UniversalChat;