
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Users, UserCheck, AlertCircle, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog } from '@/components/ui/dialog';
import { useOwnerData } from '@/hooks/useOwnerData';
import { useOwnerQuickActions } from '@/hooks/useOwnerQuickActions';
import { useAuth } from '@/hooks/useAuth';
import TenantForm from '@/components/TenantForm';

interface AdminTenantsViewProps {
  currentProfile: any;
}

const AdminTenantsView: React.FC<AdminTenantsViewProps> = ({ currentProfile }) => {
  const { i18n } = useTranslation();
  const { tenants, payments, properties } = useOwnerData(currentProfile);
  const { userProfile } = useAuth();
  const profile = currentProfile || userProfile;
  const { handleTenantSubmit } = useOwnerQuickActions(profile);
  const [showTenantForm, setShowTenantForm] = useState(false);

  // Get texts based on current language
  const getLocalizedText = (key: string) => {
    const currentLang = i18n.language;
    
    const texts: Record<string, Record<string, string>> = {
      title: {
        fr: 'Locataires',
        en: 'Tenants'
      },
      subtitle: {
        fr: 'Gérez vos locataires et leurs informations',
        en: 'Manage your tenants and their information'
      },
      addTenant: {
        fr: 'Ajouter un locataire',
        en: 'Add Tenant'
      },
      totalTenants: {
        fr: 'Total Locataires',
        en: 'Total Tenants'
      },
      totalTenantsDesc: {
        fr: 'locataires enregistrés',
        en: 'registered tenants'
      },
      activeTenants: {
        fr: 'Locataires Actifs',
        en: 'Active Tenants'
      },
      activeTenantsDesc: {
        fr: 'locataires actifs',
        en: 'active tenants'
      },
      latePayments: {
        fr: 'Paiements en Retard',
        en: 'Late Payments'
      },
      latePaymentsDesc: {
        fr: 'paiements en retard',
        en: 'late payments'
      },
      monthlyRevenue: {
        fr: 'Revenus Mensuels',
        en: 'Monthly Revenue'
      },
      monthlyRevenueDesc: {
        fr: 'Revenus mensuels totaux',
        en: 'Total monthly revenue'
      },
      tenantsList: {
        fr: 'Liste des Locataires',
        en: 'Tenants List'
      },
      noTenants: {
        fr: 'Aucun locataire trouvé',
        en: 'No tenants found'
      },
      noTenantsDesc: {
        fr: 'Commencez par ajouter votre premier locataire',
        en: 'Start by adding your first tenant'
      },
      name: {
        fr: 'Nom',
        en: 'Name'
      },
      email: {
        fr: 'Email',
        en: 'Email'
      },
      phone: {
        fr: 'Téléphone',
        en: 'Phone'
      },
      property: {
        fr: 'Propriété',
        en: 'Property'
      },
      rent: {
        fr: 'Loyer',
        en: 'Rent'
      },
      status: {
        fr: 'Statut',
        en: 'Status'
      },
      nextPayment: {
        fr: 'Prochain paiement',
        en: 'Next payment'
      }
    };

    return texts[key]?.[currentLang] || texts[key]?.['fr'] || key;
  };

  const totalTenants = tenants.length;
  const activeTenants = tenants.filter(t => t.status === 'Actif').length;
  const latePayments = payments.filter(p => p.status === 'En retard').length;
  const monthlyRevenue = tenants.reduce((sum, t) => sum + (parseFloat(t.rentAmount) || 0), 0);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Actif':
        return 'default';
      case 'Inactif':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header responsive */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-xl p-4 sm:p-6 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">{getLocalizedText('title')}</h1>
            <p className="text-teal-100 mt-1 sm:mt-2 text-sm sm:text-base">{getLocalizedText('subtitle')}</p>
          </div>
          <Button 
            className="bg-white text-teal-600 hover:bg-teal-50 border-0 shadow-md w-full sm:w-auto"
            onClick={() => setShowTenantForm(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            {getLocalizedText('addTenant')}
          </Button>
        </div>
      </div>

      {/* Metrics Grid responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="border-l-4 border-l-teal-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{getLocalizedText('totalTenants')}</CardTitle>
            <div className="p-2 bg-teal-100 rounded-lg">
              <Users className="h-4 w-4 text-teal-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{totalTenants}</div>
            <p className="text-xs text-gray-500 mt-1">{totalTenants} {getLocalizedText('totalTenantsDesc')}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{getLocalizedText('activeTenants')}</CardTitle>
            <div className="p-2 bg-green-100 rounded-lg">
              <UserCheck className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{activeTenants}</div>
            <p className="text-xs text-gray-500 mt-1">{activeTenants} {getLocalizedText('activeTenantsDesc')}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{getLocalizedText('latePayments')}</CardTitle>
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{latePayments}</div>
            <p className="text-xs text-gray-500 mt-1">{latePayments} {getLocalizedText('latePaymentsDesc')}</p>
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
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{monthlyRevenue}€</div>
            <p className="text-xs text-gray-500 mt-1">{getLocalizedText('monthlyRevenueDesc')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tenants Table responsive */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b">
          <CardTitle className="text-lg sm:text-xl text-gray-800">{getLocalizedText('tenantsList')}</CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          {tenants.length === 0 ? (
            <div className="text-center py-8 sm:py-12 bg-gradient-to-br from-gray-50 to-white rounded-lg border-2 border-dashed border-gray-200">
              <div className="p-3 sm:p-4 bg-gray-100 rounded-full w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
              </div>
              <h3 className="text-base sm:text-lg font-medium text-gray-700 mb-2">{getLocalizedText('noTenants')}</h3>
              <p className="text-sm text-gray-500 mb-4">{getLocalizedText('noTenantsDesc')}</p>
              <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                {getLocalizedText('addTenant')}
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[120px]">{getLocalizedText('name')}</TableHead>
                    <TableHead className="hidden sm:table-cell min-w-[150px]">{getLocalizedText('email')}</TableHead>
                    <TableHead className="hidden md:table-cell">{getLocalizedText('phone')}</TableHead>
                    <TableHead className="min-w-[120px]">{getLocalizedText('property')}</TableHead>
                    <TableHead>{getLocalizedText('rent')}</TableHead>
                    <TableHead>{getLocalizedText('status')}</TableHead>
                    <TableHead className="hidden lg:table-cell">{getLocalizedText('nextPayment')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tenants.map((tenant) => (
                    <TableRow key={tenant.id}>
                      <TableCell className="font-medium">{tenant.name}</TableCell>
                      <TableCell className="hidden sm:table-cell text-sm">{tenant.email}</TableCell>
                      <TableCell className="hidden md:table-cell">{tenant.phone}</TableCell>
                      <TableCell className="text-sm">{tenant.property}</TableCell>
                      <TableCell className="font-semibold">{tenant.rentAmount}€</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(tenant.status)} className="text-xs">
                          {tenant.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm">{tenant.nextPayment}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showTenantForm} onOpenChange={setShowTenantForm}>
        <TenantForm 
          onClose={() => setShowTenantForm(false)}
          onSubmit={handleTenantSubmit}
          properties={properties}
          currentProfile={profile}
        />
      </Dialog>
    </div>
  );
};

export default AdminTenantsView;
