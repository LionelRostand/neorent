
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Users, Home, Calculator, Wrench } from 'lucide-react';

interface OwnerQuickActionsProps {
  ownerProfile: any;
}

const OwnerQuickActions: React.FC<OwnerQuickActionsProps> = ({ ownerProfile }) => {
  const { t } = useTranslation();

  const quickActions = [
    {
      title: t('ownerSpace.quickActions.newProperty.title'),
      description: t('ownerSpace.quickActions.newProperty.description'),
      icon: Plus,
      color: 'bg-blue-500',
      action: () => console.log('Nouvelle propriété')
    },
    {
      title: t('ownerSpace.quickActions.newContract.title'),
      description: t('ownerSpace.quickActions.newContract.description'),
      icon: FileText,
      color: 'bg-green-500',
      action: () => console.log('Nouveau contrat')
    },
    {
      title: t('ownerSpace.quickActions.addTenant.title'),
      description: t('ownerSpace.quickActions.addTenant.description'),
      icon: Users,
      color: 'bg-purple-500',
      action: () => console.log('Nouveau locataire')
    },
    {
      title: t('ownerSpace.quickActions.propertyInspection.title'),
      description: t('ownerSpace.quickActions.propertyInspection.description'),
      icon: Home,
      color: 'bg-orange-500',
      action: () => console.log('État des lieux')
    },
    {
      title: t('ownerSpace.quickActions.calculateCharges.title'),
      description: t('ownerSpace.quickActions.calculateCharges.description'),
      icon: Calculator,
      color: 'bg-indigo-500',
      action: () => console.log('Calculer charges')
    },
    {
      title: t('ownerSpace.quickActions.maintenance.title'),
      description: t('ownerSpace.quickActions.maintenance.description'),
      icon: Wrench,
      color: 'bg-red-500',
      action: () => console.log('Maintenance')
    }
  ];

  return (
    <Card className="h-fit w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Plus className="h-4 w-4" />
          {t('ownerSpace.quickActions.title')}
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
              <div className="flex items-center space-x-3 w-full min-w-0">
                <div className={`p-2 rounded-lg ${action.color} text-white flex-shrink-0`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="text-left flex-1 min-w-0 overflow-hidden">
                  <p className="font-medium text-gray-900 text-sm leading-tight truncate">{action.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">{action.description}</p>
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
