
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, TrendingUp, TrendingDown, Users } from 'lucide-react';

interface PropertyProfitabilitySectionProps {
  totalRevenue: number;
  totalCharges: number;
  profit: number;
  occupancyRate: number;
  occupantsCount: number;
}

const PropertyProfitabilitySection: React.FC<PropertyProfitabilitySectionProps> = ({
  totalRevenue,
  totalCharges,
  profit,
  occupancyRate,
  occupantsCount
}) => {
  const formatNumber = (value: number) => {
    return isNaN(value) ? '0' : value.toFixed(0);
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Rentabilité du bien</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <div className="font-medium text-green-600">Revenus</div>
            <div className="text-xl font-bold">{formatNumber(totalRevenue)}€</div>
            <div className="text-sm text-gray-600">Ce mois</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="h-8 w-8 mx-auto mb-2 text-red-600" />
            <div className="font-medium text-red-600">Charges</div>
            <div className="text-xl font-bold">{formatNumber(totalCharges)}€</div>
            <div className="text-sm text-gray-600">Ce mois</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            {profit >= 0 ? (
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-600" />
            ) : (
              <TrendingDown className="h-8 w-8 mx-auto mb-2 text-red-600" />
            )}
            <div className={`font-medium ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {profit >= 0 ? 'Bénéfice' : 'Perte'}
            </div>
            <div className={`text-xl font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatNumber(Math.abs(profit))}€
            </div>
            <div className="text-sm text-gray-600">Ce mois</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <div className="font-medium text-blue-600">Taux d'Occupation</div>
            <div className="text-xl font-bold">{occupancyRate}%</div>
            <div className="text-sm text-gray-600">
              {occupantsCount} occupant(s)
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PropertyProfitabilitySection;
