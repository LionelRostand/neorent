
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Receipt, Info } from 'lucide-react';

interface TaxSummaryProps {
  declarationYear: number;
  totalRentalIncome: number;
  totalCharges: number;
  netIncome: number;
  estimatedTax: number;
}

const TaxSummary = ({ 
  declarationYear, 
  totalRentalIncome, 
  totalCharges, 
  netIncome, 
  estimatedTax 
}: TaxSummaryProps) => {
  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <Receipt className="h-5 w-5" />
          Résumé Fiscal {declarationYear}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Revenus Locatifs Bruts</p>
            <p className="text-xl font-bold text-blue-600">{totalRentalIncome.toLocaleString('fr-FR')}€</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Charges</p>
            <p className="text-xl font-bold text-orange-600">{totalCharges.toLocaleString('fr-FR')}€</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Revenus Nets</p>
            <p className="text-xl font-bold text-green-600">{netIncome.toLocaleString('fr-FR')}€</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Impôt Estimé</p>
            <p className="text-xl font-bold text-red-600">{estimatedTax.toLocaleString('fr-FR')}€</p>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-yellow-100 rounded-lg">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-yellow-800 mt-0.5" />
            <p className="text-sm text-yellow-800">
              <strong>Calcul:</strong> Revenus locatifs ({totalRentalIncome.toLocaleString('fr-FR')}€) 
              - Charges ({totalCharges.toLocaleString('fr-FR')}€) 
              = Revenus nets imposables ({netIncome.toLocaleString('fr-FR')}€)
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaxSummary;
