
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Home, DollarSign, Users, Bed, User, UserCheck, Mail, Phone, TrendingUp, TrendingDown, Calculator } from 'lucide-react';
import { useFirebaseRoommates } from '@/hooks/useFirebaseRoommates';
import { usePropertyCharges } from '@/hooks/usePropertyCharges';

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
  creditImmobilier?: string;
  floor?: string;
  charges?: {
    electricity?: number;
    water?: number;
    heating?: number;
    maintenance?: number;
    insurance?: number;
    garbage?: number;
    internet?: number;
    taxes?: number;
  };
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
  const { t } = useTranslation();
  const { roommates } = useFirebaseRoommates();
  const { calculateProfitability, getPropertyChargesDetail } = usePropertyCharges(null);

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

  // Calculer le statut d'occupation et les chambres disponibles
  const getOccupancyInfo = () => {
    if (property.locationType === 'Colocation') {
      const totalRooms = property.totalRooms || 0;
      const occupiedRooms = occupants.length;
      const availableRooms = Math.max(0, totalRooms - occupiedRooms);
      
      return {
        status: availableRooms > 0 ? 'Partiellement occupé' : 'Complet',
        availableRooms,
        totalRooms,
        occupiedRooms
      };
    } else {
      // Location classique
      return {
        status: occupants.length > 0 ? 'Occupé' : 'Libre',
        availableRooms: 0,
        totalRooms: 1,
        occupiedRooms: occupants.length
      };
    }
  };

  const occupancyInfo = getOccupancyInfo();

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

  // Utiliser les vraies données de charges depuis la base de données
  const profitabilityData = calculateProfitability(property.title);
  const chargesDetail = getPropertyChargesDetail(property.title);

  const totalRevenue = profitabilityData.monthlyRevenue;
  const totalCharges = profitabilityData.monthlyCharges;
  const profit = profitabilityData.monthlyProfit;

  // Fonction pour calculer le taux d'occupation en pourcentage
  const calculateOccupancyRate = () => {
    if (property.locationType === 'Colocation') {
      const totalRooms = property.totalRooms || 0;
      const occupiedRooms = occupants.length;
      if (totalRooms === 0) return 0;
      return Math.round((occupiedRooms / totalRooms) * 100);
    } else {
      // Location classique: 100% si occupé, 0% si libre
      return occupants.length > 0 ? 100 : 0;
    }
  };

  const occupancyRate = calculateOccupancyRate();

  // Fonction utilitaire pour formater les nombres
  const formatNumber = (value: number) => {
    return isNaN(value) ? '0' : value.toFixed(0);
  };

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
                  {t(`propertyForm.locationTypes.${property.locationType.toLowerCase()}`, property.locationType)}
                </Badge>
                <Badge 
                  variant={occupancyInfo.status === 'Libre' ? 'secondary' : 'default'}
                  className={
                    occupancyInfo.status === 'Libre' ? 'bg-gray-100 text-gray-800' :
                    occupancyInfo.status === 'Occupé' || occupancyInfo.status === 'Complet' ? 'bg-green-100 text-green-800' :
                    'bg-yellow-100 text-yellow-800'
                  }
                >
                  {occupancyInfo.status === 'Libre' ? t('properties.vacant') :
                   occupancyInfo.status === 'Complet' ? t('properties.fullyOccupied') :
                   occupancyInfo.status === 'Partiellement occupé' ? t('properties.partiallyOccupied') :
                   occupancyInfo.status}
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <MapPin className="mr-2 h-5 w-5" />
                  {property.address}
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">{t('propertyForm.type')}:</span> {t(`propertyForm.propertyTypes.${property.type.toLowerCase()}`)}
                  </div>
                  <div>
                    <span className="font-medium">{t('propertyForm.surface')}:</span> {property.surface}
                  </div>
                  {property.floor && (
                    <>
                      <div>
                        <span className="font-medium">{t('propertyForm.floor')}:</span> {property.floor}
                      </div>
                      <div></div>
                    </>
                  )}
                </div>

                {property.locationType === 'Colocation' && (
                  <div className="flex items-center text-gray-600">
                    <Bed className="mr-2 h-5 w-5" />
                    {occupancyInfo.availableRooms > 0 ? (
                      <span className="text-green-600 font-medium">
                        {occupancyInfo.availableRooms} {t('properties.roomsAvailable')}
                      </span>
                    ) : (
                      <span className="text-red-600 font-medium">
                        {t('properties.allRoomsOccupied')}
                      </span>
                    )}
                    <span className="ml-1">/ {occupancyInfo.totalRooms} total</span>
                  </div>
                )}

                {property.locationType === 'Location' && occupants.length > 0 && (
                  <div className="flex items-center text-green-600 font-medium">
                    <User className="mr-2 h-5 w-5" />
                    {t('properties.apartmentOccupied')}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Rentabilité et bénéfices */}
          <div>
            <h3 className="text-xl font-semibold mb-4">{t('properties.profitability')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <div className="font-medium text-green-600">{t('properties.revenue')}</div>
                  <div className="text-xl font-bold">{formatNumber(totalRevenue)}€</div>
                  <div className="text-sm text-gray-600">{t('properties.thisMonth')}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <DollarSign className="h-8 w-8 mx-auto mb-2 text-red-600" />
                  <div className="font-medium text-red-600">{t('properties.charges')}</div>
                  <div className="text-xl font-bold">{formatNumber(totalCharges)}€</div>
                  <div className="text-sm text-gray-600">{t('properties.thisMonth')}</div>
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
                    {profit >= 0 ? t('properties.profit') : t('properties.loss')}
                  </div>
                  <div className={`text-xl font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatNumber(Math.abs(profit))}€
                  </div>
                  <div className="text-sm text-gray-600">{t('properties.thisMonth')}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <div className="font-medium text-blue-600">{t('properties.occupancyRate')}</div>
                  <div className="text-xl font-bold">{occupancyRate}%</div>
                  <div className="text-sm text-gray-600">
                    {occupants.length} {t('properties.occupants')}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Détail des charges locatives */}
          {chargesDetail.hasCharges && (
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Calculator className="mr-2 h-5 w-5" />
                Détail des charges locatives
              </h3>
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-medium text-gray-700">Charges actuelles</div>
                        <div className="text-lg font-bold text-blue-600">{chargesDetail.lastMonthCharges}€</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-gray-700">Moyenne mensuelle</div>
                        <div className="text-lg font-bold text-gray-600">{Math.round(chargesDetail.averageMonthlyCharges)}€</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-gray-700">% des revenus</div>
                        <div className="text-lg font-bold text-orange-600">{profitabilityData.chargesPercentage.toFixed(1)}%</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-gray-700">Rentabilité</div>
                        <div className={`text-lg font-bold ${profitabilityData.profitabilityPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {profitabilityData.profitabilityPercentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    
                    {chargesDetail.monthlyCharges.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Historique récent</h4>
                        <div className="max-h-32 overflow-y-auto">
                          <div className="space-y-2">
                            {chargesDetail.monthlyCharges.slice(0, 3).map((charge, index) => (
                              <div key={index} className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded">
                                <span>{charge.month}</span>
                                <span className="font-medium">{charge.total}€</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {!chargesDetail.hasCharges && (
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Calculator className="mr-2 h-5 w-5" />
                Charges locatives
              </h3>
              <Card>
                <CardContent className="p-8 text-center">
                  <Calculator className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-gray-600">Aucune charge enregistrée</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Ajoutez les charges dans le menu "Charges Locatives" pour voir le détail de rentabilité
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Configuration du bien */}
          <div>
            <h3 className="text-xl font-semibold mb-4">{t('properties.propertyConfiguration')}</h3>
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Home className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <div className="font-medium">{t(`propertyForm.propertyTypes.${property.type.toLowerCase()}`)}</div>
                    <div className="text-sm text-gray-600">{property.surface}</div>
                  </div>
                  
                  {property.locationType === 'Colocation' && (
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Bed className="h-8 w-8 mx-auto mb-2 text-green-600" />
                      <div className="font-medium">{occupancyInfo.totalRooms} {t('properties.rooms')}</div>
                      <div className="text-sm text-gray-600">
                        {occupancyInfo.availableRooms} {t('properties.available')}
                      </div>
                    </div>
                  )}
                  
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Users className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                    <div className="font-medium">{occupants.length} {t('properties.occupants')}</div>
                    <div className="text-sm text-gray-600">{t(`propertyForm.locationTypes.${property.locationType.toLowerCase()}`, property.locationType)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Liste des occupants */}
          <div>
            <h3 className="text-xl font-semibold mb-4">
              {t('properties.occupantsList')} ({occupants.length})
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
                              {occupant.type === 'Locataire principal' ? t('properties.mainTenant') : t('properties.roommate')}
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
                                {occupant.roomNumber} - {occupant.rentAmount}{t('properties.perMonth')}
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
                  <p className="text-gray-600">{t('properties.noOccupants')}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {t('properties.noOccupantsDescription')}
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
