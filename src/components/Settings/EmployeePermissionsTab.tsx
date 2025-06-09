import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFirebaseUserRoles } from '@/hooks/useFirebaseUserRoles';
import { useFirebaseCompanies } from '@/hooks/useFirebaseCompanies';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Save, UserCheck } from 'lucide-react';

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

const defaultPermission: MenuPermission = {
  read: false,
  write: false,
  view: false,
  delete: false,
};

const defaultEmployeePermissions: EmployeePermissions = {
  dashboard: { ...defaultPermission },
  properties: { ...defaultPermission },
  tenants: { ...defaultPermission },
  roommates: { ...defaultPermission },
  contracts: { ...defaultPermission },
  inspections: { ...defaultPermission },
  rentManagement: { ...defaultPermission },
  rentalCharges: { ...defaultPermission },
  maintenance: { ...defaultPermission },
  messages: { ...defaultPermission },
  taxes: { ...defaultPermission },
  website: { ...defaultPermission },
  settings: { ...defaultPermission },
};

const menuLabels = {
  dashboard: 'Dashboard',
  properties: 'Propriétés',
  tenants: 'Locataires',
  roommates: 'Colocataires',
  contracts: 'Contrats',
  inspections: 'États des lieux',
  rentManagement: 'Gestion des loyers',
  rentalCharges: 'Charges locatives',
  maintenance: 'Maintenance',
  messages: 'Messages',
  taxes: 'Déclarations fiscales',
  website: 'Site Web',
  settings: 'Paramètres',
};

const EmployeePermissionsTab: React.FC = () => {
  const { userRoles, loading, refetch } = useFirebaseUserRoles();
  const { companies, loading: companiesLoading } = useFirebaseCompanies();
  const { toast } = useToast();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [permissions, setPermissions] = useState<EmployeePermissions>(defaultEmployeePermissions);
  const [isSaving, setIsSaving] = useState(false);

  const employees = userRoles.filter(user => user.role === 'employee');
  const selectedEmployee = userRoles.find(user => user.id === selectedEmployeeId);

  React.useEffect(() => {
    if (selectedEmployee) {
      const employeePermissions = (selectedEmployee as any).detailedPermissions || defaultEmployeePermissions;
      setPermissions(employeePermissions);
    }
  }, [selectedEmployee]);

  const handlePermissionChange = (
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

  const handleSavePermissions = async () => {
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

  const setAllPermissions = (value: boolean) => {
    const newPermissions: EmployeePermissions = {
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
  };

  const getCompanyName = (companyId?: string): string => {
    if (!companyId) return 'Non assigné';
    const company = companies.find(c => c.id === companyId);
    return company ? company.name : 'Entreprise inconnue';
  };

  if (loading || companiesLoading) {
    return <div>Chargement des employés et entreprises...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-lg md:text-xl">
          <div className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Gestion des permissions détaillées
          </div>
          <Button 
            onClick={handleSavePermissions}
            disabled={!selectedEmployeeId || isSaving}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="employee-select">Sélectionner un employé</Label>
            <Select value={selectedEmployeeId} onValueChange={setSelectedEmployeeId}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir un employé..." />
              </SelectTrigger>
              <SelectContent>
                {employees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.name} ({employee.email}) - {getCompanyName((employee as any).companyId)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedEmployee && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-sm mb-2">Informations de l'employé sélectionné:</h3>
              <p className="text-sm text-gray-600">
                <strong>Nom:</strong> {selectedEmployee.name}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Email:</strong> {selectedEmployee.email}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Entreprise:</strong> {getCompanyName((selectedEmployee as any).companyId)}
              </p>
            </div>
          )}

          {selectedEmployeeId && (
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setAllPermissions(true)}
              >
                Tout autoriser
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setAllPermissions(false)}
              >
                Tout interdire
              </Button>
            </div>
          )}
        </div>

        {selectedEmployeeId && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(menuLabels).map(([menuKey, menuLabel]) => (
                <Card key={menuKey} className="p-4">
                  <h3 className="font-medium text-sm mb-3">{menuLabel}</h3>
                  <div className="space-y-3">
                    {Object.entries(permissions[menuKey as keyof EmployeePermissions]).map(([permType, value]) => (
                      <div key={permType} className="flex items-center justify-between">
                        <Label className="text-xs capitalize">
                          {permType === 'read' && '📖 Lecture'}
                          {permType === 'write' && '✏️ Écriture'}
                          {permType === 'view' && '👁️ Visualisation'}
                          {permType === 'delete' && '🗑️ Suppression'}
                        </Label>
                        <Switch
                          checked={value}
                          onCheckedChange={(checked) => 
                            handlePermissionChange(
                              menuKey as keyof EmployeePermissions,
                              permType as keyof MenuPermission,
                              checked
                            )
                          }
                        />
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {employees.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Aucun employé trouvé. Ajoutez d'abord des employés dans l'onglet Général.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmployeePermissionsTab;
