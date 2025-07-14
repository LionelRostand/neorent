
import React from 'react';
import { useTranslation } from 'react-i18next';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface PropertyFormHeaderProps {
  isInDialog?: boolean;
}

const PropertyFormHeader = ({ isInDialog = true }: PropertyFormHeaderProps) => {
  const { t } = useTranslation();

  if (isInDialog) {
    return (
      <DialogHeader>
        <DialogTitle>{t('properties.addProperty')}</DialogTitle>
      </DialogHeader>
    );
  }

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold">{t('properties.addProperty')}</h2>
    </div>
  );
};

export default PropertyFormHeader;
