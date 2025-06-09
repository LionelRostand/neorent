import React, { useState } from 'react';
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
        title: "Succès",
        description: "Le locataire a été ajouté avec succès.",
      });
      console.log('Locataire ajouté à la collection Rent_tenants:', newTenant);
    } catch (err) {
      console.error('Erreur lors de l\'ajout du locataire:', err);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'ajout du locataire.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateTenant = async (id: string, updates: any) => {
    try {
      await updateTenant(id, updates);
      toast({
        title: "Succès",
        description: "Le locataire a été modifié avec succès.",
      });
      console.log('Locataire modifié dans la collection Rent_tenants:', { id, updates });
    } catch (err) {
      console.error('Erreur lors de la modification du locataire:', err);
      toast({
        title: "Erreur",
        description: "Erreur lors de la modification du locataire.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTenant = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce locataire ?')) {
      try {
        await deleteTenant(id);
        toast({
          title: "Succès",
          description: "Le locataire a été supprimé avec succès.",
        });
        console.log('Locataire supprimé de la collection Rent_tenants:', id);
      } catch (err) {
        console.error('Erreur lors de la suppression du locataire:', err);
        toast({
          title: "Erreur",
          description: "Erreur lors de la suppression du locataire.",
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
          <div className="text-lg">Chargement des locataires...</div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">Erreur: {error}</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Locataires</h1>
            <p className="text-gray-600 mt-2">Gérez vos locataires</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un locataire
              </Button>
            </DialogTrigger>
            <TenantForm
              onClose={() => setIsDialogOpen(false)}
              onSubmit={handleAddTenant}
              properties={properties}
            />
          </Dialog>
        </div>

        {/* Métriques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Locataires actifs"
            value={activeCount}
            description={`${activeCount} locataire${activeCount > 1 ? 's' : ''} actif${activeCount > 1 ? 's' : ''}`}
            icon={CheckCircle}
            iconBgColor="bg-green-500"
            borderColor="border-l-green-500"
          />
          <MetricCard
            title="En recherche"
            value={searchingCount}
            description={`${searchingCount} locataire${searchingCount > 1 ? 's' : ''} en recherche`}
            icon={Clock}
            iconBgColor="bg-yellow-500"
            borderColor="border-l-yellow-500"
          />
          <MetricCard
            title="Inactifs"
            value={inactiveCount}
            description={`${inactiveCount} locataire${inactiveCount > 1 ? 's' : ''} inactif${inactiveCount > 1 ? 's' : ''}`}
            icon={XCircle}
            iconBgColor="bg-red-500"
            borderColor="border-l-red-500"
          />
          <MetricCard
            title="Total"
            value={totalCount}
            description={`${totalCount} locataire${totalCount > 1 ? 's' : ''} au total`}
            icon={Users}
            iconBgColor="bg-blue-500"
            borderColor="border-l-blue-500"
          />
        </div>

        {/* Titre Liste */}
        <div className="pt-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Liste des Locataires</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tenants.map((tenant) => (
            <Card key={tenant.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                        {tenant.image ? (
                          <img 
                            src={tenant.image} 
                            alt={tenant.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <UserCheck className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">{tenant.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{tenant.property}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-100 text-green-800">
                        {tenant.status}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditTenant(tenant)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteTenant(tenant.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600 text-sm">
                      <Mail className="mr-2 h-4 w-4" />
                      {tenant.email}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <Phone className="mr-2 h-4 w-4" />
                      {tenant.phone}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <Home className="mr-2 h-4 w-4" />
                      {tenant.rentAmount}/mois
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 pt-4 border-t">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleViewDetails(tenant)}
                    >
                      Voir détails
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Contacter
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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
    </MainLayout>
  );
};

export default Tenants;
