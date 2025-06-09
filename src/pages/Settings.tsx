
import React from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database, Lock, Mail, CreditCard } from 'lucide-react';
import CompanyManagementNew from '@/components/Settings/CompanyManagement';
import EmployeeManagement from '@/components/Settings/EmployeeManagement';
import EmployeePermissionsTab from '@/components/Settings/EmployeePermissionsTab';
import FirebaseTab from '@/components/Settings/FirebaseTab';
import SimpleSettingsTab from '@/components/Settings/SimpleSettingsTab';
import SecurityTab from '@/components/Settings/SecurityTab';
import EmailTab from '@/components/Settings/EmailTab';
import DatabaseTab from '@/components/Settings/Database/DatabaseTab';
import PaymentTab from '@/components/Settings/PaymentTab';

const Settings = () => {
  return (
    <MainLayout>
      <div className="space-y-4 md:space-y-6">
        <div className="px-1">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Paramètres</h1>
          <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base">
            Gérez les paramètres de votre application
          </p>
        </div>

        <Tabs defaultValue="general" className="space-y-4 md:space-y-6">
          <div className="overflow-x-auto">
            <TabsList className="grid w-full min-w-[700px] grid-cols-7 bg-gray-100 mx-1">
              <TabsTrigger value="general" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm px-2 md:px-3">
                <span className="hidden sm:inline">⚙️</span>
                <span className="truncate">Général</span>
              </TabsTrigger>
              <TabsTrigger value="firebase" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm px-2 md:px-3">
                <Database className="h-3 w-3 md:h-4 md:w-4" />
                <span className="truncate">Firebase</span>
              </TabsTrigger>
              <TabsTrigger value="payments" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm px-2 md:px-3">
                <CreditCard className="h-3 w-3 md:h-4 md:w-4" />
                <span className="truncate">Paiements</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm px-2 md:px-3">
                <Lock className="h-3 w-3 md:h-4 md:w-4" />
                <span className="truncate">Sécurité</span>
              </TabsTrigger>
              <TabsTrigger value="email" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm px-2 md:px-3">
                <Mail className="h-3 w-3 md:h-4 md:w-4" />
                <span className="truncate">Email</span>
              </TabsTrigger>
              <TabsTrigger value="permissions" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm px-2 md:px-3">
                <span className="hidden sm:inline">👥</span>
                <span className="truncate">Permissions</span>
              </TabsTrigger>
              <TabsTrigger value="database" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm px-2 md:px-3">
                <span className="hidden sm:inline">📊</span>
                <span className="sm:hidden">BDD</span>
                <span className="hidden sm:inline lg:hidden">Base</span>
                <span className="hidden lg:inline">Base de données</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="general" className="space-y-4 md:space-y-6">
            <CompanyManagementNew />
            <EmployeeManagement />
          </TabsContent>

          <TabsContent value="firebase" className="space-y-4 md:space-y-6">
            <FirebaseTab />
          </TabsContent>

          <TabsContent value="payments" className="space-y-4 md:space-y-6">
            <PaymentTab />
          </TabsContent>

          <TabsContent value="security" className="space-y-4 md:space-y-6">
            <SecurityTab />
          </TabsContent>

          <TabsContent value="email" className="space-y-4 md:space-y-6">
            <EmailTab />
          </TabsContent>

          <TabsContent value="permissions" className="space-y-4 md:space-y-6">
            <EmployeePermissionsTab />
          </TabsContent>

          <TabsContent value="database" className="space-y-4 md:space-y-6">
            <DatabaseTab />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Settings;
