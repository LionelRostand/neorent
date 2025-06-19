
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Home, User, Calendar, Euro, MapPin, Phone, Mail } from 'lucide-react';

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
      <div className="text-center py-8">
        <p className="text-gray-500">Chargement des données...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Property Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Informations du logement
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Adresse:</span>
                <span>{propertyData.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Type:</span>
                <span>{propertyData.type}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Surface:</span>
                <span>{propertyData.surface}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Euro className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Loyer:</span>
                <span>{propertyData.rent}€/mois</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Charges:</span>
                <span>{propertyData.charges}€/mois</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Dépôt de garantie:</span>
                <span>{propertyData.deposit}€</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tenant Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Mes informations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-medium">Nom:</span>
                <span>{tenantData.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Email:</span>
                <span>{tenantData.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Téléphone:</span>
                <span>{tenantData.phone}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Début du bail:</span>
                <span>{new Date(tenantData.leaseStart).toLocaleDateString('fr-FR')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Fin du bail:</span>
                <span>{new Date(tenantData.leaseEnd).toLocaleDateString('fr-FR')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Statut:</span>
                <Badge variant={tenantData.status === 'À jour' ? 'default' : 'destructive'}>
                  {tenantData.status}
                </Badge>
              </div>
            </div>
          </div>

          {tenantData.type === 'Colocataire' && tenantData.roomNumber && (
            <div className="pt-4 border-t">
              <div className="flex items-center gap-2">
                <span className="font-medium">Numéro de chambre:</span>
                <Badge variant="outline">{tenantData.roomNumber}</Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Property Features */}
      <Card>
        <CardHeader>
          <CardTitle>Caractéristiques du logement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {propertyData.features?.map((feature: string, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium">Étage:</span>
                <span>{propertyData.floor}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Ascenseur:</span>
                <Badge variant={propertyData.elevator ? 'default' : 'secondary'}>
                  {propertyData.elevator ? 'Oui' : 'Non'}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Parking:</span>
                <Badge variant={propertyData.parking ? 'default' : 'secondary'}>
                  {propertyData.parking ? 'Oui' : 'Non'}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TenantOverview;
