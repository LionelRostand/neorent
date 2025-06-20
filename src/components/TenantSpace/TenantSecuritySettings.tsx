
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Lock, Key } from 'lucide-react';
import { PasswordChangeDialog } from '@/components/Layout/UserProfile/PasswordChangeDialog';
import { useState } from 'react';
import { useTenantSpaceData } from '@/hooks/useTenantSpaceData';

const TenantSecuritySettings: React.FC = () => {
  const { user } = useAuth();
  const { currentProfile } = useTenantSpaceData();
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

  if (!user || !currentProfile) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-purple-100 rounded-full">
          <Shield className="h-6 w-6 text-purple-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Paramètres de sécurité
          </h2>
          <p className="text-gray-600">
            Gérez la sécurité de votre compte
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Lock className="h-5 w-5 text-gray-600" />
            Mot de passe
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="font-medium text-gray-900">Changer le mot de passe</h3>
              <p className="text-sm text-gray-600">
                Modifiez votre mot de passe pour sécuriser votre compte
              </p>
            </div>
            <Button 
              onClick={() => setIsPasswordDialogOpen(true)}
              variant="outline"
              className="w-full sm:w-auto"
            >
              <Key className="h-4 w-4 mr-2" />
              Modifier le mot de passe
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="h-5 w-5 text-gray-600" />
            Informations de sécurité
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Email de connexion</h4>
              <p className="text-sm text-gray-600">{currentProfile.email}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Dernière connexion</h4>
              <p className="text-sm text-gray-600">
                {user.metadata?.lastSignInTime 
                  ? new Date(user.metadata.lastSignInTime).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: '2-digit', 
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                  : 'Non disponible'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-yellow-700">
            Conseils de sécurité
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 mt-1">•</span>
              Utilisez un mot de passe fort avec au moins 8 caractères
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 mt-1">•</span>
              Ne partagez jamais votre mot de passe avec qui que ce soit
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 mt-1">•</span>
              Déconnectez-vous toujours après utilisation sur un appareil partagé
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 mt-1">•</span>
              Contactez l'administrateur si vous remarquez une activité suspecte
            </li>
          </ul>
        </CardContent>
      </Card>

      <PasswordChangeDialog
        open={isPasswordDialogOpen}
        onOpenChange={setIsPasswordDialogOpen}
        user={user}
      />
    </div>
  );
};

export default TenantSecuritySettings;
