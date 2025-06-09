
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Users, Clock, AlertCircle } from 'lucide-react';
import type { Conversation } from '@/types/chat';

interface MessageStatsProps {
  conversations: Conversation[];
}

export const MessageStats: React.FC<MessageStatsProps> = ({ conversations }) => {
  const totalConversations = conversations.length;
  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);
  const onlineClients = conversations.filter(conv => conv.status === 'online').length;
  const recentConversations = conversations.filter(conv => {
    const lastMessageTime = conv.lastMessageTime.toDate();
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    return lastMessageTime > oneHourAgo;
  }).length;

  const stats = [
    {
      title: 'Total Conversations',
      value: totalConversations,
      icon: MessageCircle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Messages non lus',
      value: totalUnread,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      title: 'Clients en ligne',
      value: onlineClients,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Récentes (1h)',
      value: recentConversations,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
