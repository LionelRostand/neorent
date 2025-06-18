
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import MainLayout from '@/components/Layout/MainLayout';
import MaintenanceRequestForm from '@/components/Maintenance/MaintenanceRequestForm';
import ResponsibilityGuide from '@/components/Maintenance/ResponsibilityGuide';
import InterventionTracking from '@/components/Maintenance/InterventionTracking';
import MaintenanceHistory from '@/components/Maintenance/MaintenanceHistory';
import CostManagement from '@/components/Maintenance/CostManagement';
import { Wrench, ClipboardList, Scale, Calendar, Euro } from 'lucide-react';

const Maintenance = () => {
  const { t } = useTranslation();

  return (
    <MainLayout>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-4 sm:p-6">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{t('maintenance.title')}</h1>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              {t('maintenance.subtitle')}
            </p>
          </div>

          <Tabs defaultValue="requests" className="space-y-4 sm:space-y-6">
            <div className="overflow-x-auto">
              <TabsList className="grid grid-cols-5 w-full min-w-[500px] sm:min-w-0">
                <TabsTrigger value="requests" className="flex flex-col sm:flex-row items-center justify-center gap-1 px-1 py-2 text-xs">
                  <ClipboardList className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <span className="hidden xs:inline sm:inline">{t('maintenance.requests')}</span>
                </TabsTrigger>
                <TabsTrigger value="responsibilities" className="flex flex-col sm:flex-row items-center justify-center gap-1 px-1 py-2 text-xs">
                  <Scale className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <span className="hidden xs:inline sm:inline">{t('maintenance.responsibilities')}</span>
                </TabsTrigger>
                <TabsTrigger value="interventions" className="flex flex-col sm:flex-row items-center justify-center gap-1 px-1 py-2 text-xs">
                  <Wrench className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <span className="hidden xs:inline sm:inline">{t('maintenance.interventions')}</span>
                </TabsTrigger>
                <TabsTrigger value="history" className="flex flex-col sm:flex-row items-center justify-center gap-1 px-1 py-2 text-xs">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <span className="hidden xs:inline sm:inline">{t('maintenance.history')}</span>
                </TabsTrigger>
                <TabsTrigger value="costs" className="flex flex-col sm:flex-row items-center justify-center gap-1 px-1 py-2 text-xs">
                  <Euro className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <span className="hidden xs:inline sm:inline">{t('maintenance.costs')}</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="requests" className="space-y-4 sm:space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <ClipboardList className="h-5 w-5" />
                    {t('maintenance.requestManagement')}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {t('maintenance.description')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MaintenanceRequestForm />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="responsibilities" className="space-y-4 sm:space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Scale className="h-5 w-5" />
                    {t('maintenance.responsibilityDistribution')}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {t('maintenance.subtitle')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsibilityGuide />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="interventions" className="space-y-4 sm:space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Wrench className="h-5 w-5" />
                    {t('maintenance.interventionTracking')}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {t('maintenance.subtitle')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <InterventionTracking />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-4 sm:space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Calendar className="h-5 w-5" />
                    {t('maintenance.maintenanceHistory')}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {t('maintenance.subtitle')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MaintenanceHistory />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="costs" className="space-y-4 sm:space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Euro className="h-5 w-5" />
                    {t('maintenance.costManagement')}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {t('maintenance.subtitle')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CostManagement />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default Maintenance;
