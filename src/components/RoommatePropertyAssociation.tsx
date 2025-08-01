import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFirebaseProperties } from '@/hooks/useFirebaseProperties';
import { useFirebaseRoommates } from '@/hooks/useFirebaseRoommates';
import { useToast } from '@/hooks/use-toast';
import { Users, Home, Plus, Link as LinkIcon } from 'lucide-react';

interface RoommatePropertyAssociationProps {
  onClose?: () => void;
}

export const RoommatePropertyAssociation = ({ onClose }: RoommatePropertyAssociationProps) => {
  const { properties } = useFirebaseProperties();
  const { roommates, addRoommate, updateRoommate, refetch } = useFirebaseRoommates();
  const { toast } = useToast();
  
  const [selectedProperty, setSelectedProperty] = useState<string>('');
  const [newRoommate, setNewRoommate] = useState({
    name: '',
    email: '',
    phone: '',
    roomNumber: '',
    rentAmount: '',
    status: 'Actif',
    primaryTenant: '',
    moveInDate: new Date().toISOString().split('T')[0]
  });

  const handleAddRoommate = async () => {
    if (!selectedProperty || !newRoommate.name || !newRoommate.email) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir les champs obligatoires (propriété, nom, email)",
        variant: "destructive"
      });
      return;
    }

    try {
      await addRoommate({
        ...newRoommate,
        property: selectedProperty,
        image: null
      });

      toast({
        title: "Succès",
        description: "Colocataire ajouté avec succès"
      });

      // Reset form
      setNewRoommate({
        name: '',
        email: '',
        phone: '',
        roomNumber: '',
        rentAmount: '',
        status: 'Actif',
        primaryTenant: '',
        moveInDate: new Date().toISOString().split('T')[0]
      });
      setSelectedProperty('');
      
      // Refresh data
      await refetch();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de l'ajout du colocataire",
        variant: "destructive"
      });
    }
  };

  const handleUpdateRoommateProperty = async (roommateId: string, newPropertyId: string) => {
    try {
      await updateRoommate(roommateId, { property: newPropertyId });
      
      toast({
        title: "Succès",
        description: "Association mise à jour avec succès"
      });
      
      await refetch();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour",
        variant: "destructive"
      });
    }
  };

  const getPropertyRoommates = (propertyId: string) => {
    return roommates.filter(r => r.property === propertyId && r.status === 'Actif');
  };

  const getPropertyName = (propertyId: string) => {
    const property = properties.find(p => p.id === propertyId);
    return property ? property.title : propertyId;
  };

  return (
    <div className="space-y-6">
      {/* Ajouter un nouveau colocataire */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Ajouter un colocataire
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="property">Propriété *</Label>
              <Select value={selectedProperty} onValueChange={setSelectedProperty}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une propriété" />
                </SelectTrigger>
                <SelectContent>
                  {properties.map((property) => (
                    <SelectItem key={property.id} value={property.id}>
                      {property.title} - {property.address}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="name">Nom *</Label>
              <Input
                id="name"
                value={newRoommate.name}
                onChange={(e) => setNewRoommate(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nom du colocataire"
              />
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={newRoommate.email}
                onChange={(e) => setNewRoommate(prev => ({ ...prev, email: e.target.value }))}
                placeholder="email@exemple.com"
              />
            </div>

            <div>
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                value={newRoommate.phone}
                onChange={(e) => setNewRoommate(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Numéro de téléphone"
              />
            </div>

            <div>
              <Label htmlFor="roomNumber">Numéro de chambre</Label>
              <Input
                id="roomNumber"
                value={newRoommate.roomNumber}
                onChange={(e) => setNewRoommate(prev => ({ ...prev, roomNumber: e.target.value }))}
                placeholder="Ex: Chambre 1"
              />
            </div>

            <div>
              <Label htmlFor="rentAmount">Loyer mensuel (€)</Label>
              <Input
                id="rentAmount"
                type="number"
                value={newRoommate.rentAmount}
                onChange={(e) => setNewRoommate(prev => ({ ...prev, rentAmount: e.target.value }))}
                placeholder="550"
              />
            </div>
          </div>

          <Button onClick={handleAddRoommate} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter le colocataire
          </Button>
        </CardContent>
      </Card>

      {/* Associations existantes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5" />
            Associations existantes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {properties.map((property) => {
              const propertyRoommates = getPropertyRoommates(property.id);
              return (
                <div key={property.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Home className="h-4 w-4" />
                      <span className="font-medium">{property.title}</span>
                      <Badge variant="outline">
                        {propertyRoommates.length}/{property.totalRooms || 1} occupants
                      </Badge>
                    </div>
                  </div>

                  {propertyRoommates.length > 0 ? (
                    <div className="space-y-2">
                      {propertyRoommates.map((roommate) => (
                        <div key={roommate.id} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                          <div className="flex items-center gap-3">
                            <Users className="h-4 w-4" />
                            <div>
                              <span className="font-medium">{roommate.name}</span>
                              <div className="text-sm text-gray-500">
                                {roommate.email} • {roommate.roomNumber || 'Chambre non spécifiée'}
                                {roommate.rentAmount && ` • ${roommate.rentAmount}€/mois`}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={roommate.status === 'Actif' ? 'default' : 'secondary'}>
                              {roommate.status}
                            </Badge>
                            <Select
                              value={roommate.property}
                              onValueChange={(value) => handleUpdateRoommateProperty(roommate.id, value)}
                            >
                              <SelectTrigger className="w-40">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {properties.map((prop) => (
                                  <SelectItem key={prop.id} value={prop.id}>
                                    {prop.title}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-4">
                      Aucun colocataire assigné à cette propriété
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Colocataires non assignés */}
      {(() => {
        const unassignedRoommates = roommates.filter(r => 
          !properties.some(p => p.id === r.property) && r.status === 'Actif'
        );
        
        if (unassignedRoommates.length > 0) {
          return (
            <Card>
              <CardHeader>
                <CardTitle className="text-orange-600">Colocataires non assignés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {unassignedRoommates.map((roommate) => (
                    <div key={roommate.id} className="flex items-center justify-between bg-orange-50 p-3 rounded border border-orange-200">
                      <div className="flex items-center gap-3">
                        <Users className="h-4 w-4 text-orange-600" />
                        <div>
                          <span className="font-medium">{roommate.name}</span>
                          <div className="text-sm text-gray-500">
                            {roommate.email} • Propriété: {getPropertyName(roommate.property)}
                          </div>
                        </div>
                      </div>
                      <Select
                        value=""
                        onValueChange={(value) => handleUpdateRoommateProperty(roommate.id, value)}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Assigner à..." />
                        </SelectTrigger>
                        <SelectContent>
                          {properties.map((prop) => (
                            <SelectItem key={prop.id} value={prop.id}>
                              {prop.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        }
        return null;
      })()}
    </div>
  );
};