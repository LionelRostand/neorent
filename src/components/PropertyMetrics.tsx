
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Home, Users, DollarSign } from 'lucide-react';
import { useFirebaseProperties } from '@/hooks/useFirebaseProperties';
import { useFirebaseRoommates } from '@/hooks/useFirebaseRoommates';
import { useFirebaseTenants } from '@/hooks/useFirebaseTenants';

const PropertyMetrics: React.FC = () => {
  const { t } = useTranslation();
  const { properties, loading } = useFirebaseProperties();
  const { roommates } = useFirebaseRoommates();
  const { tenants } = useFirebaseTenants();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('properties.loading')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">{t('properties.loading')}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const totalProperties = properties.length;

  // Calculer le statut réel basé sur les colocataires ET locataires actifs
  const getPropertyStatus = (property: any) => {
    const activeRoommates = roommates.filter(roommate => 
      roommate.property === property.title && roommate.status === 'Actif'
    );
    
    const activeTenants = tenants.filter(tenant =>
      tenant.property === property.title && tenant.status === 'Actif'
    );

    if (property.locationType === 'Colocation') {
      const totalRooms = property.totalRooms || 0;
      const occupiedRooms = activeRoommates.length;
      const availableRooms = Math.max(0, totalRooms - occupiedRooms);
      
      if (availableRooms > 0 && occupiedRooms > 0) {
        return 'Partiellement occupé';
      } else if (occupiedRooms > 0) {
        return 'Complet';
      } else {
        return 'Libre';
      }
    } else {
      // Location classique - vérifier les locataires principaux ET colocataires
      const totalOccupants = activeTenants.length + activeRoommates.length;
      return totalOccupants > 0 ? 'Occupé' : 'Libre';
    }
  };

  // Calculer les propriétés occupées avec le statut réel
  const occupiedProperties = properties.filter(p => {
    const realStatus = getPropertyStatus(p);
    return realStatus === 'Occupé' || realStatus === 'Complet' || realStatus === 'Partiellement occupé';
  }).length;
  
  const availableProperties = totalProperties - occupiedProperties;
  
  // Calculer les revenus réels basés sur les colocataires ET locataires actifs
  const totalRevenue = properties.reduce((sum, p) => {
    const activeRoommates = roommates.filter(roommate => 
      roommate.property === p.title && roommate.status === 'Actif'
    );
    
    const activeTenants = tenants.filter(tenant =>
      tenant.property === p.title && tenant.status === 'Actif'
    );

    if (p.locationType === 'Colocation') {
      // Pour les colocations, calculer le revenu par chambre occupée
      const rentPerRoom = parseFloat((p.creditImmobilier || p.rent || '0').toString().replace(/[^0-9.-]+/g, '')) / (p.totalRooms || 1);
      return sum + (rentPerRoom * activeRoommates.length);
    } else {
      // Pour les locations classiques, prendre le loyer complet si occupé
      const totalOccupants = activeTenants.length + activeRoommates.length;
      if (totalOccupants > 0) {
        const rentValue = p.creditImmobilier || p.rent || '0';
        const numericRent = parseFloat(rentValue.toString().replace(/[^0-9.-]+/g, ''));
        return sum + (isNaN(numericRent) ? 0 : numericRent);
      }
      return sum;
    }
  }, 0);

  // Calculer les statistiques de colocation avec les vraies données
  const colocationProperties = properties.filter(p => p.locationType === 'Colocation');
  const totalColocationRooms = colocationProperties.reduce((sum, p) => sum + (p.totalRooms || 0), 0);
  
  // Compter les chambres réellement occupées par des colocataires actifs
  const occupiedColocationRooms = colocationProperties.reduce((sum, p) => {
    const activeRoommates = roommates.filter(roommate => 
      roommate.property === p.title && roommate.status === 'Actif'
    );
    return sum + activeRoommates.length;
  }, 0);
  
  const availableColocationRooms = totalColocationRooms - occupiedColocationRooms;

  // Calculer le taux d'occupation global
  const occupancyRate = totalProperties > 0 ? Math.round((occupiedProperties / totalProperties) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t('properties.totalProperties')}</CardTitle>
          <Building className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalProperties}</div>
          <p className="text-xs text-muted-foreground">
            {t('properties.metrics.totalDescription', { count: totalProperties })}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t('properties.occupancyRate')}</CardTitle>
          <Home className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{occupancyRate}%</div>
          <p className="text-xs text-muted-foreground">
            {t('properties.metrics.occupancyDescription', { rate: occupancyRate })}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t('properties.colocationRooms')}</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{occupiedColocationRooms}/{totalColocationRooms}</div>
          <p className="text-xs text-muted-foreground">
            {t('properties.metrics.colocationDescription', { occupied: occupiedColocationRooms, total: totalColocationRooms })}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t('properties.monthlyRevenue')}</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{Math.round(totalRevenue).toLocaleString()}€</div>
          <p className="text-xs text-muted-foreground">
            {t('properties.realRevenueReceived')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyMetrics;
