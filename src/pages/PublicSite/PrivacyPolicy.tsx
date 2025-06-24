
import React from 'react';
import { useTranslation } from 'react-i18next';
import PublicLayout from '@/components/PublicSite/PublicLayout';
import { Shield, Eye, Lock, Users, Database, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PrivacyPolicy = () => {
  const { t } = useTranslation();

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-green-100 rounded-full">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Politique de Confidentialité
            </h1>
            <p className="text-xl text-gray-600">
              Comment nous protégeons et utilisons vos données personnelles
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Dernière mise à jour : 24 juin 2025 - Conforme au RGPD
            </p>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Introduction
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  Neo Rent SAS s'engage à protéger et respecter votre vie privée. Cette politique explique 
                  quand et pourquoi nous collectons des informations personnelles, comment nous les utilisons, 
                  les conditions dans lesquelles nous pouvons les divulguer à des tiers et comment nous les protégeons.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-800 text-sm">
                    Cette politique est conforme au Règlement Général sur la Protection des Données (RGPD) 
                    et à la loi française Informatique et Libertés.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Données collectées
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Données d'identification</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Nom et prénom</li>
                    <li>Adresse email</li>
                    <li>Numéro de téléphone</li>
                    <li>Adresse postale</li>
                  </ul>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Données de navigation</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Adresse IP</li>
                    <li>Type de navigateur</li>
                    <li>Pages visitées</li>
                    <li>Temps passé sur le site</li>
                  </ul>
                </div>

                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Données professionnelles</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Entreprise</li>
                    <li>Fonction</li>
                    <li>Secteur d'activité</li>
                    <li>Besoins en gestion immobilière</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Finalités du traitement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Gestion des services</h4>
                    <p className="text-gray-600 text-sm">
                      Création et gestion de votre compte, fourniture de nos services de gestion immobilière, 
                      support client et facturation.
                    </p>
                    <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                      Base légale : Exécution du contrat
                    </span>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Communication marketing</h4>
                    <p className="text-gray-600 text-sm">
                      Envoi de newsletters, offres promotionnelles et informations sur nos nouveaux services.
                    </p>
                    <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      Base légale : Consentement
                    </span>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Amélioration des services</h4>
                    <p className="text-gray-600 text-sm">
                      Analyse de l'utilisation de notre plateforme pour améliorer nos services et 
                      développer de nouvelles fonctionnalités.
                    </p>
                    <span className="inline-block mt-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                      Base légale : Intérêt légitime
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Conservation des données
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="font-medium">Données clients actifs</span>
                    <span className="text-gray-600">Durée du contrat + 5 ans</span>
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="font-medium">Données prospects</span>
                    <span className="text-gray-600">3 ans maximum</span>
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="font-medium">Données de navigation</span>
                    <span className="text-gray-600">13 mois</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Données comptables</span>
                    <span className="text-gray-600">10 ans (obligation légale)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Vos droits RGPD</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 mb-4">
                  Vous disposez des droits suivants concernant vos données personnelles :
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="border-l-4 border-blue-500 pl-3">
                      <h4 className="font-semibold text-gray-900">Droit d'accès</h4>
                      <p className="text-sm text-gray-600">Consulter vos données</p>
                    </div>
                    <div className="border-l-4 border-green-500 pl-3">
                      <h4 className="font-semibold text-gray-900">Droit de rectification</h4>
                      <p className="text-sm text-gray-600">Corriger vos données</p>
                    </div>
                    <div className="border-l-4 border-red-500 pl-3">
                      <h4 className="font-semibold text-gray-900">Droit d'effacement</h4>
                      <p className="text-sm text-gray-600">Supprimer vos données</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="border-l-4 border-purple-500 pl-3">
                      <h4 className="font-semibold text-gray-900">Droit à la portabilité</h4>
                      <p className="text-sm text-gray-600">Récupérer vos données</p>
                    </div>
                    <div className="border-l-4 border-yellow-500 pl-3">
                      <h4 className="font-semibold text-gray-900">Droit d'opposition</h4>
                      <p className="text-sm text-gray-600">Refuser un traitement</p>
                    </div>
                    <div className="border-l-4 border-gray-500 pl-3">
                      <h4 className="font-semibold text-gray-900">Droit de limitation</h4>
                      <p className="text-sm text-gray-600">Limiter un traitement</p>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg mt-4">
                  <p className="text-green-800 text-sm">
                    Pour exercer vos droits, contactez-nous à : <strong>privacy@neorent.fr</strong>
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Sécurité des données
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour 
                  protéger vos données personnelles contre :
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>L'accès non autorisé</li>
                  <li>La divulgation accidentelle</li>
                  <li>La modification non autorisée</li>
                  <li>La destruction malveillante</li>
                </ul>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-800 text-sm">
                    <strong>Chiffrement :</strong> Toutes les données sensibles sont chiffrées en transit et au repos.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact et réclamations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Délégué à la Protection des Données</h4>
                    <p className="text-gray-700">Email : dpo@neorent.fr</p>
                    <p className="text-gray-700">Téléphone : +33 1 23 45 67 89</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Autorité de contrôle</h4>
                    <p className="text-gray-700">
                      Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire 
                      une réclamation auprès de la CNIL (Commission Nationale de l'Informatique et des Libertés).
                    </p>
                    <p className="text-gray-700">
                      <strong>CNIL :</strong> 3 Place de Fontenoy, 75007 Paris - www.cnil.fr
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default PrivacyPolicy;
