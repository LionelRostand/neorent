import React from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2, Shield } from 'lucide-react';

const Settings = () => {
  const employees = [
    {
      id: 1,
      nom: 'Dupont',
      prenom: 'Jean',
      email: 'jean.dupont@garage.com',
      telephone: '01 23 45 67 89',
      poste: 'Manager Principal'
    }
  ];

  const securityRules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Employés - Lecture pour tous les authentifiés, écriture pour admins
    match /employees/{employeeId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/user_roles/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Rôles utilisateurs - Lecture limitée, écriture admin uniquement
    match /user_roles/{userId} {
      allow read: if request.auth != null && 
        (request.auth.uid == userId || 
         get(/databases/$(database)/documents/user_roles/$(request.auth.uid)).data.role == 'admin');
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/user_roles/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Logs d'audit - Lecture admin uniquement
    match /audit_logs/{logId} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/user_roles/$(request.auth.uid)).data.role == 'admin';
    }
  }
}`;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
          <p className="text-gray-600 mt-2">Gérez les paramètres de votre application</p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 bg-gray-100">
            <TabsTrigger value="general" className="flex items-center gap-2 text-sm">
              <span className="hidden sm:inline">⚙️</span>
              Général
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2 text-sm">
              <span className="hidden sm:inline">🔔</span>
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2 text-sm">
              <span className="hidden sm:inline">🔐</span>
              Sécurité
            </TabsTrigger>
            <TabsTrigger value="permissions" className="flex items-center gap-2 text-sm">
              <span className="hidden sm:inline">👥</span>
              Permissions
            </TabsTrigger>
            <TabsTrigger value="database" className="flex items-center gap-2 text-sm">
              <span className="hidden sm:inline">📊</span>
              <span className="hidden sm:inline">Base de données</span>
              <span className="sm:hidden">BDD</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            {/* Section Compte Employés */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  👥 Compte Employés
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <p className="text-gray-600">Gérez les comptes employés de votre garage</p>
                  <Button className="flex items-center gap-2 w-full sm:w-auto">
                    <Plus className="h-4 w-4" />
                    Ajouter un employé
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <div className="min-w-full">
                    <div className="grid grid-cols-6 gap-4 p-4 bg-gray-50 rounded-t-lg text-sm font-medium text-gray-700">
                      <div>Nom</div>
                      <div>Prénom</div>
                      <div className="hidden md:block">Email</div>
                      <div className="hidden lg:block">Téléphone</div>
                      <div className="hidden xl:block">Poste</div>
                      <div>Actions</div>
                    </div>
                    
                    {employees.map((employee) => (
                      <div key={employee.id} className="grid grid-cols-6 gap-4 p-4 border-b border-gray-200">
                        <div className="font-medium">{employee.nom}</div>
                        <div>{employee.prenom}</div>
                        <div className="hidden md:block text-sm text-gray-600">{employee.email}</div>
                        <div className="hidden lg:block text-sm text-gray-600">{employee.telephone}</div>
                        <div className="hidden xl:block text-sm text-gray-600">{employee.poste}</div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Button className="w-full sm:w-auto">
                  Sauvegarder les employés
                </Button>
              </CardContent>
            </Card>

            {/* Section Règles de sécurité */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Règles de sécurité Firestore
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">
                  Copiez et collez ces règles dans votre console Firebase (Firestore Database → Règles) :
                </p>
                
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                  <pre className="text-xs whitespace-pre-wrap">
                    <code>{securityRules}</code>
                  </pre>
                </div>
                
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <span className="text-yellow-600 text-sm">⚠️</span>
                    <div className="text-sm">
                      <p className="font-medium text-yellow-800 mb-1">Important :</p>
                      <ul className="text-yellow-700 space-y-1">
                        <li>• Assurez-vous d'avoir activé l'authentification Firebase</li>
                        <li>• Créez un utilisateur avec le rôle 'admin' dans la collection user_roles</li>
                        <li>• Testez les règles avant de les déployer en production</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>🔔 Configuration des notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Label htmlFor="email-notifications">Notifications par email</Label>
                    <Input id="email-notifications" placeholder="Configurez vos notifications..." />
                  </div>
                  <div className="space-y-4">
                    <Label htmlFor="sms-notifications">Notifications SMS</Label>
                    <Input id="sms-notifications" placeholder="Configurez les SMS..." />
                  </div>
                </div>
                <Button className="w-full sm:w-auto">Sauvegarder</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>🔐 Paramètres de sécurité</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Label htmlFor="password-policy">Politique de mot de passe</Label>
                    <Input id="password-policy" placeholder="Configurez la sécurité..." />
                  </div>
                  <div className="space-y-4">
                    <Label htmlFor="two-factor">Authentification à deux facteurs</Label>
                    <Input id="two-factor" placeholder="Configurez 2FA..." />
                  </div>
                </div>
                <Button className="w-full sm:w-auto">Sauvegarder</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="permissions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>👥 Gestion des permissions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <Label htmlFor="user-roles">Rôles utilisateurs</Label>
                  <Input id="user-roles" placeholder="Gérez les permissions..." />
                </div>
                <Button className="w-full sm:w-auto">Sauvegarder</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="database" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>📊 Configuration base de données</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Label htmlFor="backup-settings">Paramètres de sauvegarde</Label>
                    <Input id="backup-settings" placeholder="Configurez les sauvegardes..." />
                  </div>
                  <div className="space-y-4">
                    <Label htmlFor="sync-settings">Synchronisation</Label>
                    <Input id="sync-settings" placeholder="Configurez la sync..." />
                  </div>
                </div>
                <Button className="w-full sm:w-auto">Sauvegarder</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Settings;
