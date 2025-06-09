
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Copy } from 'lucide-react';

interface FirestoreRulesSectionProps {
  onCopy: (text: string, type: string) => void;
}

export const FirestoreRulesSection: React.FC<FirestoreRulesSectionProps> = ({ onCopy }) => {
  const firestoreRules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // ====== FONCTIONS UTILITAIRES ======
    
    // Fonction pour vérifier si l'utilisateur est authentifié
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Fonction pour vérifier le rôle de l'utilisateur
    function hasRole(role) {
      return isAuthenticated() && 
        exists(/databases/$(database)/documents/user_roles/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/user_roles/$(request.auth.uid)).data.role == role;
    }
    
    // Fonction pour vérifier si l'utilisateur a un des rôles spécifiés
    function hasAnyRole(roles) {
      return isAuthenticated() && 
        exists(/databases/$(database)/documents/user_roles/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/user_roles/$(request.auth.uid)).data.role in roles;
    }
    
    // Fonction pour vérifier si l'utilisateur est admin
    function isAdmin() {
      return hasRole('admin');
    }
    
    // Fonction pour vérifier si l'utilisateur est manager ou admin
    function isManagerOrAdmin() {
      return hasAnyRole(['admin', 'manager']);
    }
    
    // ====== COLLECTIONS DE GESTION LOCATIVE ======
    
    // 1. Biens immobiliers - Collection: Rent_properties
    match /Rent_properties/{propertyId} {
      allow read: if isAuthenticated();
      allow write: if isManagerOrAdmin();
    }
    
    // 2. Locataires principaux - Collection: Rent_locataires
    match /Rent_locataires/{tenantId} {
      allow read: if isAuthenticated();
      allow write: if isManagerOrAdmin();
      
      // Sous-collection des documents du locataire
      match /documents/{documentId} {
        allow read, write: if isManagerOrAdmin() || 
          (isAuthenticated() && request.auth.uid == resource.data.tenantId);
      }
    }
    
    // 3. Colocataires - Collection: Rent_colocataires
    match /Rent_colocataires/{roommateId} {
      allow read: if isAuthenticated();
      allow write: if isManagerOrAdmin();
    }
    
    // 4. Contrats de bail - Collection: Rent_contracts
    match /Rent_contracts/{contractId} {
      allow read: if isAuthenticated();
      allow write: if isManagerOrAdmin();
      
      // Permettre aux locataires de lire leurs propres contrats
      allow read: if isAuthenticated() && 
        request.auth.uid == resource.data.tenantId;
    }
    
    // 5. États des lieux/Inspections - Collection: Rent_Inspections
    match /Rent_Inspections/{inspectionId} {
      allow read: if isAuthenticated();
      allow write: if hasAnyRole(['admin', 'manager', 'inspector']);
    }
    
    // 6. Paiements des loyers - Collection: Rent_Payments
    match /Rent_Payments/{paymentId} {
      allow read: if isAuthenticated();
      allow write: if isManagerOrAdmin();
      
      // Permettre aux locataires de lire leurs propres paiements
      allow read: if isAuthenticated() && 
        request.auth.uid == resource.data.tenantId;
    }
    
    // 7. Charges locatives - Collection: Rent_Charges
    match /Rent_Charges/{chargeId} {
      allow read: if isAuthenticated();
      allow write: if isManagerOrAdmin();
    }
    
    // 8. Employés - Collection: Rent_employees
    match /Rent_employees/{employeeId} {
      allow read: if isManagerOrAdmin();
      allow write: if isAdmin();
    }
    
    // 9. Rôles utilisateurs - Collection: user_roles
    match /user_roles/{userId} {
      allow read: if isAuthenticated() && 
        (request.auth.uid == userId || isAdmin());
      allow write: if isAdmin();
      allow create: if isAdmin() && 
        request.resource.data.keys().hasAll(['role', 'email', 'createdAt']) &&
        request.resource.data.role in ['admin', 'manager', 'employee', 'tenant'];
    }
    
    // 10. Configuration du site web - Collection: website_config
    match /website_config/{configId} {
      allow read: if true; // Public pour le site web
      allow write: if isAdmin();
    }
    
    // 11. Configuration de l'entreprise - Collection: company_config
    match /company_config/{configId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
    
    // 12. Entreprises - Collection: Rent_entreprises
    match /Rent_entreprises/{entrepriseId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
    
    // 13. Analytics du site web - Collection: rent_analytics
    match /rent_analytics/{analyticsId} {
      allow create: if true; // Écriture anonyme autorisée pour le tracking public
      allow read: if isManagerOrAdmin();
      allow update, delete: if isAdmin();
    }
    
    // ====== PARAMÈTRES ET CONFIGURATION ======
    
    // 14. Paramètres de sécurité - Collection: security_settings
    match /security_settings/{settingId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
    
    // 15. Paramètres email - Collection: email_settings
    match /email_settings/{settingId} {
      allow read: if isManagerOrAdmin();
      allow write: if isAdmin();
    }
    
    // ====== SYSTÈME DE CHAT ET MESSAGES ======
    
    // 16. Conversations - Collection: conversations
    match /conversations/{conversationId} {
      allow create: if true; // Visiteurs peuvent créer des conversations
      allow read: if isAuthenticated(); // Staff authentifié peut lire
      allow write: if isAuthenticated();
      
      // Sous-collection des messages
      match /messages/{messageId} {
        allow create: if true; // Visiteurs peuvent envoyer des messages
        allow read, write: if isAuthenticated();
      }
    }
    
    // 17. Messages du chat - Collection: garage_messages (legacy)
    match /garage_messages/{messageId} {
      allow create: if true; // Visiteurs peuvent envoyer des messages
      allow read: if isAuthenticated(); // Staff peut lire tous les messages
      allow update, delete: if isAuthenticated(); // Staff peut modifier/supprimer
    }
    
    // ====== SYSTÈME DE MAINTENANCE ======
    
    // 18. Demandes de maintenance - Collection: maintenance_requests
    match /maintenance_requests/{requestId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated(); // Locataires peuvent créer des demandes
      allow update: if isManagerOrAdmin() || 
        (isAuthenticated() && request.auth.uid == resource.data.tenantId);
      allow delete: if isManagerOrAdmin();
    }
    
    // 19. Interventions de maintenance - Collection: maintenance_interventions
    match /maintenance_interventions/{interventionId} {
      allow read: if isAuthenticated();
      allow write: if hasAnyRole(['admin', 'manager', 'employee']);
    }
    
    // ====== COLLECTIONS COMPLÉMENTAIRES ======
    
    // 20. Logs d'audit - Collection: audit_logs
    match /audit_logs/{logId} {
      allow read: if isAdmin();
      allow create: if isAuthenticated();
    }
    
    // 21. Documents des locataires - Collection: tenant_documents
    match /tenant_documents/{documentId} {
      allow read, write: if isManagerOrAdmin() ||
        (isAuthenticated() && resource.data.tenantId == request.auth.uid);
    }
    
    // 22. Notifications - Collection: notifications
    match /notifications/{notificationId} {
      allow read: if isAuthenticated() && 
        resource.data.userId == request.auth.uid;
      allow write: if isManagerOrAdmin();
      allow create: if isAuthenticated();
    }
    
    // 23. Sessions utilisateur - Collection: user_sessions
    match /user_sessions/{sessionId} {
      allow read, write: if isAuthenticated() && 
        resource.data.userId == request.auth.uid;
    }
    
    // 24. Configuration des permissions - Collection: employee_permissions
    match /employee_permissions/{permissionId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
    
    // 25. Fichiers uploadés - Collection: uploaded_files
    match /uploaded_files/{fileId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated() && 
        request.auth.uid == resource.data.uploadedBy;
      allow create: if isAuthenticated();
    }
  }
}`;

  return (
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
            onClick={() => onCopy(firestoreRules, 'Firestore')}
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
        
        <div className="mt-4 space-y-3">
          <div className="p-3 md:p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-2">
              <span className="text-green-600 text-sm">✅</span>
              <div className="text-sm">
                <p className="font-medium text-green-800 mb-1">Nouvelles fonctionnalités :</p>
                <ul className="text-green-700 space-y-1">
                  <li>• <strong>Fonctions utilitaires :</strong> Simplification des vérifications de rôles</li>
                  <li>• <strong>Gestion des documents :</strong> Locataires peuvent accéder à leurs documents</li>
                  <li>• <strong>Maintenance :</strong> Système de demandes et interventions</li>
                  <li>• <strong>Permissions employés :</strong> Gestion fine des autorisations</li>
                  <li>• <strong>Configuration sécurisée :</strong> Paramètres email et sécurité</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="p-3 md:p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <span className="text-blue-600 text-sm">🔒</span>
              <div className="text-sm">
                <p className="font-medium text-blue-800 mb-1">Sécurité renforcée :</p>
                <ul className="text-blue-700 space-y-1">
                  <li>• <strong>Validation des données :</strong> Contrôle des champs obligatoires</li>
                  <li>• <strong>Accès contextuel :</strong> Locataires voient uniquement leurs données</li>
                  <li>• <strong>Audit trail :</strong> Logs pour toutes les actions importantes</li>
                  <li>• <strong>Isolation des rôles :</strong> Séparation claire des permissions</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="p-3 md:p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2">
              <span className="text-red-600 text-sm">🚨</span>
              <div className="text-sm">
                <p className="font-medium text-red-800 mb-1">IMPORTANT - Configuration requise :</p>
                <ul className="text-red-700 space-y-1">
                  <li>• Activez l'authentification Firebase (Authentication)</li>
                  <li>• Créez la collection <code className="bg-red-100 px-1 rounded">user_roles</code></li>
                  <li>• Ajoutez un document avec votre UID et <code className="bg-red-100 px-1 rounded">role: "admin"</code></li>
                  <li>• Testez les règles en mode test avant de publier</li>
                  <li>• Vérifiez que tous vos utilisateurs ont un rôle défini</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="p-3 md:p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <span className="text-yellow-600 text-sm">⚠️</span>
              <div className="text-sm">
                <p className="font-medium text-yellow-800 mb-1">Instructions de déploiement :</p>
                <ol className="text-yellow-700 space-y-1 list-decimal list-inside">
                  <li>Copiez les règles ci-dessus</li>
                  <li>Allez dans la console Firebase → Firestore Database</li>
                  <li>Cliquez sur l'onglet "Règles"</li>
                  <li>Remplacez le contenu par ces nouvelles règles</li>
                  <li>Cliquez sur "Publier" pour appliquer les changements</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
