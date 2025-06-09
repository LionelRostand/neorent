
import React, { useState } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Phone, Mail, MapPin, Calendar, Euro, Plus, Search, Eye, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import TenantForm from '@/components/TenantForm';
import TenantDetailsModal from '@/components/TenantDetailsModal';
import TenantEditModal from '@/components/TenantEditModal';
import { useFirebaseTenants } from '@/hooks/useFirebaseTenants';
import { useFirebaseProperties } from '@/hooks/useFirebaseProperties';
import { useToast } from '@/hooks/use-toast';

const Tenants = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<any>(null);
  const [editingTenant, setEditingTenant] = useState<any>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { tenants, loading, error, addTenant, updateTenant, deleteTenant } = useFirebaseTenants();
  const { properties } = useFirebaseProperties();
  const { toast } = useToast();

  const filteredTenants = tenants.filter(tenant =>
    (tenant.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (tenant.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (tenant.property || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddTenant = async (data: any) => {
    try {
      await addTenant({
        name: data.name,
        email: data.email,
        phone: data.phone,
        property: data.property,
        rentAmount: data.rentAmount,
        nextPayment: data.nextPayment,
        status: data.status,
        leaseStart: data.leaseStart,
        image: data.imageBase64 ? `data:image/jpeg;base64,${data.imageBase64}` : null
      });
      setIsDialogOpen(false);
      toast({
        title: "Succès",
        description: "Le locataire a été ajouté avec succès.",
      });
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
      console.log('Locataire modifié dans la collection Rent_locataires:', { id, updates });
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
        console.log('Locataire supprimé de la collection Rent_locataires:', id);
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

  const handleTenantClick = (tenant: any) => {
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
            <p className="text-gray-600 mt-2">Gérez vos locataires et leurs informations</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un locataire
              </Button>
            </DialogTrigger>
            <TenantForm
              properties={properties}
              onClose={() => setIsDialogOpen(false)}
              onSubmit={handleAddTenant}
            />
          </Dialog>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0 md:space-x-4">
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <Search className="h-5 w-5 text-gray-500" />
            <Input
              type="text"
              placeholder="Rechercher un locataire..."
              className="flex-1"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <select className="border rounded px-4 py-2 text-sm">
              <option>Trier par</option>
              <option>Nom</option>
              <option>Propriété</option>
              <option>Date d'ajout</option>
            </select>
            <select className="border rounded px-4 py-2 text-sm">
              <option>Filtrer par</option>
              <option>Actif</option>
              <option>Inactif</option>
              <option>En attente</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTenants.map((tenant) => (
            <Card key={tenant.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={tenant.image || "https://github.com/shadcn.png"} />
                      <AvatarFallback>
                        {tenant.name && tenant.name.length >= 2 
                          ? tenant.name.substring(0, 2).toUpperCase() 
                          : 'LO'
                        }
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold">{tenant.name || 'Nom non défini'}</h3>
                      <p className="text-sm text-gray-500">{tenant.email || 'Email non défini'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">{tenant.status || 'Statut inconnu'}</Badge>
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
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm text-gray-600 flex items-center">
                  <Phone className="mr-2 h-4 w-4" />
                  {tenant.phone || 'Téléphone non défini'}
                </div>
                <div className="text-sm text-gray-600 flex items-center">
                  <MapPin className="mr-2 h-4 w-4" />
                  {tenant.property || 'Propriété non définie'}
                </div>
                <div className="text-sm text-gray-600 flex items-center">
                  <Euro className="mr-2 h-4 w-4" />
                  {tenant.rentAmount || '0'} / mois
                </div>
                <div className="text-sm text-gray-600 flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  Prochain paiement: {tenant.nextPayment || 'Non défini'}
                </div>
                
                {/* Actions */}
                <div className="flex space-x-2 pt-3 border-t">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleTenantClick(tenant)}
                    className="flex-1"
                  >
                    Détails
                  </Button>
                  <Link to={`/tenant-space?userId=${tenant.id}`}>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1"
                    >
                      <Eye className="h-3 w-3" />
                      Espace
                    </Button>
                  </Link>
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
