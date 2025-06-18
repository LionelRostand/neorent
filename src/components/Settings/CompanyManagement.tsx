
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useFirebaseCompanies, Company } from '@/hooks/useFirebaseCompanies';
import { Plus, Edit, Trash2, X, Building2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CompanyFormData {
  name: string;
  subsidiaries: string[];
  address: string;
  phone: string;
  email: string;
}

const CompanyManagementNew: React.FC = () => {
  const { t } = useTranslation();
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
    if (!confirm(t('settings.company.confirmDelete'))) return;
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
        <Label htmlFor="name" className="text-sm">{t('settings.company.companyName')}</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
          className="text-sm"
        />
      </div>
      
      <div>
        <Label htmlFor="address" className="text-sm">{t('settings.company.companyAddress')}</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
          className="text-sm"
        />
      </div>
      
      <div>
        <Label htmlFor="phone" className="text-sm">{t('settings.company.companyPhone')}</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
          className="text-sm"
        />
      </div>
      
      <div>
        <Label htmlFor="email" className="text-sm">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          className="text-sm"
        />
      </div>
      
      <div>
        <Label className="text-sm">Subsidiaries</Label>
        <div className="space-y-2">
          <div className="flex flex-col xs:flex-row gap-2">
            <Input
              value={newSubsidiary}
              onChange={(e) => setNewSubsidiary(e.target.value)}
              placeholder="Subsidiary name"
              onKeyPress={(e) => e.key === 'Enter' && addSubsidiary()}
              className="text-sm flex-1"
            />
          </div>
          
          <div className="space-y-2">
            {formData.subsidiaries.map((subsidiary, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                <span className="flex-1 truncate">{subsidiary}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSubsidiary(index)}
                  className="ml-2 flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <Button type="submit" className="w-full text-sm">
        {isEdit ? t('settings.company.editCompany') : t('settings.company.addCompany')}
      </Button>
    </form>
  );

  if (loading) {
    return <div className="text-center py-4 text-sm">Loading companies...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-base sm:text-lg md:text-xl">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-sm sm:text-base md:text-lg">{t('settings.company.title')}</span>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 text-xs sm:text-sm w-full sm:w-auto">
                <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">{t('settings.company.addCompany')}</span>
                <span className="xs:hidden">Add</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm sm:max-w-md max-h-[90vh] overflow-y-auto mx-4">
              <DialogHeader>
                <DialogTitle className="text-base sm:text-lg">{t('settings.company.addCompany')}</DialogTitle>
              </DialogHeader>
              <CompanyForm onSubmit={handleAddCompany} />
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:gap-4">
          {companies.map((company) => (
            <div key={company.id} className="p-3 sm:p-4 border border-gray-200 rounded-lg">
              <div className="flex flex-col xs:flex-row xs:justify-between xs:items-start gap-3 mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm sm:text-base lg:text-lg truncate">{company.name}</h3>
                  {company.address && <p className="text-xs sm:text-sm text-gray-600 mt-1 break-words">{company.address}</p>}
                  {company.phone && <p className="text-xs sm:text-sm text-gray-600 mt-1">📞 {company.phone}</p>}
                  {company.email && <p className="text-xs sm:text-sm text-gray-600 mt-1 break-all">✉️ {company.email}</p>}
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <Button variant="ghost" size="sm" onClick={() => openEditDialog(company)} className="h-8 w-8 p-0">
                    <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteCompany(company.id)} className="h-8 w-8 p-0">
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </div>
              
              {company.subsidiaries && company.subsidiaries.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Subsidiaries:</p>
                  <div className="flex flex-wrap gap-1">
                    {company.subsidiaries.map((subsidiary, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded truncate max-w-full">
                        {subsidiary}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <p className="text-xs text-gray-500 mt-3">
                Created on: {new Date(company.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
          
          {companies.length === 0 && (
            <div className="text-center py-6 sm:py-8 text-gray-500">
              <p className="text-sm sm:text-base">No companies registered</p>
            </div>
          )}
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-sm sm:max-w-md max-h-[90vh] overflow-y-auto mx-4">
            <DialogHeader>
              <DialogTitle className="text-base sm:text-lg">{t('settings.company.editCompany')}</DialogTitle>
            </DialogHeader>
            <CompanyForm onSubmit={handleEditCompany} isEdit />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default CompanyManagementNew;
