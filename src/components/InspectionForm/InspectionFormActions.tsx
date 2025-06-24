
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { FormButtonConfig } from '@/hooks/useFormButtonConfig';

interface InspectionFormActionsProps {
  onClose: () => void;
  buttonConfig?: FormButtonConfig;
}

const InspectionFormActions = ({ onClose, buttonConfig }: InspectionFormActionsProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex justify-end space-x-3 pt-4">
      <Button type="button" variant="outline" onClick={onClose}>
        {t('inspections.cancel')}
      </Button>
      <Button 
        type="submit" 
        variant={buttonConfig?.variant || 'default'}
        size={buttonConfig?.size || 'default'}
        className={buttonConfig?.className || "bg-blue-600 hover:bg-blue-700"}
      >
        {t('inspections.createInspection')}
      </Button>
    </div>
  );
};

export default InspectionFormActions;
