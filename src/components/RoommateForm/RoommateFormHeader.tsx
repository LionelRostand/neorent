
import React from 'react';
import { useTranslation } from 'react-i18next';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface RoommateFormHeaderProps {
  isInDialog?: boolean;
}

const RoommateFormHeader = ({ isInDialog = true }: RoommateFormHeaderProps) => {
  const { t } = useTranslation();

  if (isInDialog) {
    return (
      <DialogHeader>
        <DialogTitle>{t('forms.addTenant')}</DialogTitle>
      </DialogHeader>
    );
  }

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold">{t('forms.addTenant')}</h2>
    </div>
  );
};

export default RoommateFormHeader;
