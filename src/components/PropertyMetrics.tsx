
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Home, Users, DollarSign } from 'lucide-react';

interface Property {
  id: string; // Changed from number to string for Firebase compatibility
  title: string;
  address: string;
  type: string;
  surface: string;
  rent: string;
  status: string;
  tenant: string | null;
  image: string;
  locationType: string;
  totalRooms?: number | null;
  availableRooms?: number | null;
}

interface PropertyMetricsProps {
  properties: Property[];
}

const PropertyMetrics: React.FC<PropertyMetricsProps> = ({ properties }) => {
  const totalProperties = properties.length;
  const occupiedProperties = properties.filter(p => p.status === 'Occupé').length;
  const availableProperties = totalProperties - occupiedProperties;
  const totalRevenue = properties
    .filter(p => p.status === 'Occupé')
    .reduce((sum, p) => sum + parseFloat(p.rent.replace(/[^0-9.-]+/g, '')), 0);

  // Calculate colocation rooms
  const colocationProperties = properties.filter(p => p.locationType === 'Colocation');
  const totalColocationRooms = colocationProperties.reduce((sum, p) => sum + (p.totalRooms || 0), 0);
  const availableColocationRooms = colocationProperties.reduce((sum, p) => sum + (p.availableRooms || 0), 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total des Biens</CardTitle>
          <Building className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalProperties}</div>
          <p className="text-xs text-muted-foreground">
            {occupiedProperties} occupés, {availableProperties} libres
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Taux d'Occupation</CardTitle>
          <Home className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalProperties > 0 ? Math.round((occupiedProperties / totalProperties) * 100) : 0}%
          </div>
          <p className="text-xs text-muted-foreground">
            {occupiedProperties}/{totalProperties} biens occupés
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Chambres Colocation</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalColocationRooms - availableColocationRooms}/{totalColocationRooms}</div>
          <p className="text-xs text-muted-foreground">
            {availableColocationRooms} chambres disponibles
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Revenus Mensuels</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalRevenue.toLocaleString()}€</div>
          <p className="text-xs text-muted-foreground">
            Revenus des biens occupés
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyMetrics;
