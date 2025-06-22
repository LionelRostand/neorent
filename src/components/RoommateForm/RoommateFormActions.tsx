
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

interface RoommateFormActionsProps {
  onClose: () => void;
}

const RoommateFormActions = ({ onClose }: RoommateFormActionsProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex justify-end space-x-2 pt-4">
      <Button type="button" variant="outline" onClick={onClose}>
        {t('common.cancel')}
      </Button>
      <Button type="submit">
        {t('forms.addTenant')}
      </Button>
    </div>
  );
};

export default RoommateFormActions;
