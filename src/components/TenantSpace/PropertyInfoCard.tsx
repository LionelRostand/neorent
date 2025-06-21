
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Home, MapPin, Ruler, Euro, Shield } from 'lucide-react';

interface PropertyInfoCardProps {
  propertyData: any;
  isRoommate: boolean;
}

const PropertyInfoCard: React.FC<PropertyInfoCardProps> = ({ propertyData, isRoommate }) => {
  const { t } = useTranslation();

  if (!propertyData) {
    return null;
  }

  const propertyType = isRoommate ? 'roomInSharedFlat' : 'apartment';

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Home className="h-5 w-5 text-blue-600" />
          {isRoommate ? t('tenantSpace.overview.myRoom') : t('tenantSpace.overview.myProperty')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Property Title and Address */}
        <div>
          <h3 className="font-semibold text-gray-900">{propertyData.title}</h3>
          <div className="flex items-center gap-2 text-gray-600 mt-1">
            <MapPin className="h-4 w-4" />
            <span>{propertyData.address}</span>
          </div>
        </div>

        {/* Property Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Type */}
          <div className="flex items-center gap-2">
            <Home className="h-4 w-4 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">{t('tenantSpace.overview.type')}</p>
              <p className="font-medium">{t(`tenantSpace.overview.${propertyType}`)}</p>
            </div>
          </div>

          {/* Surface */}
          <div className="flex items-center gap-2">
            <Ruler className="h-4 w-4 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">{t('tenantSpace.overview.surface')}</p>
              <p className="font-medium">{propertyData.surface}</p>
            </div>
          </div>

          {/* Rent */}
          <div className="flex items-center gap-2">
            <Euro className="h-4 w-4 text-green-500" />
            <div>
              <p className="text-sm text-gray-500">{t('tenantSpace.overview.rent')}</p>
              <p className="font-medium text-green-600">{propertyData.rent}€/{t('common.month')}</p>
            </div>
          </div>

          {/* Charges */}
          <div className="flex items-center gap-2">
            <Euro className="h-4 w-4 text-orange-500" />
            <div>
              <p className="text-sm text-gray-500">{t('tenantSpace.overview.charges')}</p>
              <p className="font-medium text-orange-600">{propertyData.charges}€/{t('common.month')}</p>
            </div>
          </div>
        </div>

        {/* Security Deposit */}
        <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
          <Shield className="h-4 w-4 text-purple-500" />
          <div>
            <p className="text-sm text-gray-500">{t('tenantSpace.overview.securityDeposit')}</p>
            <p className="font-medium text-purple-600">{propertyData.deposit}€</p>
          </div>
        </div>

        {/* Equipment */}
        {propertyData.features && propertyData.features.length > 0 && (
          <div>
            <p className="text-sm text-gray-500 mb-2">{t('tenantSpace.overview.equipment')}</p>
            <div className="flex flex-wrap gap-2">
              {propertyData.features.map((feature: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PropertyInfoCard;
