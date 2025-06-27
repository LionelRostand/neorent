
import { useAuth } from '@/hooks/useAuth';
import { EmployeePermissions, MenuPermission } from '@/components/Settings/types/permissions';

export const useUserPermissions = () => {
  const { userProfile, userType } = useAuth();

  const isOwner = userType === 'owner' && userProfile?.isOwner;
  const isAdmin = userType === 'admin';

  const hasPermission = (
    menu: keyof EmployeePermissions,
    action: keyof MenuPermission
  ): boolean => {
    // Les admins ont tous les droits globaux
    if (isAdmin) {
      return true;
    }

    // Les propriétaires ont pleins droits sur leurs propres données
    if (isOwner) {
      return true; // Pleins droits dans leur espace
    }

    // Les locataires et colocataires ont des permissions limitées
    if (userType === 'locataire' || userType === 'colocataire') {
      // Ils peuvent seulement voir le dashboard et leurs propres données
      if (menu === 'dashboard') {
        return action === 'read' || action === 'view';
      }
      return false;
    }

    // Par défaut, refuser l'accès
    return false;
  };

  const canAccessMenu = (menu: keyof EmployeePermissions): boolean => {
    return hasPermission(menu, 'view') || hasPermission(menu, 'read');
  };

  const canRead = (menu: keyof EmployeePermissions): boolean => {
    return hasPermission(menu, 'read');
  };

  const canWrite = (menu: keyof EmployeePermissions): boolean => {
    return hasPermission(menu, 'write');
  };

  const canDelete = (menu: keyof EmployeePermissions): boolean => {
    return hasPermission(menu, 'delete');
  };

  // Fonction pour vérifier l'accès aux données spécifiques
  const canAccessOwnerData = (dataOwner: string): boolean => {
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
    hasPermission,
    canAccessMenu,
    canRead,
    canWrite,
    canDelete,
    canAccessOwnerData,
    userType,
    isAdmin,
    isOwner: isOwner,
    isOwnerWithFullRights: isOwner, // Les propriétaires ont pleins droits sur leurs données
    isTenant: userType === 'locataire',
    isRoommate: userType === 'colocataire'
  };
};
