
import { Timestamp } from 'firebase/firestore';

export interface Conversation {
  id: string;
  clientName: string;
  clientEmail: string;
  lastMessage: string;
  lastMessageTime: Timestamp;
  unreadCount: number;
  status: "online" | "offline";
  createdAt: Timestamp;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  sender: "client" | "staff";
  senderName: string;
  senderEmail: string;
  message: string;
  timestamp: Timestamp;
  read: boolean;
}

export interface CreateConversationData {
  clientName: string;
  clientEmail: string;
}

export interface SendMessageData {
  conversationId: string;
  sender: "client" | "staff";
  senderName: string;
  senderEmail: string;
  message: string;
}
