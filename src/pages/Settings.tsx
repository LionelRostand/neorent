import React from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2, Shield, Database, Lock, Key } from 'lucide-react';

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
    // Collections de l'application de gestion locative
    
    // Biens immobiliers - Lecture pour tous les authentifiés, écriture pour admins
    match /Rent_properties/{propertyId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/user_roles/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Locataires - Lecture pour tous les authentifiés, écriture pour admins
    match /Rent_locataires/{tenantId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/user_roles/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Colocataires - Lecture pour tous les authentifiés, écriture pour admins  
    match /Rent_colocataires/{roommateId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/user_roles/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Contrats de bail - Lecture pour tous les authentifiés, écriture pour admins
    match /Rent_contracts/{contractId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/user_roles/$(request.auth.uid)).data.role == 'admin';
    }
    
    // État des lieux - Lecture pour tous les authentifiés, écriture pour admins
    match /Rent_Inspections/{inspectionId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/user_roles/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Paiements des loyers - Lecture pour tous les authentifiés, écriture pour admins
    match /Rent_Payments/{paymentId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/user_roles/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Charges locatives - Lecture pour tous les authentifiés, écriture pour admins
    match /Rent_Charges/{chargeId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/user_roles/$(request.auth.uid)).data.role == 'admin';
    }
    
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
    
    // Documents des locataires - Accès restreint aux propriétaires et locataires concernés
    match /tenant_documents/{documentId} {
      allow read, write: if request.auth != null && 
        (get(/databases/$(database)/documents/user_roles/$(request.auth.uid)).data.role == 'admin' ||
         resource.data.tenantId == request.auth.uid);
    }
  }
}`;

  const authRules = `rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Images des biens immobiliers
    match /properties/{propertyId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        firestore.get(/databases/(default)/documents/user_roles/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Documents des locataires
    match /tenant_documents/{tenantId}/{allPaths=**} {
      allow read, write: if request.auth != null && 
        (firestore.get(/databases/(default)/documents/user_roles/$(request.auth.uid)).data.role == 'admin' ||
         request.auth.uid == tenantId);
    }
    
    // Documents des contrats
    match /contracts/{contractId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        firestore.get(/databases/(default)/documents/user_roles/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Images de profil
    match /profile_images/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}`;

  return (
    <MainLayout>
      <div className="space-y-4 md:space-y-6">
        <div className="px-1">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Paramètres</h1>
          <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base">
            Gérez les paramètres de votre application
          </p>
        </div>

        <Tabs defaultValue="firebase" className="space-y-4 md:space-y-6">
          <div className="overflow-x-auto">
            <TabsList className="grid w-full min-w-[600px] grid-cols-6 bg-gray-100 mx-1">
              <TabsTrigger value="firebase" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm px-2 md:px-3">
                <Database className="h-3 w-3 md:h-4 md:w-4" />
                <span className="truncate">Firebase</span>
              </TabsTrigger>
              <TabsTrigger value="general" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm px-2 md:px-3">
                <span className="hidden sm:inline">⚙️</span>
                <span className="truncate">Général</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm px-2 md:px-3">
                <span className="hidden sm:inline">🔔</span>
                <span className="truncate">Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm px-2 md:px-3">
                <Lock className="h-3 w-3 md:h-4 md:w-4" />
                <span className="truncate">Sécurité</span>
              </TabsTrigger>
              <TabsTrigger value="permissions" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm px-2 md:px-3">
                <span className="hidden sm:inline">👥</span>
                <span className="truncate">Permissions</span>
              </TabsTrigger>
              <TabsTrigger value="database" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm px-2 md:px-3">
                <span className="hidden sm:inline">📊</span>
                <span className="sm:hidden">BDD</span>
                <span className="hidden sm:inline lg:hidden">Base</span>
                <span className="hidden lg:inline">Base de données</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="firebase" className="space-y-4 md:space-y-6">
            {/* Section Règles Firestore */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <Shield className="h-5 w-5 text-red-600" />
                  Règles de sécurité Firestore
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">
                  Copiez et collez ces règles dans votre console Firebase (Firestore Database → Règles) :
                </p>
                
                <div className="bg-gray-900 text-gray-100 p-3 md:p-4 rounded-lg overflow-x-auto">
                  <pre className="text-xs whitespace-pre-wrap">
                    <code>{securityRules}</code>
                  </pre>
                </div>
                
                <div className="mt-4 p-3 md:p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <span className="text-red-600 text-sm">🚨</span>
                    <div className="text-sm">
                      <p className="font-medium text-red-800 mb-1">IMPORTANT - Configuration requise :</p>
                      <ul className="text-red-700 space-y-1">
                        <li>• Activez l'authentification Firebase (Authentication)</li>
                        <li>• Créez la collection <code className="bg-red-100 px-1 rounded">user_roles</code></li>
                        <li>• Ajoutez un document avec votre UID utilisateur et <code className="bg-red-100 px-1 rounded">role: "admin"</code></li>
                        <li>• Testez les règles avant de publier</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section Règles Storage */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <Key className="h-5 w-5 text-orange-600" />
                  Règles de sécurité Storage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">
                  Copiez et collez ces règles dans votre console Firebase (Storage → Règles) :
                </p>
                
                <div className="bg-gray-900 text-gray-100 p-3 md:p-4 rounded-lg overflow-x-auto">
                  <pre className="text-xs whitespace-pre-wrap">
                    <code>{authRules}</code>
                  </pre>
                </div>
                
                <div className="mt-4 p-3 md:p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <span className="text-orange-600 text-sm">⚠️</span>
                    <div className="text-sm">
                      <p className="font-medium text-orange-800 mb-1">Configuration Storage :</p>
                      <ul className="text-orange-700 space-y-1">
                        <li>• Activez Firebase Storage</li>
                        <li>• Créez les dossiers nécessaires dans Storage</li>
                        <li>• Configurez les CORS si nécessaire</li>
                        <li>• Vérifiez les quotas de stockage</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section Collections Firebase */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <Database className="h-5 w-5 text-blue-600" />
                  Collections Firebase configurées
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: 'Rent_properties', description: 'Biens immobiliers' },
                    { name: 'Rent_locataires', description: 'Locataires' },
                    { name: 'Rent_colocataires', description: 'Colocataires' },
                    { name: 'Rent_contracts', description: 'Contrats de bail' },
                    { name: 'Rent_Inspections', description: 'États des lieux' },
                    { name: 'Rent_Payments', description: 'Paiements des loyers' },
                    { name: 'Rent_Charges', description: 'Charges locatives' },
                    { name: 'user_roles', description: 'Rôles utilisateurs' },
                    { name: 'audit_logs', description: 'Logs d\'audit' }
                  ].map((collection) => (
                    <div key={collection.name} className="p-3 border border-gray-200 rounded-lg">
                      <h4 className="font-medium text-sm text-gray-900">{collection.name}</h4>
                      <p className="text-xs text-gray-600 mt-1">{collection.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="general" className="space-y-4 md:space-y-6">
            {/* Section Compte Employés */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  👥 Compte Employés
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 md:space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <p className="text-gray-600 text-sm md:text-base">
                    Gérez les comptes employés de votre garage
                  </p>
                  <Button className="flex items-center gap-2 w-full sm:w-auto">
                    <Plus className="h-4 w-4" />
                    Ajouter un employé
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <div className="min-w-[600px]">
                    <div className="hidden md:grid grid-cols-6 gap-4 p-4 bg-gray-50 rounded-t-lg text-sm font-medium text-gray-700">
                      <div>Nom</div>
                      <div>Prénom</div>
                      <div>Email</div>
                      <div>Téléphone</div>
                      <div>Poste</div>
                      <div>Actions</div>
                    </div>
                    
                    {employees.map((employee) => (
                      <div key={employee.id} className="md:hidden space-y-3 p-4 border border-gray-200 rounded-lg mb-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-lg">{employee.nom} {employee.prenom}</h3>
                            <p className="text-sm text-gray-600">{employee.poste}</p>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600">{employee.email}</p>
                          <p className="text-sm text-gray-600">{employee.telephone}</p>
                        </div>
                      </div>
                    ))}

                    <div className="hidden md:block">
                      {employees.map((employee) => (
                        <div key={employee.id} className="grid grid-cols-6 gap-4 p-4 border-b border-gray-200">
                          <div className="font-medium">{employee.nom}</div>
                          <div>{employee.prenom}</div>
                          <div className="text-sm text-gray-600 truncate">{employee.email}</div>
                          <div className="text-sm text-gray-600">{employee.telephone}</div>
                          <div className="text-sm text-gray-600">{employee.poste}</div>
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
                </div>

                <Button className="w-full sm:w-auto">
                  Sauvegarder les employés
                </Button>
              </CardContent>
            </Card>

            {/* Section Règles de sécurité */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <Shield className="h-5 w-5" />
                  Règles de sécurité Firestore
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">
                  Copiez et collez ces règles dans votre console Firebase (Firestore Database → Règles) :
                </p>
                
                <div className="bg-gray-900 text-gray-100 p-3 md:p-4 rounded-lg overflow-x-auto">
                  <pre className="text-xs whitespace-pre-wrap">
                    <code>{securityRules}</code>
                  </pre>
                </div>
                
                <div className="mt-4 p-3 md:p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
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

          <TabsContent value="notifications" className="space-y-4 md:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">🔔 Configuration des notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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

          <TabsContent value="security" className="space-y-4 md:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">🔐 Paramètres de sécurité</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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

          <TabsContent value="permissions" className="space-y-4 md:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">👥 Gestion des permissions</CardTitle>
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

          <TabsContent value="database" className="space-y-4 md:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">📊 Configuration base de données</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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
