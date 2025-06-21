
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Users, Home, Calculator, Wrench } from 'lucide-react';

interface OwnerQuickActionsProps {
  ownerProfile: any;
}

const OwnerQuickActions: React.FC<OwnerQuickActionsProps> = ({ ownerProfile }) => {
  const quickActions = [
    {
      title: 'Nouvelle propriété',
      description: 'Ajouter un bien',
      icon: Plus,
      color: 'bg-blue-500',
      action: () => console.log('Nouvelle propriété')
    },
    {
      title: 'Nouveau contrat',
      description: 'Créer un bail',
      icon: FileText,
      color: 'bg-green-500',
      action: () => console.log('Nouveau contrat')
    },
    {
      title: 'Ajouter locataire',
      description: 'Enregistrer un locataire',
      icon: Users,
      color: 'bg-purple-500',
      action: () => console.log('Nouveau locataire')
    },
    {
      title: 'État des lieux',
      description: 'Programmer une visite',
      icon: Home,
      color: 'bg-orange-500',
      action: () => console.log('État des lieux')
    },
    {
      title: 'Calculer charges',
      description: 'Révision annuelle',
      icon: Calculator,
      color: 'bg-indigo-500',
      action: () => console.log('Calculer charges')
    },
    {
      title: 'Maintenance',
      description: 'Demande d\'intervention',
      icon: Wrench,
      color: 'bg-red-500',
      action: () => console.log('Maintenance')
    }
  ];

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Plus className="h-4 w-4" />
          Actions rapides
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 p-4 pt-0">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Button
              key={action.title}
              variant="ghost"
              className="w-full justify-start h-auto p-3 hover:bg-gray-50 rounded-lg border-0"
              onClick={action.action}
            >
              <div className="flex items-center space-x-3 w-full">
                <div className={`p-2 rounded-lg ${action.color} text-white flex-shrink-0`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-medium text-gray-900 text-sm leading-tight">{action.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{action.description}</p>
                </div>
              </div>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default OwnerQuickActions;
