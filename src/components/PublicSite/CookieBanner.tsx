
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Cookie, Settings } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface CookieBannerProps {
  onAccept?: () => void;
  onDecline?: () => void;
  onPreferences?: () => void;
}

export const CookieBanner = ({ 
  onAccept, 
  onDecline, 
  onPreferences 
}: CookieBannerProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà fait un choix
    const cookieChoice = localStorage.getItem('cookie-consent');
    if (!cookieChoice) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
    if (onAccept) onAccept();
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
    if (onDecline) onDecline();
  };

  const handlePreferences = () => {
    setShowPreferences(true);
    if (onPreferences) onPreferences();
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Bannière principale */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
        <Card className="mx-auto max-w-6xl shadow-lg border-2">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-start gap-3 flex-1">
                <Cookie className="h-6 w-6 text-orange-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Nous utilisons des cookies
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Ce site utilise des cookies pour améliorer votre expérience de navigation. 
                    En continuant à utiliser ce site, vous acceptez notre utilisation des cookies.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handlePreferences}
                  className="flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Préférences
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleDecline}
                >
                  Refuser
                </Button>
                <Button 
                  size="sm"
                  onClick={handleAccept}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Accepter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal des préférences */}
      {showPreferences && (
        <div className="fixed inset-0 z-[60] bg-black bg-opacity-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Cookie className="h-5 w-5" />
                  Préférences de cookies
                </h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowPreferences(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4 mb-6">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Cookies essentiels</h3>
                      <p className="text-sm text-gray-600">
                        Nécessaires au fonctionnement du site. Ne peuvent pas être désactivés.
                      </p>
                    </div>
                    <div className="text-green-600 text-sm font-medium">Toujours actifs</div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Cookies analytiques</h3>
                      <p className="text-sm text-gray-600">
                        Nous permettent d'analyser l'utilisation du site pour l'améliorer.
                      </p>
                    </div>
                    <input type="checkbox" className="h-4 w-4" defaultChecked />
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Cookies marketing</h3>
                      <p className="text-sm text-gray-600">
                        Utilisés pour vous proposer des publicités pertinentes.
                      </p>
                    </div>
                    <input type="checkbox" className="h-4 w-4" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  variant="outline" 
                  onClick={handleDecline}
                  className="flex-1"
                >
                  Refuser tout
                </Button>
                <Button 
                  onClick={handleAccept}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Accepter la sélection
                </Button>
              </div>

              <div className="mt-4 text-center">
                <a 
                  href="/politique-cookies" 
                  className="text-sm text-blue-600 hover:underline"
                >
                  Consulter notre politique de cookies
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};
