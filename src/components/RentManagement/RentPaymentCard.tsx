
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Clock, 
  User, 
  Calendar,
  AlertTriangle,
  Trash2,
  Building,
  Home,
  DollarSign
} from 'lucide-react';

interface Payment {
  id: string;
  tenantName: string;
  tenantType: string;
  property: string;
  rentAmount: number;
  dueDate: string;
  status: string;
  paymentDate: string | null;
  paymentMethod: string | null;
}

interface RentPaymentCardProps {
  payment: Payment;
  onMarkAsPaid: (paymentId: string) => void;
  onDelete: (paymentId: string) => void;
}

const RentPaymentCard: React.FC<RentPaymentCardProps> = ({
  payment,
  onMarkAsPaid,
  onDelete
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Payé':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Payé</Badge>;
      case 'En retard':
        return <Badge className="bg-red-100 text-red-800 border-red-200">En retard</Badge>;
      case 'En attente':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">En attente</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Payé':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'En retard':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'En attente':
        return <Clock className="h-5 w-5 text-orange-600" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-600" />;
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

  return (
    <Card className={`hover:shadow-lg transition-all duration-200 border-l-4 ${getCardBorderColor(payment.status)} h-full flex flex-col`}>
      <CardContent className="p-4 sm:p-6 flex flex-col h-full">
        {/* Header avec nom et statut */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-semibold text-gray-900 truncate">{payment.tenantName}</h3>
              <Badge variant="outline" className="text-xs mt-1">
                {payment.tenantType}
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusIcon(payment.status)}
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => onDelete(payment.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Informations du bien */}
        <div className="space-y-3 mb-4 flex-1">
          <div className="flex items-center text-sm text-gray-600">
            <Building className="mr-2 h-4 w-4 text-blue-500 flex-shrink-0" />
            <span className="truncate">{payment.property}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="mr-2 h-4 w-4 text-orange-500 flex-shrink-0" />
            <span>Échéance: {new Date(payment.dueDate).toLocaleDateString('fr-FR')}</span>
          </div>

          {payment.paymentDate && (
            <div className="flex items-center text-sm text-gray-600">
              <CheckCircle className="mr-2 h-4 w-4 text-green-500 flex-shrink-0" />
              <span>Payé le: {new Date(payment.paymentDate).toLocaleDateString('fr-FR')}</span>
              {payment.paymentMethod && <span className="ml-1">({payment.paymentMethod})</span>}
            </div>
          )}
        </div>

        {/* Statut et montant */}
        <div className="flex items-center justify-between mb-4">
          {getStatusBadge(payment.status)}
          <div className="text-right">
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-gray-500 mr-1" />
              <span className="text-2xl font-bold text-gray-900">{payment.rentAmount}€</span>
            </div>
            <p className="text-xs text-gray-500">Loyer mensuel</p>
          </div>
        </div>
        
        {/* Actions pour les paiements non payés */}
        {payment.status !== 'Payé' && (
          <div className="pt-4 border-t border-gray-100 space-y-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full hover:bg-blue-50"
            >
              Envoyer rappel
            </Button>
            <Button 
              size="sm" 
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              onClick={() => onMarkAsPaid(payment.id)}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Marquer comme payé
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RentPaymentCard;
