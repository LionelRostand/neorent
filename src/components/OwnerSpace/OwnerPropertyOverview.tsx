
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building, MapPin, Users, Eye } from 'lucide-react';

interface OwnerPropertyOverviewProps {
  ownerProfile: any;
}

const OwnerPropertyOverview: React.FC<OwnerPropertyOverviewProps> = ({ ownerProfile }) => {
  const { t } = useTranslation();

  const properties = [
    {
      id: 1,
      name: 'Résidence Les Jardins',
      address: '123 Rue de la Paix, 75001 Paris',
      type: 'Appartement',
      units: 12,
      occupied: 11,
      status: 'Actif',
      statusColor: 'bg-green-100 text-green-800'
    },
    {
      id: 2,
      name: 'Villa Montmartre',
      address: '45 Avenue Victor Hugo, 75016 Paris',
      type: 'Maison',
      units: 1,
      occupied: 1,
      status: 'Actif',
      statusColor: 'bg-green-100 text-green-800'
    },
    {
      id: 3,
      name: 'Studio Centre Ville',
      address: '67 Boulevard Saint-Germain, 75005 Paris',
      type: 'Studio',
      units: 4,
      occupied: 3,
      status: 'Maintenance',
      statusColor: 'bg-yellow-100 text-yellow-800'
    }
  ];

  const getOccupancyRate = (occupied: number, total: number) => {
    return Math.round((occupied / total) * 100);
  };

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
        {properties.map((property) => (
          <Card key={property.id} className="border border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">{property.name}</h3>
                  <div className="flex items-center text-gray-500 text-xs mb-2">
                    <MapPin className="h-3 w-3 mr-1" />
                    {property.address}
                  </div>
                  <Badge variant="secondary" className="text-xs px-2 py-1">
                    {property.type}
                  </Badge>
                </div>
                <Badge className={`${property.statusColor} text-xs px-2 py-1`}>
                  {property.status === 'Actif' ? t('ownerSpace.propertyOverview.status.active') : t('ownerSpace.propertyOverview.status.maintenance')}
                </Badge>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center text-gray-600">
                    <Users className="h-3 w-3 mr-1" />
                    {t('ownerSpace.propertyOverview.occupation')}
                  </div>
                  <span className="font-medium">
                    {property.occupied}/{property.units} ({getOccupancyRate(property.occupied, property.units)}%)
                  </span>
                </div>
              </div>

              <Button variant="ghost" size="sm" className="w-full text-xs h-8">
                <Eye className="h-3 w-3 mr-1" />
                {t('ownerSpace.propertyOverview.viewDetails')}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OwnerPropertyOverview;
