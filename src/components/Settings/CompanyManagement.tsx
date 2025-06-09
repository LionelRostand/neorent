
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useFirebaseCompanies, Company } from '@/hooks/useFirebaseCompanies';
import { Plus, Edit, Trash2, X, Building2 } from 'lucide-react';

interface CompanyFormData {
  name: string;
  subsidiaries: string[];
  address: string;
  phone: string;
  email: string;
}

const CompanyManagementNew: React.FC = () => {
  const { companies, loading, addCompany, updateCompany, deleteCompany } = useFirebaseCompanies();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [formData, setFormData] = useState<CompanyFormData>({
    name: '',
    subsidiaries: [],
    address: '',
    phone: '',
    email: ''
  });
  const [newSubsidiary, setNewSubsidiary] = useState('');

  const resetForm = () => {
    setFormData({
      name: '',
      subsidiaries: [],
      address: '',
      phone: '',
      email: ''
    });
    setNewSubsidiary('');
  };

  const addSubsidiary = () => {
    if (newSubsidiary.trim() && !formData.subsidiaries.includes(newSubsidiary.trim())) {
      setFormData(prev => ({
        ...prev,
        subsidiaries: [...prev.subsidiaries, newSubsidiary.trim()]
      }));
      setNewSubsidiary('');
    }
  };

  const removeSubsidiary = (index: number) => {
    setFormData(prev => ({
      ...prev,
      subsidiaries: prev.subsidiaries.filter((_, i) => i !== index)
    }));
  };

  const handleAddCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    await addCompany(formData);
    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEditCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCompany) return;
    
    await updateCompany(selectedCompany.id, formData);
    resetForm();
    setIsEditDialogOpen(false);
    setSelectedCompany(null);
  };

  const handleDeleteCompany = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette entreprise ?')) return;
    await deleteCompany(id);
  };

  const openEditDialog = (company: Company) => {
    setSelectedCompany(company);
    setFormData({
      name: company.name,
      subsidiaries: company.subsidiaries || [],
      address: company.address || '',
      phone: company.phone || '',
      email: company.email || ''
    });
    setIsEditDialogOpen(true);
  };

  const CompanyForm = ({ onSubmit, isEdit = false }: { onSubmit: (e: React.FormEvent) => void; isEdit?: boolean }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nom de l'entreprise</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="address">Adresse</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
        />
      </div>
      
      <div>
        <Label htmlFor="phone">Téléphone</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
        />
      </div>
      
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
        />
      </div>
      
      <div>
        <Label>Filiales</Label>
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              value={newSubsidiary}
              onChange={(e) => setNewSubsidiary(e.target.value)}
              placeholder="Nom de la filiale"
              onKeyPress={(e) => e.key === 'Enter' && addSubsidiary()}
            />
            <Button type="button" onClick={addSubsidiary} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-2">
            {formData.subsidiaries.map((subsidiary, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span>{subsidiary}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSubsidiary(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <Button type="submit" className="w-full">
        {isEdit ? 'Modifier l\'entreprise' : 'Ajouter l\'entreprise'}
      </Button>
    </form>
  );

  if (loading) {
    return <div>Chargement des entreprises...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-lg md:text-xl">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Gestion des Entreprises
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Ajouter une entreprise
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Ajouter une entreprise</DialogTitle>
              </DialogHeader>
              <CompanyForm onSubmit={handleAddCompany} />
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          {companies.map((company) => (
            <div key={company.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium text-lg">{company.name}</h3>
                  {company.address && <p className="text-sm text-gray-600">{company.address}</p>}
                  {company.phone && <p className="text-sm text-gray-600">📞 {company.phone}</p>}
                  {company.email && <p className="text-sm text-gray-600">✉️ {company.email}</p>}
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => openEditDialog(company)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteCompany(company.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {company.subsidiaries && company.subsidiaries.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-700">Filiales:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {company.subsidiaries.map((subsidiary, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {subsidiary}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <p className="text-xs text-gray-500 mt-2">
                Créée le: {new Date(company.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
          
          {companies.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Aucune entreprise enregistrée
            </div>
          )}
        </div>

        {/* Dialog de modification */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Modifier l'entreprise</DialogTitle>
            </DialogHeader>
            <CompanyForm onSubmit={handleEditCompany} isEdit />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default CompanyManagementNew;
