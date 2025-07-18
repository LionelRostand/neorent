
export const systemRules = `
    // ====== GESTION DES UTILISATEURS ET RÔLES ======
    
    // 1. Rôles utilisateurs - Collection: user_roles
    match /user_roles/{userId} {
      allow read: if isAuthenticated() && 
        (request.auth.uid == userId || isAdmin());
      allow write: if isAdmin();
      allow create: if isAdmin() && 
        request.resource.data.keys().hasAll(['role', 'email', 'createdAt']) &&
        request.resource.data.role in ['admin', 'manager', 'employee', 'tenant'];
    }
    
    // 2. Configuration des permissions - Collection: employee_permissions
    match /employee_permissions/{permissionId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
    
    // ====== DEMANDES D'INSCRIPTION ======
    
    // 3. Demandes d'inscription propriétaires - Collection: owner_registration_requests
    match /owner_registration_requests/{requestId} {
      // Permettre la création par des utilisateurs non authentifiés (site public)
      allow create: if true;
      // Seuls les admins et managers peuvent lire, modifier et supprimer
      allow read, write, delete: if isManagerOrAdmin();
    }
    
    // ====== CONFIGURATION ET PARAMÈTRES ======
    
    // 4. Configuration du site web - Collection: website_config
    match /website_config/{configId} {
      allow read: if true; // Public pour le site web
      allow write: if isAdmin();
    }
    
    // 5. Configuration de l'entreprise - Collection: company_config
    match /company_config/{configId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
    
    // 6. Paramètres de sécurité - Collection: security_settings
    match /security_settings/{settingId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
    
    // 7. Paramètres email - Collection: email_settings
    match /email_settings/{settingId} {
      allow read: if isManagerOrAdmin();
      allow write: if isAdmin();
    }
    
    // ====== SYSTÈME DE COMMUNICATION ======
    
    // 8. Conversations - Collection: conversations
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
    
    // 9. Messages de chat - Collection: rent_messages
    match /rent_messages/{messageId} {
      allow create: if true; // Visiteurs et utilisateurs peuvent créer des messages
      allow read: if isAuthenticated(); // Staff peut lire tous les messages
      allow write: if isAuthenticated(); // Staff peut modifier les messages
      allow update: if isAuthenticated() && 
        (request.resource.data.diff(resource.data).affectedKeys().hasOnly(['read'])); // Marquer comme lu
    }
    
    // 10. Notifications - Collection: notifications
    match /notifications/{notificationId} {
      allow read: if isAuthenticated() && 
        resource.data.userId == request.auth.uid;
      allow write: if isManagerOrAdmin();
      allow create: if isAuthenticated();
    }
    
    // ====== DOCUMENTS ET FICHIERS ======
    
    // 11. Documents des locataires - Collection: tenant_documents
    match /tenant_documents/{documentId} {
      allow read, write: if isManagerOrAdmin() ||
        (isAuthenticated() && resource.data.tenantId == request.auth.uid);
    }
    
    // 12. Fichiers uploadés - Collection: uploaded_files
    match /uploaded_files/{fileId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated() && 
        request.auth.uid == resource.data.uploadedBy;
      allow create: if isAuthenticated();
    }
    
    // ====== ANALYTICS ET AUDIT ======
    
    // 13. Analytics du site web - Collection: rent_analytics
    match /rent_analytics/{analyticsId} {
      // Permettre l'écriture anonyme pour le tracking public du site
      allow create: if true;
      // Permettre la lecture pour les administrateurs et managers
      allow read: if isManagerOrAdmin();
      // Seuls les admins peuvent modifier/supprimer
      allow update, delete: if isAdmin();
    }
    
    // 14. Logs d'audit - Collection: audit_logs
    match /audit_logs/{logId} {
      allow read: if isAdmin();
      allow create: if isAuthenticated();
    }
    
    // 15. Sessions utilisateur - Collection: user_sessions
    match /user_sessions/{sessionId} {
      allow read, write: if isAuthenticated() && 
        resource.data.userId == request.auth.uid;
    }
`;
