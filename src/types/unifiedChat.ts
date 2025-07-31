import { Timestamp } from 'firebase/firestore';

export interface UnifiedConversation {
  id: string;
  participants: string[]; // Array d'emails des participants
  participantNames: Record<string, string>; // Map email -> nom
  lastMessage: string;
  lastMessageTime: Timestamp;
  unreadCount: Record<string, number>; // Map email -> nombre non lus
  createdAt: Timestamp;
  type: 'tenant_to_tenant' | 'tenant_to_admin' | 'admin_to_tenant';
}

export interface UnifiedMessage {
  id: string;
  conversationId: string;
  senderEmail: string;
  senderName: string;
  content: string;
  timestamp: Timestamp;
  readBy: string[]; // Array d'emails qui ont lu le message
}

export interface CreateConversationData {
  participants: string[];
  participantNames: Record<string, string>;
  type: 'tenant_to_tenant' | 'tenant_to_admin' | 'admin_to_tenant';
}

export interface SendMessageData {
  conversationId: string;
  senderEmail: string;
  senderName: string;
  content: string;
}