
export const firestoreRules = `rules_version = '2';
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
    
    // 8. Fiscalités et déclarations - Collection: rent_fiscality
    match /rent_fiscality/{fiscalityId} {
      allow read: if isAuthenticated();
      allow write: if isManagerOrAdmin();
      allow create: if isAuthenticated() && 
        request.resource.data.keys().hasAll(['title', 'type', 'property', 'amount', 'dueDate', 'status', 'year']) &&
        request.resource.data.status in ['À payer', 'Payée', 'À déclarer'];
    }
    
    // 9. Employés - Collection: Rent_employees
    match /Rent_employees/{employeeId} {
      allow read: if isManagerOrAdmin();
      allow write: if isAdmin();
    }
    
    // 10. Rôles utilisateurs - Collection: user_roles
    match /user_roles/{userId} {
      allow read: if isAuthenticated() && 
        (request.auth.uid == userId || isAdmin());
      allow write: if isAdmin();
      allow create: if isAdmin() && 
        request.resource.data.keys().hasAll(['role', 'email', 'createdAt']) &&
        request.resource.data.role in ['admin', 'manager', 'employee', 'tenant'];
    }
    
    // 11. Configuration du site web - Collection: website_config
    match /website_config/{configId} {
      allow read: if true; // Public pour le site web
      allow write: if isAdmin();
    }
    
    // 12. Configuration de l'entreprise - Collection: company_config
    match /company_config/{configId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
    
    // 13. Entreprises - Collection: Rent_entreprises
    match /Rent_entreprises/{entrepriseId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
    
    // 14. Analytics du site web - Collection: rent_analytics
    match /rent_analytics/{analyticsId} {
      allow create: if true; // Écriture anonyme autorisée pour le tracking public
      allow read: if isManagerOrAdmin();
      allow update, delete: if isAdmin();
    }
    
    // ====== PARAMÈTRES ET CONFIGURATION ======
    
    // 15. Paramètres de sécurité - Collection: security_settings
    match /security_settings/{settingId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
    
    // 16. Paramètres email - Collection: email_settings
    match /email_settings/{settingId} {
      allow read: if isManagerOrAdmin();
      allow write: if isAdmin();
    }
    
    // ====== SYSTÈME DE CHAT ET MESSAGES ======
    
    // 17. Conversations - Collection: conversations
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
