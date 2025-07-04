
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();

  // Application uniquement en français
  const currentLanguage = { code: 'fr', name: 'Français', flag: '🇫🇷' };

  // S'assurer que la langue est bien définie sur le français
  useEffect(() => {
    if (i18n.language !== 'fr') {
      console.log('Définition de la langue sur le français');
      i18n.changeLanguage('fr');
      localStorage.setItem('preferredLanguage', 'fr');
    }
  }, [i18n]);

  return (
    <Button variant="ghost" size="sm" className="flex items-center gap-2" disabled>
      <Globe className="h-4 w-4" />
      <span className="hidden sm:inline">{currentLanguage.flag} {currentLanguage.name}</span>
      <span className="sm:hidden">{currentLanguage.flag}</span>
    </Button>
  );
};

export default LanguageSelector;
