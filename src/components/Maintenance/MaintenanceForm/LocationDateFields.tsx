
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';

interface LocationDateFieldsProps {
  location: string;
  requestDate: string;
  onLocationChange: (value: string) => void;
  onRequestDateChange: (value: string) => void;
}

const LocationDateFields = ({ location, requestDate, onLocationChange, onRequestDateChange }: LocationDateFieldsProps) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="location">{t('maintenance.locationField')}</Label>
        <Input
          id="location"
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
          placeholder={t('maintenance.locationPlaceholder')}
          className="w-full"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="requestDate">{t('maintenance.requestDateField')}</Label>
        <Input
          id="requestDate"
          type="date"
          value={requestDate}
          onChange={(e) => onRequestDateChange(e.target.value)}
          className="w-full"
          required
        />
      </div>
    </>
  );
};

export default LocationDateFields;
