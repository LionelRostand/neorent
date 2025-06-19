import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Home, 
  MapPin, 
  Ruler, 
  Bed, 
  Euro,
  Car,
  Wifi,
  Shield,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface PropertyInfoProps {
  propertyData: {
    title: string;
    address: string;
    type: string;
    surface: string;
    rooms: string;
    rent: number;
    charges: number;
    deposit: number;
    furnished: boolean;
    floor: string;
    elevator: boolean;
    parking: boolean;
    features: string[];
  };
}

const PropertyInfo: React.FC<PropertyInfoProps> = ({ propertyData }) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  // Forcer les valeurs financières selon la demande
  const baseRent = 400;
  const monthlyCharges = 50;
  const securityDeposit = baseRent + monthlyCharges; // 450€

  // Function to translate property type
  const translatePropertyType = (type: string) => {
    switch (type.toLowerCase()) {
      case 'chambre en colocation':
        return t('tenantSpace.overview.roomInSharedFlat');
      case 'appartement':
        return t('tenantSpace.overview.apartment');
      case 'studio':
        return t('tenantSpace.overview.studio');
      case 'maison':
        return t('tenantSpace.overview.house');
      default:
        return type;
    }
  };

  // Function to translate room count
  const translateRooms = (rooms: string) => {
    if (rooms.includes('chambre')) {
      const number = rooms.match(/\d+/)?.[0] || '1';
      return `${number} ${number === '1' ? t('tenantSpace.overview.bedroom') : t('tenantSpace.overview.bedroom') + 's'}`;
    }
    return rooms;
  };

  // Function to translate floor
  const translateFloor = (floor: string) => {
    if (floor.includes('3ème')) {
      return t('tenantSpace.overview.ordinalFloor.3');
    } else if (floor.includes('2ème')) {
      return t('tenantSpace.overview.ordinalFloor.2');
    } else if (floor.includes('1er')) {
      return t('tenantSpace.overview.ordinalFloor.1');
    } else if (floor.includes('rez')) {
      return t('tenantSpace.overview.ordinalFloor.ground');
    }
    return floor;
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Informations générales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <Home className="h-4 w-4 md:h-5 md:w-5" />
            {t('tenantSpace.overview.generalInfo')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-base md:text-lg">{propertyData.title}</h3>
                <div className="flex items-start text-gray-600 mt-1">
                  <MapPin className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm md:text-base">{propertyData.address}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs md:text-sm text-gray-600">{t('tenantSpace.overview.type')}</p>
                  <p className="font-medium text-sm md:text-base">{translatePropertyType(propertyData.type)}</p>
                </div>
                <div>
                  <p className="text-xs md:text-sm text-gray-600">{t('tenantSpace.overview.surface')}</p>
                  <div className="flex items-center">
                    <Ruler className="h-4 w-4 mr-2" />
                    <span className="font-medium text-sm md:text-base">{propertyData.surface}</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs md:text-sm text-gray-600">{t('tenantSpace.overview.rooms')}</p>
                  <div className="flex items-center">
                    <Bed className="h-4 w-4 mr-2" />
                    <span className="font-medium text-sm md:text-base">{translateRooms(propertyData.rooms)}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs md:text-sm text-gray-600">{t('tenantSpace.overview.floor')}</p>
                  <p className="font-medium text-sm md:text-base">{translateFloor(propertyData.floor)}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs md:text-sm text-gray-600 mb-2">{t('tenantSpace.overview.equipment')}</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm md:text-base">{t('tenantSpace.overview.furnished')}</span>
                    {propertyData.furnished ? (
                      <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 md:h-5 md:w-5 text-red-500" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm md:text-base">{t('tenantSpace.overview.elevator')}</span>
                    {propertyData.elevator ? (
                      <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 md:h-5 md:w-5 text-red-500" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm md:text-base">{t('tenantSpace.overview.parking')}</span>
                    {propertyData.parking ? (
                      <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 md:h-5 md:w-5 text-red-500" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informations financières */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <Euro className="h-4 w-4 md:h-5 md:w-5" />
            {t('tenantSpace.overview.financialInfo')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="text-center p-3 md:p-4 bg-blue-50 rounded-lg">
              <p className="text-xs md:text-sm text-gray-600">{t('tenantSpace.overview.monthlyRent')}</p>
              <p className="text-xl md:text-2xl font-bold text-blue-600">{baseRent}€</p>
            </div>
            <div className="text-center p-3 md:p-4 bg-orange-50 rounded-lg">
              <p className="text-xs md:text-sm text-gray-600">{t('tenantSpace.overview.monthlyCharges')}</p>
              <p className="text-xl md:text-2xl font-bold text-orange-600">{monthlyCharges}€</p>
            </div>
            <div className="text-center p-3 md:p-4 bg-green-50 rounded-lg">
              <p className="text-xs md:text-sm text-gray-600">{t('tenantSpace.overview.securityDeposit')}</p>
              <p className="text-xl md:text-2xl font-bold text-green-600">{securityDeposit}€</p>
            </div>
          </div>
          
          <div className="mt-4 p-3 md:p-4 bg-gray-50 rounded-lg">
            <p className="text-xs md:text-sm text-gray-600">{t('tenantSpace.overview.totalMonthly')}</p>
            <p className="text-lg md:text-xl font-bold">{baseRent + monthlyCharges}€</p>
          </div>
        </CardContent>
      </Card>

      {/* Caractéristiques */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">{t('tenantSpace.overview.characteristics')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
            {propertyData.features.map((feature, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="justify-center py-2 text-xs md:text-sm"
              >
                {feature}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyInfo;
