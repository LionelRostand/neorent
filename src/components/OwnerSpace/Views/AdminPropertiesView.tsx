
import React from 'react';
import { Plus, Building, Home, Users, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useOwnerData } from '@/hooks/useOwnerData';

interface AdminPropertiesViewProps {
  currentProfile: any;
}

const AdminPropertiesView: React.FC<AdminPropertiesViewProps> = ({ currentProfile }) => {
  const { properties } = useOwnerData(currentProfile);

  const totalProperties = properties.length;
  const occupiedProperties = properties.filter(p => p.status === 'Occupé').length;
  const occupancyRate = totalProperties > 0 ? Math.round((occupiedProperties / totalProperties) * 100) : 0;
  const totalRooms = properties.reduce((sum, p) => sum + (p.totalRooms || 0), 0);
  const occupiedRooms = properties.reduce((sum, p) => sum + (p.totalRooms || 0) - (p.availableRooms || 0), 0);
  const monthlyRevenue = properties.reduce((sum, p) => sum + (parseFloat(p.rent) || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Propriétés</h1>
            <p className="text-gray-600 mt-1">Gérez vos biens immobiliers</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un bien
          </Button>
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
              <p className="text-xs text-muted-foreground">
                {totalProperties} propriétés dans votre portefeuille
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taux d'Occupation</CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{occupancyRate}%</div>
              <p className="text-xs text-muted-foreground">
                {occupancyRate}% de vos propriétés sont occupées
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chambres Colocation</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{occupiedRooms}/{totalRooms}</div>
              <p className="text-xs text-muted-foreground">
                {occupiedRooms}/{totalRooms} chambres occupées
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenus Mensuels</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{monthlyRevenue}€</div>
              <p className="text-xs text-muted-foreground">
                Revenus réels perçus
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Properties List */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des Propriétés</CardTitle>
          </CardHeader>
          <CardContent>
            {properties.length === 0 ? (
              <div className="text-center py-8">
                <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Aucune propriété trouvée</p>
                <p className="text-sm text-gray-400">Commencez par ajouter votre première propriété</p>
              </div>
            ) : (
              <div className="space-y-4">
                {properties.map((property) => (
                  <div key={property.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Building className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{property.title}</h3>
                        <p className="text-sm text-gray-600">{property.address}</p>
                        <p className="text-sm text-gray-500">{property.type} • {property.surface}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{property.rent}€/mois</p>
                      <p className="text-sm text-gray-600">{property.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPropertiesView;
