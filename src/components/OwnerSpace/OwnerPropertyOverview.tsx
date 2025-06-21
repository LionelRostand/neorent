
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building, MapPin, Users, Eye } from 'lucide-react';
import { useFirebaseProperties } from '@/hooks/useFirebaseProperties';
import { useFirebaseRoommates } from '@/hooks/useFirebaseRoommates';

interface OwnerPropertyOverviewProps {
  ownerProfile: any;
}

const OwnerPropertyOverview: React.FC<OwnerPropertyOverviewProps> = ({ ownerProfile }) => {
  const { t } = useTranslation();
  const { properties, loading } = useFirebaseProperties();
  const { roommates } = useFirebaseRoommates();

  // Filtrer les propriétés selon le propriétaire connecté
  const ownerProperties = properties.filter(property => 
    property.owner === ownerProfile?.name || property.owner === ownerProfile?.email
  );

  const getOccupancyRate = (occupied: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((occupied / total) * 100);
  };

  const getRealStatus = (property: any) => {
    const activeRoommates = roommates.filter(roommate => 
      roommate.property === property.title && roommate.status === 'Actif'
    );

    if (property.locationType === 'Colocation') {
      const totalRooms = property.totalRooms || 0;
      const occupiedRooms = activeRoommates.length;
      
      if (occupiedRooms === 0) {
        return {
          status: t('ownerSpace.propertyOverview.status.vacant'),
          color: 'bg-gray-100 text-gray-800'
        };
      } else if (occupiedRooms < totalRooms) {
        return {
          status: t('ownerSpace.propertyOverview.status.partiallyOccupied'),
          color: 'bg-yellow-100 text-yellow-800'
        };
      } else {
        return {
          status: t('ownerSpace.propertyOverview.status.active'),
          color: 'bg-green-100 text-green-800'
        };
      }
    } else {
      return activeRoommates.length > 0 
        ? {
            status: t('ownerSpace.propertyOverview.status.active'),
            color: 'bg-green-100 text-green-800'
          }
        : {
            status: t('ownerSpace.propertyOverview.status.vacant'),
            color: 'bg-gray-100 text-gray-800'
          };
    }
  };

  const getOccupancyInfo = (property: any) => {
    if (property.locationType === 'Colocation') {
      const activeRoommates = roommates.filter(roommate => 
        roommate.property === property.title && roommate.status === 'Actif'
      );
      const totalRooms = property.totalRooms || 0;
      const occupiedRooms = activeRoommates.length;
      return {
        occupied: occupiedRooms,
        total: totalRooms
      };
    } else {
      const isOccupied = roommates.some(roommate => 
        roommate.property === property.title && roommate.status === 'Actif'
      );
      return {
        occupied: isOccupied ? 1 : 0,
        total: 1
      };
    }
  };

  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Building className="h-5 w-5" />
            {t('ownerSpace.propertyOverview.title')}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border border-gray-200 animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (ownerProperties.length === 0) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Building className="h-5 w-5" />
            {t('ownerSpace.propertyOverview.title')}
          </h2>
        </div>
        <Card className="border border-gray-200">
          <CardContent className="p-8 text-center">
            <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">{t('ownerSpace.propertyOverview.noProperties')}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Building className="h-5 w-5" />
          {t('ownerSpace.propertyOverview.title')}
        </h2>
        <Button variant="outline" size="sm">
          {t('ownerSpace.propertyOverview.viewAll')}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ownerProperties.map((property) => {
          const statusInfo = getRealStatus(property);
          const occupancyInfo = getOccupancyInfo(property);
          
          return (
            <Card key={property.id} className="border border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">{property.title}</h3>
                    <div className="flex items-center text-gray-500 text-xs mb-2">
                      <MapPin className="h-3 w-3 mr-1" />
                      {property.address}
                    </div>
                    <Badge variant="secondary" className="text-xs px-2 py-1">
                      {property.type}
                    </Badge>
                  </div>
                  <Badge className={`${statusInfo.color} text-xs px-2 py-1`}>
                    {statusInfo.status}
                  </Badge>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center text-gray-600">
                      <Users className="h-3 w-3 mr-1" />
                      {t('ownerSpace.propertyOverview.occupation')}
                    </div>
                    <span className="font-medium">
                      {occupancyInfo.occupied}/{occupancyInfo.total} ({getOccupancyRate(occupancyInfo.occupied, occupancyInfo.total)}%)
                    </span>
                  </div>
                </div>

                <Button variant="ghost" size="sm" className="w-full text-xs h-8">
                  <Eye className="h-3 w-3 mr-1" />
                  {t('ownerSpace.propertyOverview.viewDetails')}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default OwnerPropertyOverview;
