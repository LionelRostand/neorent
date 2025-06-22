
import React from 'react';
import { useTranslation } from 'react-i18next';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';

const RoommateFormHeader = () => {
  const { t } = useTranslation();

  return (
    <DialogHeader>
      <DialogTitle>{t('forms.addTenant')}</DialogTitle>
    </DialogHeader>
  );
};

export default RoommateFormHeader;
