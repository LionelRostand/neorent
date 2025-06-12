
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
    
    // ====== CONFIGURATION ET PARAMÈTRES ======
    
    // 3. Configuration du site web - Collection: website_config
    match /website_config/{configId} {
      allow read: if true; // Public pour le site web
      allow write: if isAdmin();
    }
    
    // 4. Configuration de l'entreprise - Collection: company_config
    match /company_config/{configId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
    
    // 5. Paramètres de sécurité - Collection: security_settings
    match /security_settings/{settingId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
    
    // 6. Paramètres email - Collection: email_settings
    match /email_settings/{settingId} {
      allow read: if isManagerOrAdmin();
      allow write: if isAdmin();
    }
    
    // ====== SYSTÈME DE COMMUNICATION ======
    
    // 7. Conversations - Collection: conversations
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
    
    // 8. Notifications - Collection: notifications
    match /notifications/{notificationId} {
      allow read: if isAuthenticated() && 
        resource.data.userId == request.auth.uid;
      allow write: if isManagerOrAdmin();
      allow create: if isAuthenticated();
    }
    
    // ====== DOCUMENTS ET FICHIERS ======
    
    // 9. Documents des locataires - Collection: tenant_documents
    match /tenant_documents/{documentId} {
      allow read, write: if isManagerOrAdmin() ||
        (isAuthenticated() && resource.data.tenantId == request.auth.uid);
    }
    
    // 10. Fichiers uploadés - Collection: uploaded_files
    match /uploaded_files/{fileId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated() && 
        request.auth.uid == resource.data.uploadedBy;
      allow create: if isAuthenticated();
    }
    
    // ====== ANALYTICS ET AUDIT ======
    
    // 11. Analytics du site web - Collection: rent_analytics
    match /rent_analytics/{analyticsId} {
      allow create: if true; // Écriture anonyme autorisée pour le tracking public
      allow read: if isManagerOrAdmin();
      allow update, delete: if isAdmin();
    }
    
    // 12. Logs d'audit - Collection: audit_logs
    match /audit_logs/{logId} {
      allow read: if isAdmin();
      allow create: if isAuthenticated();
    }
    
    // 13. Sessions utilisateur - Collection: user_sessions
    match /user_sessions/{sessionId} {
      allow read, write: if isAuthenticated() && 
        resource.data.userId == request.auth.uid;
    }
`;
