
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  // Fonction pour changer la langue
  const changeLanguage = async (languageCode: string) => {
    try {
      await i18n.changeLanguage(languageCode);
      localStorage.setItem('preferredLanguage', languageCode);
      console.log('Language changed to:', languageCode);
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  // S'assurer que la langue est bien chargée au démarrage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage && savedLanguage !== i18n.language) {
      console.log('Loading saved language:', savedLanguage);
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{currentLanguage.flag} {currentLanguage.name}</span>
          <span className="sm:hidden">{currentLanguage.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            className={i18n.language === language.code ? 'bg-gray-100' : ''}
          >
            <span className="mr-2">{language.flag}</span>
            {language.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
