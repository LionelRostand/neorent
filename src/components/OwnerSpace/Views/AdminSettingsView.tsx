
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Settings, User, Shield, Database, Mail, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AdminSettingsViewProps {
  currentProfile: any;
}

const AdminSettingsView: React.FC<AdminSettingsViewProps> = ({ currentProfile }) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-3 md:p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Paramètres</h1>
          <p className="text-gray-600">Gérez les paramètres de votre application</p>
        </div>

        <div className="space-y-6">
          {/* Compte utilisateur */}
          <Card className="shadow-sm border-0 bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-lg">
                <User className="h-5 w-5 text-gray-700" />
                Compte utilisateur
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-2 block">
                    Nom
                  </Label>
                  <Input 
                    id="name" 
                    defaultValue={currentProfile?.email || 'test@yahoo.com'}
                    className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 block">
                    E-mail
                  </Label>
                  <Input 
                    id="email" 
                    type="email" 
                    defaultValue={currentProfile?.email || 'test@yahoo.com'}
                    className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-2 block">
                    Téléphone
                  </Label>
                  <Input 
                    id="phone" 
                    defaultValue={currentProfile?.phone || ''}
                    placeholder=""
                    className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                <div className="pt-2">
                  <Button 
                    className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-2.5 rounded-md font-medium"
                  >
                    Enregistrer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sécurité */}
          <Card className="shadow-sm border-0 bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-lg">
                <Shield className="h-5 w-5 text-gray-700" />
                Sécurité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="current-password" className="text-sm font-medium text-gray-700 mb-2 block">
                    Mot de passe actuel
                  </Label>
                  <Input 
                    id="current-password" 
                    type="password" 
                    className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <Label htmlFor="new-password" className="text-sm font-medium text-gray-700 mb-2 block">
                    Nouveau mot de passe
                  </Label>
                  <Input 
                    id="new-password" 
                    type="password" 
                    className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <Label htmlFor="confirm-password" className="text-sm font-medium text-gray-700 mb-2 block">
                    Confirmer le mot de passe
                  </Label>
                  <Input 
                    id="confirm-password" 
                    type="password" 
                    className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                <div className="pt-2">
                  <Button 
                    className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-2.5 rounded-md font-medium"
                  >
                    Modifier le mot de passe
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="shadow-sm border-0 bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-lg">
                <Mail className="h-5 w-5 text-gray-700" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium text-gray-900">Notifications par e-mail</p>
                    <p className="text-sm text-gray-500">Recevez des notifications importantes par e-mail</p>
                  </div>
                  <Button variant="outline" size="sm" className="border-gray-300">
                    Activé
                  </Button>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium text-gray-900">Alertes de paiement</p>
                    <p className="text-sm text-gray-500">Notifications pour les loyers en retard</p>
                  </div>
                  <Button variant="outline" size="sm" className="border-gray-300">
                    Activé
                  </Button>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium text-gray-900">Alertes de maintenance</p>
                    <p className="text-sm text-gray-500">Notifications pour les demandes de maintenance</p>
                  </div>
                  <Button variant="outline" size="sm" className="border-gray-300">
                    Désactivé
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsView;
