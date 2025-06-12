
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
    <div className="space-y-6">
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Receipt className="h-5 w-5" />
            Résumé Fiscal {declarationYear} (Calcul Annuel)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Revenus Locatifs Bruts</p>
              <p className="text-2xl font-bold text-blue-600">{totalRentalIncome.toLocaleString('fr-FR')}€</p>
              <p className="text-xs text-gray-500 mt-1">Total annuel automatique</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Charges Déductibles</p>
              <p className="text-2xl font-bold text-orange-600">{totalCharges.toLocaleString('fr-FR')}€</p>
              <p className="text-xs text-gray-500 mt-1">Charges annuelles</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Revenus Nets Imposables</p>
              <p className="text-2xl font-bold text-green-600">{netIncome.toLocaleString('fr-FR')}€</p>
              <p className="text-xs text-gray-500 mt-1">Base de calcul de l'impôt</p>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-100 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-800 mt-0.5" />
              <p className="text-sm text-blue-800">
                <strong>Calcul annuel automatique:</strong> Tous les loyers mensuels ont été multipliés par 12 pour obtenir les revenus annuels
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Carte mise en évidence pour la somme à payer */}
      <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-300 border-2 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-red-800">
            <AlertTriangle className="h-6 w-6" />
            💰 SOMME À PAYER - DÉCLARATION FISCALE {declarationYear}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <p className="text-sm text-red-700 mb-3">Impôt estimé sur les revenus fonciers</p>
            <div className="bg-white rounded-xl p-6 border-2 border-red-400 shadow-inner">
              <p className="text-5xl font-bold text-red-600 mb-2">{estimatedTax.toLocaleString('fr-FR')}€</p>
              <p className="text-sm text-red-500 font-medium">À régler lors de votre déclaration d'impôts</p>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-red-100 rounded-lg p-3">
              <p className="text-sm text-red-800">
                <strong>Base de calcul:</strong><br/>
                {netIncome.toLocaleString('fr-FR')}€ (revenus nets)
              </p>
            </div>
            <div className="bg-red-100 rounded-lg p-3">
              <p className="text-sm text-red-800">
                <strong>Tranche d'imposition:</strong><br/>
                {taxBracket}% (tranche marginale)
              </p>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              <strong>⚠️ Important :</strong> Cette estimation est basée sur votre tranche marginale d'imposition. 
              Le montant réel peut varier selon votre situation fiscale globale.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaxSummary;
