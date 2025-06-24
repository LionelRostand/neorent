
import React from 'react';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, Building, Users, FileText, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useOwnerData } from '@/hooks/useOwnerData';

interface AdminDashboardViewProps {
  currentProfile: any;
}

const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ currentProfile }) => {
  const { t } = useTranslation();
  const { properties, tenants, roommates, contracts } = useOwnerData(currentProfile);

  const totalProperties = properties.length;
  const totalTenants = tenants.length + roommates.length;
  const totalContracts = contracts.length;
  const monthlyRevenue = [...tenants, ...roommates].reduce((sum, item) => sum + (parseFloat(item.rentAmount?.toString() || '0') || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord</h1>
          <p className="text-gray-600 mt-1">Vue d'ensemble de votre portefeuille immobilier</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Propriétés</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProperties}</div>
              <p className="text-xs text-muted-foreground">Biens immobiliers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Locataires</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTenants}</div>
              <p className="text-xs text-muted-foreground">Locataires actifs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contrats</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalContracts}</div>
              <p className="text-xs text-muted-foreground">Contrats actifs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenus Mensuels</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{monthlyRevenue}€</div>
              <p className="text-xs text-muted-foreground">Revenus mensuels</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Overview Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Propriétés Récentes</CardTitle>
            </CardHeader>
            <CardContent>
              {properties.length === 0 ? (
                <div className="text-center py-8">
                  <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Aucune propriété</p>
                  <p className="text-sm text-gray-400">Commencez par ajouter vos biens</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {properties.slice(0, 3).map((property) => (
                    <div key={property.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Building className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{property.title}</h4>
                        <p className="text-sm text-gray-600">{property.address}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Locataires Actifs</CardTitle>
            </CardHeader>
            <CardContent>
              {totalTenants === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Aucun locataire</p>
                  <p className="text-sm text-gray-400">Les locataires apparaîtront ici</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {[...tenants, ...roommates].slice(0, 3).map((tenant) => (
                    <div key={tenant.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Users className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{tenant.name}</h4>
                        <p className="text-sm text-gray-600">{tenant.rentAmount}€/mois</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardView;
