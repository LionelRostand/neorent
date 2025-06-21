
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Actions rapides
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Button
              key={action.title}
              variant="ghost"
              className="w-full justify-start h-auto p-4 hover:bg-gray-50"
              onClick={action.action}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${action.color} text-white`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">{action.title}</p>
                  <p className="text-sm text-gray-500">{action.description}</p>
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
