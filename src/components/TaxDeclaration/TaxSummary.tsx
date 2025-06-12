
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Receipt, Info, AlertTriangle } from 'lucide-react';

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
    <div className="space-y-4">
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Receipt className="h-5 w-5" />
            Résumé Fiscal {declarationYear}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Revenus Locatifs Bruts (Annuels)</p>
              <p className="text-xl font-bold text-blue-600">{totalRentalIncome.toLocaleString('fr-FR')}€</p>
              <p className="text-xs text-gray-500 mt-1">Loyers perçus sur l'année</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Charges Déductibles</p>
              <p className="text-xl font-bold text-orange-600">{totalCharges.toLocaleString('fr-FR')}€</p>
              <p className="text-xs text-gray-500 mt-1">Charges annuelles</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Revenus Nets Imposables</p>
              <p className="text-xl font-bold text-green-600">{netIncome.toLocaleString('fr-FR')}€</p>
              <p className="text-xs text-gray-500 mt-1">Base de calcul de l'impôt</p>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-yellow-100 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-yellow-800 mt-0.5" />
              <p className="text-sm text-yellow-800">
                <strong>Calcul annuel:</strong> Revenus locatifs ({totalRentalIncome.toLocaleString('fr-FR')}€) 
                - Charges ({totalCharges.toLocaleString('fr-FR')}€) 
                = Revenus nets imposables ({netIncome.toLocaleString('fr-FR')}€)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Carte spéciale pour mettre en évidence la somme à payer */}
      <Card className="bg-red-50 border-red-300 border-2">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-red-800">
            <AlertTriangle className="h-6 w-6" />
            Montant de l'Impôt à Payer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <p className="text-sm text-red-700 mb-2">Impôt estimé sur les revenus fonciers {declarationYear}</p>
            <div className="bg-white rounded-lg p-4 border-2 border-red-300">
              <p className="text-4xl font-bold text-red-600">{estimatedTax.toLocaleString('fr-FR')}€</p>
            </div>
            <p className="text-xs text-red-600 mt-3 font-medium">
              Ce montant sera à régler lors de votre déclaration d'impôts
            </p>
          </div>
          
          <div className="mt-4 p-3 bg-red-100 rounded-lg">
            <p className="text-sm text-red-800">
              <strong>Important :</strong> Cette estimation est basée sur votre tranche marginale d'imposition. 
              Le montant réel peut varier selon votre situation fiscale globale.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaxSummary;
