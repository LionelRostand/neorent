
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Receipt, Info, AlertTriangle, Globe } from 'lucide-react';
import { countries } from './CountrySelector';

interface TaxSummaryProps {
  declarationYear: number;
  totalRentalIncome: number;
  totalCharges: number;
  netIncome: number;
  estimatedTax: number;
  taxBracket: string;
  country: string;
  currencySymbol: string;
}

const TaxSummary = ({ 
  declarationYear, 
  totalRentalIncome, 
  totalCharges, 
  netIncome, 
  estimatedTax,
  taxBracket,
  country,
  currencySymbol
}: TaxSummaryProps) => {
  const selectedCountry = countries.find(c => c.code === country);
  const isZeroTax = country === 'AE';

  return (
    <div className="space-y-6">
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Receipt className="h-5 w-5" />
            <Globe className="h-4 w-4" />
            Résumé Fiscal {declarationYear} - {selectedCountry?.flag} {selectedCountry?.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Revenus Locatifs Bruts</p>
              <p className="text-2xl font-bold text-blue-600">{totalRentalIncome.toLocaleString('fr-FR')}{currencySymbol}</p>
              <p className="text-xs text-gray-500 mt-1">Total annuel automatique</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Charges Déductibles</p>
              <p className="text-2xl font-bold text-orange-600">{totalCharges.toLocaleString('fr-FR')}{currencySymbol}</p>
              <p className="text-xs text-gray-500 mt-1">Charges annuelles</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Revenus Nets Imposables</p>
              <p className="text-2xl font-bold text-green-600">{netIncome.toLocaleString('fr-FR')}{currencySymbol}</p>
              <p className="text-xs text-gray-500 mt-1">Base de calcul de l'impôt</p>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-100 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-800 mt-0.5" />
              <p className="text-sm text-blue-800">
                <strong>Calcul pour {selectedCountry?.name}:</strong> Tous les loyers mensuels ont été multipliés par 12 pour obtenir les revenus annuels selon la fiscalité locale
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Carte mise en évidence pour la somme à payer */}
      <Card className={`${isZeroTax ? 'bg-gradient-to-r from-green-50 to-green-100 border-green-300' : 'bg-gradient-to-r from-red-50 to-red-100 border-red-300'} border-2 shadow-lg`}>
        <CardHeader className="pb-3">
          <CardTitle className={`flex items-center gap-2 ${isZeroTax ? 'text-green-800' : 'text-red-800'}`}>
            {isZeroTax ? <Info className="h-6 w-6" /> : <AlertTriangle className="h-6 w-6" />}
            {isZeroTax ? '🎉' : '💰'} {isZeroTax ? 'AUCUN IMPÔT À PAYER' : 'SOMME À PAYER'} - DÉCLARATION FISCALE {declarationYear}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <p className={`text-sm ${isZeroTax ? 'text-green-700' : 'text-red-700'} mb-3`}>
              {isZeroTax ? 'Aucun impôt sur les revenus fonciers' : 'Impôt estimé sur les revenus fonciers'}
            </p>
            <div className={`bg-white rounded-xl p-6 border-2 ${isZeroTax ? 'border-green-400' : 'border-red-400'} shadow-inner`}>
              <p className={`text-5xl font-bold ${isZeroTax ? 'text-green-600' : 'text-red-600'} mb-2`}>
                {estimatedTax.toLocaleString('fr-FR')}{currencySymbol}
              </p>
              <p className={`text-sm ${isZeroTax ? 'text-green-500' : 'text-red-500'} font-medium`}>
                {isZeroTax ? 'Pas d\'imposition dans ce pays' : 'À régler lors de votre déclaration d\'impôts'}
              </p>
            </div>
          </div>
          
          {!isZeroTax && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-red-100 rounded-lg p-3">
                <p className="text-sm text-red-800">
                  <strong>Base de calcul:</strong><br/>
                  {netIncome.toLocaleString('fr-FR')}{currencySymbol} (revenus nets)
                </p>
              </div>
              <div className="bg-red-100 rounded-lg p-3">
                <p className="text-sm text-red-800">
                  <strong>Système fiscal:</strong><br/>
                  {selectedCountry?.name} - Calcul progressif
                </p>
              </div>
            </div>
          )}
          
          <div className={`mt-4 p-3 ${isZeroTax ? 'bg-green-200' : 'bg-red-200'} rounded-lg`}>
            <p className={`text-sm ${isZeroTax ? 'text-green-800' : 'text-red-800'}`}>
              <strong>{isZeroTax ? '🌟' : '⚠️'} Important :</strong> {isZeroTax 
                ? `Les ${selectedCountry?.name} n'imposent pas les revenus des particuliers. Cette situation est avantageuse pour les investisseurs immobiliers.`
                : `Cette estimation est basée sur le système fiscal de ${selectedCountry?.name}. Le montant réel peut varier selon votre situation fiscale globale et les accords de double imposition.`
              }
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaxSummary;
