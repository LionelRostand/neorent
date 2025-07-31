import React from 'react';
import { Building, TrendingUp, TrendingDown, DollarSign, Percent } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PropertyData {
  propertyName: string;
  monthlyRevenue: number;
  monthlyCharges: number;
  monthlyProfit: number;
  profitMargin: number;
  roi: number;
}

interface PropertyProfitabilityProps {
  propertiesData: PropertyData[];
}

const PropertyProfitability: React.FC<PropertyProfitabilityProps> = ({ propertiesData }) => {
  const getProfitabilityBadge = (profitMargin: number) => {
    if (profitMargin >= 30) {
      return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
    } else if (profitMargin >= 20) {
      return <Badge className="bg-blue-100 text-blue-800">Bon</Badge>;
    } else if (profitMargin >= 10) {
      return <Badge className="bg-yellow-100 text-yellow-800">Correct</Badge>;
    } else if (profitMargin >= 0) {
      return <Badge className="bg-orange-100 text-orange-800">Faible</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-800">Déficitaire</Badge>;
    }
  };

  const getROIBadge = (roi: number) => {
    if (roi >= 8) {
      return <Badge variant="default" className="bg-green-600">ROI Élevé</Badge>;
    } else if (roi >= 5) {
      return <Badge variant="secondary">ROI Moyen</Badge>;
    } else if (roi >= 2) {
      return <Badge variant="outline">ROI Faible</Badge>;
    } else {
      return <Badge variant="destructive">ROI Très Faible</Badge>;
    }
  };

  // Trier par profitabilité décroissante
  const sortedProperties = [...propertiesData].sort((a, b) => b.monthlyProfit - a.monthlyProfit);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Rentabilité par Propriété
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedProperties.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Building className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Aucune donnée de propriété disponible</p>
              <p className="text-sm">Ajoutez des paiements et charges pour voir l'analyse</p>
            </div>
          ) : (
            sortedProperties.map((property, index) => (
              <Card key={property.propertyName} className={`border-l-4 ${
                property.monthlyProfit >= 500 ? 'border-l-green-500' :
                property.monthlyProfit >= 200 ? 'border-l-blue-500' :
                property.monthlyProfit >= 0 ? 'border-l-yellow-500' : 'border-l-red-500'
              }`}>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                          {property.propertyName}
                        </h3>
                        {index === 0 && sortedProperties.length > 1 && (
                          <Badge variant="outline" className="text-xs">
                            Plus rentable
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                        <div>
                          <p className="text-gray-600 text-xs">Revenus</p>
                          <p className="font-medium text-blue-600">
                            {property.monthlyRevenue.toLocaleString()}€
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-xs">Charges</p>
                          <p className="font-medium text-red-600">
                            {property.monthlyCharges.toLocaleString()}€
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-xs">Bénéfice</p>
                          <p className={`font-semibold ${property.monthlyProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {property.monthlyProfit >= 0 ? '+' : ''}{property.monthlyProfit.toLocaleString()}€
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-xs">ROI Estimé</p>
                          <p className="font-medium text-purple-600">
                            {property.roi.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:items-end gap-2">
                      {getProfitabilityBadge(property.profitMargin)}
                      {getROIBadge(property.roi)}
                      <div className="text-right">
                        <div className="text-lg font-bold">
                          {property.profitMargin.toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-600">
                          Marge
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Barre de progression pour la rentabilité */}
                  <div className="mt-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-600">Rentabilité</span>
                      <span className="text-xs text-gray-600">
                        {property.monthlyProfit.toLocaleString()}€/mois
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          property.profitMargin >= 30 ? 'bg-green-500' :
                          property.profitMargin >= 20 ? 'bg-blue-500' :
                          property.profitMargin >= 10 ? 'bg-yellow-500' :
                          property.profitMargin >= 0 ? 'bg-orange-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(Math.max(property.profitMargin, 0), 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyProfitability;