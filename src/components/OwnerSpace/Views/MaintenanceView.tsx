
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Wrench, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useFirebaseMaintenances } from '@/hooks/useFirebaseMaintenances';
import MaintenanceForm from '@/components/Maintenance/MaintenanceForm';

interface MaintenanceViewProps {
  currentProfile: any;
  onViewChange: (view: string) => void;
}

const MaintenanceView: React.FC<MaintenanceViewProps> = ({ currentProfile, onViewChange }) => {
  const [isNewMaintenanceDialogOpen, setIsNewMaintenanceDialogOpen] = useState(false);
  const { maintenances = [] } = useFirebaseMaintenances();

  // Calculs des métriques
  const totalMaintenances = maintenances.length;
  const completedMaintenances = maintenances.filter(m => m.status === 'Terminée').length;
  const pendingMaintenances = maintenances.filter(m => m.status === 'En attente' || m.status === 'Programmée').length;
  const urgentMaintenances = maintenances.filter(m => m.priority === 'Urgent' && m.status !== 'Terminée').length;

  const metrics = [
    {
      title: 'Total Demandes',
      value: totalMaintenances,
      description: `${totalMaintenances} demandes au total`,
      icon: Wrench,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Terminées',
      value: completedMaintenances,
      description: `${completedMaintenances} demandes résolues`,
      icon: CheckCircle,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'En Attente',
      value: pendingMaintenances,
      description: `${pendingMaintenances} demandes en cours`,
      icon: Clock,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Urgentes',
      value: urgentMaintenances,
      description: `${urgentMaintenances} demandes urgentes`,
      icon: AlertTriangle,
      iconColor: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Métriques de maintenance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {metric.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mb-1">
                      {metric.value}
                    </p>
                    <p className="text-xs text-gray-500">
                      {metric.description}
                    </p>
                  </div>
                  <div className={`${metric.bgColor} p-3 rounded-lg`}>
                    <Icon className={`h-6 w-6 ${metric.iconColor}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {/* Header avec bouton d'action */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Gestion de la Maintenance</h3>
        <Dialog open={isNewMaintenanceDialogOpen} onOpenChange={setIsNewMaintenanceDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle Demande
            </Button>
          </DialogTrigger>
          <MaintenanceForm
            onClose={() => setIsNewMaintenanceDialogOpen(false)}
            onSubmit={(data) => {
              console.log('Maintenance data:', data);
              setIsNewMaintenanceDialogOpen(false);
            }}
          />
        </Dialog>
      </div>
      
      {/* Contenu principal - tableau des maintenances */}
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Demandes de Maintenance</h3>
            <p className="text-gray-500">
              Gérez les demandes d'intervention et de maintenance de vos propriétés
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MaintenanceView;
