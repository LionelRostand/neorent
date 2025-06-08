
import React from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TenantProfile from '@/components/TenantSpace/TenantProfile';
import PropertyInfo from '@/components/TenantSpace/PropertyInfo';
import TenantDocuments from '@/components/TenantSpace/TenantDocuments';
import RentHistory from '@/components/TenantSpace/RentHistory';
import { User, Building2, FileText, Receipt } from 'lucide-react';

const TenantSpace = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mon Espace Locataire</h1>
          <p className="text-gray-600 mt-2">Gérez vos informations et documents</p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Mon Profil
            </TabsTrigger>
            <TabsTrigger value="property" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Mon Logement
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Mes Documents
            </TabsTrigger>
            <TabsTrigger value="rent" className="flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              Mes Loyers
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <TenantProfile />
          </TabsContent>

          <TabsContent value="property" className="mt-6">
            <PropertyInfo />
          </TabsContent>

          <TabsContent value="documents" className="mt-6">
            <TenantDocuments />
          </TabsContent>

          <TabsContent value="rent" className="mt-6">
            <RentHistory />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default TenantSpace;
