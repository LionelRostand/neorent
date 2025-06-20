
import { useAuth } from '@/hooks/useAuth';

export const useOwnerPermissions = () => {
  const { userProfile, userType } = useAuth();

  const isOwner = userType === 'employee';
  const isAdmin = userType === 'admin';

  const hasOwnerAccess = (action: string): boolean => {
    // Les admins ont tous les droits
    if (isAdmin) {
      return true;
    }

    // Les propriétaires (employees) ont accès à leur espace
    if (isOwner) {
      return true;
    }

    // Par défaut, refuser l'accès
    return false;
  };

  const canAccessOwnerSpace = (): boolean => {
    return isOwner || isAdmin;
  };

  return {
    isOwner,
    isAdmin,
    hasOwnerAccess,
    canAccessOwnerSpace,
    userType,
    userProfile
  };
};
