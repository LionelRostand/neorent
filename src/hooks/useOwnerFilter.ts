
import { useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';

export const useOwnerFilter = () => {
  const location = useLocation();
  const { userProfile, userType } = useAuth();
  
  // Récupérer le paramètre owner de l'URL
  const ownerParam = new URLSearchParams(location.search).get('owner');
  
  // Déterminer le propriétaire actuel
  const currentOwner = ownerParam || 
    ((userType === 'employee' || userType === 'admin') ? userProfile?.name : null);
  
  // Fonction pour filtrer les données par propriétaire
  const filterByOwner = <T extends { owner?: string }>(items: T[]): T[] => {
    if (!currentOwner) return items;
    return items.filter(item => item.owner === currentOwner);
  };
  
  // Fonction pour filtrer les locataires par propriétés du propriétaire
  const filterTenantsByOwner = <T extends { property: string }>(
    tenants: T[], 
    properties: { title: string; owner?: string }[]
  ): T[] => {
    if (!currentOwner) return tenants;
    const ownerProperties = properties.filter(prop => prop.owner === currentOwner);
    const ownerPropertyTitles = ownerProperties.map(prop => prop.title);
    return tenants.filter(tenant => ownerPropertyTitles.includes(tenant.property));
  };
  
  return {
    currentOwner,
    isOwnerFiltered: !!ownerParam,
    filterByOwner,
    filterTenantsByOwner
  };
};
