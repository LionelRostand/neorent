
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Calculator, Euro, FileText, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import RentalChargeForm from '@/components/RentalChargeForm';

interface RentalChargesViewProps {
  currentProfile: any;
  onViewChange: (view: string) => void;
}

const RentalChargesView: React.FC<RentalChargesViewProps> = ({ currentProfile, onViewChange }) => {
  const [isNewChargeDialogOpen, setIsNewChargeDialogOpen] = useState(false);

  // Mock data - replace with real data from hooks
  const metrics = [
    {
      title: 'Total Charges',
      value: 12,
      description: '12 charges au total',
      icon: Calculator,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Calculées',
      value: 8,
      description: '8 charges calculées',
      icon: FileText,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'En Attente',
      value: 4,
      description: '4 charges en attente',
      icon: Clock,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Ce Mois',
      value: 3,
      description: '3 charges ce mois',
      icon: Euro,
      iconColor: 'text-amber-600',
      bgColor: 'bg-amber-50'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Métriques des charges */}
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
        <h3 className="text-lg font-semibold text-gray-900">Gestion des Charges Locatives</h3>
        <Dialog open={isNewChargeDialogOpen} onOpenChange={setIsNewChargeDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle Charge
            </Button>
          </DialogTrigger>
          <RentalChargeForm
            onClose={() => setIsNewChargeDialogOpen(false)}
            onSubmit={(data) => {
              console.log('Charge data:', data);
              setIsNewChargeDialogOpen(false);
            }}
          />
        </Dialog>
      </div>
      
      {/* Contenu principal - tableau des charges */}
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Gestion des Charges</h3>
            <p className="text-gray-500">
              Créez et gérez les charges locatives pour vos propriétés
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RentalChargesView;
