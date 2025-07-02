
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
      {/* Header responsive avec amélioration mobile */}
      <div className="bg-gradient-to-r from-slate-600 to-slate-700 rounded-xl p-4 sm:p-6 text-white shadow-lg">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight">{t('properties.title')}</h1>
              <p className="text-slate-100 mt-1 sm:mt-2 text-sm sm:text-base leading-relaxed">
                {t('properties.subtitle')}
              </p>
              {profile && (
                <p className="text-slate-200 text-xs sm:text-sm mt-1">
                  {t('ownerSpace.owner')}: {profile.name || profile.email}
                </p>
              )}
            </div>
            <div className="flex-shrink-0 w-full sm:w-auto">
              <Button 
                onClick={() => setShowPropertyForm(true)}
                className="bg-white text-slate-600 hover:bg-slate-50 border-0 shadow-md w-full sm:w-auto text-sm sm:text-base px-4 py-2 sm:px-6"
              >
                <Plus className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">{t('properties.addProperty')}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Grid responsive amélioré */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <Card className="border-l-4 border-l-slate-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 leading-tight">{t('properties.totalProperties')}</CardTitle>
            <div className="p-1.5 sm:p-2 bg-slate-100 rounded-lg flex-shrink-0">
              <Home className="h-3 w-3 sm:h-4 sm:w-4 text-slate-600" />
            </div>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{totalProperties}</div>
            <p className="text-xs text-gray-500 mt-1 leading-tight">{totalProperties} {t('properties.propertiesRegistered')}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 leading-tight">{t('properties.occupiedProperties')}</CardTitle>
            <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg flex-shrink-0">
              <Users className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{occupiedProperties}</div>
            <p className="text-xs text-gray-500 mt-1 leading-tight">{occupiedProperties} {t('properties.propertiesWithTenants')}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 leading-tight">{t('properties.totalTenants')}</CardTitle>
            <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg flex-shrink-0">
              <Users className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{totalTenants}</div>
            <p className="text-xs text-gray-500 mt-1 leading-tight">{totalTenants} {t('properties.activeTenants')}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 leading-tight">{t('properties.monthlyRevenue')}</CardTitle>
            <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg flex-shrink-0">
              <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{monthlyRevenue}€</div>
            <p className="text-xs text-gray-500 mt-1 leading-tight">{t('properties.metrics.revenueDescription')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Properties Table responsive amélioré */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b px-3 sm:px-6 py-3 sm:py-4">
          <CardTitle className="text-base sm:text-lg lg:text-xl text-gray-800">{t('properties.listTitle')}</CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-3 lg:p-6">
          {properties && properties.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[100px] px-2 sm:px-4 text-xs sm:text-sm">{t('properties.fields.title')}</TableHead>
                    <TableHead className="min-w-[120px] px-2 sm:px-4 text-xs sm:text-sm">{t('properties.address')}</TableHead>
                    <TableHead className="hidden sm:table-cell px-2 sm:px-4 text-xs sm:text-sm">{t('properties.fields.type')}</TableHead>
                    <TableHead className="hidden md:table-cell px-2 sm:px-4 text-xs sm:text-sm">{t('properties.surface')}</TableHead>
                    <TableHead className="px-2 sm:px-4 text-xs sm:text-sm">{t('properties.rent')}</TableHead>
                    <TableHead className="hidden lg:table-cell px-2 sm:px-4 text-xs sm:text-sm">{t('tenants.tenant')}</TableHead>
                    <TableHead className="px-2 sm:px-4 text-xs sm:text-sm">{t('properties.fields.status')}</TableHead>
                    <TableHead className="text-right min-w-[80px] px-2 sm:px-4 text-xs sm:text-sm">{t('properties.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {properties.map((property) => (
                    <TableRow key={property.id}>
                      <TableCell className="font-medium px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">{property.title}</TableCell>
                      <TableCell className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">{property.address}</TableCell>
                      <TableCell className="hidden sm:table-cell px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">{property.type}</TableCell>
                      <TableCell className="hidden md:table-cell px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">{property.surface}m²</TableCell>
                      <TableCell className="font-semibold px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">{property.rent}€</TableCell>
                      <TableCell className="hidden lg:table-cell px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">{property.tenant || t('common.none')}</TableCell>
                      <TableCell className="px-2 sm:px-4 py-2 sm:py-3">
                        <Badge variant={getStatusBadgeVariant(property.status)} className="text-xs">
                          {property.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right px-2 sm:px-4 py-2 sm:py-3">
                        <div className="flex justify-end space-x-1">
                          <Button variant="ghost" size="sm" className="h-6 w-6 sm:h-8 sm:w-8 p-0">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 w-6 sm:h-8 sm:w-8 p-0">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 w-6 sm:h-8 sm:w-8 p-0">
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
            <div className="text-center py-8 sm:py-12 bg-gradient-to-br from-gray-50 to-white rounded-lg border-2 border-dashed border-gray-200 mx-3 sm:mx-0">
              <div className="p-3 sm:p-4 bg-gray-100 rounded-full w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 flex items-center justify-center">
                <Home className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
              </div>
              <h3 className="text-sm sm:text-base lg:text-lg font-medium text-gray-700 mb-2 px-4">{t('properties.noProperties')}</h3>
              <p className="text-xs sm:text-sm text-gray-500 mb-4 px-4">{t('properties.noPropertiesDesc')}</p>
              <Button className="bg-slate-600 hover:bg-slate-700 text-white text-sm px-4 py-2">
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
