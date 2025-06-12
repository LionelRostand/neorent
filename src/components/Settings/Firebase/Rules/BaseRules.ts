
export const utilityFunctions = `
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
`;

export const rulesHeader = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {`;

export const rulesFooter = `  }
}`;
