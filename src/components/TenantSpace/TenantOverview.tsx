import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Home, User, Calendar, Euro, MapPin, Phone, Mail, Key, Clock, Shield, CreditCard } from 'lucide-react';

interface TenantOverviewProps {
  propertyData: any;
  tenantData: any;
}

const TenantOverview: React.FC<TenantOverviewProps> = ({
  propertyData,
  tenantData
}) => {
  const { t } = useTranslation();

  if (!propertyData || !tenantData) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500 text-lg">Chargement des données...</p>
        </div>
      </div>
    );
  }

  const isRoommate = tenantData.type === 'Colocataire';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">
              Bienvenue, {tenantData.name}
            </h2>
            <p className="text-blue-100 text-sm sm:text-base">
              {isRoommate ? `Chambre ${tenantData.roomNumber}` : 'Votre logement'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant="secondary" 
              className="bg-white/20 text-white border-white/30 px-3 py-1"
            >
              {tenantData.status}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Property Information */}
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Home className="h-5 w-5 text-blue-600" />
              </div>
              {isRoommate ? 'Ma chambre' : 'Mon logement'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-gray-500 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-gray-700 block">Adresse</span>
                    <span className="text-gray-600 text-sm">{propertyData.address}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Home className="h-4 w-4 text-gray-500" />
                  <div>
                    <span className="font-medium text-gray-700 block">Type</span>
                    <span className="text-gray-600 text-sm">{propertyData.type}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 bg-gray-400 rounded-sm"></div>
                  <div>
                    <span className="font-medium text-gray-700 block">Surface</span>
                    <span className="text-gray-600 text-sm">{propertyData.surface}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Euro className="h-4 w-4 text-green-500" />
                  <div>
                    <span className="font-medium text-gray-700 block">Loyer</span>
                    <span className="text-green-600 font-semibold">{propertyData.rent}€/mois</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Euro className="h-4 w-4 text-orange-500" />
                  <div>
                    <span className="font-medium text-gray-700 block">Charges</span>
                    <span className="text-orange-600 font-semibold">{propertyData.charges}€/mois</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="h-4 w-4 text-purple-500" />
                  <div>
                    <span className="font-medium text-gray-700 block">Dépôt de garantie</span>
                    <span className="text-purple-600 font-semibold">{propertyData.deposit}€</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Property Features */}
            <div className="pt-4 border-t">
              <h4 className="font-medium text-gray-700 mb-3">Équipements</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {propertyData.features?.map((feature: string, index: number) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-700">Étage:</span>
                  <span className="text-gray-600">{propertyData.floor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-700">Ascenseur:</span>
                  <Badge variant={propertyData.elevator ? 'default' : 'secondary'} className="text-xs">
                    {propertyData.elevator ? 'Oui' : 'Non'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-700">Parking:</span>
                  <Badge variant={propertyData.parking ? 'default' : 'secondary'} className="text-xs">
                    {propertyData.parking ? 'Oui' : 'Non'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-green-100 rounded-lg">
                <User className="h-5 w-5 text-green-600" />
              </div>
              Mes informations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-gray-500" />
                  <div>
                    <span className="font-medium text-gray-700 block">Nom complet</span>
                    <span className="text-gray-600">{tenantData.name}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <div>
                    <span className="font-medium text-gray-700 block">Email</span>
                    <span className="text-gray-600 text-sm break-all">{tenantData.email}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <div>
                    <span className="font-medium text-gray-700 block">Téléphone</span>
                    <span className="text-gray-600">{tenantData.phone}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <div>
                    <span className="font-medium text-gray-700 block">Début du bail</span>
                    <span className="text-blue-600">{new Date(tenantData.leaseStart).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-orange-500" />
                  <div>
                    <span className="font-medium text-gray-700 block">Fin du bail</span>
                    <span className="text-orange-600">{new Date(tenantData.leaseEnd).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 bg-gray-400 rounded-full"></div>
                  <div>
                    <span className="font-medium text-gray-700 block">Statut</span>
                    <Badge variant={tenantData.status === 'À jour' ? 'default' : 'destructive'}>
                      {tenantData.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {isRoommate && tenantData.roomNumber && (
              <div className="pt-4 border-t">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <Key className="h-5 w-5 text-blue-600" />
                    <div>
                      <span className="font-medium text-blue-800 block">Numéro de chambre</span>
                      <Badge variant="outline" className="mt-1 border-blue-200 text-blue-700">
                        Chambre {tenantData.roomNumber}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Actions rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <button className="flex flex-col items-center gap-2 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <CreditCard className="h-6 w-6 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Paiements</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <Home className="h-6 w-6 text-green-600" />
              <span className="text-sm font-medium text-green-800">Maintenance</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              <Mail className="h-6 w-6 text-purple-600" />
              <span className="text-sm font-medium text-purple-800">Messages</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
              <User className="h-6 w-6 text-orange-600" />
              <span className="text-sm font-medium text-orange-800">Profil</span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TenantOverview;
