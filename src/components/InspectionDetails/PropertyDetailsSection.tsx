
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, User, MapPin } from 'lucide-react';

interface PropertyDetailsSectionProps {
  inspection: {
    property: string;
    tenant: string;
    roomNumber?: string;
    contractType?: string;
  };
}

const PropertyDetailsSection = ({ inspection }: PropertyDetailsSectionProps) => {
  const { t } = useTranslation();
  
  const isColocatif = inspection.contractType === 'Bail colocatif' || (inspection.tenant && inspection.tenant.includes('Colocataire'));

  return (
    <Card>
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Building2 className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
          <span className="truncate">{t('inspections.propertyDetails')}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 pt-0">
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-start text-gray-600 text-sm sm:text-base">
            <Building2 className="mr-2 sm:mr-3 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <span className="font-medium">{t('inspections.property')}: </span>
              <span className="break-words">{inspection.property}</span>
            </div>
          </div>
          
          <div className="flex items-start text-gray-600 text-sm sm:text-base">
            <User className="mr-2 sm:mr-3 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <span className="font-medium">
                {isColocatif ? `${t('inspections.roommate')}: ` : `${t('inspections.tenant')}: `}
              </span>
              <span className="break-words">{inspection.tenant}</span>
            </div>
          </div>

          {isColocatif && inspection.roomNumber && (
            <div className="flex items-start text-gray-600 text-sm sm:text-base">
              <MapPin className="mr-2 sm:mr-3 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <span className="font-medium">{t('inspections.room')}: </span>
                <span className="break-words">{inspection.roomNumber}</span>
              </div>
            </div>
          )}

          <div className="bg-gray-50 p-3 sm:p-4 rounded-md">
            <p className="text-xs sm:text-sm text-gray-600 break-words">
              <span className="font-medium">{t('inspections.contractType')}: </span>
              {isColocatif ? t('inspections.colocationLease') : t('inspections.rentalLease')}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyDetailsSection;
