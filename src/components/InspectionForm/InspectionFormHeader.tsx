
import React from 'react';
import { useTranslation } from 'react-i18next';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';

const InspectionFormHeader = () => {
  const { t } = useTranslation();
  
  return (
    <DialogHeader>
      <DialogTitle className="text-xl font-bold">{t('inspections.newInspection')}</DialogTitle>
    </DialogHeader>
  );
};

export default InspectionFormHeader;
