
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
    
    // ====== SYSTÈME DE CHAT ======
    
    // 13. Conversations - Collection: conversations
    match /conversations/{conversationId} {
      allow create: if true; // Visiteurs peuvent créer des conversations
      allow read, write: if request.auth != null; // Staff authentifié peut tout faire
    }
    
    // 14. Messages du chat - Collection: garage_messages
    match /garage_messages/{messageId} {
      allow create: if true; // Visiteurs peuvent envoyer des messages
      allow read: if request.auth != null; // Staff peut lire tous les messages
      allow update, delete: if request.auth != null; // Staff peut modifier/supprimer
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
  );
};
