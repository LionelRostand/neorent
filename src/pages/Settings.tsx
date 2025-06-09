import React from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Database, Lock, Key, Copy } from 'lucide-react';
import CompanyManagementNew from '@/components/Settings/CompanyManagement';
import EmployeeManagement from '@/components/Settings/EmployeeManagement';

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

  const firestoreRules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // ====== COLLECTIONS DE GESTION LOCATIVE ======
    
    // 1. Biens immobiliers - Collection: Rent_properties
    match /Rent_properties/{propertyId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (get(/databases/$(database)/documents/user_roles/$(request.auth.uid)).data.role in ['admin', 'manager']);
    }
    
    // 2. Locataires principaux - Collection: Rent_locataires
    match /Rent_locataires/{tenantId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (get(/databases/$(database)/documents/user_roles/$(request.auth.uid)).data.role in ['admin', 'manager']);
    }
    
    // 3. Colocataires - Collection: Rent_colocataires
    match /Rent_colocataires/{roommateId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (get(/databases/$(database)/documents/user_roles/$(request.auth.uid)).data.role in ['admin', 'manager']);
    }
    
    // 4. Contrats de bail - Collection: Rent_contracts
    match /Rent_contracts/{contractId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (get(/databases/$(database)/documents/user_roles/$(request.auth.uid)).data.role in ['admin', 'manager']);
    }
    
    // 5. États des lieux/Inspections - Collection: Rent_Inspections
    match /Rent_Inspections/{inspectionId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (get(/databases/$(database)/documents/user_roles/$(request.auth.uid)).data.role in ['admin', 'manager', 'inspector']);
    }
    
    // 6. Paiements des loyers - Collection: Rent_Payments
    match /Rent_Payments/{paymentId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (get(/databases/$(database)/documents/user_roles/$(request.auth.uid)).data.role in ['admin', 'manager']);
    }
    
    // 7. Charges locatives - Collection: Rent_Charges
    match /Rent_Charges/{chargeId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (get(/databases/$(database)/documents/user_roles/$(request.auth.uid)).data.role in ['admin', 'manager']);
    }
    
    // 8. Employés - Collection: Rent_employees
    match /Rent_employees/{employeeId} {
      allow read: if request.auth != null && 
        (get(/databases/$(database)/documents/user_roles/$(request.auth.uid)).data.role in ['admin', 'manager']);
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/user_roles/$(request.auth.uid)).data.role == 'admin';
    }
    
    // 9. Rôles utilisateurs - Collection: user_roles
    match /user_roles/{userId} {
      allow read: if request.auth != null && 
        (request.auth.uid == userId || 
         get(/databases/$(database)/documents/user_roles/$(request.auth.uid)).data.role == 'admin');
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/user_roles/$(request.auth.uid)).data.role == 'admin';
    }
    
    // 10. Configuration du site web - Collection: website_config
    match /website_config/{configId} {
      allow read: if true; // Public pour le site web
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/user_roles/$(request.auth.uid)).data.role == 'admin';
    }
    
    // 11. Configuration de l'entreprise - Collection: company_config
    match /company_config/{configId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/user_roles/$(request.auth.uid)).data.role == 'admin';
    }
    
    // 12. Entreprises - Collection: Rent_entreprises
    match /Rent_entreprises/{entrepriseId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/user_roles/$(request.auth.uid)).data.role == 'admin';
    }
    
    // ====== COLLECTIONS COMPLÉMENTAIRES ======
    
    // Logs d'audit
    match /audit_logs/{logId} {
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/user_roles/$(request.auth.uid)).data.role == 'admin';
      allow create: if request.auth != null;
    }
    
    // Documents des locataires
    match /tenant_documents/{documentId} {
      allow read, write: if request.auth != null && 
        (get(/databases/$(database)/documents/user_roles/$(request.auth.uid)).data.role in ['admin', 'manager'] ||
         resource.data.tenantId == request.auth.uid);
    }
    
    // Notifications
    match /notifications/{notificationId} {
      allow read: if request.auth != null && 
        resource.data.userId == request.auth.uid;
      allow write: if request.auth != null && 
        (get(/databases/$(database)/documents/user_roles/$(request.auth.uid)).data.role in ['admin', 'manager']);
    }
    
    // Sessions utilisateur
    match /user_sessions/{sessionId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
  }
}`;

  const storageRules = `rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // ====== DOSSIERS DE STOCKAGE ======
    
    // Images des biens immobiliers
    match /properties/{propertyId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        firestore.get(/databases/(default)/documents/user_roles/$(request.auth.uid)).data.role in ['admin', 'manager'];
    }
    
    // Documents des locataires (contrats, pièces d'identité, etc.)
    match /tenant_documents/{tenantId}/{allPaths=**} {
      allow read, write: if request.auth != null && 
        (firestore.get(/databases/(default)/documents/user_roles/$(request.auth.uid)).data.role in ['admin', 'manager'] ||
         request.auth.uid == tenantId);
    }
    
    // Documents des contrats (PDF de contrats de bail)
    match /contracts/{contractId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        firestore.get(/databases/(default)/documents/user_roles/$(request.auth.uid)).data.role in ['admin', 'manager'];
    }
    
    // Photos d'état des lieux
    match /inspections/{inspectionId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        firestore.get(/databases/(default)/documents/user_roles/$(request.auth.uid)).data.role in ['admin', 'manager', 'inspector'];
    }
    
    // Images de profil des utilisateurs
    match /profile_images/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (request.auth.uid == userId ||
         firestore.get(/databases/(default)/documents/user_roles/$(request.auth.uid)).data.role == 'admin');
    }
    
    // Documents de paiement (reçus, factures)
    match /payment_documents/{paymentId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        firestore.get(/databases/(default)/documents/user_roles/$(request.auth.uid)).data.role in ['admin', 'manager'];
    }
    
    // Documents de charges (factures de charges)
    match /charge_documents/{chargeId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        firestore.get(/databases/(default)/documents/user_roles/$(request.auth.uid)).data.role in ['admin', 'manager'];
    }
    
    // Médias du site web (images, logos, etc.)
    match /website_media/{allPaths=**} {
      allow read: if true; // Public pour le site web
      allow write: if request.auth != null && 
        firestore.get(/databases/(default)/documents/user_roles/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Documents d'employés
    match /employee_documents/{employeeId}/{allPaths=**} {
      allow read, write: if request.auth != null && 
        firestore.get(/databases/(default)/documents/user_roles/$(request.auth.uid)).data.role == 'admin';
    }
  }
}`;

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    console.log(`Règles ${type} copiées dans le presse-papier`);
  };

  return (
    <MainLayout>
      <div className="space-y-4 md:space-y-6">
        <div className="px-1">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Paramètres</h1>
          <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base">
            Gérez les paramètres de votre application
          </p>
        </div>

        <Tabs defaultValue="general" className="space-y-4 md:space-y-6">
          <div className="overflow-x-auto">
            <TabsList className="grid w-full min-w-[600px] grid-cols-6 bg-gray-100 mx-1">
              <TabsTrigger value="general" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm px-2 md:px-3">
                <span className="hidden sm:inline">⚙️</span>
                <span className="truncate">Général</span>
              </TabsTrigger>
              <TabsTrigger value="firebase" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm px-2 md:px-3">
                <Database className="h-3 w-3 md:h-4 md:w-4" />
                <span className="truncate">Firebase</span>
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

          <TabsContent value="general" className="space-y-4 md:space-y-6">
            <CompanyManagementNew />
            <EmployeeManagement />
          </TabsContent>

          <TabsContent value="firebase" className="space-y-4 md:space-y-6">
            {/* Section Règles Firestore */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-lg md:text-xl">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-red-600" />
                    Règles de sécurité Firestore
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyToClipboard(firestoreRules, 'Firestore')}
                    className="flex items-center gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    Copier
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">
                  Copiez et collez ces règles dans votre console Firebase (Firestore Database → Règles) :
                </p>
                
                <div className="bg-gray-900 text-gray-100 p-3 md:p-4 rounded-lg overflow-x-auto">
                  <pre className="text-xs whitespace-pre-wrap">
                    <code>{firestoreRules}</code>
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
                        <li>• Créez toutes les collections mentionnées</li>
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
                <CardTitle className="flex items-center justify-between text-lg md:text-xl">
                  <div className="flex items-center gap-2">
                    <Key className="h-5 w-5 text-orange-600" />
                    Règles de sécurité Storage
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyToClipboard(storageRules, 'Storage')}
                    className="flex items-center gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    Copier
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">
                  Copiez et collez ces règles dans votre console Firebase (Storage → Règles) :
                </p>
                
                <div className="bg-gray-900 text-gray-100 p-3 md:p-4 rounded-lg overflow-x-auto">
                  <pre className="text-xs whitespace-pre-wrap">
                    <code>{storageRules}</code>
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
                    { name: 'Rent_properties', description: 'Biens immobiliers', status: 'Configuré' },
                    { name: 'Rent_locataires', description: 'Locataires principaux', status: 'Configuré' },
                    { name: 'Rent_colocataires', description: 'Colocataires', status: 'Configuré' },
                    { name: 'Rent_contracts', description: 'Contrats de bail', status: 'Configuré' },
                    { name: 'Rent_Inspections', description: 'États des lieux', status: 'Configuré' },
                    { name: 'Rent_Payments', description: 'Paiements des loyers', status: 'Configuré' },
                    { name: 'Rent_Charges', description: 'Charges locatives', status: 'Configuré' },
                    { name: 'Rent_entreprises', description: 'Entreprises', status: 'Configuré' },
                    { name: 'Rent_employees', description: 'Employés', status: 'À créer' },
                    { name: 'user_roles', description: 'Rôles utilisateurs', status: 'À créer' },
                    { name: 'website_config', description: 'Configuration site web', status: 'À créer' },
                    { name: 'audit_logs', description: 'Logs d\'audit', status: 'Optionnel' },
                    { name: 'tenant_documents', description: 'Documents locataires', status: 'Optionnel' }
                  ].map((collection) => (
                    <div key={collection.name} className="p-3 border border-gray-200 rounded-lg">
                      <h4 className="font-medium text-sm text-gray-900">{collection.name}</h4>
                      <p className="text-xs text-gray-600 mt-1">{collection.description}</p>
                      <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                        collection.status === 'Configuré' ? 'bg-green-100 text-green-800' :
                        collection.status === 'À créer' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {collection.status}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Section Rôles utilisateurs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  👥 Rôles utilisateurs définis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="font-medium text-red-800">admin</h4>
                    <p className="text-sm text-red-700">Accès complet à toutes les fonctionnalités</p>
                  </div>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-800">manager</h4>
                    <p className="text-sm text-blue-700">Gestion des biens, locataires, contrats et paiements</p>
                  </div>
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-medium text-green-800">inspector</h4>
                    <p className="text-sm text-green-700">Création et modification des états des lieux uniquement</p>
                  </div>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <h4 className="font-medium text-gray-800">tenant</h4>
                    <p className="text-sm text-gray-700">Accès limité à ses propres informations</p>
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
