
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Home, Key, Calendar, MapPin } from 'lucide-react';

interface TenantSpaceHeaderProps {
  currentProfile: {
    name: string;
    roomNumber?: string;
    address?: string;
    leaseStart?: string;
  };
  currentType: string;
}

const TenantSpaceHeader: React.FC<TenantSpaceHeaderProps> = ({
  currentProfile,
  currentType
}) => {
  const { t } = useTranslation();
  
  // Convert French type to English for translation key
  const typeKey = currentType === 'colocataire' ? 'roommate' : 'tenant';
  const translatedType = t(`tenantSpace.${typeKey}`);
  
  // Clean the name by trimming whitespace and removing extra spaces
  const cleanName = currentProfile?.name?.trim().replace(/\s+/g, ' ') || t('common.user');
  const isRoommate = currentType === 'colocataire';

  // For the title, use room number if available, otherwise use English type
  const titleDisplay = currentProfile?.roomNumber 
    ? t('tenantSpace.room', { number: currentProfile.roomNumber })
    : (currentType === 'colocataire' ? 'Roommate' : 'Tenant');

  // For the badge, display room number if available, otherwise use translated type
  const displayType = currentProfile?.roomNumber 
    ? t('tenantSpace.room', { number: currentProfile.roomNumber })
    : translatedType;

  console.log('TenantSpaceHeader render:', {
    currentProfile,
    currentType,
    typeKey,
    translatedType,
    cleanName,
    roomNumber: currentProfile?.roomNumber,
    titleDisplay,
    displayType,
    isRoommate
  });

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm border p-6 sm:p-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-blue-100 rounded-xl">
              {isRoommate ? (
                <Key className="h-6 w-6 text-blue-600" />
              ) : (
                <Home className="h-6 w-6 text-blue-600" />
              )}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                {titleDisplay} Space
              </h1>
              <p className="text-gray-600 mt-1 text-lg">
                Bienvenue {cleanName}
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            {currentProfile?.roomNumber && (
              <div className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                <span>{t('tenantSpace.room', { number: currentProfile.roomNumber })}</span>
              </div>
            )}
            {currentProfile?.address && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="max-w-xs truncate">{currentProfile.address}</span>
              </div>
            )}
            {currentProfile?.leaseStart && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{t('tenantHistory.since')} {new Date(currentProfile.leaseStart).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <Badge 
            variant="secondary" 
            className="bg-green-100 text-green-800 border-green-200 text-sm px-4 py-2 font-medium"
          >
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            {displayType}
          </Badge>
          <Badge 
            variant="outline" 
            className="border-blue-200 text-blue-700 text-sm px-4 py-2"
          >
            {t('common.activeAccount')}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default TenantSpaceHeader;
