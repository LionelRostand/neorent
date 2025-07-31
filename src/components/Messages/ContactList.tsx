
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, Circle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { Conversation } from '@/types/chat';

interface ContactListProps {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  onConversationSelect: (conversation: Conversation) => void;
  onConversationDelete: (conversationId: string) => void;
  loading: boolean;
}

export const ContactList: React.FC<ContactListProps> = ({
  conversations,
  selectedConversation,
  onConversationSelect,
  onConversationDelete,
  loading
}) => {
  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Contacts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Contacts
          <span className="text-sm font-normal text-gray-500">
            {conversations.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-400px)]">
          {conversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              Aucun contact
            </div>
          ) : (
            <div className="space-y-1">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-4 border-b cursor-pointer transition-colors ${
                    selectedConversation?.id === conversation.id
                      ? 'bg-green-50 border-green-200'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => onConversationSelect(conversation)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {conversation.clientName}
                        </h4>
                        <Circle
                          className={`h-2 w-2 ${
                            conversation.status === 'online'
                              ? 'text-green-500 fill-current'
                              : 'text-gray-400 fill-current'
                          }`}
                        />
                        {conversation.unreadCount > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[1.5rem] text-center">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate">
                        {conversation.clientEmail}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {(() => {
                          // Vérifier que lastMessageTime existe et a une méthode toDate
                          if (!conversation.lastMessageTime || typeof conversation.lastMessageTime.toDate !== 'function') {
                            return 'Pas de message';
                          }
                          
                          try {
                            return formatDistanceToNow(conversation.lastMessageTime.toDate(), {
                              addSuffix: true,
                              locale: fr
                            });
                          } catch (error) {
                            console.warn('Erreur lors de la conversion de timestamp:', error);
                            return 'Date invalide';
                          }
                        })()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onConversationDelete(conversation.id);
                      }}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
