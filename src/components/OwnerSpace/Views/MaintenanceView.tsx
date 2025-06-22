
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
  const { requests = [] } = useFirebaseMaintenances();

  // Calculate metrics
  const totalMaintenances = requests.length;
  const completedMaintenances = requests.filter(m => m.status === 'Terminée').length;
  const pendingMaintenances = requests.filter(m => m.status === 'En attente' || m.status === 'Programmée').length;
  const urgentMaintenances = requests.filter(m => m.priority === 'Urgent' && m.status !== 'Terminée').length;

  const metrics = [
    {
      title: 'Total Requests',
      value: totalMaintenances,
      description: `${totalMaintenances} total requests`,
      icon: Wrench,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Completed',
      value: completedMaintenances,
      description: `${completedMaintenances} resolved requests`,
      icon: CheckCircle,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Pending',
      value: pendingMaintenances,
      description: `${pendingMaintenances} ongoing requests`,
      icon: Clock,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Urgent',
      value: urgentMaintenances,
      description: `${urgentMaintenances} urgent requests`,
      icon: AlertTriangle,
      iconColor: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Maintenance metrics */}
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
      
      {/* Header with action button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Maintenance Management</h3>
        <Dialog open={isNewMaintenanceDialogOpen} onOpenChange={setIsNewMaintenanceDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="mr-2 h-4 w-4" />
              New Request
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>New Maintenance Request</DialogTitle>
            </DialogHeader>
            <MaintenanceForm
              onSubmit={(data) => {
                console.log('Maintenance data:', data);
                setIsNewMaintenanceDialogOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Main content - maintenance table */}
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Maintenance Requests</h3>
            <p className="text-gray-500">
              Manage intervention requests and maintenance for your properties
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MaintenanceView;
