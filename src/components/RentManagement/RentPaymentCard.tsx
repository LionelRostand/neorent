
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
  DollarSign
} from 'lucide-react';

interface Payment {
  id: string;
  tenantName: string;
  tenantType: string;
  property: string;
  rentAmount: number;
  paidAmount?: number;
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

  // Vérifier s'il y a une incohérence de paiement
  const hasPaymentDiscrepancy = payment.status === 'Payé' && 
    payment.paidAmount !== undefined && 
    payment.paidAmount !== payment.rentAmount;

  return (
    <Card className={`hover:shadow-lg transition-all duration-200 border-l-4 ${getCardBorderColor(payment.status)} h-full flex flex-col ${hasPaymentDiscrepancy ? 'ring-2 ring-red-200' : ''}`}>
      <CardContent className="p-3 sm:p-4 lg:p-6 flex flex-col h-full">
        {/* Header avec nom et statut */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="h-3 w-3 sm:h-5 sm:w-5 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm sm:text-lg font-semibold text-gray-900 truncate">{payment.tenantName}</h3>
              <Badge variant="outline" className="text-xs mt-1">
                {payment.tenantType}
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
            {getStatusIcon(payment.status)}
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1 sm:p-2"
              onClick={() => onDelete(payment.id)}
            >
              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>

        {/* Alerte d'incohérence de paiement */}
        {hasPaymentDiscrepancy && (
          <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center text-xs text-red-700">
              <AlertTriangle className="h-3 w-3 mr-1" />
              <span>Incohérence de paiement détectée</span>
            </div>
          </div>
        )}

        {/* Informations du bien */}
        <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4 flex-1">
          <div className="flex items-start text-xs sm:text-sm text-gray-600">
            <Building className="mr-2 h-3 w-3 sm:h-4 sm:w-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <span className="break-words">{payment.property}</span>
          </div>
          
          <div className="flex items-center text-xs sm:text-sm text-gray-600">
            <Calendar className="mr-2 h-3 w-3 sm:h-4 sm:w-4 text-orange-500 flex-shrink-0" />
            <span>Échéance: {new Date(payment.dueDate).toLocaleDateString('fr-FR')}</span>
          </div>

          {payment.paymentDate && (
            <div className="flex items-center text-xs sm:text-sm text-gray-600">
              <CheckCircle className="mr-2 h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
              <span className="break-words">
                Payé le: {new Date(payment.paymentDate).toLocaleDateString('fr-FR')}
                {payment.paymentMethod && <span className="ml-1">({payment.paymentMethod})</span>}
              </span>
            </div>
          )}
        </div>

        {/* Montant du loyer mensuel */}
        <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">Loyer mensuel à payer</span>
            </div>
            <span className="text-xl sm:text-2xl font-bold text-blue-600">{payment.rentAmount}€</span>
          </div>
          
          {/* Affichage du statut de paiement */}
          <div className="mt-2 flex items-center justify-between">
            {getStatusBadge(payment.status)}
            {payment.paidAmount !== undefined && payment.paidAmount !== payment.rentAmount && payment.status === 'Payé' && (
              <span className="text-sm text-red-600 font-medium">
                Payé: {payment.paidAmount}€
              </span>
            )}
          </div>
        </div>
        
        {/* Actions pour les paiements non payés */}
        {payment.status !== 'Payé' && (
          <div className="pt-3 sm:pt-4 border-t border-gray-100 space-y-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full hover:bg-blue-50 text-xs sm:text-sm"
            >
              Envoyer rappel
            </Button>
            <Button 
              size="sm" 
              className="w-full bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm"
              onClick={() => onMarkAsPaid(payment.id)}
            >
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Marquer comme payé
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RentPaymentCard;
