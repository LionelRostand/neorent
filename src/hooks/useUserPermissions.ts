
import { useAuth } from '@/hooks/useAuth';
import { EmployeePermissions, MenuPermission } from '@/components/Settings/types/permissions';

export const useUserPermissions = () => {
  const { userProfile, userType } = useAuth();

  const isOwner = userType === 'owner' && userProfile?.isOwner;

  const hasPermission = (
    menu: keyof EmployeePermissions,
    action: keyof MenuPermission
  ): boolean => {
    // Les admins ont tous les droits
    if (userType === 'admin') {
      return true;
    }

    // Les propriétaires ont des droits étendus
    if (isOwner && userProfile?.detailedPermissions) {
      const menuPermissions = userProfile.detailedPermissions[menu];
      return menuPermissions ? menuPermissions[action] : false;
    }

    // Les locataires et colocataires ont des permissions limitées
    if (userType === 'locataire' || userType === 'colocataire') {
      // Ils peuvent seulement voir le dashboard et leurs propres données
      if (menu === 'dashboard') {
        return action === 'read' || action === 'view';
      }
      return false;
    }

    // Pour les propriétaires normaux, vérifier les permissions détaillées
    if (userType === 'owner' && userProfile?.detailedPermissions) {
      const menuPermissions = userProfile.detailedPermissions[menu];
      return menuPermissions ? menuPermissions[action] : false;
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

  return {
    hasPermission,
    canAccessMenu,
    canRead,
    canWrite,
    canDelete,
    userType,
    isAdmin: userType === 'admin',
    isOwner: userType === 'owner',
    isOwnerWithPermissions: isOwner,
    isTenant: userType === 'locataire',
    isRoommate: userType === 'colocataire'
  };
};
