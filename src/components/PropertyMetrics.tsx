
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Home, Users, DollarSign } from 'lucide-react';
import { useFirebaseProperties } from '@/hooks/useFirebaseProperties';

const PropertyMetrics: React.FC = () => {
  const { properties, loading } = useFirebaseProperties();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chargement...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">Chargement...</p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const totalProperties = properties.length;
  const occupiedProperties = properties.filter(p => p.status === 'Occupé').length;
  const availableProperties = totalProperties - occupiedProperties;
  
  // Calculer les revenus à partir des biens occupés
  const totalRevenue = properties
    .filter(p => p.status === 'Occupé')
    .reduce((sum, p) => {
      const rentValue = p.creditImmobilier || p.rent || '0';
      const numericRent = parseFloat(rentValue.toString().replace(/[^0-9.-]+/g, ''));
      return sum + (isNaN(numericRent) ? 0 : numericRent);
    }, 0);

  // Calculer les statistiques de colocation
  const colocationProperties = properties.filter(p => p.locationType === 'Colocation');
  const totalColocationRooms = colocationProperties.reduce((sum, p) => sum + (p.totalRooms || 0), 0);
  const availableColocationRooms = colocationProperties.reduce((sum, p) => sum + (p.availableRooms || 0), 0);
  const occupiedColocationRooms = totalColocationRooms - availableColocationRooms;

  // Calculer le taux d'occupation
  const occupancyRate = totalProperties > 0 ? Math.round((occupiedProperties / totalProperties) * 100) : 0;

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
          <div className="text-2xl font-bold">{occupancyRate}%</div>
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
          <div className="text-2xl font-bold">{occupiedColocationRooms}/{totalColocationRooms}</div>
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
