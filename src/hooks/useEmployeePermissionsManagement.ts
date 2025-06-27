
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

  // Filtrer les employés - inclure tous les propriétaires et admins (sauf l'admin principal)
  const employees = userRoles.filter(user => 
    user.role === 'owner' || 
    user.isOwner === true || 
    (user.role === 'admin' && user.email !== 'admin@neotech-consulting.com') // Exclure l'admin principal
  );
  
  const selectedEmployee = employees.find(emp => emp.id === selectedEmployeeId);

  console.log('🔍 All user roles:', userRoles);
  console.log('👥 Filtered employees for permissions:', employees);

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
          // Pour les propriétaires, définir des permissions complètes par défaut sur leurs données
          if (data.role === 'owner' || data.isOwner) {
            const fullOwnerPermissions = {
              dashboard: { read: true, write: true, view: true, delete: true },
              properties: { read: true, write: true, view: true, delete: true },
              tenants: { read: true, write: true, view: true, delete: true },
              roommates: { read: true, write: true, view: true, delete: true },
              contracts: { read: true, write: true, view: true, delete: true },
              inspections: { read: true, write: true, view: true, delete: true },
              rentManagement: { read: true, write: true, view: true, delete: true },
              rentalCharges: { read: true, write: true, view: true, delete: true },
              maintenance: { read: true, write: true, view: true, delete: true },
              messages: { read: true, write: true, view: true, delete: false },
              taxes: { read: true, write: true, view: true, delete: false },
              website: { read: true, write: true, view: true, delete: false },
              settings: { read: false, write: false, view: false, delete: false }, // Seul l'admin peut gérer les paramètres
            };
            setPermissions(data.detailedPermissions || fullOwnerPermissions);
          } else {
            setPermissions(data.detailedPermissions || defaultEmployeePermissions);
          }
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
        description: "Veuillez sélectionner un propriétaire",
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
