
import { useAuth } from '@/hooks/useAuth';

interface MenuPermission {
  read: boolean;
  write: boolean;
  view: boolean;
  delete: boolean;
}

interface EmployeePermissions {
  dashboard: MenuPermission;
  properties: MenuPermission;
  tenants: MenuPermission;
  roommates: MenuPermission;
  contracts: MenuPermission;
  inspections: MenuPermission;
  rentManagement: MenuPermission;
  rentalCharges: MenuPermission;
  maintenance: MenuPermission;
  messages: MenuPermission;
  taxes: MenuPermission;
  website: MenuPermission;
  settings: MenuPermission;
}

export const useUserPermissions = () => {
  const { userProfile, userType } = useAuth();

  const hasPermission = (
    menu: keyof EmployeePermissions,
    action: keyof MenuPermission
  ): boolean => {
    // Les admins ont tous les droits
    if (userType === 'admin') {
      return true;
    }

    // Les locataires et colocataires ont des permissions limitées
    if (userType === 'locataire' || userType === 'colocataire') {
      // Ils peuvent seulement voir le dashboard et leurs propres données
      if (menu === 'dashboard') {
        return action === 'read' || action === 'view';
      }
      return false;
    }

    // Pour les employés, vérifier les permissions détaillées
    if (userType === 'employee' && userProfile?.detailedPermissions) {
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
    isEmployee: userType === 'employee',
    isTenant: userType === 'locataire',
    isRoommate: userType === 'colocataire'
  };
};
