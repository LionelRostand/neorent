
import React from 'react';
import { useTranslation } from 'react-i18next';
import PublicLayout from '@/components/PublicSite/PublicLayout';
import { Cookie, Shield, Eye, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CookiePolicy = () => {
  const { t } = useTranslation();

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-orange-100 rounded-full">
                <Cookie className="h-8 w-8 text-orange-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Politique de Cookies
            </h1>
            <p className="text-xl text-gray-600">
              Comment nous utilisons les cookies sur Neo Rent
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Dernière mise à jour : 24 juin 2025
            </p>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cookie className="h-5 w-5" />
                  Qu'est-ce qu'un cookie ?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  Un cookie est un petit fichier texte stocké sur votre appareil (ordinateur, smartphone, tablette) 
                  lorsque vous visitez notre site web. Les cookies nous permettent de reconnaître votre navigateur 
                  et de mémoriser certaines informations.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Types de cookies utilisés
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Cookies essentiels</h3>
                  <p className="text-gray-700 mb-2">
                    Ces cookies sont nécessaires au fonctionnement de notre site web. Ils ne peuvent pas être désactivés.
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Gestion des sessions utilisateur</li>
                    <li>Préférences de sécurité</li>
                    <li>Fonctionnalités de base du site</li>
                  </ul>
                </div>

                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Cookies analytiques</h3>
                  <p className="text-gray-700 mb-2">
                    Ces cookies nous aident à comprendre comment les visiteurs utilisent notre site.
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Statistiques de visite</li>
                    <li>Pages les plus consultées</li>
                    <li>Amélioration de l'expérience utilisateur</li>
                  </ul>
                </div>

                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Cookies marketing</h3>
                  <p className="text-gray-700 mb-2">
                    Ces cookies sont utilisés pour personnaliser les publicités et mesurer leur efficacité.
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Publicités ciblées</li>
                    <li>Mesure des campagnes</li>
                    <li>Réseaux sociaux</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Gestion de vos préférences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  Vous pouvez à tout moment modifier vos préférences de cookies :
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Via la bannière de cookies lors de votre première visite</li>
                  <li>En utilisant les paramètres de votre navigateur</li>
                  <li>En nous contactant directement</li>
                </ul>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-800 text-sm">
                    <strong>Note :</strong> La désactivation de certains cookies peut affecter 
                    le fonctionnement optimal de notre site web.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Durée de conservation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="font-medium">Cookies de session</span>
                    <span className="text-gray-600">Supprimés à la fermeture du navigateur</span>
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="font-medium">Cookies persistants</span>
                    <span className="text-gray-600">Maximum 24 mois</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Cookies analytiques</span>
                    <span className="text-gray-600">13 mois</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  Pour toute question concernant notre politique de cookies, vous pouvez nous contacter :
                </p>
                <div className="space-y-2 text-gray-600">
                  <p><strong>Email :</strong> privacy@neorent.fr</p>
                  <p><strong>Adresse :</strong> 123 Rue de la Paix, 75001 Paris, France</p>
                  <p><strong>Téléphone :</strong> +33 1 23 45 67 89</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default CookiePolicy;
