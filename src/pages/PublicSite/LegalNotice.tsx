
import React from 'react';
import { useTranslation } from 'react-i18next';
import PublicLayout from '@/components/PublicSite/PublicLayout';
import { Scale, Building, Phone, Mail, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const LegalNotice = () => {
  const { t } = useTranslation();

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-blue-100 rounded-full">
                <Scale className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Mentions Légales
            </h1>
            <p className="text-xl text-gray-600">
              Informations légales sur Neo Rent
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Dernière mise à jour : 24 juin 2025
            </p>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Éditeur du site
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Société</h3>
                    <p className="text-gray-700">Neo Rent SAS</p>
                    <p className="text-gray-700">Société par Actions Simplifiée</p>
                    <p className="text-gray-700">Capital social : 10 000 €</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Identification</h3>
                    <p className="text-gray-700">SIRET : 123 456 789 00012</p>
                    <p className="text-gray-700">RCS Paris B 123 456 789</p>
                    <p className="text-gray-700">TVA : FR12345678901</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Coordonnées
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Siège social</h3>
                    <p className="text-gray-700">123 Rue de la Paix</p>
                    <p className="text-gray-700">75001 Paris, France</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Contact</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-700">+33 1 23 45 67 89</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-700">contact@neorent.fr</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-700">www.neorent.fr</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Directeur de publication</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Le directeur de la publication est M. Jean Dupont, Président de Neo Rent SAS.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hébergement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Hébergeur</h3>
                  <p className="text-gray-700">Lovable Platform</p>
                  <p className="text-gray-700">Service d'hébergement web</p>
                  <p className="text-gray-700">www.lovable.dev</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Propriété intellectuelle</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur 
                  et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour 
                  les documents téléchargeables et les représentations iconographiques et photographiques.
                </p>
                <p className="text-gray-700">
                  La reproduction de tout ou partie de ce site sur un support électronique quelconque est 
                  formellement interdite sauf autorisation expresse du directeur de la publication.
                </p>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-yellow-800 text-sm">
                    <strong>Neo Rent®</strong> est une marque déposée de Neo Rent SAS. 
                    Toute utilisation non autorisée de cette marque est interdite.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Responsabilité</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  Les informations contenues sur ce site sont aussi précises que possible et le site est périodiquement 
                  mis à jour, mais peut toutefois contenir des inexactitudes, des omissions ou des lacunes.
                </p>
                <p className="text-gray-700">
                  Si vous constatez une lacune, erreur ou ce qui parait être un dysfonctionnement, merci de bien 
                  vouloir le signaler par email à <strong>contact@neorent.fr</strong> en décrivant le problème 
                  de la manière la plus précise possible.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Liens hypertextes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  Les sites internet peuvent proposer des liens vers d'autres sites internet ou d'autres ressources 
                  disponibles sur Internet. Neo Rent SAS ne dispose d'aucun moyen pour contrôler les sites en 
                  connexion avec ses sites internet.
                </p>
                <p className="text-gray-700">
                  Neo Rent SAS ne répond pas de la disponibilité de tels sites et sources externes, ni ne la garantit. 
                  Elle ne peut être tenue pour responsable de tout dommage, de quelque nature que ce soit, résultant 
                  du contenu de ces sites ou sources externes.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Droit applicable</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Tant le présent site que les modalités et conditions de son utilisation sont régis par le droit 
                  français, quel que soit le lieu d'utilisation. En cas de contestation éventuelle, et après 
                  l'échec de toute tentative de recherche d'une solution amiable, les tribunaux français seront 
                  seuls compétents pour connaître de ce litige.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default LegalNotice;
