
import React from 'react';
import { useTranslation } from 'react-i18next';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface InspectionFormHeaderProps {
  isInDialog?: boolean;
}

const InspectionFormHeader = ({ isInDialog = true }: InspectionFormHeaderProps) => {
  const { t } = useTranslation();

  if (isInDialog) {
    return (
      <DialogHeader>
        <DialogTitle>{t('inspections.newInspection')}</DialogTitle>
      </DialogHeader>
    );
  }

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold">{t('inspections.newInspection')}</h2>
    </div>
  );
};

export default InspectionFormHeader;
