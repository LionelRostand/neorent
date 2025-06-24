
import React from 'react';
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

interface ChargeCardProps {
  charge: ChargeData;
  onDelete: (id: string) => void; // Changed from number to string
}

const ChargeCard: React.FC<ChargeCardProps> = ({ charge, onDelete }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              {charge.propertyName}
            </CardTitle>
            <div className="flex items-center gap-4 mt-2">
              <Badge variant="outline">{charge.propertyType}</Badge>
              <span className="text-sm text-gray-600">Locataire: {charge.tenant}</span>
            </div>
          </div>
          <span className="text-2xl font-bold text-blue-600">{charge.total.toFixed(2)}€</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Électricité</p>
            <p className="font-semibold">{charge.electricity.toFixed(2)}€</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Eau</p>
            <p className="font-semibold">{charge.water.toFixed(2)}€</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Chauffage</p>
            <p className="font-semibold">{charge.heating.toFixed(2)}€</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Entretien</p>
            <p className="font-semibold">{charge.maintenance.toFixed(2)}€</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Assurance</p>
            <p className="font-semibold">{charge.insurance.toFixed(2)}€</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Ordures</p>
            <p className="font-semibold">{charge.garbage.toFixed(2)}€</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Internet</p>
            <p className="font-semibold">{charge.internet.toFixed(2)}€</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChargeCard;
