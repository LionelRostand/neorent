
import React from 'react';
import { Receipt } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2 } from 'lucide-react';

interface ChargeData {
  id: string; // Changed from number to string for Firebase compatibility
  propertyName: string;
  propertyType: string;
  month: string;
  electricity: number;
  water: number;
  heating: number;
  maintenance: number;
  insurance: number;
  garbage: number;
  internet: number;
  total: number;
  tenant: string;
}

interface AnnualChargesListProps {
  charges: ChargeData[];
  selectedYear: string;
}

const AnnualChargesList: React.FC<AnnualChargesListProps> = ({
  charges,
  selectedYear
}) => {
  // Grouper les charges par propriété
  const chargesByProperty = charges.reduce((acc, charge) => {
    if (!acc[charge.propertyName]) {
      acc[charge.propertyName] = {
        property: charge,
        charges: [],
        total: 0
      };
    }
    acc[charge.propertyName].charges.push(charge);
    acc[charge.propertyName].total += charge.total;
    return acc;
  }, {} as Record<string, { property: ChargeData; charges: ChargeData[]; total: number }>);

  const propertyEntries = Object.values(chargesByProperty);

  return (
    <div className="space-y-4">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
        Charges Annuelles - {selectedYear}
      </h2>
      
      <div className="grid grid-cols-1 gap-6">
        {propertyEntries.map((entry) => (
          <Card key={entry.property.propertyName} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Building2 className="h-4 w-4 sm:h-5 sm:w-5" />
                    {entry.property.propertyName}
                  </CardTitle>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
                    <Badge variant="outline" className="text-xs sm:text-sm w-fit">
                      {entry.property.propertyType}
                    </Badge>
                    <span className="text-xs sm:text-sm text-gray-600">
                      Locataire: {entry.property.tenant}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-600">
                      {entry.charges.length} mois de données
                    </span>
                  </div>
                </div>
                <div className="text-center lg:text-right">
                  <span className="text-2xl sm:text-3xl font-bold text-blue-600">
                    {entry.total.toFixed(2)}€
                  </span>
                  <p className="text-xs sm:text-sm text-gray-600">Total annuel</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
                <div className="text-center p-2 sm:p-0">
                  <p className="text-xs sm:text-sm text-gray-600">Électricité</p>
                  <p className="text-sm sm:text-base font-semibold">
                    {entry.charges.reduce((sum, c) => sum + c.electricity, 0).toFixed(2)}€
                  </p>
                </div>
                <div className="text-center p-2 sm:p-0">
                  <p className="text-xs sm:text-sm text-gray-600">Eau</p>
                  <p className="text-sm sm:text-base font-semibold">
                    {entry.charges.reduce((sum, c) => sum + c.water, 0).toFixed(2)}€
                  </p>
                </div>
                <div className="text-center p-2 sm:p-0">
                  <p className="text-xs sm:text-sm text-gray-600">Chauffage</p>
                  <p className="text-sm sm:text-base font-semibold">
                    {entry.charges.reduce((sum, c) => sum + c.heating, 0).toFixed(2)}€
                  </p>
                </div>
                <div className="text-center p-2 sm:p-0">
                  <p className="text-xs sm:text-sm text-gray-600">Entretien</p>
                  <p className="text-sm sm:text-base font-semibold">
                    {entry.charges.reduce((sum, c) => sum + c.maintenance, 0).toFixed(2)}€
                  </p>
                </div>
                <div className="text-center p-2 sm:p-0">
                  <p className="text-xs sm:text-sm text-gray-600">Assurance</p>
                  <p className="text-sm sm:text-base font-semibold">
                    {entry.charges.reduce((sum, c) => sum + c.insurance, 0).toFixed(2)}€
                  </p>
                </div>
                <div className="text-center p-2 sm:p-0">
                  <p className="text-xs sm:text-sm text-gray-600">Ordures</p>
                  <p className="text-sm sm:text-base font-semibold">
                    {entry.charges.reduce((sum, c) => sum + c.garbage, 0).toFixed(2)}€
                  </p>
                </div>
                <div className="text-center p-2 sm:p-0">
                  <p className="text-xs sm:text-sm text-gray-600">Internet</p>
                  <p className="text-sm sm:text-base font-semibold">
                    {entry.charges.reduce((sum, c) => sum + c.internet, 0).toFixed(2)}€
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {propertyEntries.length === 0 && (
        <div className="text-center py-12">
          <Receipt className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">Aucune charge</h3>
          <p className="mt-2 text-gray-500">
            Aucune charge trouvée pour l'année {selectedYear}.
          </p>
        </div>
      )}
    </div>
  );
};

export default AnnualChargesList;
