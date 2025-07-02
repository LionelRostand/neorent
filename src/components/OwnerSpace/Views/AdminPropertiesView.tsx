
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

  console.log('AdminPropertiesView - Using profile:', profile);
  console.log('AdminPropertiesView - Filtered properties:', properties);

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
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header responsive */}
      <div className="bg-gradient-to-r from-slate-600 to-slate-700 rounded-xl p-4 sm:p-6 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">{t('properties.title')}</h1>
            <p className="text-slate-100 mt-1 sm:mt-2 text-sm sm:text-base">
              {t('properties.subtitle')}
            </p>
            {profile && (
              <p className="text-slate-200 text-sm mt-1">
                {t('ownerSpace.owner')}: {profile.name || profile.email}
              </p>
            )}
          </div>
          <Button 
            onClick={() => setShowPropertyForm(true)}
            className="bg-white text-slate-600 hover:bg-slate-50 border-0 shadow-md w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            {t('properties.addProperty')}
          </Button>
        </div>
      </div>

      {/* Metrics Grid responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="border-l-4 border-l-slate-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{t('properties.totalProperties')}</CardTitle>
            <div className="p-2 bg-slate-100 rounded-lg">
              <Home className="h-4 w-4 text-slate-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{totalProperties}</div>
            <p className="text-xs text-gray-500 mt-1">{totalProperties} {t('properties.propertiesRegistered')}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{t('properties.occupiedProperties')}</CardTitle>
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{occupiedProperties}</div>
            <p className="text-xs text-gray-500 mt-1">{occupiedProperties} {t('properties.propertiesWithTenants')}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{t('properties.totalTenants')}</CardTitle>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{totalTenants}</div>
            <p className="text-xs text-gray-500 mt-1">{totalTenants} {t('properties.activeTenants')}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{t('properties.monthlyRevenue')}</CardTitle>
            <div className="p-2 bg-purple-100 rounded-lg">
              <DollarSign className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{monthlyRevenue}€</div>
            <p className="text-xs text-gray-500 mt-1">{t('properties.metrics.revenueDescription')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Properties Table responsive */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b">
          <CardTitle className="text-lg sm:text-xl text-gray-800">{t('properties.listTitle')}</CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          {properties && properties.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[120px]">{t('properties.fields.title')}</TableHead>
                    <TableHead className="min-w-[150px]">{t('properties.address')}</TableHead>
                    <TableHead className="hidden sm:table-cell">{t('properties.fields.type')}</TableHead>
                    <TableHead className="hidden md:table-cell">{t('properties.surface')}</TableHead>
                    <TableHead>{t('properties.rent')}</TableHead>
                    <TableHead className="hidden lg:table-cell">{t('tenants.tenant')}</TableHead>
                    <TableHead>{t('properties.fields.status')}</TableHead>
                    <TableHead className="text-right min-w-[100px]">{t('properties.actions')}</TableHead>
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
                      <TableCell className="hidden lg:table-cell">{property.tenant || t('common.none')}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(property.status)} className="text-xs">
                          {property.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
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
              <h3 className="text-base sm:text-lg font-medium text-gray-700 mb-2">{t('properties.noProperties')}</h3>
              <p className="text-sm text-gray-500 mb-4">{t('properties.noPropertiesDesc')}</p>
              <Button className="bg-slate-600 hover:bg-slate-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                {t('properties.addProperty')}
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
