import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  AlertCircle, 
  Users, 
  Clock, 
  Trash2,
  Send,
  Search
} from 'lucide-react';

interface MessagesViewProps {
  currentProfile: any;
}

const MessagesView: React.FC<MessagesViewProps> = ({ currentProfile }) => {
  const { t } = useTranslation();
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [newMessage, setNewMessage] = useState('');

  // Données simulées des conversations
  const conversations = [
    {
      id: 1,
      name: 'RUTH MEGHA',
      email: 'ruthmegha35@gmail.com',
      lastMessage: 'Il y a environ 2 heures',
      isOnline: true,
      unreadCount: 0,
      messages: [
        { id: 1, sender: 'Lionel DJOSSA', content: 'Hi RUTH', timestamp: 'Il y a environ 2 heures' },
        { id: 2, sender: 'Lionel DJOSSA', content: 'hello', timestamp: 'Il y a environ 2 heures' }
      ]
    },
    {
      id: 2,
      name: 'EMAD ADAM',
      email: 'entrepreneurpro19@gmail.com',
      lastMessage: 'Il y a environ 3 heures',
      isOnline: true,
      unreadCount: 0,
      messages: [
        { id: 1, sender: 'EMAD ADAM', content: 'Bonjour, j\'ai une question concernant le loyer', timestamp: 'Il y a environ 3 heures' }
      ]
    }
  ];

  // Métriques des messages
  const totalConversations = conversations.length;
  const unreadMessages = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);
  const onlineClients = conversations.filter(conv => conv.isOnline).length;
  const recentMessages = 0; // Messages de la dernière heure

  const metrics = [
    {
      title: 'Conversations Totales',
      value: totalConversations,
      icon: MessageCircle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Messages Non Lus',
      value: unreadMessages,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Clients En Ligne',
      value: onlineClients,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Récents (1h)',
      value: recentMessages,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedContact) {
      // Logique d'envoi de message
      setNewMessage('');
    }
  };

  return (
    <div className="h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">Centre de Messages</h1>
        <p className="text-gray-600 mt-1">Communiquez avec les locataires et gérez les demandes</p>
      </div>

      {/* Métriques */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {metrics.map((metric, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                    <metric.icon className={`h-5 w-5 ${metric.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{metric.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Interface de messagerie */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Liste des contacts */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-0">
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Contacts</h3>
                    <Badge variant="secondary">{conversations.length}</Badge>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Rechercher un contact..."
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {conversations.map((contact) => (
                    <div
                      key={contact.id}
                      className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedContact?.id === contact.id ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                      onClick={() => setSelectedContact(contact)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-700">
                                {contact.name.charAt(0)}
                              </span>
                            </div>
                            {contact.isOnline && (
                              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{contact.name}</h4>
                            <p className="text-sm text-gray-500">{contact.email}</p>
                            <p className="text-xs text-gray-400">{contact.lastMessage}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {contact.unreadCount > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {contact.unreadCount}
                            </Badge>
                          )}
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Zone de conversation */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardContent className="p-0 h-full flex flex-col">
                {selectedContact ? (
                  <>
                    {/* Header de la conversation */}
                    <div className="p-4 border-b bg-gray-50">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {selectedContact.name.charAt(0)}
                            </span>
                          </div>
                          {selectedContact.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{selectedContact.name}</h3>
                          <p className="text-sm text-gray-500">{selectedContact.email}</p>
                          {selectedContact.isOnline && (
                            <Badge variant="outline" className="text-xs text-green-600 border-green-200">
                              En ligne
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-96">
                      {selectedContact.messages.map((message: any) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.sender === 'Lionel DJOSSA' ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-xs px-4 py-2 rounded-lg ${
                              message.sender === 'Lionel DJOSSA'
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-200 text-gray-900'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Zone de saisie */}
                    <div className="p-4 border-t">
                      <div className="flex space-x-2">
                        <Input
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Tapez votre message..."
                          className="flex-1"
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                        <Button onClick={handleSendMessage} className="bg-green-500 hover:bg-green-600">
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Sélectionnez un contact pour commencer la conversation</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesView;