
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
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
            <p className="text-gray-600 mt-1">Configurez vos préférences et paramètres</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profil Utilisateur
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Nom complet</Label>
                <Input id="name" defaultValue={currentProfile?.name || ''} />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={currentProfile?.email || ''} />
              </div>
              <div>
                <Label htmlFor="phone">Téléphone</Label>
                <Input id="phone" defaultValue={currentProfile?.phone || ''} />
              </div>
              <Button>Sauvegarder les modifications</Button>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Sécurité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="current-password">Mot de passe actuel</Label>
                <Input id="current-password" type="password" />
              </div>
              <div>
                <Label htmlFor="new-password">Nouveau mot de passe</Label>
                <Input id="new-password" type="password" />
              </div>
              <div>
                <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                <Input id="confirm-password" type="password" />
              </div>
              <Button>Changer le mot de passe</Button>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notifications par email</p>
                  <p className="text-sm text-gray-500">Recevoir les notifications importantes</p>
                </div>
                <Button variant="outline" size="sm">Activer</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Rappels de paiement</p>
                  <p className="text-sm text-gray-500">Être notifié des loyers en retard</p>
                </div>
                <Button variant="outline" size="sm">Activer</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Maintenance urgente</p>
                  <p className="text-sm text-gray-500">Notifications de maintenance prioritaire</p>
                </div>
                <Button variant="outline" size="sm">Activer</Button>
              </div>
            </CardContent>
          </Card>

          {/* System Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Système
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Langue</p>
                  <p className="text-sm text-gray-500">Français</p>
                </div>
                <Button variant="outline" size="sm">Changer</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Fuseau horaire</p>
                  <p className="text-sm text-gray-500">Europe/Paris</p>
                </div>
                <Button variant="outline" size="sm">Modifier</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Format de date</p>
                  <p className="text-sm text-gray-500">DD/MM/YYYY</p>
                </div>
                <Button variant="outline" size="sm">Changer</Button>
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Gestion des Données
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Exporter mes données</p>
                  <p className="text-sm text-gray-500">Télécharger toutes vos données en format CSV</p>
                </div>
                <Button variant="outline">Exporter</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Sauvegarde automatique</p>
                  <p className="text-sm text-gray-500">Sauvegarder automatiquement vos données</p>
                </div>
                <Button variant="outline" size="sm">Configurer</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-red-600">Supprimer mon compte</p>
                  <p className="text-sm text-gray-500">Supprimer définitivement votre compte et toutes vos données</p>
                </div>
                <Button variant="destructive">Supprimer</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsView;
