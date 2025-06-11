
import React from 'react';
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
  return (
    <MainLayout>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-4 sm:p-6">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Gestion de la Maintenance</h1>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              Gérez toutes les demandes et interventions de maintenance de vos biens immobiliers
            </p>
          </div>

          <Tabs defaultValue="requests" className="space-y-4 sm:space-y-6">
            <div className="overflow-x-auto">
              <TabsList className="grid grid-cols-5 w-full min-w-[500px] sm:min-w-0">
                <TabsTrigger value="requests" className="flex flex-col sm:flex-row items-center justify-center gap-1 px-1 py-2 text-xs">
                  <ClipboardList className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <span className="hidden xs:inline sm:inline">Demandes</span>
                </TabsTrigger>
                <TabsTrigger value="responsibilities" className="flex flex-col sm:flex-row items-center justify-center gap-1 px-1 py-2 text-xs">
                  <Scale className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <span className="hidden xs:inline sm:inline">Responsa.</span>
                </TabsTrigger>
                <TabsTrigger value="interventions" className="flex flex-col sm:flex-row items-center justify-center gap-1 px-1 py-2 text-xs">
                  <Wrench className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <span className="hidden xs:inline sm:inline">Intervent.</span>
                </TabsTrigger>
                <TabsTrigger value="history" className="flex flex-col sm:flex-row items-center justify-center gap-1 px-1 py-2 text-xs">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <span className="hidden xs:inline sm:inline">Historique</span>
                </TabsTrigger>
                <TabsTrigger value="costs" className="flex flex-col sm:flex-row items-center justify-center gap-1 px-1 py-2 text-xs">
                  <Euro className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <span className="hidden xs:inline sm:inline">Coûts</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="requests" className="space-y-4 sm:space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <ClipboardList className="h-5 w-5" />
                    Gestion des Demandes de Maintenance
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Enregistrez et gérez les demandes de maintenance des locataires
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
                    Répartition des Responsabilités
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Classification des charges entre propriétaire et locataire selon la loi française
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
                    Suivi des Interventions
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Planifiez et suivez l'avancement des travaux de maintenance
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
                    Historique des Maintenances
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Consultez l'historique complet par bien et par type d'intervention
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
                    Coûts et Facturation
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Gérez les frais de maintenance selon la responsabilité
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
