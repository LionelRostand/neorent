
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
        <div className="container mx-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Gestion de la Maintenance</h1>
            <p className="text-muted-foreground mt-2">
              Gérez toutes les demandes et interventions de maintenance de vos biens immobiliers
            </p>
          </div>

          <Tabs defaultValue="requests" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="requests" className="flex items-center justify-center gap-1 px-2 py-2">
                <ClipboardList className="h-5 w-5 flex-shrink-0" />
                <span className="hidden sm:inline text-xs">Demandes</span>
              </TabsTrigger>
              <TabsTrigger value="responsibilities" className="flex items-center justify-center gap-1 px-2 py-2">
                <Scale className="h-5 w-5 flex-shrink-0" />
                <span className="hidden sm:inline text-xs">Responsabilités</span>
              </TabsTrigger>
              <TabsTrigger value="interventions" className="flex items-center justify-center gap-1 px-2 py-2">
                <Wrench className="h-5 w-5 flex-shrink-0" />
                <span className="hidden sm:inline text-xs">Interventions</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center justify-center gap-1 px-2 py-2">
                <Calendar className="h-5 w-5 flex-shrink-0" />
                <span className="hidden sm:inline text-xs">Historique</span>
              </TabsTrigger>
              <TabsTrigger value="costs" className="flex items-center justify-center gap-1 px-2 py-2">
                <Euro className="h-5 w-5 flex-shrink-0" />
                <span className="hidden sm:inline text-xs">Coûts</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="requests" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardList className="h-5 w-5" />
                    Gestion des Demandes de Maintenance
                  </CardTitle>
                  <CardDescription>
                    Enregistrez et gérez les demandes de maintenance des locataires
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MaintenanceRequestForm />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="responsibilities" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scale className="h-5 w-5" />
                    Répartition des Responsabilités
                  </CardTitle>
                  <CardDescription>
                    Classification des charges entre propriétaire et locataire selon la loi française
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsibilityGuide />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="interventions" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wrench className="h-5 w-5" />
                    Suivi des Interventions
                  </CardTitle>
                  <CardDescription>
                    Planifiez et suivez l'avancement des travaux de maintenance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <InterventionTracking />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Historique des Maintenances
                  </CardTitle>
                  <CardDescription>
                    Consultez l'historique complet par bien et par type d'intervention
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MaintenanceHistory />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="costs" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Euro className="h-5 w-5" />
                    Coûts et Facturation
                  </CardTitle>
                  <CardDescription>
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
