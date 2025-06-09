
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Key, Copy } from 'lucide-react';

interface StorageRulesSectionProps {
  onCopy: (text: string, type: string) => void;
}

export const StorageRulesSection: React.FC<StorageRulesSectionProps> = ({ onCopy }) => {
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

  return (
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
            onClick={() => onCopy(storageRules, 'Storage')}
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
  );
};
