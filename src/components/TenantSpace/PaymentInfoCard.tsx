
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PaymentInfoCardProps {
  monthlyRent: number;
  monthlyCharges: number;
  totalMonthly: number;
}

const PaymentInfoCard: React.FC<PaymentInfoCardProps> = ({
  monthlyRent,
  monthlyCharges,
  totalMonthly
}) => {
  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="text-blue-800 text-lg md:text-xl">Informations de paiement</CardTitle>
      </CardHeader>
      <CardContent className="text-blue-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <h4 className="font-medium mb-2 text-sm md:text-base">Modalités de paiement</h4>
            <ul className="space-y-1 text-xs md:text-sm">
              <li>• Loyer mensuel: {monthlyRent}€</li>
              <li>• Charges mensuelles: {monthlyCharges}€</li>
              <li>• Total mensuel: {totalMonthly}€</li>
              <li>• Échéance: 1er de chaque mois</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2 text-sm md:text-base">Moyens de paiement acceptés</h4>
            <ul className="space-y-1 text-xs md:text-sm">
              <li>• Virement bancaire (recommandé)</li>
              <li>• Chèque</li>
              <li>• Prélèvement automatique</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentInfoCard;
