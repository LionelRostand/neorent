
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import MainLayout from '@/components/Layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Mail, Phone, Home, UserCheck, CheckCircle, Clock, XCircle, Users, Edit, Trash2 } from 'lucide-react';
import MetricCard from '@/components/MetricCard';
import TenantForm from '@/components/TenantForm';
import TenantDetailsModal from '@/components/TenantDetailsModal';
import TenantEditModal from '@/components/TenantEditModal';
import { useFirebaseTenants } from '@/hooks/useFirebaseTenants';
import { useFirebaseProperties } from '@/hooks/useFirebaseProperties';
import { useToast } from '@/hooks/use-toast';

const Tenants = () => {
  const { t } = useTranslation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [editingTenant, setEditingTenant] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { tenants, loading, error, addTenant, updateTenant, deleteTenant } = useFirebaseTenants();
  const { properties } = useFirebaseProperties();
  const { toast } = useToast();

  const activeCount = tenants.filter(t => t.status === 'Actif').length;
  const inactiveCount = tenants.filter(t => t.status === 'Inactif').length;
  const searchingCount = tenants.filter(t => t.status === 'En recherche').length;
  const totalCount = tenants.length;

  const handleAddTenant = async (data: any) => {
    try {
      const newTenant = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        property: data.property,
        rentAmount: data.rentAmount,
        nextPayment: data.nextPayment,
        status: 'Actif',
        leaseStart: data.leaseStart,
        image: data.imageBase64 ? `data:image/jpeg;base64,${data.imageBase64}` : null
      };

      await addTenant(newTenant);
      toast({
        title: t('common.success'),
        description: t('tenants.addSuccess'),
      });
      console.log('Locataire ajouté à la collection Rent_tenants:', newTenant);
    } catch (err) {
      console.error('Erreur lors de l\'ajout du locataire:', err);
      toast({
        title: t('common.error'),
        description: t('tenants.addError'),
        variant: "destructive",
      });
    }
  };

  const handleUpdateTenant = async (id: string, updates: any) => {
    try {
      await updateTenant(id, updates);
      toast({
        title: t('common.success'),
        description: t('tenants.updateSuccess'),
      });
      console.log('Locataire modifié dans la collection Rent_tenants:', { id, updates });
    } catch (err) {
      console.error('Erreur lors de la modification du locataire:', err);
      toast({
        title: t('common.error'),
        description: t('tenants.updateError'),
        variant: "destructive",
      });
    }
  };

  const handleDeleteTenant = async (id: string) => {
    if (window.confirm(t('tenants.confirmDelete'))) {
      try {
        await deleteTenant(id);
        toast({
          title: t('common.success'),
          description: t('tenants.deleteSuccess'),
        });
        console.log('Locataire supprimé de la collection Rent_tenants:', id);
      } catch (err) {
        console.error('Erreur lors de la suppression du locataire:', err);
        toast({
          title: t('common.error'),
          description: t('tenants.deleteError'),
          variant: "destructive",
        });
      }
    }
  };

  const handleViewDetails = (tenant: any) => {
    setSelectedTenant(tenant);
    setIsDetailsModalOpen(true);
  };

  const handleEditTenant = (tenant: any) => {
    setEditingTenant(tenant);
    setIsEditModalOpen(true);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('tenants.loading')}</p>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">{t('common.error')}: {error}</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="space-y-6 sm:space-y-8">
          {/* En-tête avec titre et bouton d'ajout */}
          <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('tenants.management')}</h1>
                <p className="text-gray-600 mt-2 text-sm sm:text-base">{t('tenants.description')}</p>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 w-full sm:w-auto">
                    <Plus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="text-sm sm:text-base">{t('tenants.addTenant')}</span>
                  </Button>
                </DialogTrigger>
                <TenantForm
                  onClose={() => setIsDialogOpen(false)}
                  onSubmit={handleAddTenant}
                  properties={properties}
                />
              </Dialog>
            </div>
          </div>

          {/* Métriques responsives */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            <MetricCard
              title={t('tenants.metrics.activeTenants')}
              value={activeCount}
              description={t('tenants.metrics.activeDescription', { count: activeCount })}
              icon={CheckCircle}
              iconBgColor="bg-green-500"
              borderColor="border-l-green-500"
            />
            <MetricCard
              title={t('tenants.metrics.searching')}
              value={searchingCount}
              description={t('tenants.metrics.searchingDescription', { count: searchingCount })}
              icon={Clock}
              iconBgColor="bg-yellow-500"
              borderColor="border-l-yellow-500"
            />
            <MetricCard
              title={t('tenants.metrics.inactive')}
              value={inactiveCount}
              description={t('tenants.metrics.inactiveDescription', { count: inactiveCount })}
              icon={XCircle}
              iconBgColor="bg-red-500"
              borderColor="border-l-red-500"
            />
            <MetricCard
              title={t('tenants.metrics.total')}
              value={totalCount}
              description={t('tenants.metrics.totalDescription', { count: totalCount })}
              icon={Users}
              iconBgColor="bg-blue-500"
              borderColor="border-l-blue-500"
            />
          </div>

          {/* Section Liste des Locataires */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{t('tenants.listTitle')}</h2>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">{t('tenants.listDescription')}</p>
            </div>
            
            <div className="p-3 sm:p-4 lg:p-6">
              {tenants.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">{t('tenants.noTenants')}</h3>
                  <p className="mt-2 text-gray-500">{t('tenants.noTenantsDescription')}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
                  {tenants.map((tenant) => (
                    <Card key={tenant.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-green-500 bg-white">
                      <CardContent className="p-3 sm:p-4">
                        <div className="space-y-3">
                          {/* Header with avatar, name, and actions */}
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-2 min-w-0 flex-1">
                              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                                {tenant.image ? (
                                  <img 
                                    src={tenant.image} 
                                    alt={tenant.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <UserCheck className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <h3 className="font-semibold text-sm sm:text-base text-gray-900 truncate">{tenant.name}</h3>
                                <p className="text-xs text-gray-500 truncate">{tenant.property}</p>
                              </div>
                            </div>
                            <div className="flex flex-col items-end space-y-1 ml-2">
                              <Badge className="bg-green-100 text-green-800 border-green-200 text-xs px-2 py-0.5">
                                {tenant.status}
                              </Badge>
                              <div className="flex space-x-1">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditTenant(tenant)}
                                  className="h-6 w-6 p-0 border-gray-200 hover:border-gray-300"
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteTenant(tenant.id)}
                                  className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 border-gray-200 hover:border-red-300"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                          
                          {/* Contact info */}
                          <div className="space-y-2">
                            <div className="flex items-center text-gray-600 text-xs">
                              <Mail className="mr-2 h-3 w-3 text-blue-500 flex-shrink-0" />
                              <span className="truncate">{tenant.email}</span>
                            </div>
                            <div className="flex items-center text-gray-600 text-xs">
                              <Phone className="mr-2 h-3 w-3 text-green-500 flex-shrink-0" />
                              <span className="truncate">{tenant.phone}</span>
                            </div>
                            <div className="flex items-center text-gray-600 text-xs">
                              <Home className="mr-2 h-3 w-3 text-orange-500 flex-shrink-0" />
                              <span className="truncate">
                                <span className="font-medium text-blue-600">{tenant.rentAmount}{t('tenants.rentPerMonth')}</span>
                              </span>
                            </div>
                          </div>
                          
                          {/* Action buttons */}
                          <div className="flex flex-col space-y-1.5 pt-2 border-t border-gray-100">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full h-7 text-xs hover:bg-blue-50 hover:border-blue-300"
                              onClick={() => handleViewDetails(tenant)}
                            >
                              {t('tenants.viewDetails')}
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full h-7 text-xs hover:bg-green-50 hover:border-green-300"
                            >
                              {t('tenants.contact')}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          <TenantDetailsModal
            tenant={selectedTenant}
            isOpen={isDetailsModalOpen}
            onClose={() => setIsDetailsModalOpen(false)}
          />

          <TenantEditModal
            tenant={editingTenant}
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onSave={handleUpdateTenant}
            properties={properties}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default Tenants;
