
import React, { useEffect } from 'react';
import { toast } from 'sonner';
import { MessageCircle } from 'lucide-react';
import { useMessageNotifications } from '@/hooks/useMessageNotifications';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const MessageToast: React.FC = () => {
  const { hasNewMessages, clearNewMessageFlag, getRecentConversations } = useMessageNotifications();
  const navigate = useNavigate();

  useEffect(() => {
    if (hasNewMessages) {
      const recentConversations = getRecentConversations(1);
      if (recentConversations.length > 0) {
        const conversation = recentConversations[0];
        
        toast('Nouveau message reçu', {
          description: `${conversation.clientName}: ${conversation.lastMessage.substring(0, 50)}...`,
          icon: <MessageCircle className="h-4 w-4" />,
          action: (
            <Button 
              size="sm" 
              onClick={() => {
                navigate('/admin/messages');
                clearNewMessageFlag();
              }}
            >
              Voir
            </Button>
          ),
          duration: 5000
        });
      }
      
      clearNewMessageFlag();
    }
  }, [hasNewMessages, clearNewMessageFlag, getRecentConversations, navigate]);

  return null;
};
