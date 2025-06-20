
import { useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';

export const useOwnerFilter = () => {
  const location = useLocation();
  const { userProfile, userType } = useAuth();
  
  // Récupérer le paramètre owner de l'URL
  const ownerParam = new URLSearchParams(location.search).get('owner');
  
  // Déterminer le propriétaire actuel
  // Pour les admins, seulement filtrer s'il y a un paramètre owner explicite
  // Pour les employés, utiliser leur nom par défaut ou le paramètre owner
  const currentOwner = ownerParam || 
    (userType === 'employee' ? userProfile?.name : null);
  
  // Fonction pour filtrer les données par propriétaire
  const filterByOwner = <T extends { owner?: string }>(items: T[]): T[] => {
    // Si c'est un admin sans paramètre owner, montrer tout
    if (userType === 'admin' && !ownerParam) {
      return items;
    }
    
    // Sinon, filtrer par propriétaire si défini
    if (!currentOwner) return items;
    return items.filter(item => item.owner === currentOwner);
  };
  
  // Fonction pour filtrer les locataires par propriétés du propriétaire
  const filterTenantsByOwner = <T extends { property: string }>(
    tenants: T[], 
    properties: { title: string; owner?: string }[]
  ): T[] => {
    // Si c'est un admin sans paramètre owner, montrer tout
    if (userType === 'admin' && !ownerParam) {
      return tenants;
    }
    
    if (!currentOwner) return tenants;
    const ownerProperties = properties.filter(prop => prop.owner === currentOwner);
    const ownerPropertyTitles = ownerProperties.map(prop => prop.title);
    return tenants.filter(tenant => ownerPropertyTitles.includes(tenant.property));
  };
  
  return {
    currentOwner,
    isOwnerFiltered: !!ownerParam || (userType === 'employee'),
    filterByOwner,
    filterTenantsByOwner
  };
};
