
import React, { useState } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import MaintenanceRequestForm from '@/components/Maintenance/MaintenanceRequestForm';
import ResponsibilityGuide from '@/components/Maintenance/ResponsibilityGuide';
import InterventionTracking from '@/components/Maintenance/InterventionTracking';
import MaintenanceHistory from '@/components/Maintenance/MaintenanceHistory';
import CostManagement from '@/components/Maintenance/CostManagement';
import { Wrench, ClipboardList, Users, History, Calculator } from 'lucide-react';

const Maintenance = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Maintenance</h1>
            <p className="text-muted-foreground">
              Gestion complète de la maintenance des biens immobiliers
            </p>
          </div>
        </div>

        <Tabs defaultValue="requests" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="requests" className="flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              Demandes
            </TabsTrigger>
            <TabsTrigger value="responsibilities" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Responsabilités
            </TabsTrigger>
            <TabsTrigger value="tracking" className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              Suivi
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Historique
            </TabsTrigger>
            <TabsTrigger value="costs" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Coûts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="requests">
            <Card>
              <CardHeader>
                <CardTitle>Demandes de Maintenance</CardTitle>
                <CardDescription>
                  Enregistrer et gérer les demandes de maintenance des locataires
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MaintenanceRequestForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="responsibilities">
            <Card>
              <CardHeader>
                <CardTitle>Répartition des Responsabilités</CardTitle>
                <CardDescription>
                  Classification selon la loi française du 6 juillet 1989
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsibilityGuide />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tracking">
            <Card>
              <CardHeader>
                <CardTitle>Suivi des Interventions</CardTitle>
                <CardDescription>
                  Planification et suivi des travaux de maintenance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <InterventionTracking />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Historique des Maintenances</CardTitle>
                <CardDescription>
                  Historique par bien et par type d'intervention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MaintenanceHistory />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="costs">
            <Card>
              <CardHeader>
                <CardTitle>Coûts et Facturation</CardTitle>
                <CardDescription>
                  Gestion des frais selon la responsabilité
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CostManagement />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Maintenance;
