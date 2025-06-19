
export const documentRules = `
    // Règles pour la collection rent_documents
    match /rent_documents/{documentId} {
      // Lecture : autorisée pour les utilisateurs authentifiés qui peuvent voir le document
      allow read: if request.auth != null && 
        (request.auth.uid == resource.data.roommateId ||
         request.auth.uid == resource.data.tenantId ||
         isAdmin());

      // Création : autorisée pour les utilisateurs authentifiés
      allow create: if request.auth != null && 
        validateDocumentData() &&
        (request.auth.uid == request.resource.data.roommateId ||
         request.auth.uid == request.resource.data.tenantId ||
         isAdmin());

      // Mise à jour : autorisée pour le propriétaire du document ou un admin
      allow update: if request.auth != null && 
        (request.auth.uid == resource.data.roommateId ||
         request.auth.uid == resource.data.tenantId ||
         isAdmin()) &&
        validateDocumentUpdate();

      // Suppression : autorisée pour le propriétaire du document ou un admin
      allow delete: if request.auth != null && 
        (request.auth.uid == resource.data.roommateId ||
         request.auth.uid == resource.data.tenantId ||
         isAdmin());
    }

    // Fonction de validation des données de document
    function validateDocumentData() {
      let data = request.resource.data;
      return data.keys().hasAll(['fileName', 'fileType', 'documentType', 'downloadURL', 'roommateId']) &&
             data.fileName is string &&
             data.fileType is string &&
             data.documentType is string &&
             data.downloadURL is string &&
             data.roommateId is string &&
             data.createdAt is timestamp &&
             data.updatedAt is timestamp;
    }

    // Fonction de validation des mises à jour
    function validateDocumentUpdate() {
      // Empêcher la modification des champs critiques
      let unchangedFields = ['fileName', 'fileType', 'downloadURL', 'roommateId', 'createdAt'];
      return unchangedFields.all(field in unchangedFields, 
        !(field in request.resource.data) || 
        request.resource.data[field] == resource.data[field]);
    }`;
