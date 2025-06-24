
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Home, Users, AlertCircle, DollarSign, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog } from '@/components/ui/dialog';
import PropertyForm from '@/components/PropertyForm';
import { useOwnerQuickActions } from '@/hooks/useOwnerQuickActions';
import { useAuth } from '@/hooks/useAuth';
import { useFormButtonConfig } from '@/hooks/useFormButtonConfig';
import { useOwnerData } from '@/hooks/useOwnerData';

interface AdminPropertiesViewProps {
  currentProfile?: any;
}

const AdminPropertiesView: React.FC<AdminPropertiesViewProps> = ({ currentProfile }) => {
  const { t } = useTranslation();
  const { userProfile } = useAuth();
  const profile = currentProfile || userProfile;
  const { handlePropertySubmit } = useOwnerQuickActions(profile);
  const { getButtonConfig } = useFormButtonConfig();
  const { properties, tenants, payments } = useOwnerData(profile);
  const [showPropertyForm, setShowPropertyForm] = useState(false);

  const propertyButtonConfig = getButtonConfig('property');

  const totalProperties = properties?.length || 0;
  const occupiedProperties = properties?.filter(p => p.tenant).length || 0;
  const totalTenants = tenants?.length || 0;
  const monthlyRevenue = tenants?.reduce((sum, t) => sum + (parseFloat(t.rentAmount) || 0), 0) || 0;

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Occupé':
        return 'default';
      case 'Libre':
        return 'secondary';
      case 'En maintenance':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header harmonisé avec la sidebar */}
      <div className="bg-gradient-to-r from-slate-600 to-slate-700 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Propriétés</h1>
            <p className="text-slate-100 mt-2">Gérez vos propriétés et leurs informations</p>
          </div>
          <Button 
            onClick={() => setShowPropertyForm(true)}
            className="bg-white text-slate-600 hover:bg-slate-50 border-0 shadow-md"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle propriété
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-slate-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Propriétés</CardTitle>
            <div className="p-2 bg-slate-100 rounded-lg">
              <Home className="h-4 w-4 text-slate-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{totalProperties}</div>
            <p className="text-xs text-gray-500 mt-1">{totalProperties} propriétés enregistrées</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Propriétés Occupées</CardTitle>
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{occupiedProperties}</div>
            <p className="text-xs text-gray-500 mt-1">{occupiedProperties} propriétés avec locataires</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Locataires</CardTitle>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{totalTenants}</div>
            <p className="text-xs text-gray-500 mt-1">{totalTenants} locataires actifs</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Revenus Mensuels</CardTitle>
            <div className="p-2 bg-purple-100 rounded-lg">
              <DollarSign className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{monthlyRevenue}€</div>
            <p className="text-xs text-gray-500 mt-1">Revenus mensuels totaux</p>
          </CardContent>
        </Card>
      </div>

      {/* Properties Table */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b">
          <CardTitle className="text-xl text-gray-800">Liste des Propriétés</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {properties && properties.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titre</TableHead>
                  <TableHead>Adresse</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Surface</TableHead>
                  <TableHead>Loyer</TableHead>
                  <TableHead>Locataire</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {properties.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell className="font-medium">{property.title}</TableCell>
                    <TableCell>{property.address}</TableCell>
                    <TableCell>{property.type}</TableCell>
                    <TableCell>{property.surface}m²</TableCell>
                    <TableCell>{property.rent}€</TableCell>
                    <TableCell>{property.tenant || 'Aucun'}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(property.status)}>
                        {property.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-white rounded-lg border-2 border-dashed border-gray-200">
              <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Home className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Aucune propriété</h3>
              <p className="text-gray-500 mb-4">Commencez par ajouter votre première propriété</p>
              <Button className="bg-slate-600 hover:bg-slate-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une propriété
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showPropertyForm} onOpenChange={setShowPropertyForm}>
        <PropertyForm 
          onClose={() => setShowPropertyForm(false)}
          onSubmit={handlePropertySubmit}
          buttonConfig={propertyButtonConfig}
        />
      </Dialog>
    </div>
  );
};

export default AdminPropertiesView;
