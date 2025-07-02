
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
        {/* Header harmonisé */}
        <div className="bg-gradient-to-r from-slate-600 to-slate-700 rounded-xl p-6 text-white shadow-lg mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">{t('ownerSpace.properties.title')}</h1>
              <p className="text-slate-100 mt-2">{t('ownerSpace.properties.subtitle')}</p>
              {currentProfile && (
                <p className="text-slate-200 text-sm mt-1">
                  {t('ownerSpace.properties.owner')} {currentProfile.name || currentProfile.email}
                </p>
              )}
            </div>
            <Dialog open={isNewPropertyDialogOpen} onOpenChange={setIsNewPropertyDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-white text-slate-600 hover:bg-slate-50 border-0 shadow-md">
                  <Plus className="h-4 w-4 mr-2" />
                  {t('ownerSpace.properties.newProperty')}
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

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-slate-500 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{t('ownerSpace.properties.totalProperties')}</CardTitle>
              <div className="p-2 bg-slate-100 rounded-lg">
                <Building className="h-4 w-4 text-slate-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{totalProperties}</div>
              <p className="text-xs text-gray-500 mt-1">{totalProperties} {t('ownerSpace.properties.totalPropertiesDesc')}</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{t('ownerSpace.properties.occupiedProperties')}</CardTitle>
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{occupiedProperties}</div>
              <p className="text-xs text-gray-500 mt-1">{occupiedProperties} {t('ownerSpace.properties.occupiedPropertiesDesc')}</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{t('ownerSpace.properties.occupancyRate')}</CardTitle>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Home className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{occupancyRate}%</div>
              <p className="text-xs text-gray-500 mt-1">{occupancyRate}% {t('ownerSpace.properties.occupancyRateDesc')}</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{t('ownerSpace.properties.monthlyRevenue')}</CardTitle>
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{monthlyRevenue}€</div>
              <p className="text-xs text-gray-500 mt-1">{t('ownerSpace.properties.monthlyRevenueDesc')}</p>
            </CardContent>
          </Card>
        </div>

        {/* Properties List */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b">
            <CardTitle className="text-xl text-gray-800">{t('ownerSpace.properties.propertiesList')}</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {properties.length === 0 ? (
              <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-white rounded-lg border-2 border-dashed border-gray-200">
                <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Building className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">{t('ownerSpace.properties.noProperties')}</h3>
                <p className="text-gray-500 mb-4">{t('ownerSpace.properties.noPropertiesDesc')}</p>
                <Button className="bg-slate-600 hover:bg-slate-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  {t('ownerSpace.properties.addProperty')}
                </Button>
              </div>
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
                        return { status: t('ownerSpace.propertyOverview.status.vacant'), color: 'bg-gray-100 text-gray-800' };
                      } else if (occupiedRooms < totalRooms) {
                        return { status: t('ownerSpace.propertyOverview.status.partiallyOccupied'), color: 'bg-yellow-100 text-yellow-800' };
                      } else {
                        return { status: t('properties.status.occupied'), color: 'bg-green-100 text-green-800' };
                      }
                    } else {
                      return activeRoommates.length > 0 
                        ? { status: t('properties.status.occupied'), color: 'bg-green-100 text-green-800' }
                        : { status: t('ownerSpace.propertyOverview.status.vacant'), color: 'bg-gray-100 text-gray-800' };
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
                            <span className="text-gray-600">{t('ownerSpace.properties.surface')}</span>
                            <span className="font-medium">{property.surface}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">{t('ownerSpace.properties.rent')}</span>
                            <span className="font-medium">{property.rent}€</span>
                          </div>
                          {property.locationType === 'Colocation' && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">{t('ownerSpace.properties.rooms')}</span>
                              <span className="font-medium">{activeRoommates.length}/{property.totalRooms || 0}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" className="flex-1">
                            <Eye className="h-4 w-4 mr-1" />
                            {t('ownerSpace.properties.view')}
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
      </div>
    </div>
  );
};

export default PropertyView;
