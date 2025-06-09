
import React, { useState } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Mail, Phone, Home, UserCheck, CheckCircle, Clock, XCircle, Users } from 'lucide-react';
import MetricCard from '@/components/MetricCard';
import RoommateForm from '@/components/RoommateForm';
import RoommateDetailsModal from '@/components/RoommateDetailsModal';
import { useFirebaseRoommates } from '@/hooks/useFirebaseRoommates';
import { useFirebaseProperties } from '@/hooks/useFirebaseProperties';

const Roommates = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRoommate, setSelectedRoommate] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const { roommates, loading, error, addRoommate } = useFirebaseRoommates();
  const { properties } = useFirebaseProperties();

  const activeCount = roommates.filter(r => r.status === 'Actif').length;
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
      console.log('Colocataire ajouté à la collection Rent_colocataires:', newRoommate);
    } catch (err) {
      console.error('Erreur lors de l\'ajout du colocataire:', err);
    }
  };

  const handleViewDetails = (roommate: any) => {
    setSelectedRoommate(roommate);
    setIsDetailsModalOpen(true);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Chargement des colocataires...</div>
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
            <h1 className="text-3xl font-bold text-gray-900">Colocataires</h1>
            <p className="text-gray-600 mt-2">Gérez les colocataires de vos biens</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un colocataire
              </Button>
            </DialogTrigger>
            <RoommateForm
              onClose={() => setIsDialogOpen(false)}
              onSubmit={handleAddRoommate}
              properties={properties}
            />
          </Dialog>
        </div>

        {/* Métriques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
            value={0}
            description="0 colocataire en recherche"
            icon={Clock}
            iconBgColor="bg-yellow-500"
            borderColor="border-l-yellow-500"
          />
          <MetricCard
            title="Inactifs"
            value={0}
            description="0 colocataire inactif"
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

        {/* Titre Liste */}
        <div className="pt-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Liste des Colocataires</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roommates.map((roommate) => (
            <Card key={roommate.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                        {roommate.image ? (
                          <img 
                            src={roommate.image} 
                            alt={roommate.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <UserCheck className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">{roommate.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{roommate.property}</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      {roommate.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600 text-sm">
                      <Mail className="mr-2 h-4 w-4" />
                      {roommate.email}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <Phone className="mr-2 h-4 w-4" />
                      {roommate.phone}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <Home className="mr-2 h-4 w-4" />
                      {roommate.roomNumber} - {roommate.rentAmount}/mois
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <UserCheck className="mr-2 h-4 w-4" />
                      Locataire principal: {roommate.primaryTenant}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 pt-4 border-t">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleViewDetails(roommate)}
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

        <RoommateDetailsModal
          roommate={selectedRoommate}
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
        />
      </div>
    </MainLayout>
  );
};

export default Roommates;
