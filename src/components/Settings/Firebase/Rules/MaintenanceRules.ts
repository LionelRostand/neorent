
export const maintenanceRules = `
    // ====== SYSTÈME DE MAINTENANCE ======
    
    // 1. Demandes de maintenance - Collection: maintenance_requests
    match /maintenance_requests/{requestId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated(); // Locataires peuvent créer des demandes
      allow update: if isManagerOrAdmin() || 
        (isAuthenticated() && request.auth.uid == resource.data.tenantId);
      allow delete: if isManagerOrAdmin();
    }
    
    // 2. Interventions de maintenance - Collection: maintenance_interventions
    match /maintenance_interventions/{interventionId} {
      allow read: if isAuthenticated();
      allow write: if hasAnyRole(['admin', 'manager', 'employee']);
    }
`;
