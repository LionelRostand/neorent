
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { FormButtonConfig } from '@/hooks/useFormButtonConfig';

interface RoommateFormActionsProps {
  onClose: () => void;
  buttonConfig?: FormButtonConfig;
}

const RoommateFormActions = ({ onClose, buttonConfig }: RoommateFormActionsProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex justify-end space-x-2 pt-4">
      <Button type="button" variant="outline" onClick={onClose}>
        {t('common.cancel')}
      </Button>
      <Button 
        type="submit"
        variant={buttonConfig?.variant || 'default'}
        size={buttonConfig?.size || 'default'}
        className={buttonConfig?.className}
      >
        {t('forms.addTenant')}
      </Button>
    </div>
  );
};

export default RoommateFormActions;
