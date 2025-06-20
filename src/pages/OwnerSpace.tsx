
import React from 'react';
import { useTranslation } from 'react-i18next';
import MainLayout from '@/components/Layout/MainLayout';
import OwnerSpaceHeader from '@/components/OwnerSpace/OwnerSpaceHeader';
import OwnerNavigationGrid from '@/components/OwnerSpace/OwnerNavigationGrid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useOwnerSpaceData } from '@/hooks/useOwnerSpaceData';
import { Building, Users, Euro, FileText } from 'lucide-react';

const OwnerSpace = () => {
  const { t } = useTranslation();
  const { currentOwner, ownerProperties, ownerTenants, ownerRoommates, ownerContracts, loading } = useOwnerSpaceData();

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
        </div>
      </MainLayout>
    );
  }

  // Calculate monthly revenue from tenants and roommates
  const monthlyRevenue = ownerTenants.reduce((total, tenant) => {
    return total + (Number(tenant.rentAmount) || 0);
  }, 0) + ownerRoommates.reduce((total, roommate) => {
    return total + (Number(roommate.rentAmount) || 0);
  }, 0);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Only render header if currentOwner exists and has required properties */}
        {currentOwner && currentOwner.name && (
          <OwnerSpaceHeader 
            owner={{
              name: currentOwner.name,
              email: currentOwner.email || 'email@example.com'
            }}
            propertiesCount={ownerProperties.length}
            tenantsCount={ownerTenants.length}
            roommatesCount={ownerRoommates.length}
          />
        )}
        
        {/* Show fallback if no current owner */}
        {(!currentOwner || !currentOwner.name) && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h1 className="text-3xl font-bold text-gray-900">Espace Propriétaire</h1>
            <p className="text-gray-600 mt-2">Chargement des informations...</p>
          </div>
        )}
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mes Propriétés</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ownerProperties.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Locataires Actifs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ownerTenants.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenus Mensuels</CardTitle>
              <Euro className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{monthlyRevenue}€</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contrats Actifs</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ownerContracts.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Grid */}
        <Card>
          <CardHeader>
            <CardTitle>Gestion de vos biens</CardTitle>
          </CardHeader>
          <CardContent>
            <OwnerNavigationGrid />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default OwnerSpace;
