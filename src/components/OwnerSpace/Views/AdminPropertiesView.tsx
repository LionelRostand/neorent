
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Building, Plus, TrendingUp, DollarSign, Users, Eye, Edit, Trash2, Calculator, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog } from '@/components/ui/dialog';
import PropertyForm from '@/components/PropertyForm';
import PropertyDetailsModal from '@/components/PropertyDetailsModal';
import { useOwnerQuickActions } from '@/hooks/useOwnerQuickActions';
import { useAuth } from '@/hooks/useAuth';
import { useFormButtonConfig } from '@/hooks/useFormButtonConfig';
import { useOwnerData } from '@/hooks/useOwnerData';
import { usePropertyCharges } from '@/hooks/usePropertyCharges';

interface AdminPropertiesViewProps {
  currentProfile?: any;
}

const AdminPropertiesView: React.FC<AdminPropertiesViewProps> = ({ currentProfile }) => {
  const { t } = useTranslation();
  const { userProfile } = useAuth();
  const profile = currentProfile || userProfile;
  const { handlePropertySubmit } = useOwnerQuickActions(profile);
  const { getButtonConfig } = useFormButtonConfig();
  const { properties, roommates } = useOwnerData(profile);
  const { getGlobalSummary } = usePropertyCharges(profile);
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);

  const propertyButtonConfig = getButtonConfig('property');
  const globalSummary = getGlobalSummary();

  // Calculs des métriques avec intégration des charges
  const totalProperties = properties?.length || 0;
  const occupiedProperties = globalSummary.propertiesWithData.length;
  const totalTenants = roommates?.filter(r => r.status === 'Actif').length || 0;
  const monthlyRevenue = globalSummary.totalRevenue;
  const monthlyCharges = globalSummary.totalCharges;
  const monthlyProfit = globalSummary.totalProfit;

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

  // Fonction pour calculer l'affichage correct des locataires
  const getTenantDisplay = (property: any) => {
    if (property.locationType === 'Colocation') {
      // Pour une colocation, compter les colocataires actifs
      const propertyRoommates = roommates?.filter(r => 
        r.status === 'Actif' && (
          r.property === property.title || 
          r.property === property.address ||
          r.property?.includes(property.title) ||
          property.title?.includes(r.property)
        )
      ) || [];
      
      const totalRooms = property.totalRooms || 1;
      const occupiedRooms = propertyRoommates.length;
      const availableRooms = totalRooms - occupiedRooms;
      
      if (occupiedRooms === 0) {
        return 'Aucun';
      } else {
        return `${occupiedRooms}/${totalRooms} occupées`;
      }
    } else {
      // Pour une location classique
      return property.tenant || 'Aucun';
    }
  };

  // Fonction pour calculer le statut correct
  const getRealStatus = (property: any) => {
    if (property.locationType === 'Colocation') {
      const propertyRoommates = roommates?.filter(r => 
        r.status === 'Actif' && (
          r.property === property.title || 
          r.property === property.address ||
          r.property?.includes(property.title) ||
          property.title?.includes(r.property)
        )
      ) || [];
      
      const totalRooms = property.totalRooms || 1;
      const occupiedRooms = propertyRoommates.length;
      
      if (occupiedRooms === 0) {
        return 'Libre';
      } else if (occupiedRooms < totalRooms) {
        return 'Partiellement occupé';
      } else {
        return 'Occupé';
      }
    } else {
      // Pour une location classique, utiliser le statut existant
      return property.status;
    }
  };

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header responsive */}
      <div className="bg-gradient-to-r from-slate-600 to-slate-700 rounded-xl p-4 sm:p-6 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Propriétés</h1>
            <p className="text-slate-100 mt-1 sm:mt-2 text-sm sm:text-base">Gérez vos propriétés et leurs informations</p>
          </div>
          <Button 
            onClick={() => setShowPropertyForm(true)}
            className="bg-white text-slate-600 hover:bg-slate-50 border-0 shadow-md w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle propriété
          </Button>
        </div>
      </div>

      {/* Metrics Grid - Layout 2x2 comme dans l'image */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <Card className="border-l-4 border-l-slate-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total des Biens</CardTitle>
            <div className="p-2 bg-slate-100 rounded-lg">
              <Building className="h-4 w-4 text-slate-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{totalProperties}</div>
            <p className="text-xs text-gray-500 mt-1">{totalProperties} propriétés dans votre portefeuille</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Taux d'Occupation</CardTitle>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">67%</div>
            <p className="text-xs text-gray-500 mt-1">Taux d'occupation des chambres et propriétés</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Chambres Colocation</CardTitle>
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">2/3</div>
            <p className="text-xs text-gray-500 mt-1">2/3 chambres occupées</p>
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
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{Math.round(globalSummary.totalRevenue)}€</div>
            <p className="text-xs text-gray-500 mt-1">Revenus réels perçus</p>
          </CardContent>
        </Card>
      </div>

      {/* Properties Table responsive */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b">
          <CardTitle className="text-lg sm:text-xl text-gray-800">Liste des Propriétés</CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          {properties && properties.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[120px]">Titre</TableHead>
                    <TableHead className="min-w-[150px]">Adresse</TableHead>
                    <TableHead className="hidden sm:table-cell">Type</TableHead>
                    <TableHead className="hidden md:table-cell">Surface</TableHead>
                    <TableHead>Loyer</TableHead>
                    <TableHead className="hidden lg:table-cell">Locataire</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right min-w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {properties.map((property) => (
                    <TableRow key={property.id}>
                      <TableCell className="font-medium">{property.title}</TableCell>
                      <TableCell className="text-sm">{property.address}</TableCell>
                      <TableCell className="hidden sm:table-cell">{property.type}</TableCell>
                      <TableCell className="hidden md:table-cell">{property.surface}m²</TableCell>
                      <TableCell className="font-semibold">{property.rent}€</TableCell>
                      <TableCell className="hidden lg:table-cell">{getTenantDisplay(property)}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(getRealStatus(property))} className="text-xs">
                          {getRealStatus(property)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={() => setSelectedProperty(property)}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12 bg-gradient-to-br from-gray-50 to-white rounded-lg border-2 border-dashed border-gray-200">
              <div className="p-3 sm:p-4 bg-gray-100 rounded-full w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 flex items-center justify-center">
                <Home className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
              </div>
              <h3 className="text-base sm:text-lg font-medium text-gray-700 mb-2">Aucune propriété</h3>
              <p className="text-sm text-gray-500 mb-4">Commencez par ajouter votre première propriété</p>
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

      {/* Modal de détails de propriété */}
      <PropertyDetailsModal
        property={selectedProperty}
        isOpen={!!selectedProperty}
        onClose={() => setSelectedProperty(null)}
      />
    </div>
  );
};

export default AdminPropertiesView;
