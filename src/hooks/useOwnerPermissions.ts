
import { useAuth } from '@/hooks/useAuth';
import { useAdminTenantAccess } from '@/hooks/useAdminTenantAccess';

export const useOwnerPermissions = () => {
  const { userProfile, userType, user } = useAuth();
  const { isAuthorizedAdmin, getCurrentProfile } = useAdminTenantAccess();
  const currentProfile = getCurrentProfile();

  // Vérifier si l'utilisateur est propriétaire
  const isOwner = userType === 'owner' || userProfile?.isOwner || userProfile?.role === 'owner';
  const isAdmin = userType === 'admin' || isAuthorizedAdmin || user?.email === 'admin@neotech-consulting.com';

  const hasOwnerAccess = (action: string): boolean => {
    // Les admins ont tous les droits globaux
    if (isAdmin) {
      return true;
    }

    // Les propriétaires ont tous les droits sur leurs propres données
    if (isOwner) {
      return true; // Pleins droits sur leur espace
    }

    // Par défaut, refuser l'accès
    return false;
  };

  const canAccessOwnerSpace = (): boolean => {
    return isOwner || isAdmin;
  };

  // Les propriétaires et admins ont pleins droits
  const hasFullOwnerRights = (): boolean => {
    return isOwner || isAdmin;
  };

  const canManageProperties = (): boolean => {
    return hasFullOwnerRights();
  };

  const canManageTenants = (): boolean => {
    return hasFullOwnerRights();
  };

  const canManageContracts = (): boolean => {
    return hasFullOwnerRights();
  };

  const canViewFinancials = (): boolean => {
    return hasFullOwnerRights();
  };

  const canManageInspections = (): boolean => {
    return hasFullOwnerRights();
  };

  const canManageCharges = (): boolean => {
    return hasFullOwnerRights();
  };

  const canManageMaintenance = (): boolean => {
    return hasFullOwnerRights();
  };

  const canManageRoommates = (): boolean => {
    return hasFullOwnerRights();
  };

  // Fonction pour vérifier si l'utilisateur peut accéder à une donnée spécifique
  const canAccessData = (dataOwner: string): boolean => {
    // L'admin peut accéder à toutes les données
    if (isAdmin) {
      return true;
    }

    // Le propriétaire peut accéder seulement à ses propres données
    if (isOwner && userProfile) {
      return dataOwner === userProfile.name || dataOwner === userProfile.email;
    }

    return false;
  };

  return {
    isOwner,
    isAdmin,
    hasOwnerAccess,
    canAccessOwnerSpace,
    hasFullOwnerRights,
    canManageProperties,
    canManageTenants,
    canManageContracts,
    canViewFinancials,
    canManageInspections,
    canManageCharges,
    canManageMaintenance,
    canManageRoommates,
    canAccessData,
    userType,
    userProfile: currentProfile || userProfile
  };
};
