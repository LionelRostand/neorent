
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';

interface TenantSpaceHeaderProps {
  currentProfile: {
    name: string;
    roomNumber?: string;
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
  
  // Clean the name by trimming whitespace
  const cleanName = currentProfile?.name?.trim() || 'Utilisateur';

  console.log('TenantSpaceHeader render:', {
    currentProfile,
    currentType,
    typeKey,
    translatedType,
    cleanName,
    roomNumber: currentProfile?.roomNumber
  });

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
            {t('tenantSpace.title', { type: translatedType })}
          </h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base break-words">
            {t('tenantSpace.welcome', { name: cleanName })}
          </p>
          {currentType === 'colocataire' && currentProfile?.roomNumber && (
            <p className="text-gray-500 mt-1 text-sm">
              {t('tenantSpace.room', { number: currentProfile.roomNumber })}
            </p>
          )}
        </div>
        <Badge 
          variant="secondary" 
          className="bg-green-100 text-green-800 border-green-200 text-xs sm:text-sm flex-shrink-0"
        >
          {translatedType}
        </Badge>
      </div>
    </div>
  );
};

export default TenantSpaceHeader;
