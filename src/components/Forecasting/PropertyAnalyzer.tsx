import React, { useState } from 'react';
import { Building, Calculator, TrendingUp, TrendingDown, DollarSign, Percent } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PropertyData {
  propertyName: string;
  monthlyRevenue: number;
  annualRevenue: number;
  monthlyCharges: number;
  annualCharges: number;
  monthlyProfit: number;
  annualProfit: number;
  profitMargin: number;
  roi: number;
}

interface PropertyAnalyzerProps {
  propertiesData: PropertyData[];
}

const PropertyAnalyzer: React.FC<PropertyAnalyzerProps> = ({ propertiesData }) => {
  const [selectedProperty, setSelectedProperty] = useState<string>('');
  
  const selectedPropertyData = propertiesData.find(p => p.propertyName === selectedProperty);

  const getRentabilityStatus = (profitMargin: number, monthlyProfit: number) => {
    if (monthlyProfit > 0 && profitMargin >= 20) {
      return { 
        status: 'Très Rentable', 
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: TrendingUp,
        iconColor: 'text-green-600'
      };
    } else if (monthlyProfit > 0 && profitMargin >= 10) {
      return { 
        status: 'Rentable', 
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: TrendingUp,
        iconColor: 'text-blue-600'
      };
    } else if (monthlyProfit > 0) {
      return { 
        status: 'Peu Rentable', 
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: TrendingUp,
        iconColor: 'text-yellow-600'
      };
    } else {
      return { 
        status: 'Non Rentable', 
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: TrendingDown,
        iconColor: 'text-red-600'
      };
    }
  };

  const getRecommendations = (data: PropertyData) => {
    const recommendations = [];
    
    if (data.monthlyProfit <= 0) {
      recommendations.push("🚨 Cette propriété génère des pertes. Analysez les charges pour les réduire.");
    }
    
    if (data.profitMargin < 10) {
      recommendations.push("📉 Marge bénéficiaire faible. Considérez une augmentation du loyer ou une réduction des charges.");
    }
    
    if (data.roi < 3) {
      recommendations.push("📊 ROI faible. Évaluez si cette propriété mérite d'être conservée dans votre portefeuille.");
    }
    
    if (data.monthlyCharges > data.monthlyRevenue * 0.4) {
      recommendations.push("💰 Les charges représentent plus de 40% des revenus. Optimisez la gestion des coûts.");
    }
    
    if (data.profitMargin >= 30) {
      recommendations.push("✅ Excellente rentabilité ! Cette propriété est un atout majeur de votre portefeuille.");
    }
    
    if (recommendations.length === 0) {
      recommendations.push("✅ Performance correcte. Continuez le suivi régulier des revenus et charges.");
    }
    
    return recommendations;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Analyse de Rentabilité par Propriété
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sélecteur de propriété */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Sélectionnez une propriété à analyser :
          </label>
          <Select value={selectedProperty} onValueChange={setSelectedProperty}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choisir une propriété..." />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
              {propertiesData.map((property) => (
                <SelectItem key={property.propertyName} value={property.propertyName}>
                  {property.propertyName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Analyse détaillée */}
        {selectedPropertyData ? (
          <div className="space-y-6">
            {/* Statut de rentabilité */}
            <div className={`p-4 rounded-lg border-2 ${getRentabilityStatus(selectedPropertyData.profitMargin, selectedPropertyData.monthlyProfit).color}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {React.createElement(getRentabilityStatus(selectedPropertyData.profitMargin, selectedPropertyData.monthlyProfit).icon, {
                    className: `h-6 w-6 ${getRentabilityStatus(selectedPropertyData.profitMargin, selectedPropertyData.monthlyProfit).iconColor}`
                  })}
                  <span className="font-semibold text-lg">
                    {getRentabilityStatus(selectedPropertyData.profitMargin, selectedPropertyData.monthlyProfit).status}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">
                    {selectedPropertyData.profitMargin.toFixed(1)}%
                  </div>
                  <div className="text-sm">Marge</div>
                </div>
              </div>
            </div>

            {/* Métriques financières */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <DollarSign className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                <div className="text-xl font-bold text-blue-600">
                  {selectedPropertyData.monthlyRevenue.toLocaleString()}€
                </div>
                <div className="text-sm text-gray-600">Revenus/mois</div>
              </div>
              
              <div className="bg-red-50 p-4 rounded-lg text-center">
                <DollarSign className="h-6 w-6 mx-auto mb-2 text-red-600" />
                <div className="text-xl font-bold text-red-600">
                  {selectedPropertyData.monthlyCharges.toLocaleString()}€
                </div>
                <div className="text-sm text-gray-600">Charges/mois</div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <TrendingUp className="h-6 w-6 mx-auto mb-2 text-green-600" />
                <div className={`text-xl font-bold ${selectedPropertyData.monthlyProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {selectedPropertyData.monthlyProfit >= 0 ? '+' : ''}{selectedPropertyData.monthlyProfit.toLocaleString()}€
                </div>
                <div className="text-sm text-gray-600">Bénéfice/mois</div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <Percent className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                <div className="text-xl font-bold text-purple-600">
                  {selectedPropertyData.roi.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">ROI estimé</div>
              </div>
            </div>

            {/* Analyse annuelle */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="border-blue-200">
                <CardContent className="p-4 text-center">
                  <div className="text-lg font-semibold text-blue-600">
                    {selectedPropertyData.annualRevenue.toLocaleString()}€
                  </div>
                  <div className="text-sm text-gray-600">Revenus annuels</div>
                </CardContent>
              </Card>
              
              <Card className="border-red-200">
                <CardContent className="p-4 text-center">
                  <div className="text-lg font-semibold text-red-600">
                    {selectedPropertyData.annualCharges.toLocaleString()}€
                  </div>
                  <div className="text-sm text-gray-600">Charges annuelles</div>
                </CardContent>
              </Card>
              
              <Card className="border-green-200">
                <CardContent className="p-4 text-center">
                  <div className={`text-lg font-semibold ${selectedPropertyData.annualProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedPropertyData.annualProfit >= 0 ? '+' : ''}{selectedPropertyData.annualProfit.toLocaleString()}€
                  </div>
                  <div className="text-sm text-gray-600">Bénéfice annuel</div>
                </CardContent>
              </Card>
            </div>

            {/* Barre de progression de rentabilité */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Rentabilité</span>
                <span className="text-sm text-gray-600">
                  {selectedPropertyData.monthlyProfit.toLocaleString()}€/mois
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className={`h-4 rounded-full transition-all duration-500 ${
                    selectedPropertyData.profitMargin >= 30 ? 'bg-green-500' :
                    selectedPropertyData.profitMargin >= 20 ? 'bg-blue-500' :
                    selectedPropertyData.profitMargin >= 10 ? 'bg-yellow-500' :
                    selectedPropertyData.profitMargin >= 0 ? 'bg-orange-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(Math.max(selectedPropertyData.profitMargin, 0), 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Recommandations */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Recommandations :</h4>
              {getRecommendations(selectedPropertyData).map((recommendation, index) => (
                <Alert key={index}>
                  <AlertDescription className="text-sm">
                    {recommendation}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Building className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Sélectionnez une propriété pour voir son analyse de rentabilité détaillée</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PropertyAnalyzer;