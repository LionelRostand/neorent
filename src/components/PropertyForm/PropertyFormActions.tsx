
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { FormButtonConfig } from '@/hooks/useFormButtonConfig';

interface PropertyFormActionsProps {
  onClose: () => void;
  buttonConfig?: FormButtonConfig;
}

const PropertyFormActions = ({ onClose, buttonConfig }: PropertyFormActionsProps) => {
  const { i18n } = useTranslation();

  // Get texts based on current language
  const getLocalizedText = (key: string) => {
    const currentLang = i18n.language;
    
    const texts: Record<string, Record<string, string>> = {
      cancel: {
        fr: 'Annuler',
        en: 'Cancel'
      },
      addProperty: {
        fr: 'Ajouter propriété',
        en: 'Add Property'
      }
    };

    return texts[key]?.[currentLang] || texts[key]?.['fr'] || key;
  };

  return (
    <div className="flex justify-end space-x-2 pt-4">
      <Button type="button" variant="outline" onClick={onClose}>
        {getLocalizedText('cancel')}
      </Button>
      <Button 
        type="submit"
        variant={buttonConfig?.variant || 'default'}
        size={buttonConfig?.size || 'default'}
        className={buttonConfig?.className}
      >
        {getLocalizedText('addProperty')}
      </Button>
    </div>
  );
};

export default PropertyFormActions;
