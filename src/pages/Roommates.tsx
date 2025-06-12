import React, { useState } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Mail, Phone, Home, UserCheck, CheckCircle, Clock, XCircle, Users, Edit, Trash2 } from 'lucide-react';
import MetricCard from '@/components/MetricCard';
import RoommateForm from '@/components/RoommateForm';
import RoommateDetailsModal from '@/components/RoommateDetailsModal';
import RoommateEditModal from '@/components/RoommateEditModal';
import { useFirebaseRoommates } from '@/hooks/useFirebaseRoommates';
import { useFirebaseProperties } from '@/hooks/useFirebaseProperties';
import { useToast } from '@/hooks/use-toast';

const Roommates = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRoommate, setSelectedRoommate] = useState(null);
  const [editingRoommate, setEditingRoommate] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { roommates, loading, error, addRoommate, updateRoommate, deleteRoommate } = useFirebaseRoommates();
  const { properties } = useFirebaseProperties();
  const { toast } = useToast();

  const activeCount = roommates.filter(r => r.status === 'Actif').length;
  const inactiveCount = roommates.filter(r => r.status === 'Inactif').length;
  const searchingCount = roommates.filter(r => r.status === 'En recherche').length;
  const totalCount = roommates.length;

  const handleAddRoommate = async (data: any) => {
    try {
      const newRoommate = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        property: data.property,
        roomNumber: data.roomNumber,
        rentAmount: data.rentAmount,
        status: 'Actif',
        primaryTenant: data.primaryTenant,
        moveInDate: data.moveInDate,
        image: data.imageBase64 ? `data:image/jpeg;base64,${data.imageBase64}` : null
      };

      await addRoommate(newRoommate);
      toast({
        title: "Succès",
        description: "Le colocataire a été ajouté avec succès.",
      });
      console.log('Colocataire ajouté à la collection Rent_colocataires:', newRoommate);
    } catch (err) {
      console.error('Erreur lors de l\'ajout du colocataire:', err);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'ajout du colocataire.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateRoommate = async (id: string, updates: any) => {
    try {
      await updateRoommate(id, updates);
      toast({
        title: "Succès",
        description: "Le colocataire a été modifié avec succès.",
      });
      console.log('Colocataire modifié dans la collection Rent_colocataires:', { id, updates });
    } catch (err) {
      console.error('Erreur lors de la modification du colocataire:', err);
      toast({
        title: "Erreur",
        description: "Erreur lors de la modification du colocataire.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteRoommate = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce colocataire ?')) {
      try {
        await deleteRoommate(id);
        toast({
          title: "Succès",
          description: "Le colocataire a été supprimé avec succès.",
        });
        console.log('Colocataire supprimé de la collection Rent_colocataires:', id);
      } catch (err) {
        console.error('Erreur lors de la suppression du colocataire:', err);
        toast({
          title: "Erreur",
          description: "Erreur lors de la suppression du colocataire.",
          variant: "destructive",
        });
      }
    }
  };

  const handleViewDetails = (roommate: any) => {
    setSelectedRoommate(roommate);
    setIsDetailsModalOpen(true);
  };

  const handleEditRoommate = (roommate: any) => {
    setEditingRoommate(roommate);
    setIsEditModalOpen(true);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des colocataires...</p>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="space-y-6 sm:space-y-8">
          {/* En-tête avec titre et bouton d'ajout */}
          <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gestion des Colocataires</h1>
                <p className="text-gray-600 mt-2 text-sm sm:text-base">Gérez et suivez tous vos colocataires en un seul endroit</p>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 w-full sm:w-auto">
                    <Plus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="text-sm sm:text-base">Ajouter un colocataire</span>
                  </Button>
                </DialogTrigger>
                <RoommateForm
                  onClose={() => setIsDialogOpen(false)}
                  onSubmit={handleAddRoommate}
                  properties={properties}
                />
              </Dialog>
            </div>
          </div>

          {/* Métriques */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            <MetricCard
              title="Colocataires actifs"
              value={activeCount}
              description={`${activeCount} colocataire${activeCount > 1 ? 's' : ''} actif${activeCount > 1 ? 's' : ''}`}
              icon={CheckCircle}
              iconBgColor="bg-green-500"
              borderColor="border-l-green-500"
            />
            <MetricCard
              title="En recherche"
              value={searchingCount}
              description={`${searchingCount} colocataire${searchingCount > 1 ? 's' : ''} en recherche`}
              icon={Clock}
              iconBgColor="bg-yellow-500"
              borderColor="border-l-yellow-500"
            />
            <MetricCard
              title="Inactifs"
              value={inactiveCount}
              description={`${inactiveCount} colocataire${inactiveCount > 1 ? 's' : ''} inactif${inactiveCount > 1 ? 's' : ''}`}
              icon={XCircle}
              iconBgColor="bg-red-500"
              borderColor="border-l-red-500"
            />
            <MetricCard
              title="Total"
              value={totalCount}
              description={`${totalCount} colocataire${totalCount > 1 ? 's' : ''} au total`}
              icon={Users}
              iconBgColor="bg-blue-500"
              borderColor="border-l-blue-500"
            />
          </div>

          {/* Section Liste des Colocataires */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Liste des Colocataires</h2>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">Consultez et gérez tous vos colocataires</p>
            </div>
            
            <div className="p-4 sm:p-6">
              {roommates.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Aucun colocataire</h3>
                  <p className="mt-2 text-gray-500">Commencez par ajouter votre premier colocataire.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {roommates.map((roommate) => (
                    <Card key={roommate.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
                      <CardContent className="p-4 sm:p-6">
                        <div className="space-y-3 sm:space-y-4">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center space-x-3 min-w-0 flex-1">
                              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                                {roommate.image ? (
                                  <img 
                                    src={roommate.image} 
                                    alt={roommate.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <UserCheck className="h-5 w-5 sm:h-8 sm:w-8 text-blue-600" />
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <h3 className="font-semibold text-sm sm:text-lg text-gray-900 truncate">{roommate.name}</h3>
                                <p className="text-xs sm:text-sm text-gray-600 mt-1 truncate">{roommate.property}</p>
                              </div>
                            </div>
                            <div className="flex flex-col items-end space-y-1 ml-2">
                              <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs">
                                {roommate.status}
                              </Badge>
                              <div className="flex space-x-1">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditRoommate(roommate)}
                                  className="h-6 w-6 sm:h-8 sm:w-8 p-0"
                                >
                                  <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteRoommate(roommate.id)}
                                  className="h-6 w-6 sm:h-8 sm:w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center text-gray-600 text-xs sm:text-sm">
                              <Mail className="mr-2 h-3 w-3 sm:h-4 sm:w-4 text-blue-500 flex-shrink-0" />
                              <span className="truncate">{roommate.email}</span>
                            </div>
                            <div className="flex items-center text-gray-600 text-xs sm:text-sm">
                              <Phone className="mr-2 h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                              <span className="truncate">{roommate.phone}</span>
                            </div>
                            <div className="flex items-center text-gray-600 text-xs sm:text-sm">
                              <Home className="mr-2 h-3 w-3 sm:h-4 sm:w-4 text-orange-500 flex-shrink-0" />
                              <span className="truncate">Chambre {roommate.roomNumber} - <span className="font-medium text-blue-600">{roommate.rentAmount}€/mois</span></span>
                            </div>
                            <div className="flex items-center text-gray-600 text-xs sm:text-sm">
                              <UserCheck className="mr-2 h-3 w-3 sm:h-4 sm:w-4 text-purple-500 flex-shrink-0" />
                              <span className="truncate">Locataire principal: {roommate.primaryTenant}</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 pt-3 sm:pt-4 border-t border-gray-100">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex-1 hover:bg-blue-50 hover:border-blue-300 text-xs sm:text-sm"
                              onClick={() => handleViewDetails(roommate)}
                            >
                              Voir détails
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex-1 hover:bg-blue-50 hover:border-blue-300 text-xs sm:text-sm"
                            >
                              Contacter
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

          <RoommateDetailsModal
            roommate={selectedRoommate}
            isOpen={isDetailsModalOpen}
            onClose={() => setIsDetailsModalOpen(false)}
          />

          <RoommateEditModal
            roommate={editingRoommate}
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onSave={handleUpdateRoommate}
            properties={properties}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default Roommates;
