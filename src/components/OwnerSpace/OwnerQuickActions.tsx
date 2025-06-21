
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { useFirebaseProperties } from '@/hooks/useFirebaseProperties';
import { useFirebaseRoommates } from '@/hooks/useFirebaseRoommates';
import { useToast } from '@/hooks/use-toast';
import { useQuickActionsData } from './QuickActions/useQuickActionsData';
import QuickActionItem from './QuickActions/QuickActionItem';
import QuickActionsDialogs from './QuickActions/QuickActionsDialogs';

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

  const quickActions = useQuickActionsData(ownerProfile, setOpenDialog);

  return (
    <>
      <Card className="h-fit w-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Plus className="h-4 w-4" />
            {t('ownerSpace.quickActions.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 p-4 pt-0">
          {quickActions.map((action) => (
            <QuickActionItem key={action.title} action={action} />
          ))}
        </CardContent>
      </Card>

      <QuickActionsDialogs
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        handlePropertySubmit={handlePropertySubmit}
        handleRoommateSubmit={handleRoommateSubmit}
        handleInspectionSubmit={handleInspectionSubmit}
        properties={properties}
      />
    </>
  );
};

export default OwnerQuickActions;
