
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import MainLayout from '@/components/Layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building, 
  Users, 
  Database, 
  Mail, 
  Shield, 
  CreditCard, 
  Settings as SettingsIcon,
  ShieldCheck,
  UserCog
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import FirebaseTab from '@/components/Settings/FirebaseTab';
import DatabaseTab from '@/components/Settings/Database/DatabaseTab';
import EmailTab from '@/components/Settings/EmailTab';
import SecurityTab from '@/components/Settings/SecurityTab';
import PaymentTab from '@/components/Settings/PaymentTab';
import EmployeeManagement from '@/components/Settings/EmployeeManagement';
import EmployeePermissionsTab from '@/components/Settings/EmployeePermissionsTab';
import CompanyManagement from '@/components/Settings/CompanyManagement';
import AdminTenantAccess from '@/components/AdminTenantAccess';
import { useAuth } from '@/hooks/useAuth';

const Settings = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('company');
  const { user } = useAuth();
  const isAdmin = user?.email === 'admin@neotech-consulting.com';

  const tabs = [
    { id: 'company', label: t('settings.tabs.company'), icon: Building },
    { id: 'employees', label: t('settings.tabs.employees'), icon: Users },
    { id: 'permissions', label: t('settings.tabs.permissions'), icon: ShieldCheck },
    { id: 'firebase', label: t('settings.tabs.firebase'), icon: Database },
    { id: 'database', label: t('settings.tabs.database'), icon: Database },
    { id: 'email', label: t('settings.tabs.email'), icon: Mail },
    { id: 'security', label: t('settings.tabs.security'), icon: Shield },
    { id: 'payment', label: t('settings.tabs.payment'), icon: CreditCard },
    ...(isAdmin ? [{ id: 'admin-access', label: t('settings.tabs.adminAccess'), icon: UserCog }] : [])
  ];

  // Calcul dynamique du nombre de colonnes pour la grille
  const gridCols = `grid-cols-${tabs.length}`;

  return (
    <MainLayout>
      <div className="space-y-4 md:space-y-6">
        <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
          <div className="flex items-center space-x-3">
            <SettingsIcon className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('settings.title')}</h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">
                {t('settings.subtitle')}
              </p>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="overflow-x-auto">
            <TabsList className={`grid w-full min-w-[800px] ${gridCols} mb-4 md:mb-6 mx-1`}>
              {tabs.map((tab) => (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id}
                  className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3"
                >
                  <tab.icon className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="truncate text-[10px] sm:text-xs lg:text-sm">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="company" className="space-y-4 md:space-y-6">
            <CompanyManagement />
          </TabsContent>

          <TabsContent value="employees" className="space-y-4 md:space-y-6">
            <EmployeeManagement />
          </TabsContent>

          <TabsContent value="permissions" className="space-y-4 md:space-y-6">
            <EmployeePermissionsTab />
          </TabsContent>

          <TabsContent value="firebase" className="space-y-4 md:space-y-6">
            <FirebaseTab />
          </TabsContent>

          <TabsContent value="database" className="space-y-4 md:space-y-6">
            <DatabaseTab />
          </TabsContent>

          <TabsContent value="email" className="space-y-4 md:space-y-6">
            <EmailTab />
          </TabsContent>

          <TabsContent value="security" className="space-y-4 md:space-y-6">
            <SecurityTab />
          </TabsContent>

          <TabsContent value="payment" className="space-y-4 md:space-y-6">
            <PaymentTab />
          </TabsContent>

          {isAdmin && (
            <TabsContent value="admin-access" className="space-y-4 md:space-y-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl md:text-2xl font-semibold text-gray-900">
                      🔑 {t('settings.adminAccess')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-6">
                      {t('settings.adminAccessDescription')}
                    </p>
                    <AdminTenantAccess />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Settings;
