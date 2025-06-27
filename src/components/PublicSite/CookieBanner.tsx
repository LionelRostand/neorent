
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, Cookie, Settings } from 'lucide-react';

export const CookieBanner = () => {
  const { t, i18n } = useTranslation();
  const isEnglish = i18n.language === 'en';
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      setIsVisible(true);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setIsVisible(false);
  };

  const acceptNecessary = () => {
    localStorage.setItem('cookieConsent', 'necessary');
    setIsVisible(false);
  };

  const rejectAll = () => {
    localStorage.setItem('cookieConsent', 'rejected');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <Card className="max-w-4xl mx-auto bg-white shadow-lg border">
        <CardContent className="p-6">
          {!showSettings ? (
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <div className="flex items-start gap-3 flex-1">
                <Cookie className="h-6 w-6 text-orange-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {t('cookies.title', 'Nous utilisons des cookies')}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {t('cookies.description', 'Ce site utilise des cookies pour améliorer votre expérience de navigation, analyser le trafic et personnaliser le contenu. En continuant à naviguer, vous acceptez notre utilisation des cookies.')}
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 lg:flex-shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSettings(true)}
                  className="text-xs"
                >
                  <Settings className="h-3 w-3 mr-1" />
                  {t('cookies.settings', 'Paramètres')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={acceptNecessary}
                  className="text-xs"
                >
                  {t('cookies.necessaryOnly', 'Nécessaires uniquement')}
                </Button>
                <Button
                  size="sm"
                  onClick={acceptAll}
                  className="bg-green-600 hover:bg-green-700 text-xs"
                >
                  {t('cookies.acceptAll', 'Accepter tout')}
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">
                  {t('cookies.settingsTitle', 'Paramètres des cookies')}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div className="border-b pb-3">
                  <h4 className="font-medium text-gray-900 mb-1">
                    {t('cookies.necessary', 'Cookies nécessaires')}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {t('cookies.necessaryDescription', 'Ces cookies sont indispensables au fonctionnement du site web.')}
                  </p>
                </div>
                <div className="border-b pb-3">
                  <h4 className="font-medium text-gray-900 mb-1">
                    {t('cookies.analytics', 'Cookies analytiques')}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {t('cookies.analyticsDescription', 'Ces cookies nous aident à comprendre comment vous utilisez notre site.')}
                  </p>
                </div>
                <div className="border-b pb-3">
                  <h4 className="font-medium text-gray-900 mb-1">
                    {t('cookies.marketing', 'Cookies de marketing')}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {t('cookies.marketingDescription', 'Ces cookies sont utilisés pour personnaliser les publicités.')}
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={rejectAll}
                  className="text-xs"
                >
                  {t('cookies.rejectAll', 'Tout refuser')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={acceptNecessary}
                  className="text-xs"
                >
                  {t('cookies.necessaryOnly', 'Nécessaires uniquement')}
                </Button>
                <Button
                  size="sm"
                  onClick={acceptAll}
                  className="bg-green-600 hover:bg-green-700 text-xs"
                >
                  {t('cookies.acceptAll', 'Accepter tout')}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
