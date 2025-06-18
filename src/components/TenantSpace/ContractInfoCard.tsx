
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ContractInfoCardProps {
  contractData: any;
  monthlyRent: number;
  monthlyCharges: number;
  totalMonthly: number;
}

const ContractInfoCard: React.FC<ContractInfoCardProps> = ({
  contractData,
  monthlyRent,
  monthlyCharges,
  totalMonthly
}) => {
  if (!contractData) return null;

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="text-blue-800 text-lg md:text-xl">Informations du contrat</CardTitle>
      </CardHeader>
      <CardContent className="text-blue-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <h4 className="font-medium mb-2 text-sm md:text-base">Détails du contrat</h4>
            <ul className="space-y-1 text-xs md:text-sm">
              <li>• Locataire: {contractData.tenant}</li>
              <li>• Propriété: {contractData.property}</li>
              <li>• Montant: {contractData.amount}</li>
              <li>• Date de début: {new Date(contractData.startDate).toLocaleDateString('fr-FR')}</li>
              <li>• Statut: {contractData.status}</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2 text-sm md:text-base">Historique généré</h4>
            <ul className="space-y-1 text-xs md:text-sm">
              <li>• Depuis: {new Date(contractData.startDate).toLocaleDateString('fr-FR')}</li>
              <li>• Loyer mensuel: {monthlyRent}€</li>
              <li>• Charges mensuelles: {monthlyCharges}€</li>
              <li>• Total mensuel: {totalMonthly}€</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContractInfoCard;
