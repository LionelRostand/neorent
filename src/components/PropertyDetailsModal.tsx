
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Home, DollarSign, Users, Bed, User, UserCheck, Mail, Phone, TrendingUp, TrendingDown } from 'lucide-react';
import { useFirebaseRoommates } from '@/hooks/useFirebaseRoommates';
import { useFirebaseCharges } from '@/hooks/useFirebaseCharges';

interface Property {
  id: string;
  title: string;
  address: string;
  type: string;
  surface: string;
  rent: string;
  status: string;
  tenant: string | null;
  image: string;
  locationType: string;
  totalRooms?: number | null;
  availableRooms?: number | null;
}

interface Occupant {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'Locataire principal' | 'Colocataire';
  roomNumber?: string;
  rentAmount?: string;
}

interface PropertyDetailsModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
}

const PropertyDetailsModal: React.FC<PropertyDetailsModalProps> = ({ property, isOpen, onClose }) => {
  const { roommates } = useFirebaseRoommates();
  const { charges } = useFirebaseCharges();

  if (!property) return null;

  // Récupérer les vrais occupants de cette propriété
  const getOccupants = (property: Property): Occupant[] => {
    const occupants: Occupant[] = [];
    
    // Récupérer les colocataires de cette propriété
    const propertyRoommates = roommates.filter(roommate => 
      roommate.property === property.title && roommate.status === 'Actif'
    );

    propertyRoommates.forEach(roommate => {
      occupants.push({
        id: roommate.id,
        name: roommate.name,
        email: roommate.email,
        phone: roommate.phone,
        type: roommate.primaryTenant ? 'Locataire principal' : 'Colocataire',
        roomNumber: roommate.roomNumber,
        rentAmount: roommate.rentAmount
      });
    });

    return occupants;
  };

  const occupants = getOccupants(property);

  // Calculer les revenus totaux de cette propriété
  const calculateTotalRevenue = () => {
    return occupants.reduce((total, occupant) => {
      if (occupant.rentAmount) {
        const amount = parseFloat(occupant.rentAmount.replace(/[^0-9.-]+/g, ''));
        return total + (isNaN(amount) ? 0 : amount);
      }
      return total;
    }, 0);
  };

  // Récupérer les charges de cette propriété pour le mois actuel
  const getCurrentMonthCharges = () => {
    const currentMonth = new Date().toISOString().slice(0, 7); // Format YYYY-MM
    const propertyCharges = charges.find(charge => 
      charge.propertyName === property.title && charge.month === currentMonth
    );
    return propertyCharges ? propertyCharges.total : 0;
  };

  const totalRevenue = calculateTotalRevenue();
  const totalCharges = getCurrentMonthCharges();
  const profit = totalRevenue - totalCharges;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{property.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image et informations principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
              {property.image && property.image !== '/placeholder.svg' ? (
                <img 
                  src={property.image} 
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Home className="h-16 w-16 text-gray-400" />
              )}
            </div>

            <div className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                <Badge 
                  variant={property.locationType === 'Colocation' ? 'default' : 'secondary'}
                  className={property.locationType === 'Colocation' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}
                >
                  {property.locationType}
                </Badge>
                <Badge 
                  variant={property.status === 'Occupé' ? 'default' : 'secondary'}
                  className={property.status === 'Occupé' ? 'bg-green-100 text-green-800' : ''}
                >
                  {property.status}
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <MapPin className="mr-2 h-5 w-5" />
                  {property.address}
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Type:</span> {property.type}
                  </div>
                  <div>
                    <span className="font-medium">Surface:</span> {property.surface}
                  </div>
                </div>

                {property.locationType === 'Colocation' && property.totalRooms && (
                  <div className="flex items-center text-gray-600">
                    <Bed className="mr-2 h-5 w-5" />
                    <span className="text-green-600 font-medium">
                      {property.availableRooms} chambre{property.availableRooms !== 1 ? 's' : ''} disponible{property.availableRooms !== 1 ? 's' : ''}
                    </span>
                    <span className="ml-1">/ {property.totalRooms} total</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Rentabilité et bénéfices */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Rentabilité du bien</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <div className="font-medium text-green-600">Revenus</div>
                  <div className="text-xl font-bold">{totalRevenue}€</div>
                  <div className="text-sm text-gray-600">Ce mois</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <DollarSign className="h-8 w-8 mx-auto mb-2 text-red-600" />
                  <div className="font-medium text-red-600">Charges</div>
                  <div className="text-xl font-bold">{totalCharges}€</div>
                  <div className="text-sm text-gray-600">Ce mois</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  {profit >= 0 ? (
                    <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  ) : (
                    <TrendingDown className="h-8 w-8 mx-auto mb-2 text-red-600" />
                  )}
                  <div className={`font-medium ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {profit >= 0 ? 'Bénéfice' : 'Perte'}
                  </div>
                  <div className={`text-xl font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(profit)}€
                  </div>
                  <div className="text-sm text-gray-600">Ce mois</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <div className="font-medium text-blue-600">Taux d'occupation</div>
                  <div className="text-xl font-bold">
                    {property.totalRooms ? 
                      Math.round(((property.totalRooms - (property.availableRooms || 0)) / property.totalRooms) * 100) 
                      : (occupants.length > 0 ? 100 : 0)
                    }%
                  </div>
                  <div className="text-sm text-gray-600">
                    {occupants.length} occupant{occupants.length !== 1 ? 's' : ''}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Configuration du bien */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Configuration du bien</h3>
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Home className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <div className="font-medium">{property.type}</div>
                    <div className="text-sm text-gray-600">{property.surface}</div>
                  </div>
                  
                  {property.locationType === 'Colocation' && property.totalRooms && (
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Bed className="h-8 w-8 mx-auto mb-2 text-green-600" />
                      <div className="font-medium">{property.totalRooms} chambres</div>
                      <div className="text-sm text-gray-600">
                        {property.availableRooms} disponible{property.availableRooms !== 1 ? 's' : ''}
                      </div>
                    </div>
                  )}
                  
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Users className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                    <div className="font-medium">{occupants.length} occupant{occupants.length !== 1 ? 's' : ''}</div>
                    <div className="text-sm text-gray-600">{property.locationType}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Liste des occupants */}
          <div>
            <h3 className="text-xl font-semibold mb-4">
              Liste des occupants ({occupants.length})
            </h3>
            
            {occupants.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {occupants.map((occupant) => (
                  <Card key={occupant.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          {occupant.type === 'Locataire principal' ? (
                            <User className="h-5 w-5 text-gray-400" />
                          ) : (
                            <UserCheck className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        
                        <div className="flex-1 space-y-2">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium">{occupant.name}</h4>
                            <Badge variant="outline" className="text-xs">
                              {occupant.type}
                            </Badge>
                          </div>
                          
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Mail className="mr-1 h-3 w-3" />
                              {occupant.email}
                            </div>
                            <div className="flex items-center">
                              <Phone className="mr-1 h-3 w-3" />
                              {occupant.phone}
                            </div>
                            {occupant.roomNumber && (
                              <div className="flex items-center">
                                <Bed className="mr-1 h-3 w-3" />
                                {occupant.roomNumber} - {occupant.rentAmount}/mois
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Users className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-gray-600">Aucun occupant pour ce bien</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Les occupants apparaîtront automatiquement une fois ajoutés dans la section Colocataires
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyDetailsModal;
