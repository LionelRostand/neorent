
import { useState, useEffect } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { useFirebaseUserRoles } from '@/hooks/useFirebaseUserRoles';
import { useFirebaseCompanies } from '@/hooks/useFirebaseCompanies';
import { EmployeePermissions, MenuPermission, defaultEmployeePermissions } from '@/components/Settings/types/permissions';

export const useEmployeePermissionsManagement = () => {
  const { toast } = useToast();
  const { userRoles, loading: employeesLoading, refetch } = useFirebaseUserRoles();
  const { companies } = useFirebaseCompanies();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [permissions, setPermissions] = useState<EmployeePermissions>(defaultEmployeePermissions);
  const [isSaving, setIsSaving] = useState(false);

  const employees = userRoles.filter(user => user.role === 'employee');
  const selectedEmployee = employees.find(emp => emp.id === selectedEmployeeId);

  // Load permissions when employee is selected
  useEffect(() => {
    const loadPermissions = async () => {
      if (!selectedEmployeeId) {
        setPermissions(defaultEmployeePermissions);
        return;
      }

      try {
        const userRoleDoc = await getDoc(doc(db, 'user_roles', selectedEmployeeId));
        if (userRoleDoc.exists()) {
          const data = userRoleDoc.data();
          setPermissions(data.detailedPermissions || defaultEmployeePermissions);
        } else {
          setPermissions(defaultEmployeePermissions);
        }
      } catch (error) {
        console.error('Error loading permissions:', error);
        setPermissions(defaultEmployeePermissions);
      }
    };

    loadPermissions();
  }, [selectedEmployeeId]);

  const updatePermissions = (
    menu: keyof EmployeePermissions,
    permissionType: keyof MenuPermission,
    value: boolean
  ) => {
    setPermissions(prev => ({
      ...prev,
      [menu]: {
        ...prev[menu],
        [permissionType]: value
      }
    }));
  };

  const setAllPermissions = (value: boolean): EmployeePermissions => {
    const newPermissions = {
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
    setPermissions(newPermissions);
    return newPermissions;
  };

  const savePermissions = async () => {
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

  return {
    employees,
    companies,
    selectedEmployeeId,
    selectedEmployee,
    permissions,
    loading: employeesLoading,
    saving: isSaving,
    setSelectedEmployeeId,
    updatePermissions,
    setAllPermissions,
    savePermissions
  };
};
