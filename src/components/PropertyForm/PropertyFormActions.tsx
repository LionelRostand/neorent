
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

interface PropertyFormActionsProps {
  onClose: () => void;
}

const PropertyFormActions = ({ onClose }: PropertyFormActionsProps) => {
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
      <Button type="submit">
        {getLocalizedText('addProperty')}
      </Button>
    </div>
  );
};

export default PropertyFormActions;
