
export const propertyManagementRules = `
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
      
      // Sous-collection des documents du colocataire
      match /documents/{documentId} {
        allow read, write: if isManagerOrAdmin() || 
          (isAuthenticated() && request.auth.uid == resource.data.roommateId);
      }
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
    
    // 10. Entreprises - Collection: Rent_entreprises
    match /Rent_entreprises/{entrepriseId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
`;
