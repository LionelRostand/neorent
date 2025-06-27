
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
    <div className="fixed inset-x-0 bottom-0 z-50 p-2 sm:p-4">
      <Card className="max-w-6xl mx-auto bg-white shadow-lg border">
        <CardContent className="p-3 sm:p-4 md:p-6">
          {!showSettings ? (
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="flex items-start gap-2 sm:gap-3">
                <Cookie className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600 flex-shrink-0 mt-0.5 sm:mt-1" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1 sm:mb-2">
                    {t('cookies.title')}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {t('cookies.description')}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSettings(true)}
                  className="text-xs sm:text-sm px-3 py-2 h-auto whitespace-nowrap"
                >
                  <Settings className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  {t('cookies.settings')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={acceptNecessary}
                  className="text-xs sm:text-sm px-3 py-2 h-auto"
                >
                  {t('cookies.necessaryOnly')}
                </Button>
                <Button
                  size="sm"
                  onClick={acceptAll}
                  className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm px-3 py-2 h-auto"
                >
                  {t('cookies.acceptAll')}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                  {t('cookies.settingsTitle')}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(false)}
                  className="p-1 h-auto"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                <div className="border-b pb-2 sm:pb-3">
                  <h4 className="font-medium text-gray-900 text-xs sm:text-sm mb-1">
                    {t('cookies.necessary')}
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {t('cookies.necessaryDescription')}
                  </p>
                </div>
                <div className="border-b pb-2 sm:pb-3">
                  <h4 className="font-medium text-gray-900 text-xs sm:text-sm mb-1">
                    {t('cookies.analytics')}
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {t('cookies.analyticsDescription')}
                  </p>
                </div>
                <div className="border-b pb-2 sm:pb-3">
                  <h4 className="font-medium text-gray-900 text-xs sm:text-sm mb-1">
                    {t('cookies.marketing')}
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {t('cookies.marketingDescription')}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={rejectAll}
                  className="text-xs sm:text-sm px-3 py-2 h-auto"
                >
                  {t('cookies.rejectAll')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={acceptNecessary}
                  className="text-xs sm:text-sm px-3 py-2 h-auto"
                >
                  {t('cookies.necessaryOnly')}
                </Button>
                <Button
                  size="sm"
                  onClick={acceptAll}
                  className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm px-3 py-2 h-auto"
                >
                  {t('cookies.acceptAll')}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
