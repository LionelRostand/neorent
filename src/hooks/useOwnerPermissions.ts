
import { useAuth } from '@/hooks/useAuth';

export const useOwnerPermissions = () => {
  const { userProfile, userType } = useAuth();

  const isOwner = userType === 'employee' && userProfile?.isOwner;
  const isAdmin = userType === 'admin';

  const hasOwnerAccess = (action: string): boolean => {
    // Les admins ont tous les droits
    if (isAdmin) {
      return true;
    }

    // Les propriétaires (employees with isOwner=true) ont accès à leur espace
    if (isOwner) {
      // Vérifier les permissions spécifiques si disponibles
      if (userProfile?.permissions && Array.isArray(userProfile.permissions)) {
        return userProfile.permissions.includes(action);
      }
      return true; // Accès par défaut pour les propriétaires
    }

    // Par défaut, refuser l'accès
    return false;
  };

  const canAccessOwnerSpace = (): boolean => {
    return isOwner || isAdmin;
  };

  const hasDetailedPermission = (menu: string, action: string): boolean => {
    // Les admins ont tous les droits
    if (isAdmin) {
      return true;
    }

    // Vérifier les permissions détaillées pour les propriétaires
    if (isOwner && userProfile?.detailedPermissions) {
      const menuPermissions = userProfile.detailedPermissions[menu];
      return menuPermissions ? menuPermissions[action] : false;
    }

    return false;
  };

  const canManageProperties = (): boolean => {
    return hasDetailedPermission('properties', 'write');
  };

  const canManageTenants = (): boolean => {
    return hasDetailedPermission('tenants', 'write');
  };

  const canManageContracts = (): boolean => {
    return hasDetailedPermission('contracts', 'write');
  };

  const canViewFinancials = (): boolean => {
    return hasDetailedPermission('rentManagement', 'read');
  };

  return {
    isOwner,
    isAdmin,
    hasOwnerAccess,
    canAccessOwnerSpace,
    hasDetailedPermission,
    canManageProperties,
    canManageTenants,
    canManageContracts,
    canViewFinancials,
    userType,
    userProfile
  };
};
