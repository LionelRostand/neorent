
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Calendar, CheckCircle } from 'lucide-react';

interface Tenant {
  id: number;
  name: string;
  email: string;
  phone: string;
  property: string;
  rentAmount: string;
  nextPayment: string;
  status: string;
  leaseStart: string;
  image: string | null;
  paidAmount?: number;
}

interface PaymentStatus {
  status: string;
  color: string;
  icon: React.ComponentType<any>;
}

interface PaymentStatusCardProps {
  tenant: Tenant;
  paymentStatus: PaymentStatus;
}

const PaymentStatusCard: React.FC<PaymentStatusCardProps> = ({ tenant, paymentStatus }) => {
  const PaymentIcon = paymentStatus.icon;
  const montantAttendu = Number(tenant.rentAmount) || 0;
  const montantPaye = typeof tenant.paidAmount === 'number' ? tenant.paidAmount : montantAttendu;
  
  // Vérifier s'il y a une différence entre le montant attendu et payé
  const hasPaymentDifference = montantPaye !== montantAttendu;

  return (
    <Card>
      <CardContent className="p-6">
        <h4 className="text-lg font-semibold mb-4">Statut de paiement</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <DollarSign className="mr-2 h-5 w-5 text-blue-600" />
              <span className="font-medium">Montant du loyer</span>
            </div>
            <span className="text-lg font-bold text-blue-600">{tenant.rentAmount}€</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <PaymentIcon className="mr-2 h-5 w-5" />
              <span className="font-medium">Statut du mois</span>
            </div>
            <Badge className={paymentStatus.color}>
              {paymentStatus.status}
            </Badge>
          </div>
        </div>
        
        {/* Affichage conditionnel du détail de paiement */}
        {hasPaymentDifference ? (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span>Montant attendu :</span>
              <span className="font-semibold text-blue-700">{montantAttendu.toLocaleString()}€</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span>Montant payé :</span>
              <span className="font-semibold text-green-700">{montantPaye.toLocaleString()}€</span>
            </div>
            {montantPaye < montantAttendu && (
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <span className="text-red-700">Reste à verser :</span>
                <span className="font-semibold text-red-700">{(montantAttendu - montantPaye).toLocaleString()}€</span>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="flex items-center text-green-700">
                <CheckCircle className="h-4 w-4 mr-1" />
                Paiement complet
              </span>
              <span className="text-green-700 font-semibold">{montantAttendu.toLocaleString()}€</span>
            </div>
          </div>
        )}
        
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center text-blue-700">
            <Calendar className="mr-2 h-4 w-4" />
            <span className="font-medium">
              Prochain paiement: {new Date(tenant.nextPayment).toLocaleDateString('fr-FR')}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentStatusCard;
