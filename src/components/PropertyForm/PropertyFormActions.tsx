
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { FormButtonConfig } from '@/hooks/useFormButtonConfig';

interface PropertyFormActionsProps {
  onClose: () => void;
  buttonConfig?: FormButtonConfig;
}

const PropertyFormActions = ({ onClose, buttonConfig }: PropertyFormActionsProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex justify-end space-x-2 pt-4">
      <Button type="button" variant="outline" onClick={onClose}>
        {t('buttons.cancel')}
      </Button>
      <Button 
        type="submit"
        variant={buttonConfig?.variant || 'default'}
        size={buttonConfig?.size || 'default'}
        className={buttonConfig?.className}
      >
        {t('propertyForm.ajouterPropriete')}
      </Button>
    </div>
  );
};

export default PropertyFormActions;
