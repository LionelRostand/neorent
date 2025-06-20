
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Building2 } from 'lucide-react';

interface Tenant {
  id: string;
  name: string;
  type: string;
  property: string;
  rentAmount: number;
}

interface PropertyInfoDisplayProps {
  tenantData: Tenant;
}

const PropertyInfoDisplay: React.FC<PropertyInfoDisplayProps> = ({ tenantData }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-blue-50 p-3 sm:p-4 lg:p-5 rounded-lg border border-blue-200">
      <h4 className="font-semibold text-blue-800 mb-2 sm:mb-3 text-sm sm:text-base flex items-center gap-2">
        <Building2 className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
        <span className="truncate">Informations du bien</span>
      </h4>
      <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
          <span className="text-blue-700 font-medium">Type:</span>
          <span className="text-blue-900 font-medium break-words">{tenantData.type}</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
          <span className="text-blue-700 font-medium">Bien:</span>
          <span className="text-blue-900 font-medium break-words sm:text-right">{tenantData.property}</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
          <span className="text-blue-700 font-medium">Loyer attendu:</span>
          <span className="text-green-600 font-bold text-sm sm:text-base">{tenantData.rentAmount}€</span>
        </div>
      </div>
    </div>
  );
};

export default PropertyInfoDisplay;
