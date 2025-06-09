
import React from 'react';
import { MessageCircle } from 'lucide-react';

interface ChatWidgetButtonProps {
  onClick: () => void;
}

export const ChatWidgetButton: React.FC<ChatWidgetButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-4 right-4 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-colors"
    >
      <MessageCircle className="h-6 w-6" />
    </button>
  );
};
