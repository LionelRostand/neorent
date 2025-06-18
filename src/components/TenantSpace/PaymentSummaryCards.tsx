
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  CreditCard, 
  CheckCircle, 
  Euro,
  TrendingUp
} from 'lucide-react';

interface PaymentSummaryCardsProps {
  totalPaid: number;
  paidPayments: number;
  monthlyRent: number;
  monthlyCharges: number;
}

const PaymentSummaryCards: React.FC<PaymentSummaryCardsProps> = ({
  totalPaid,
  paidPayments,
  monthlyRent,
  monthlyCharges
}) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
      <Card>
        <CardContent className="pt-4 md:pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600">Total payé</p>
              <p className="text-lg md:text-2xl font-bold text-green-600">{totalPaid.toLocaleString()}€</p>
            </div>
            <Euro className="h-6 w-6 md:h-8 md:w-8 text-green-500" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-4 md:pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600">Paiements effectués</p>
              <p className="text-lg md:text-2xl font-bold text-blue-600">{paidPayments}</p>
            </div>
            <CheckCircle className="h-6 w-6 md:h-8 md:w-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-4 md:pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600">Loyer mensuel</p>
              <p className="text-lg md:text-2xl font-bold text-purple-600">{monthlyRent}€</p>
            </div>
            <CreditCard className="h-6 w-6 md:h-8 md:w-8 text-purple-500" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-4 md:pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600">Charges mensuelles</p>
              <p className="text-lg md:text-2xl font-bold text-orange-600">{monthlyCharges}€</p>
            </div>
            <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-orange-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSummaryCards;
