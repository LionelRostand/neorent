import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Building, Home, Users, DollarSign, Edit, Trash2, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import PropertyForm from '@/components/PropertyForm';
import { useOwnerData } from '@/hooks/useOwnerData';

interface PropertyViewProps {
  currentProfile: any;
  onViewChange: (view: string) => void;
}

const PropertyView: React.FC<PropertyViewProps> = ({ currentProfile, onViewChange }) => {
  const [isNewPropertyDialogOpen, setIsNewPropertyDialogOpen] = useState(false);
  const { properties, roommates } = useOwnerData(currentProfile);

  // Calculate metrics
  const totalProperties = properties.length;
  const occupiedProperties = properties.filter(prop => {
    const hasActiveRoommates = roommates.some(roommate => 
      roommate.property === prop.title && roommate.status === 'Actif'
    );
    return hasActiveRoommates;
  }).length;
  
  const occupancyRate = totalProperties > 0 ? Math.round((occupiedProperties / totalProperties) * 100) : 0;
  
  // Calculate shared housing rooms
  const sharedHousingProperties = properties.filter(prop => prop.locationType === 'Colocation');
  const totalSharedRooms = sharedHousingProperties.reduce((sum, prop) => sum + (prop.totalRooms || 0), 0);
  const occupiedSharedRooms = sharedHousingProperties.reduce((sum, prop) => {
    const activeRoommates = roommates.filter(roommate => 
      roommate.property === prop.title && roommate.status === 'Actif'
    );
    return sum + activeRoommates.length;
  }, 0);
  
  // Calculate monthly revenue
  const monthlyRevenue = roommates.reduce((sum, roommate) => {
    if (roommate.status === 'Actif') {
      return sum + (parseFloat(roommate.rentAmount?.toString() || '0') || 0);
    }
    return sum;
  }, 0);

  return (
    <div className="min-h-screen">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Propriétés</h1>
            <p className="text-gray-600 mt-1">Gérez vos biens immobiliers</p>
          </div>
          <Dialog open={isNewPropertyDialogOpen} onOpenChange={setIsNewPropertyDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un bien
              </Button>
            </DialogTrigger>
            <PropertyForm
              onClose={() => setIsNewPropertyDialogOpen(false)}
              onSubmit={async (data) => {
                console.log('Property data:', data);
                setIsNewPropertyDialogOpen(false);
              }}
            />
          </Dialog>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total des Biens</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProperties}</div>
              <p className="text-xs text-muted-foreground">{totalProperties} propriétés dans votre portefeuille</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taux d'Occupation</CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{occupancyRate}%</div>
              <p className="text-xs text-muted-foreground">{occupancyRate}% de vos propriétés sont occupées</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chambres Colocation</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{occupiedSharedRooms}/{totalSharedRooms}</div>
              <p className="text-xs text-muted-foreground">{occupiedSharedRooms}/{totalSharedRooms} chambres occupées</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenus Mensuels</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{monthlyRevenue}€</div>
              <p className="text-xs text-muted-foreground">Revenus réels perçus</p>
            </CardContent>
          </Card>
        </div>

        {/* Properties List */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Liste des Propriétés</h2>
        </div>

        {properties.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucune propriété trouvée</p>
              <p className="text-sm text-gray-400">Commencez par ajouter votre premier bien</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {properties.map((property) => {
              const activeRoommates = roommates.filter(roommate => 
                roommate.property === property.title && roommate.status === 'Actif'
              );
              
              const getStatusInfo = () => {
                if (property.locationType === 'Colocation') {
                  const totalRooms = property.totalRooms || 0;
                  const occupiedRooms = activeRoommates.length;
                  
                  if (occupiedRooms === 0) {
                    return { status: 'Vacant', color: 'bg-gray-100 text-gray-800' };
                  } else if (occupiedRooms < totalRooms) {
                    return { status: 'Partiellement Occupé', color: 'bg-yellow-100 text-yellow-800' };
                  } else {
                    return { status: 'Complet', color: 'bg-green-100 text-green-800' };
                  }
                } else {
                  return activeRoommates.length > 0 
                    ? { status: 'Occupé', color: 'bg-green-100 text-green-800' }
                    : { status: 'Vacant', color: 'bg-gray-100 text-gray-800' };
                }
              };

              const statusInfo = getStatusInfo();
              
              return (
                <Card key={property.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{property.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{property.address}</p>
                        <Badge variant="secondary" className="text-xs">
                          {property.type}
                        </Badge>
                      </div>
                      <Badge className={`${statusInfo.color} text-xs`}>
                        {statusInfo.status}
                      </Badge>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Surface:</span>
                        <span className="font-medium">{property.surface}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Loyer:</span>
                        <span className="font-medium">{property.rent}€</span>
                      </div>
                      {property.locationType === 'Colocation' && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Chambres:</span>
                          <span className="font-medium">{activeRoommates.length}/{property.totalRooms || 0}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" className="flex-1">
                        <Eye className="h-4 w-4 mr-1" />
                        Voir
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyView;
