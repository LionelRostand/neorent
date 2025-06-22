
import React from 'react';
import { useTranslation } from 'react-i18next';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';

const PropertyFormHeader = () => {
  const { t } = useTranslation();

  return (
    <DialogHeader>
      <DialogTitle>{t('properties.addProperty')}</DialogTitle>
    </DialogHeader>
  );
};

export default PropertyFormHeader;
