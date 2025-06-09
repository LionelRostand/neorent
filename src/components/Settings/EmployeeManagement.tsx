
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFirebaseUserRoles } from '@/hooks/useFirebaseUserRoles';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

interface Employee {
  id: string;
  role: 'admin' | 'employee';
  email: string;
  name: string;
  createdAt: string;
  permissions?: string[];
}

interface EmployeeFormData {
  name: string;
  email: string;
  role: 'admin' | 'employee';
}

const EmployeeManagement: React.FC = () => {
  const { userRoles, loading, refetch } = useFirebaseUserRoles();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState<EmployeeFormData>({
    name: '',
    email: '',
    role: 'employee'
  });

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      role: 'employee'
    });
  };

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const employeeId = `emp_${Date.now()}`;
      const newEmployee = {
        ...formData,
        createdAt: new Date().toISOString(),
        permissions: formData.role === 'admin' ? ['all'] : ['read']
      };

      await setDoc(doc(db, 'user_roles', employeeId), newEmployee);
      
      toast({
        title: "Succès",
        description: "Employé ajouté avec succès",
      });
      
      resetForm();
      setIsAddDialogOpen(false);
      refetch();
    } catch (error) {
      console.error('Error adding employee:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'ajout de l'employé",
        variant: "destructive",
      });
    }
  };

  const handleEditEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEmployee) return;

    try {
      const updatedEmployee = {
        ...formData,
        createdAt: selectedEmployee.createdAt,
        permissions: formData.role === 'admin' ? ['all'] : ['read']
      };

      await setDoc(doc(db, 'user_roles', selectedEmployee.id), updatedEmployee, { merge: true });
      
      toast({
        title: "Succès",
        description: "Employé modifié avec succès",
      });
      
      resetForm();
      setIsEditDialogOpen(false);
      setSelectedEmployee(null);
      refetch();
    } catch (error) {
      console.error('Error updating employee:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la modification de l'employé",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEmployee = async (employeeId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet employé ?')) return;

    try {
      await deleteDoc(doc(db, 'user_roles', employeeId));
      
      toast({
        title: "Succès",
        description: "Employé supprimé avec succès",
      });
      
      refetch();
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression de l'employé",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (employee: Employee) => {
    setSelectedEmployee(employee);
    setFormData({
      name: employee.name,
      email: employee.email,
      role: employee.role
    });
    setIsEditDialogOpen(true);
  };

  const EmployeeForm = ({ onSubmit, isEdit = false }: { onSubmit: (e: React.FormEvent) => void; isEdit?: boolean }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nom complet</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="role">Rôle</Label>
        <Select value={formData.role} onValueChange={(value: 'admin' | 'employee') => setFormData({ ...formData, role: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="employee">Employé</SelectItem>
            <SelectItem value="admin">Administrateur</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Button type="submit" className="w-full">
        {isEdit ? 'Modifier l\'employé' : 'Ajouter l\'employé'}
      </Button>
    </form>
  );

  if (loading) {
    return <div>Chargement des employés...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-lg md:text-xl">
          <div className="flex items-center gap-2">
            👥 Compte Employés
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Ajouter un employé
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un employé</DialogTitle>
              </DialogHeader>
              <EmployeeForm onSubmit={handleAddEmployee} />
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 md:space-y-6">
        <p className="text-gray-600 text-sm md:text-base">
          Gérez les comptes employés de votre entreprise
        </p>

        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            <div className="hidden md:grid grid-cols-6 gap-4 p-4 bg-gray-50 rounded-t-lg text-sm font-medium text-gray-700">
              <div>Nom</div>
              <div>Email</div>
              <div>Rôle</div>
              <div>Date création</div>
              <div>Permissions</div>
              <div>Actions</div>
            </div>
            
            {userRoles.map((employee) => (
              <div key={employee.id} className="md:hidden space-y-3 p-4 border border-gray-200 rounded-lg mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-lg">{employee.name}</h3>
                    <p className="text-sm text-gray-600">{employee.role === 'admin' ? 'Administrateur' : 'Employé'}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => openEditDialog(employee)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteEmployee(employee.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">{employee.email}</p>
                  <p className="text-xs text-gray-500">
                    Créé le: {new Date(employee.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}

            <div className="hidden md:block">
              {userRoles.map((employee) => (
                <div key={employee.id} className="grid grid-cols-6 gap-4 p-4 border-b border-gray-200">
                  <div className="font-medium">{employee.name}</div>
                  <div className="text-sm text-gray-600 truncate">{employee.email}</div>
                  <div className="text-sm text-gray-600">
                    {employee.role === 'admin' ? 'Administrateur' : 'Employé'}
                  </div>
                  <div className="text-sm text-gray-600">
                    {new Date(employee.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    {employee.permissions?.join(', ') || 'Aucune'}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => openEditDialog(employee)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteEmployee(employee.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dialog de modification */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modifier l'employé</DialogTitle>
            </DialogHeader>
            <EmployeeForm onSubmit={handleEditEmployee} isEdit />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default EmployeeManagement;
