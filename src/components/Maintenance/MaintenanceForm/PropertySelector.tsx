
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from 'react-i18next';

interface Property {
  id: string;
  title: string;
  address: string;
  locationType: string;
  status: string;
}

interface PropertySelectorProps {
  value: string;
  onChange: (value: string) => void;
  properties: Property[];
  loading: boolean;
}

const PropertySelector = ({ value, onChange, properties, loading }: PropertySelectorProps) => {
  const { t } = useTranslation();

  const availableProperties = properties.filter(property => 
    property.locationType === 'Location' || property.locationType === 'Colocation'
  );

  return (
    <div className="space-y-2">
      <Label htmlFor="propertyId">{t('maintenance.propertyField')}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={loading ? t('maintenance.loadingProperties') : t('maintenance.selectProperty')} />
        </SelectTrigger>
        <SelectContent className="bg-white z-50 max-h-60 overflow-y-auto">
          {loading ? (
            <SelectItem value="loading" disabled>{t('maintenance.loadingProperties')}</SelectItem>
          ) : availableProperties.length > 0 ? (
            availableProperties.map((property) => (
              <SelectItem key={property.id} value={property.title} className="hover:bg-gray-100">
                <div className="flex flex-col">
                  <span className="font-medium">{property.title}</span>
                  <span className="text-sm text-gray-500">{property.address} - {property.locationType}</span>
                  <span className="text-xs text-gray-400">Status: {property.status}</span>
                </div>
              </SelectItem>
            ))
          ) : (
            <SelectItem value="no-properties" disabled>{t('maintenance.noPropertiesFound')}</SelectItem>
          )}
        </SelectContent>
      </Select>
      {value && (
        <p className="text-sm text-blue-600">
          {t('maintenance.propertySelected')} {properties.find(p => p.title === value)?.title}
        </p>
      )}
    </div>
  );
};

export default PropertySelector;
