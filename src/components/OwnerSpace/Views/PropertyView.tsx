
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Building, Home, Users, DollarSign, Edit, Trash2, Eye, TrendingUp, Calculator } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import PropertyForm from '@/components/PropertyForm';
import PropertyDetailsModal from '@/components/PropertyDetailsModal';
import { useOwnerData } from '@/hooks/useOwnerData';
import { usePropertyCharges } from '@/hooks/usePropertyCharges';

interface PropertyViewProps {
  currentProfile: any;
  onViewChange: (view: string) => void;
}

const PropertyView: React.FC<PropertyViewProps> = ({ currentProfile, onViewChange }) => {
  const { i18n } = useTranslation();
  const [isNewPropertyDialogOpen, setIsNewPropertyDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const { properties, roommates } = useOwnerData(currentProfile);
  const { getGlobalSummary } = usePropertyCharges(currentProfile);

  // Get texts based on current language
  const getLocalizedText = (key: string) => {
    const currentLang = i18n.language;
    
    const texts: Record<string, Record<string, string>> = {
      title: {
        fr: 'Propriétés',
        en: 'Properties'
      },
      subtitle: {
        fr: 'Gérez vos biens immobiliers',
        en: 'Manage your real estate properties'
      },
      addProperty: {
        fr: 'Ajouter un bien',
        en: 'Add Property'
      },
      newProperty: {
        fr: 'Nouvelle propriété',
        en: 'New Property'
      },
      totalProperties: {
        fr: 'Total des Biens',
        en: 'Total Properties'
      },
      totalPropertiesDesc: {
        fr: 'propriétés dans votre portefeuille',
        en: 'properties in your portfolio'
      },
      occupancyRate: {
        fr: 'Taux d\'Occupation',
        en: 'Occupancy Rate'
      },
      occupancyRateDesc: {
        fr: 'de vos propriétés sont occupées',
        en: 'of your properties are occupied'
      },
      occupiedProperties: {
        fr: 'Propriétés Occupées',
        en: 'Occupied Properties'
      },
      occupiedPropertiesDesc: {
        fr: 'propriétés avec locataires',
        en: 'properties with tenants'
      },
      sharedRooms: {
        fr: 'Chambres Colocation',
        en: 'Shared Rooms'
      },
      sharedRoomsDesc: {
        fr: 'chambres occupées',
        en: 'rooms occupied'
      },
      totalTenants: {
        fr: 'Total Locataires',
        en: 'Total Tenants'
      },
      monthlyRevenue: {
        fr: 'Revenus Mensuels',
        en: 'Monthly Revenue'
      },
      monthlyCharges: {
        fr: 'Charges Mensuelles',
        en: 'Monthly Charges'
      },
      monthlyProfit: {
        fr: 'Bénéfice Mensuel',
        en: 'Monthly Profit'
      },
      monthlyRevenueDesc: {
        fr: 'Revenus totaux',
        en: 'Total revenue'
      },
      monthlyChargesDesc: {
        fr: 'Charges totales',
        en: 'Total charges'
      },
      monthlyProfitDesc: {
        fr: 'Bénéfice réel',
        en: 'Actual profit'
      },
      propertiesList: {
        fr: 'Liste des Propriétés',
        en: 'Properties List'
      },
      noProperties: {
        fr: 'Aucune propriété trouvée',
        en: 'No properties found'
      },
      noPropertiesDesc: {
        fr: 'Commencez par ajouter votre premier bien',
        en: 'Start by adding your first property'
      },
      surface: {
        fr: 'Surface:',
        en: 'Area:'
      },
      rent: {
        fr: 'Loyer:',
        en: 'Rent:'
      },
      rooms: {
        fr: 'Chambres:',
        en: 'Rooms:'
      },
      view: {
        fr: 'Voir',
        en: 'View'
      },
      vacant: {
        fr: 'Vacant',
        en: 'Vacant'
      },
      occupied: {
        fr: 'Occupé',
        en: 'Occupied'
      },
      partiallyOccupied: {
        fr: 'Partiellement Occupé',
        en: 'Partially Occupied'
      },
      complete: {
        fr: 'Complet',
        en: 'Full'
      }
    };

    return texts[key]?.[currentLang] || texts[key]?.['fr'] || key;
  };

  // Calculate metrics using charges integration
  const globalSummary = getGlobalSummary();
  const totalProperties = properties.length;
  const occupiedProperties = globalSummary.propertiesWithData.length;
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
  
  // Use calculated profitability data
  const monthlyRevenue = globalSummary.totalRevenue;
  const monthlyCharges = globalSummary.totalCharges;
  const monthlyProfit = globalSummary.totalProfit;

  return (
    <div className="min-h-screen">
      <div className="p-3 md:p-6">
        {/* Header harmonisé */}
        <div className="bg-gradient-to-r from-slate-600 to-slate-700 rounded-xl p-4 md:p-6 text-white shadow-lg mb-4 md:mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{getLocalizedText('title')}</h1>
              <p className="text-slate-100 mt-2 text-sm md:text-base">{getLocalizedText('subtitle')}</p>
            </div>
            <Dialog open={isNewPropertyDialogOpen} onOpenChange={setIsNewPropertyDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-white text-slate-600 hover:bg-slate-50 border-0 shadow-md w-full md:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  {getLocalizedText('newProperty')}
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
        </div>

        {/* Metrics Grid avec nouvelles cartes pour charges et bénéfices */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 mb-6 md:mb-8">
          <Card className="border-l-4 border-l-slate-500 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{getLocalizedText('totalProperties')}</CardTitle>
              <div className="p-2 bg-slate-100 rounded-lg">
                <Building className="h-4 w-4 text-slate-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{totalProperties}</div>
              <p className="text-xs text-gray-500 mt-1">{totalProperties} {getLocalizedText('totalPropertiesDesc')}</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{getLocalizedText('occupiedProperties')}</CardTitle>
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{occupiedProperties}</div>
              <p className="text-xs text-gray-500 mt-1">{occupiedProperties} {getLocalizedText('occupiedPropertiesDesc')}</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{getLocalizedText('monthlyRevenue')}</CardTitle>
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{monthlyRevenue}€</div>
              <p className="text-xs text-gray-500 mt-1">{getLocalizedText('monthlyRevenueDesc')}</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{getLocalizedText('monthlyCharges')}</CardTitle>
              <div className="p-2 bg-red-100 rounded-lg">
                <Calculator className="h-4 w-4 text-red-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{monthlyCharges}€</div>
              <p className="text-xs text-gray-500 mt-1">{getLocalizedText('monthlyChargesDesc')}</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{getLocalizedText('monthlyProfit')}</CardTitle>
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${monthlyProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {monthlyProfit >= 0 ? '+' : ''}{monthlyProfit}€
              </div>
              <p className="text-xs text-gray-500 mt-1">{getLocalizedText('monthlyProfitDesc')}</p>
            </CardContent>
          </Card>
        </div>

        {/* Properties List */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b">
            <CardTitle className="text-xl text-gray-800">{getLocalizedText('propertiesList')}</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {properties.length === 0 ? (
              <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-white rounded-lg border-2 border-dashed border-gray-200">
                <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Building className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">{getLocalizedText('noProperties')}</h3>
                <p className="text-gray-500 mb-4">{getLocalizedText('noPropertiesDesc')}</p>
                <Button className="bg-slate-600 hover:bg-slate-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  {getLocalizedText('addProperty')}
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                {properties.map((property) => {
                  const activeRoommates = roommates.filter(roommate => 
                    roommate.property === property.title && roommate.status === 'Actif'
                  );
                  
                  const getStatusInfo = () => {
                    if (property.locationType === 'Colocation') {
                      const totalRooms = property.totalRooms || 0;
                      const occupiedRooms = activeRoommates.length;
                      
                      if (occupiedRooms === 0) {
                        return { status: getLocalizedText('vacant'), color: 'bg-gray-100 text-gray-800' };
                      } else if (occupiedRooms < totalRooms) {
                        return { status: getLocalizedText('partiallyOccupied'), color: 'bg-yellow-100 text-yellow-800' };
                      } else {
                        return { status: getLocalizedText('complete'), color: 'bg-green-100 text-green-800' };
                      }
                    } else {
                      return activeRoommates.length > 0 
                        ? { status: getLocalizedText('occupied'), color: 'bg-green-100 text-green-800' }
                        : { status: getLocalizedText('vacant'), color: 'bg-gray-100 text-gray-800' };
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
                            <span className="text-gray-600">{getLocalizedText('surface')}</span>
                            <span className="font-medium">{property.surface}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">{getLocalizedText('rent')}</span>
                            <span className="font-medium">{property.rent}€</span>
                          </div>
                          {property.locationType === 'Colocation' && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">{getLocalizedText('rooms')}</span>
                              <span className="font-medium">{activeRoommates.length}/{property.totalRooms || 0}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => setSelectedProperty(property)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            {getLocalizedText('view')}
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
          </CardContent>
        </Card>

        {/* Modal de détails de propriété */}
        <PropertyDetailsModal
          property={selectedProperty}
          isOpen={!!selectedProperty}
          onClose={() => setSelectedProperty(null)}
        />
      </div>
    </div>
  );
};

export default PropertyView;
