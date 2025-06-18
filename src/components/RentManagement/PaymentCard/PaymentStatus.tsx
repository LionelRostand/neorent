
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface PaymentStatusProps {
  status: string;
}

export const PaymentStatus: React.FC<PaymentStatusProps> = ({ status }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Payé':
        return <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">Payé</Badge>;
      case 'En retard':
        return <Badge className="bg-red-100 text-red-800 border-red-200 text-xs">En retard</Badge>;
      case 'En attente':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200 text-xs">En attente</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Payé':
        return <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />;
      case 'En retard':
        return <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />;
      case 'En attente':
        return <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />;
    }
  };

  const getCardBorderColor = (status: string) => {
    switch (status) {
      case 'Payé':
        return 'border-l-green-500';
      case 'En retard':
        return 'border-l-red-500';
      case 'En attente':
        return 'border-l-orange-500';
      default:
        return 'border-l-gray-500';
    }
  };

  return {
    badge: getStatusBadge(status),
    icon: getStatusIcon(status),
    borderColor: getCardBorderColor(status)
  };
};
