
import { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { EmployeePermissions, MenuPermission, defaultEmployeePermissions } from '../types/permissions';

export const usePermissionOperations = (refetch: () => void) => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const savePermissions = async (selectedEmployeeId: string, permissions: EmployeePermissions) => {
    if (!selectedEmployeeId) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un employé",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      await setDoc(doc(db, 'user_roles', selectedEmployeeId), {
        detailedPermissions: permissions
      }, { merge: true });

      toast({
        title: "Succès",
        description: "Permissions mises à jour avec succès",
      });

      refetch();
    } catch (error) {
      console.error('Error updating permissions:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour des permissions",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const setAllPermissions = (value: boolean): EmployeePermissions => {
    return {
      dashboard: { read: value, write: value, view: value, delete: value },
      properties: { read: value, write: value, view: value, delete: value },
      tenants: { read: value, write: value, view: value, delete: value },
      roommates: { read: value, write: value, view: value, delete: value },
      contracts: { read: value, write: value, view: value, delete: value },
      inspections: { read: value, write: value, view: value, delete: value },
      rentManagement: { read: value, write: value, view: value, delete: value },
      rentalCharges: { read: value, write: value, view: value, delete: value },
      maintenance: { read: value, write: value, view: value, delete: value },
      messages: { read: value, write: value, view: value, delete: value },
      taxes: { read: value, write: value, view: value, delete: value },
      website: { read: value, write: value, view: value, delete: value },
      settings: { read: value, write: value, view: value, delete: value },
    };
  };

  return {
    isSaving,
    savePermissions,
    setAllPermissions
  };
};
