
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
  const { ownerData, loading } = useOwnerSpaceData();

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <OwnerSpaceHeader />
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mes Propriétés</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ownerData?.totalProperties || 0}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Locataires Actifs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ownerData?.activeTenants || 0}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenus Mensuels</CardTitle>
              <Euro className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ownerData?.monthlyRevenue || 0}€</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contrats Actifs</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ownerData?.activeContracts || 0}</div>
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
