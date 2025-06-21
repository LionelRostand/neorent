
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Plus, FileText, Users, Home, Calculator, Wrench } from 'lucide-react';
import PropertyForm from '@/components/PropertyForm';
import RoommateForm from '@/components/RoommateForm';
import InspectionForm from '@/components/InspectionForm';
import { useFirebaseProperties } from '@/hooks/useFirebaseProperties';
import { useFirebaseRoommates } from '@/hooks/useFirebaseRoommates';
import { useToast } from '@/hooks/use-toast';

// Import des composants d'aperçu
import PropertyPreview from './QuickActionPreviews/PropertyPreview';
import ContractPreview from './QuickActionPreviews/ContractPreview';
import TenantPreview from './QuickActionPreviews/TenantPreview';
import InspectionPreview from './QuickActionPreviews/InspectionPreview';
import ChargesPreview from './QuickActionPreviews/ChargesPreview';
import MaintenancePreview from './QuickActionPreviews/MaintenancePreview';

interface OwnerQuickActionsProps {
  ownerProfile: any;
}

const OwnerQuickActions: React.FC<OwnerQuickActionsProps> = ({ ownerProfile }) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { properties, addProperty } = useFirebaseProperties();
  const { addRoommate } = useFirebaseRoommates();
  
  const [openDialog, setOpenDialog] = useState<string | null>(null);

  const handlePropertySubmit = async (propertyData: any) => {
    try {
      await addProperty(propertyData);
      toast({
        title: t('properties.addSuccess'),
        description: t('properties.addSuccessDescription'),
      });
      setOpenDialog(null);
    } catch (error) {
      console.error('Error adding property:', error);
      toast({
        title: t('common.error'),
        description: t('properties.addError'),
        variant: "destructive",
      });
    }
  };

  const handleRoommateSubmit = async (roommateData: any) => {
    try {
      await addRoommate(roommateData);
      toast({
        title: t('roommates.addSuccess'),
        description: t('roommates.addSuccessDescription'),
      });
      setOpenDialog(null);
    } catch (error) {
      console.error('Error adding roommate:', error);
      toast({
        title: t('common.error'),
        description: t('roommates.addError'),
        variant: "destructive",
      });
    }
  };

  const handleInspectionSubmit = (inspectionData: any) => {
    console.log('Inspection data:', inspectionData);
    toast({
      title: t('inspections.addSuccess'),
      description: t('inspections.addSuccessDescription'),
    });
    setOpenDialog(null);
  };

  const quickActions = [
    {
      title: t('ownerSpace.quickActions.newProperty.title'),
      description: t('ownerSpace.quickActions.newProperty.description'),
      icon: Plus,
      color: 'bg-blue-500',
      action: () => setOpenDialog('property'),
      preview: <PropertyPreview ownerProfile={ownerProfile} />
    },
    {
      title: t('ownerSpace.quickActions.newContract.title'),
      description: t('ownerSpace.quickActions.newContract.description'),
      icon: FileText,
      color: 'bg-green-500',
      action: () => console.log('Nouveau contrat - À implémenter'),
      preview: <ContractPreview />
    },
    {
      title: t('ownerSpace.quickActions.addTenant.title'),
      description: t('ownerSpace.quickActions.addTenant.description'),
      icon: Users,
      color: 'bg-purple-500',
      action: () => setOpenDialog('roommate'),
      preview: <TenantPreview ownerProfile={ownerProfile} />
    },
    {
      title: t('ownerSpace.quickActions.propertyInspection.title'),
      description: t('ownerSpace.quickActions.propertyInspection.description'),
      icon: Home,
      color: 'bg-orange-500',
      action: () => setOpenDialog('inspection'),
      preview: <InspectionPreview />
    },
    {
      title: t('ownerSpace.quickActions.calculateCharges.title'),
      description: t('ownerSpace.quickActions.calculateCharges.description'),
      icon: Calculator,
      color: 'bg-indigo-500',
      action: () => console.log('Calculer charges - À implémenter'),
      preview: <ChargesPreview />
    },
    {
      title: t('ownerSpace.quickActions.maintenance.title'),
      description: t('ownerSpace.quickActions.maintenance.description'),
      icon: Wrench,
      color: 'bg-red-500',
      action: () => console.log('Maintenance - À implémenter'),
      preview: <MaintenancePreview />
    }
  ];

  return (
    <>
      <Card className="h-fit w-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Plus className="h-4 w-4" />
            {t('ownerSpace.quickActions.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-4 pt-0">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <div key={action.title} className="space-y-2">
                <Button
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
                
                {/* Aperçu de l'action */}
                {action.preview}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Property Form Dialog */}
      <Dialog open={openDialog === 'property'} onOpenChange={() => setOpenDialog(null)}>
        <PropertyForm 
          onSubmit={handlePropertySubmit}
          onClose={() => setOpenDialog(null)}
        />
      </Dialog>

      {/* Roommate Form Dialog */}
      <Dialog open={openDialog === 'roommate'} onOpenChange={() => setOpenDialog(null)}>
        <RoommateForm 
          onSubmit={handleRoommateSubmit}
          onClose={() => setOpenDialog(null)}
          properties={properties}
        />
      </Dialog>

      {/* Inspection Form Dialog */}
      <Dialog open={openDialog === 'inspection'} onOpenChange={() => setOpenDialog(null)}>
        <InspectionForm 
          onSubmit={handleInspectionSubmit}
          onClose={() => setOpenDialog(null)}
        />
      </Dialog>
    </>
  );
};

export default OwnerQuickActions;
