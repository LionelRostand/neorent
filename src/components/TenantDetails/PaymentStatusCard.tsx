
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Calendar } from 'lucide-react';

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
            <span className="text-lg font-bold text-blue-600">{tenant.rentAmount}</span>
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
